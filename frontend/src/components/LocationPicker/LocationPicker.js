import React, { useEffect, useState } from "react";
import './LocationPicker.css'

const LocationPicker = ({ onLocationChange, initialProvinceName, initialDistrictName, initialWardName  }) => {
  const [provinces, setProvinces] = useState([]);
  const [districts, setDistricts] = useState([]);
  const [wards, setWards] = useState([]);

  const [selectedProvince, setSelectedProvince] = useState(null);
  const [selectedDistrict, setSelectedDistrict] = useState(null);
  const [selectedWard, setSelectedWard] = useState(null);

  const [coordinates, setCoordinates] = useState(null);

  // Gán tỉnh ban đầu nếu có


  // Load provinces
  useEffect(() => {
    fetch("https://provinces.open-api.vn/api/p/")
      .then((res) => res.json())
      .then((data) => setProvinces(data));
  }, []);
  
  useEffect(() => {
    if ( initialProvinceName) {
      const foundProvince = provinces.find(p => p.name === initialProvinceName);
      if (foundProvince) {
        setSelectedProvince(foundProvince);

      }
    }
  }, [provinces, initialProvinceName]);



  // Gán huyện ban đầu nếu có
  useEffect(() => {
    if ( initialDistrictName) {
      const foundDistrict = districts.find(d => d.name === initialDistrictName);
      if (foundDistrict) {
        setSelectedDistrict(foundDistrict);
      }
    }
  }, [districts, initialDistrictName]);

  // Gán xã/phường ban đầu nếu có
  useEffect(() => {
    if ( initialWardName) {
      const foundWard = wards.find(w => w.name === initialWardName);
      if (foundWard) {
        setSelectedWard(foundWard);
      }
    }
  }, [wards, initialWardName]);


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
//       const url = `https://maps.googleapis.com/maps/api/geocode/json?address=Hanoi,Vietnam&key=YOUR_API_KEY?q=${encodeURIComponent(
//         fullAddress
//       )}&format=json`;

//https://maps.googleapis.com/maps/api/geocode/json?address=&key=YOUR_API_KEY

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
    if (selectedProvince || selectedDistrict || selectedWard) {
      let fullAddress = `${selectedWard?.name || ''}, ${selectedDistrict?.name || ''}, ${selectedProvince?.name|| ''}, Vietnam`;
      fullAddress = removeVietnameseAdminTitles(fullAddress); // <- Xử lý tại đây
      onLocationChange({
        province: selectedProvince?.name || '',
        district: selectedDistrict?.name || '',
        ward: selectedWard?.name|| '',
      }); 

      const url = `https://nominatim.openstreetmap.org/search?q=${encodeURIComponent(
        fullAddress
      )}&format=json&addressdetails=1&limit=1`;
  

    }
  }, [selectedProvince, selectedDistrict, selectedWard]);
  

  return (
    <div className="location-picker" >

      <select className="picker"
        value={selectedProvince?.code || ""}
        onChange={(e) => {
        const code = e.target.value;
        const province = provinces.find((p) => p.code.toString() === code);
        setSelectedProvince(province);
        setSelectedDistrict(null);
        setSelectedWard(null);
      }}>
        <option value="">Tỉnh/Thành phố</option>
        {provinces.map((p) => (
          <option key={p.code} value={p.code}>{p.name}</option>
        ))}
      </select>

      <select className="picker"
        value={selectedDistrict?.code || ""} 
        onChange={(e) => {
        const code = e.target.value;
        const district = districts.find((d) => d.code.toString() === code);
        setSelectedDistrict(district);
        setSelectedWard(null);
      }} disabled={!districts.length}>
        <option value="">Quận/Huyện</option>
        {districts.map((d) => (
          <option key={d.code} value={d.code}>{d.name}</option>
        ))}
      </select>

      <select className="picker"
        value={selectedWard?.code || ""}
        onChange={(e) => {
        const code = e.target.value;
        const ward = wards.find((w) => w.code.toString() === code);
        setSelectedWard(ward);
      }} disabled={!wards.length}>
        <option value="">Xã/Phường</option>
        {wards.map((w) => (
          <option key={w.code} value={w.code}>{w.name}</option>
        ))}
      </select>
    </div>
  );
};

export default LocationPicker;
