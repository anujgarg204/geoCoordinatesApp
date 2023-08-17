import React, { useState, useEffect } from 'react';
import axios from 'axios';
import Notification1 from './Notification1'

function CityCoordinates() {
  const [cityName, setCityName] = useState('');
  const [desLatitude, setDesLatitude] = useState(null);
  const [desLongitude, setDesLongitude] = useState(null);
  const [srcLatitude, setSrcLatitude] = useState(null);
  const [srcLongitude, setSrcLongitude] = useState(null);
  const [error, setError] = useState(null);
  const [distance, setDistance] = useState(null);
  const [disError, setDisError] = useState(null);

  const apiKey = 'YOUR API KEY'; // Replace with your actual API key

  useEffect(() => {
    const interval = setInterval(getDistance, 1*1000); // 5 minutes in milliseconds
    return () => {
      clearInterval(interval);
    };
  }, []);

  useEffect(() => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          setSrcLatitude(position.coords.latitude);
          setSrcLongitude(position.coords.longitude);
        },
        (error) => {
          console.error("Error getting geolocation:", error);
        }
      );
    } else {
      console.error("Geolocation is not supported by this browser.");
    }
  }, []);

  const handleCityNameChange = (event) => {
    setCityName(event.target.value);
  };

  const getCoordinates = () => {
    setError(null);

    const apiUrl = `https://api.openweathermap.org/data/2.5/weather?q=${cityName}&appid=${apiKey}`;

    axios.get(apiUrl)
      .then(response => {
        setDesLatitude(response.data.coord.lat);
        setDesLongitude(response.data.coord.lon);
      })
      .catch(error => {
        setError(error.message);
      });
  };

  const getDistance = () => {

    if(desLatitude !== null && desLongitude !== null){
      const R = 6371; // Earth's radius in kilometers
    const lat1 = parseFloat(srcLatitude);
    const lon1 = parseFloat(srcLongitude);
    const lat2 = parseFloat(desLatitude);
    const lon2 = parseFloat(desLongitude);

    const dLat = ((lat2 - lat1) * Math.PI) / 180;
    const dLon = ((lon2 - lon1) * Math.PI) / 180;

    const a =
      Math.sin(dLat / 2) * Math.sin(dLat / 2) +
      Math.cos((lat1 * Math.PI) / 180) *
      Math.cos((lat2 * Math.PI) / 180) *
      Math.sin(dLon / 2) *
      Math.sin(dLon / 2);

    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));

    const calculatedDistance = R * c;
    console.log("Current distance is: ", calculatedDistance);
    setDistance(calculatedDistance.toFixed(2));


      // const apiUrl = `https://api.openweathermap.org/data/2.5/distances?lat=${srcLatitude}&lon=${srcLongitude}&lat=${desLatitude}&lon=${desLongitude}&appid=${apiKey}`;
      
      // console.log(apiUrl)
      // axios.get(apiUrl)
      //   .then(response => {
      //     setDistance(response.data.distance);
      //   })
      //   .catch(error => {
      //     setDisError(error.message);
      //   });
  }
}

  return (
    <div>
      <h1>City Coordinates Finder</h1>
      <label htmlFor="cityName">Enter City Name:</label>
      <input
        type="text"
        id="cityName"
        value={cityName}
        onChange={handleCityNameChange}
      />
      {/* <button onClick={getCoordinates}>Get Coordinates</button> */}
      <button onClick={getCoordinates}>Get Distance</button>
      
      {desLatitude !== null && desLongitude !== null ? (
        <div>
          <p>
            Destination Latitude: {desLatitude}<br />
            Destination Longitude: {desLongitude}
          </p>
        </div>
      ) : (
        <p>{error ? `Error: ${error}` : 'Coordinates will appear here.'}</p>
      )}


      {srcLatitude !== null && srcLongitude !== null ? (
        <div>
        <p>
          Source Latitude: {srcLatitude}<br />
          Source Longitude: {srcLongitude}
        </p>
      </div>
      ): (
        <p>{error ? `Error: ${error}` : 'Coordinates will appear here.'}</p>
      )}

      <h1>Distance Calculation</h1>
      {distance !== null ? (
        <p>
          Distance: {distance} km
        </p>
      ) : (
        <p>{disError ? `Error: ${disError}` : 'Calculating distance...'}</p>
      )}

      {distance != null && distance < 10 ? (
        <Notification1 />
      ): (
        <p>You have not arrived yet</p>
      )}
     
    </div>
  );
}

export default CityCoordinates;
