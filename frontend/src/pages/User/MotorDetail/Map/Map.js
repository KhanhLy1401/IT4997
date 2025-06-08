import React, { useRef, useEffect, useState } from 'react';
import mapboxgl from 'mapbox-gl';
import MapboxDirections from '@mapbox/mapbox-gl-directions/dist/mapbox-gl-directions';
import 'mapbox-gl/dist/mapbox-gl.css';
import '@mapbox/mapbox-gl-directions/dist/mapbox-gl-directions.css';

mapboxgl.accessToken = 'pk.eyJ1Ijoia2hhbmhoaGgiLCJhIjoiY21hYXg2d3hiMjh2MzJpcHp3Z3M4YnRhNCJ9.ZiMfLQEXU-iAEKi_NJx5eA';

const DirectionMap = () => {
  const mapContainer = useRef(null);
  const directionsRef = useRef(null);
  const [showLocationMenu, setShowLocationMenu] = useState(false);

  const getCurrentLocation = () => {
    navigator.geolocation.getCurrentPosition(
      (position) => {
        const loc = [position.coords.longitude, position.coords.latitude];
        if (directionsRef.current) {
          directionsRef.current.setOrigin(loc);
        }
        setShowLocationMenu(false);
      },
      (error) => {
        console.error("Lỗi lấy vị trí:", error);
        alert("Không thể lấy vị trí hiện tại. Vui lòng kiểm tra quyền truy cập vị trí.");
      }
    );
  };

  useEffect(() => {
    if (!mapContainer.current) return;

    const map = new mapboxgl.Map({
      container: mapContainer.current,
      style: 'mapbox://styles/mapbox/streets-v11',
      center: [105.8542, 21.0285],
      zoom: 12
    });

    const directions = new MapboxDirections({
      accessToken: mapboxgl.accessToken,
      unit: 'metric',
      profile: 'driving',
      controls: {
        inputs: true,
        instructions: true,
        profileSwitcher: true
      },
      language: 'vi'
    });

    directionsRef.current = directions;
    map.addControl(directions, 'top-left');

    // Thêm nút chọn vị trí hiện tại
    setTimeout(() => {
      const originContainer = document.querySelector('.mapbox-gl-directions-origin');
      if (originContainer) {
        const locationBtn = document.createElement('div');
        locationBtn.innerHTML = `
          <button style="
            background: none;
            border: none;
            cursor: pointer;
            position: absolute;
            right: 10px;
            top: 50%;
            transform: translateY(-50%);
            color: #555;
          ">
            <span style="font-size: 18px">📍</span>
          </button>
        `;
        locationBtn.onclick = getCurrentLocation;
        originContainer.style.position = 'relative';
        originContainer.appendChild(locationBtn);
      }
    }, 1000);

    return () => map.remove();
  }, []);

  return (
    <div style={{ position: 'relative' }}>
      <div ref={mapContainer} style={{ width: '100%', height: '500px' }} />
      
      {/* Menu chọn vị trí (hiển thị khi click vào ô input) */}
      {showLocationMenu && (
        <div style={{
          position: 'absolute',
          top: '60px',
          left: '10px',
          zIndex: 1000,
          background: 'white',
          padding: '10px',
          borderRadius: '4px',
          boxShadow: '0 2px 8px rgba(0,0,0,0.15)'
        }}>
          <div 
            style={{ padding: '8px', cursor: 'pointer', display: 'flex', alignItems: 'center' }}
            onClick={getCurrentLocation}
          >
            <span style={{ marginRight: '8px' }}>📍</span>
            <span>Dùng vị trí hiện tại</span>
          </div>
        </div>
      )}
    </div>
  );
};

export default DirectionMap;