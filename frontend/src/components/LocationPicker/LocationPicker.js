import React, { useEffect, useState } from "react";
import './LocationPicker.css'

const LocationPicker = () => {
  const [provinces, setProvinces] = useState([]);
  const [districts, setDistricts] = useState([]);
  const [wards, setWards] = useState([]);

  const [selectedProvince, setSelectedProvince] = useState(null);
  const [selectedDistrict, setSelectedDistrict] = useState(null);
  const [selectedWard, setSelectedWard] = useState(null);

  const [coordinates, setCoordinates] = useState(null);

  // Load provinces
  useEffect(() => {
    fetch("https://provinces.open-api.vn/api/p/")
      .then((res) => res.json())
      .then((data) => setProvinces(data));
  }, []);

  // Load districts when province changes
  useEffect(() => {
    if (selectedProvince) {
      fetch(`https://provinces.open-api.vn/api/p/${selectedProvince.code}?depth=2`)
        .then((res) => res.json())
        .then((data) => setDistricts(data.districts));
    } else {
      setDistricts([]);
      setWards([]);
    }
  }, [selectedProvince]);

  // Load wards when district changes
  useEffect(() => {
    if (selectedDistrict) {
      fetch(`https://provinces.open-api.vn/api/d/${selectedDistrict.code}?depth=2`)
        .then((res) => res.json())
        .then((data) => setWards(data.wards));
    } else {
      setWards([]);
    }
  }, [selectedDistrict]);

  // Get coordinates when full address is selected
//   useEffect(() => {
//     if (selectedProvince && selectedDistrict && selectedWard) {
//       const fullAddress = `${selectedWard.name}, ${selectedDistrict.name}, ${selectedProvince.name}`;
//       const url = `https://nominatim.openstreetmap.org/search?q=${encodeURIComponent(
//         fullAddress
//       )}&format=json`;

//       fetch(url, {
//         headers: {
//           "User-Agent": "ReactLocationPicker"
//         }
//       })
//         .then((res) => res.json())
//         .then((data) => {
//           if (data.length > 0) {
//             setCoordinates({ lat: data[0].lat, lon: data[0].lon });
//           } else {
//             setCoordinates(null);
//           }
//         });
//     }
//   }, [selectedProvince, selectedDistrict, selectedWard]);

function removeVietnameseAdminTitles(address) {
    return address
      .replace(/(Tỉnh|Thành phố|Huyện|Quận|Xã|Phường|Thị trấn)\s*/g, '')
      .trim();
  }

useEffect(() => {
    if (selectedProvince && selectedDistrict && selectedWard) {
      let fullAddress = `${selectedWard.name}, ${selectedDistrict.name}, ${selectedProvince.name}, Vietnam`;
      fullAddress = removeVietnameseAdminTitles(fullAddress); // <- Xử lý tại đây


      const url = `https://nominatim.openstreetmap.org/search?q=${encodeURIComponent(
        fullAddress
      )}&format=json&addressdetails=1&limit=1`;
  
      console.log("🔍 Tìm tọa độ cho:", fullAddress);
  
      fetch(url, {
        headers: {
          "User-Agent": "Mozilla/5.0 (React app)",
          "Accept-Language": "vi"
        }
      })
        .then((res) => res.json())
        .then((data) => {
          console.log("📡 Kết quả tọa độ:", data);
          if (data.length > 0) {
            setCoordinates({ lat: data[0].lat, lon: data[0].lon });
          } else {
            setCoordinates(null);
          }
        })
        .catch(err => {
          console.error("❌ Lỗi lấy tọa độ:", err);
          setCoordinates(null);
        });
    }
  }, [selectedProvince, selectedDistrict, selectedWard]);
  

  return (
    <div className="location-picker" >

      <select className="picker" onChange={(e) => {
        const code = e.target.value;
        const province = provinces.find((p) => p.code.toString() === code);
        setSelectedProvince(province);
        setSelectedDistrict(null);
        setSelectedWard(null);
      }}>
        <option value="">-- Chọn Tỉnh/Thành --</option>
        {provinces.map((p) => (
          <option key={p.code} value={p.code}>{p.name}</option>
        ))}
      </select>

      <select className="picker" onChange={(e) => {
        const code = e.target.value;
        const district = districts.find((d) => d.code.toString() === code);
        setSelectedDistrict(district);
        setSelectedWard(null);
      }} disabled={!districts.length}>
        <option value="">-- Chọn Quận/Huyện --</option>
        {districts.map((d) => (
          <option key={d.code} value={d.code}>{d.name}</option>
        ))}
      </select>

      <select className="picker" onChange={(e) => {
        const code = e.target.value;
        const ward = wards.find((w) => w.code.toString() === code);
        setSelectedWard(ward);
      }} disabled={!wards.length}>
        <option value="">-- Chọn Xã/Phường --</option>
        {wards.map((w) => (
          <option key={w.code} value={w.code}>{w.name}</option>
        ))}
      </select>

      {/* <div style={{ marginTop: "1rem" }}>
        {coordinates ? (
          <p>📍 Tọa độ: <strong>{coordinates.lat}</strong>, <strong>{coordinates.lon}</strong></p>
        ) : selectedWard ? (
          <p>🔍 Đang tìm tọa độ...</p>
        ) : null}
      </div> */}
    </div>
  );
};

export default LocationPicker;
