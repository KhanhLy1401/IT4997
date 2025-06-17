from bson import ObjectId
from sklearn.feature_extraction.text import TfidfVectorizer
from sklearn.metrics.pairwise import cosine_similarity
from collections import defaultdict, Counter

from models import bikes_col, rentals_col, reviews_col

# --- TF-IDF Content-Based ---
def prepare_tfidf_matrix(bikes):
    #ghép các thuộc tính thành document
    docs = [f"{b['title']} {b['brand']} {b['bikeType']} {b['description']}" for b in bikes]
    vect = TfidfVectorizer() #Tạo vectorizer
    tfidf = vect.fit_transform(docs) #Chuyển sang ma trận TF-IDF
    return tfidf, vect

def recommend_by_content(bike_id, top_n=4):
    bike = bikes_col.find_one({"_id": ObjectId(bike_id)}) 
    province = bike["location"]["province"]
    bikes = list(bikes_col.find({"location.province": province})) #Lấy toàn bộ xe cùng tỉnh với xe ng dùng
    tfidf, _ = prepare_tfidf_matrix(bikes) #Tạo ma trận TF-IDF
    index_map = {str(b['_id']): i for i, b in enumerate(bikes)}  #Ánh xạ _id sang index
    if bike_id not in index_map:
        return []
    i = index_map[bike_id] #Lấy index của xe người dùng đang xem
    sims = cosine_similarity(tfidf[i], tfidf).flatten() #Tính độ tương đồng với tất cả các xe cùng tỉnh
    sims[i] = 0 #Bỏ  chính xe ng dùng ra
    print("TF-IDF shape:", tfidf.shape) 
    print("Cosine scores:", sims)

    idxs = sims.argsort()[-top_n:][::-1] #Lấy top N xe tương đồng nhất
    results = []
    for idx in idxs:
        b = bikes[idx]
        b['_id'] = str(b['_id']) #Chuyển object sang chuỗi
        results.append(b)
    return results

# --- Collaborative Filtering ---
def build_user_rentals():
    user_rentals = defaultdict(set)
    for r in rentals_col.find():
        user_rentals[r['userId']].add(r['bikeId']) #Tạo dict: userId -> danh sách bikeId
    return user_rentals

def get_avg_rating(bike_id):
    ratings = list(reviews_col.find({"bikeId": bike_id}))
    if not ratings:
        return 0
    return sum(r["rating"] for r in ratings) / len(ratings)

def jaccard(set1, set2):
    return len(set1 & set2) / len(set1 | set2) if set1 | set2 else 0 #Jaccard similarity giữa 2 set

def recommend_by_user(user_id, top_n=6):
    user_rentals = build_user_rentals() #Tạo dict lịch sử thuê xe
    if user_id not in user_rentals:
        return []
    target = user_rentals[user_id]  #Lịch sử của user hiện tại
    sims = [(other, jaccard(target, user_rentals[other])) for other in user_rentals if other != user_id]
    sims.sort(key=lambda x: x[1], reverse=True)
    top_users = [u for u, _ in sims[:3]] #Lấy top user tương đồng
    recommended_ids = set()
    for u in top_users:
        recommended_ids |= user_rentals[u]
    recommended_ids -= user_rentals[user_id] #Trừ những xe đã thuê rồi 
    bikes = list(bikes_col.find({ "_id": { "$in": [ObjectId(b) for b in recommended_ids] } }))
    for b in bikes:
        b['_id'] = str(b['_id'])
        b['avg_rating'] = get_avg_rating(str(b['_id']))
    
    # Sắp xếp theo rating giảm dần
    bikes.sort(key=lambda x: x['avg_rating'], reverse=True)

    return bikes[:top_n]

# --- Hybrid ---
def recommend_hybrid(user_id, bike_id, top_n=5, alpha=0.5, beta=0.3, gamma=0.2):
    bikes = list(bikes_col.find())
    tfidf, _ = prepare_tfidf_matrix(bikes)
    index_map = {str(b['_id']): i for i, b in enumerate(bikes)}
    if bike_id not in index_map:
        return []
    i = index_map[bike_id]
    sims = cosine_similarity(tfidf[i], tfidf).flatten()

    user_rentals = build_user_rentals()
    collab_score = Counter()
    similar_users = [u for u in user_rentals if u != user_id and user_id in user_rentals]
    for u in similar_users:
        sim = jaccard(user_rentals[user_id], user_rentals[u])
        if sim > 0:
            for b in user_rentals[u]:
                if b not in user_rentals[user_id]:
                    collab_score[b] += sim
    if collab_score:
        max_val = max(collab_score.values())
        for k in collab_score:
            collab_score[k] /= max_val

    results = []
    for j, b in enumerate(bikes):
        bid = str(b['_id'])
        if bid == bike_id:
            continue
        cb_score = sims[j]
        cf_score = collab_score.get(bid, 0)
        
        # ✅ Tính điểm rating
        rating = get_avg_rating(bid)
        rating_score = rating / 5.0  # Normalize từ 0–1

        # ✅ Gộp điểm
        hybrid_score = alpha * cb_score + beta * cf_score + gamma * rating_score

        b['_id'] = bid
        b['avg_rating'] = round(rating, 2)
        results.append((b, hybrid_score))

    results.sort(key=lambda x: x[1], reverse=True)
    return [b for b, _ in results[:top_n]]
