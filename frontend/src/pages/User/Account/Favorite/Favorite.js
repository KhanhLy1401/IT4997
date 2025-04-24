import React from 'react';
import './Favorite.css';

const Favorite = () => {
  const cars = [
    {
      id: 1,
      image: '/images/xpander_cross_2023.jpg',
      name: 'MITSUBISHI XPANDER CROSS 2023',
      location: 'Quận 3, TP. Hồ Chí Minh',
      rating: 5.0,
      trips: 9,
      price: 966,
      oldPrice: 1086,
      transmission: 'Số tự động',
      seats: 7,
      fuel: 'Xăng',
      owner: 'owner1.jpg'
    },
    {
      id: 2,
      image: '/images/xpander_2024.jpg',
      name: 'MITSUBISHI XPANDER 2024',
      location: 'Quận 1, TP. Hồ Chí Minh',
      rating: 5.0,
      trips: 28,
      price: 787,
      oldPrice: 907,
      transmission: 'Số tự động',
      seats: 7,
      fuel: 'Xăng',
      owner: 'owner2.jpg'
    }
  ];

  return (
    <div className="favorite-cars-container">
      <h1>Xe yêu thích của tôi</h1>
      <div className="tabs">
        <div className="tab active">Xe tự lái</div>
        <div className="tab">Xe có tài xế</div>
      </div>
      <div className="car-list">
        {cars.map(car => (
          <div className="car-card" key={car.id}>
            <img className="car-image" src={car.image} alt={car.name} />
            <div className="car-info">
              <div className="badges">
                <span className="badge">Miễn thế chấp</span>
              </div>
              <h2>{car.name}</h2>
              <p>{car.transmission} • {car.seats} chỗ • {car.fuel}</p>
              <div className="rating">
                <span>⭐ {car.rating} • </span>
                <span>{car.trips} chuyến</span>
              </div>
              <p>{car.location}</p>
            </div>
            <div className="car-price">
              <img className="owner-avatar" src={`/images/${car.owner}`} alt="Chủ xe" />
              <div>
                <span className="old-price">{car.oldPrice}K</span>
                <span className="new-price">{car.price}K</span>/ngày
              </div>
              <button className="btn-remove">Bỏ thích</button>
              <a href="#" className="details-link">Xem chi tiết</a>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Favorite;
