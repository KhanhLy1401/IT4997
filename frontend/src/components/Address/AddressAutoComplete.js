

import React, { useState, useEffect } from 'react';
import './AddressAutoComplete.css'

const AddressAutocomplete = ({ onSelectAddress }) => {
  const [query, setQuery] = useState('');
  const [suggestions, setSuggestions] = useState([]);
  const [selectedAddress, setSelectedAddress] = useState('');

  useEffect(() => {
    const fetchSuggestions = async () => {
      if (query.length < 2) {
        setSuggestions([]);
        return;
      }
      try {
        const response = await fetch(
          `https://nominatim.openstreetmap.org/search?q=${encodeURIComponent(query)}&format=json&addressdetails=1&accept-language=vi`
        );
        const data = await response.json();
        setSuggestions(data);
      } catch (error) {
        console.error('Lỗi khi lấy địa chỉ:', error);
      }
    };

    const timeoutId = setTimeout(() => {
      fetchSuggestions();
    }, 200);

    return () => clearTimeout(timeoutId);
  }, [query]);

  const handleSelect = (address) => {
    const displayAddress = address.display_name;
    setSelectedAddress(displayAddress);
    setQuery(displayAddress);
    setSuggestions([]);
    // Gọi hàm onSelectAddress từ prop để thông báo cho component cha
    if (onSelectAddress) {
      onSelectAddress(displayAddress);
    }
  };

  return (
    <div className='autocomplete-address'>
      <i class="fa-solid fa-location-dot"></i> 
      <input
        
        type="text"
        placeholder="Nhập địa chỉ..."
        value={query}
        onChange={(e) => setQuery(e.target.value)}
        style={{ width: '100%', padding: '8px' }}
      />
      {suggestions.length > 0 && (
        <ul
          style={{
            position: 'absolute',
            top: '110%',
            left: 0,
            right: 0,
            background: '#fff',
            border: '1px solid #fff',
            listStyle: 'none',
            padding: 0,
            margin: 0,
            maxHeight: '200px',
            overflowY: 'auto',
            zIndex: 1000
          }}
        >
          {suggestions.map((suggestion) => (
            <li
              key={suggestion.place_id}
              onClick={() => handleSelect(suggestion)}
              style={{ padding: '8px', cursor: 'pointer' }}
            >
              {suggestion.display_name}
            </li>
          ))}
        </ul>
      )}
      <i class="fa-solid fa-angle-down" ></i>
    </div>
  );
};

export default AddressAutocomplete;
