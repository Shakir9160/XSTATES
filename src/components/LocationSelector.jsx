import axios from "axios";
import { useEffect, useState } from "react";
import "./LocationSelector.css"; // for styling

const LocationSelector = () => {
  const [countries, setCountries] = useState([]);
  const [states, setStates] = useState([]);
  const [cities, setCities] = useState([]);

  const [selectedCountry, setSelectedCountry] = useState("");
  const [selectedState, setSelectedState] = useState("");
  const [selectedCity, setSelectedCity] = useState("");

  // Fetch all countries
  useEffect(() => {
    const fetchCountries = async () => {
      try {
        const res = await axios.get(
          "https://crio-location-selector.onrender.com/countries"
        );
        setCountries(res.data);
      } catch (err) {
        console.error("Error fetching countries:", err);
      }
    };

    fetchCountries();
  }, []);

  // Fetch states when country changes
  useEffect(() => {
    if (!selectedCountry) return;

    const fetchStates = async () => {
      try {
        const res = await axios.get(
          `https://crio-location-selector.onrender.com/country=${selectedCountry}/states`
        );
        setStates(res.data);
        setCities([]);
        setSelectedState("");
        setSelectedCity("");
      } catch (err) {
        console.error("Error fetching states:", err);
      }
    };

    fetchStates();
  }, [selectedCountry]);

  // Fetch cities when state changes
  useEffect(() => {
    if (!selectedState || !selectedCountry) return;

    const fetchCities = async () => {
      try {
        const res = await axios.get(
          `https://crio-location-selector.onrender.com/country=${selectedCountry}/state=${selectedState}/cities`
        );
        setCities(res.data);
        setSelectedCity("");
      } catch (err) {
        console.error("Error fetching cities:", err);
      }
    };

    fetchCities();
  }, [selectedState, selectedCountry]);

  return (
    <div className="location-container">
      <h1>Select Location</h1>

      <div className="dropdown-row">
        {/* Country Dropdown */}
        <select
          className="country-select"
          value={selectedCountry}
          onChange={(e) => setSelectedCountry(e.target.value)}
        >
          <option value="">Select Country</option>
          {countries.map((country) => (
            <option key={country} value={country}>
              {country}
            </option>
          ))}
        </select>

        {/* State Dropdown */}
        <select
          className="state-select"
          value={selectedState}
          onChange={(e) => setSelectedState(e.target.value)}
          disabled={!selectedCountry}
        >
          <option value="">Select State</option>
          {states.map((state) => (
            <option key={state} value={state}>
              {state}
            </option>
          ))}
        </select>

        {/* City Dropdown */}
        <select
          className="city-select"
          value={selectedCity}
          onChange={(e) => setSelectedCity(e.target.value)}
          disabled={!selectedState}
        >
          <option value="">Select City</option>
          {cities.map((city) => (
            <option key={city} value={city}>
              {city}
            </option>
          ))}
        </select>
      </div>

      {/* Display Selection */}
      {selectedCountry && selectedState && selectedCity && (
        <div className="result">
          <span className="prefix">You selected</span>{" "}
          <span className="city">{selectedCity}</span>
          <span className="prefix">,</span>{" "}
          <span className="state">{selectedState},</span>{" "}
          <span className="country">{selectedCountry}</span>
        </div>
      )}
    </div>
  );
};

export default LocationSelector;
