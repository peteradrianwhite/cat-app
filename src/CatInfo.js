import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './CatInfo.css';

const CatInfo = () => {
  const [catImage, setCatImage] = useState('');
  const [CatInfo, setCatInfo] = useState('');

  const fetchCatData = async () => {
    try {
      const factResponse = await axios.get('https://catfact.ninja/fact');
      
      setCatImage('https://cataas.com/cat?' + new Date().getTime());
      setCatInfo(factResponse.data.fact);
    } catch (error) {
      console.error('Error fetching cat data:', error);
    }
  };

  const fetchCatGif = async () => {
    try {
         
      setCatImage(`https://cataas.com/cat/gif?timestamp=${new Date().getTime()}` );
      const factResponse = await axios.get('https://catfact.ninja/fact');
      setCatInfo(factResponse.data.fact);
    } catch (error) {
      console.error('Error fetching cat gif:', error);
    }
  };

  useEffect(() => {
    fetchCatData();
  }, []);

  return (
    <div className="cat-fact-container">
      <img src={catImage} alt="Random Cat" className="cat-image" />
      <p className="cat-fact">{CatInfo}</p>
      <button onClick={fetchCatData} className="refresh-button">Refresh</button> 
      <br/>
      <button onClick={fetchCatGif} className="gif-button">How about a gif?</button> <label>Gifs Take a Short Time to Load</label>
      
    </div>
  );
};

export default CatInfo;
