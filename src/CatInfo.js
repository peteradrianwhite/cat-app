import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './CatInfo.css';

const CatInfo = () => {
  const [catImage, setCatImage] = useState('');
  const [CatInfo, setCatInfo] = useState('');
  const [favorites, setFavorites] = useState([]);

  const fetchCatData = async () => {
    try {
      const factResponse = await axios.get('https://catfact.ninja/fact');
      
      setCatImage('https://cataas.com/cat?' + new Date().getTime());
      setCatInfo(factResponse.data.fact);
    } catch (error) {
      console.error('Error fetching cat data:', error);
    }
  };


  const saveCatPic = () => {
    setFavorites(prevFavorites => {
      const newFavorites = [...prevFavorites, catImage];
      if (newFavorites.length > 4) {
        newFavorites.shift(); 
      }
      return newFavorites;
    });
  };

  useEffect(() => {
    fetchCatData();
  }, []);

  return (
    <div className="cat-fact-container">
      <img src={catImage} alt="Random Cat" className="cat-image" />
      <p className="cat-fact">{CatInfo}</p>
      <div className="button-container">
      <button onClick={fetchCatData} className="refresh-button">Refresh</button> 
      <button onClick={saveCatPic} className="save-button">Save Cat Pic</button>
      
    </div>
        <div className="favorites-container">
            {favorites.map((fav, index) => (
            <img key={index} src={fav} alt={`Favorite ${index + 1}`} className="favorite-image" />
            ))}
      </div>
    </div>

    
  );
};

export default CatInfo;
