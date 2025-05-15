from flask import Flask, request, jsonify
from flask_cors import CORS
from logic import recommend_by_content, recommend_by_user, recommend_hybrid

app = Flask(__name__) #tạo ứng dụng flask
CORS(app)

#api gợi ý theo nội dung xe
@app.route("/recommend/content")
def content_based():
    bike_id = request.args.get("bikeId") #Lấy tham số bikeId từ url(?bikeId=avdlkfja)
    if not bike_id:
        return jsonify({"error": "Missing bikeId"}), 400
    results = recommend_by_content(bike_id)
    return jsonify(results)

@app.route("/recommend/user")
def user_based():
    user_id = request.args.get("userId")
    if not user_id:
        return jsonify({"error": "Missing userId"}), 400
    results = recommend_by_user(user_id)
    return jsonify(results)

@app.route("/recommend/hybrid")
def hybrid_based():
    user_id = request.args.get("userId") #lấy userId từ url
    bike_id = request.args.get("bikeId") #lấy bikeId từ url
    if not user_id or not bike_id:
        return jsonify({"error": "Missing userId or bikeId"}), 400
    results = recommend_hybrid(user_id, bike_id)
    return jsonify(results)

if __name__ == "__main__":
    app.run(debug=True, port=5001)
