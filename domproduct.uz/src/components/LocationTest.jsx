import React, { useState, useContext } from 'react';
import { LocationContext } from '../contexts/LocationContext';
import OpenStreetMapUtils from '../utils/OpenStreetMapUtils';

const LocationTest = () => {
  const { location, detectLocationByGPS, detectLocationByIP } = useContext(LocationContext);
  const [testResults, setTestResults] = useState([]);
  const [isTestingAll, setIsTestingAll] = useState(false);

  const addTestResult = (name, status, data, error = null) => {
    const result = {
      id: Date.now(),
      name,
      status, // 'success', 'error', 'info'
      data,
      error,
      timestamp: new Date().toLocaleTimeString()
    };
    setTestResults(prev => [result, ...prev]);
  };

  // 1. GPS Test
  const testGPS = async () => {
    try {
      addTestResult('GPS Detection', 'info', 'Testing GPS location...');
      const result = await detectLocationByGPS();
      addTestResult('GPS Detection', 'success', result);
    } catch (error) {
      addTestResult('GPS Detection', 'error', null, error.message);
    }
  };

  // 2. IP Geolocation Test
  const testIPGeolocation = async () => {
    try {
      addTestResult('IP Geolocation', 'info', 'Testing IP-based location...');
      const result = await detectLocationByIP();
      addTestResult('IP Geolocation', 'success', result);
    } catch (error) {
      addTestResult('IP Geolocation', 'error', null, error.message);
    }
  };

  // 3. Yandex API Test (direct)
  const testYandexAPI = async () => {
    try {
      addTestResult('Yandex API Direct', 'info', 'Testing Yandex Geocoder...');
      
      // Toshkent koordinatalari
      const testLat = 41.2995;
      const testLon = 69.2401;
      const apiKey = import.meta.env.VITE_YANDEX_MAPS_API_KEY;
      
      // API key bilan test
      let url = `https://geocode-maps.yandex.ru/1.x/?format=json&geocode=${testLon},${testLat}&results=1&lang=uz`;
      if (apiKey && apiKey !== 'undefined') {
        url += `&apikey=${apiKey}`;
      }

      const response = await fetch(url);
      const data = await response.json();
      
      if (data.response && data.response.GeoObjectCollection) {
        const geoObjects = data.response.GeoObjectCollection.featureMember;
        if (geoObjects && geoObjects.length > 0) {
          const location = geoObjects[0].GeoObject;
          addTestResult('Yandex API Direct', 'success', {
            address: location.metaDataProperty.GeocoderMetaData.text,
            coordinates: location.Point.pos,
            kind: location.metaDataProperty.GeocoderMetaData.kind,
            precision: location.metaDataProperty.GeocoderMetaData.precision
          });
        } else {
          addTestResult('Yandex API Direct', 'error', null, 'No results found');
        }
      } else {
        addTestResult('Yandex API Direct', 'error', data, 'Invalid API response');
      }
    } catch (error) {
      addTestResult('Yandex API Direct', 'error', null, error.message);
    }
  };

  // 4. IP Services Manual Test
  const testIPServices = async () => {
    const services = [
      { name: 'ipapi.co', url: 'https://ipapi.co/json/' },
      { name: 'ipinfo.io', url: 'https://ipinfo.io/json' },
      { name: 'ip-api.com', url: 'http://ip-api.com/json/' }
    ];

    for (const service of services) {
      try {
        addTestResult(`IP Service: ${service.name}`, 'info', 'Testing...');
        
        const response = await fetch(service.url);
        const data = await response.json();
        
        addTestResult(`IP Service: ${service.name}`, 'success', {
          ip: data.ip,
          city: data.city || data.query,
          region: data.region || data.regionName,
          country: data.country || data.countryCode,
          coordinates: data.loc ? data.loc.split(',') : [data.lat, data.lon]
        });
      } catch (error) {
        addTestResult(`IP Service: ${service.name}`, 'error', null, error.message);
      }
    }
  };

  // 5. Environment Variables Test
  const testEnvironmentVars = () => {
    const vars = {
      'VITE_GOOGLE_MAPS_API_KEY': import.meta.env.VITE_GOOGLE_MAPS_API_KEY,
      'VITE_YANDEX_MAPS_API_KEY': import.meta.env.VITE_YANDEX_MAPS_API_KEY,
      'NODE_ENV': import.meta.env.NODE_ENV,
      'MODE': import.meta.env.MODE
    };

    Object.entries(vars).forEach(([key, value]) => {
      const status = value && value !== 'undefined' ? 'success' : 'error';
      const displayValue = value ? 
        (key.includes('API_KEY') ? `${value.substring(0, 10)}...` : value) : 
        'Not set';
      
      addTestResult(`ENV: ${key}`, status, { value: displayValue });
    });
  };

  // 6. OpenStreetMap Test (bepul!)
  const testOpenStreetMap = async () => {
    try {
      addTestResult('OpenStreetMap Test', 'info', 'Testing OSM reverse geocoding...');
      
      // Toshkent koordinatalari
      const lat = 41.2995;
      const lon = 69.2401;
      
      const result = await OpenStreetMapUtils.reverseGeocode(lat, lon, 'uz');
      
      addTestResult('OpenStreetMap Test', 'success', {
        provider: 'OpenStreetMap (OSM)',
        api_cost: 'FREE - No API key required!',
        formatted_address: result.formatted_address,
        city: result.city,
        state: result.state,
        country: result.country,
        coordinates: [result.latitude, result.longitude],
        source: result.source,
        licence: result.licence
      });
    } catch (error) {
      addTestResult('OpenStreetMap Test', 'error', null, error.message);
    }
  };

  // Test All
  const testAll = async () => {
    setIsTestingAll(true);
    setTestResults([]);
    
    addTestResult('Comprehensive Test', 'info', 'Starting all tests...');
    
    // Environment variables
    testEnvironmentVars();
    
    // OpenStreetMap (bepul!)
    await testOpenStreetMap();
    
    // IP Services
    await testIPServices();
    
    // Yandex API
    await testYandexAPI();
    
    // IP Geolocation through context
    await testIPGeolocation();
    
    // GPS (agar user ruxsat bersa)
    // await testGPS(); // Commented out to avoid permission popup
    
    addTestResult('Comprehensive Test', 'success', 'All tests completed!');
    setIsTestingAll(false);
  };

  const clearResults = () => {
    setTestResults([]);
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'success': return '#22c55e';
      case 'error': return '#ef4444';
      case 'info': return '#3b82f6';
      default: return '#6b7280';
    }
  };

  const getStatusIcon = (status) => {
    switch (status) {
      case 'success': return '✅';
      case 'error': return '❌';
      case 'info': return '🔄';
      default: return '⚪';
    }
  };

  return (
    <div style={{ padding: '20px', maxWidth: '1000px', margin: '0 auto' }}>
      <div style={{ 
        background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
        color: 'white',
        padding: '30px',
        borderRadius: '15px',
        marginBottom: '20px',
        textAlign: 'center'
      }}>
        <h1>🧪 Location Detection Test Suite</h1>
        <p>API va Location servislarini sinovdan o'tkazish</p>
      </div>

      {/* Current Location Info */}
      {location && (
        <div style={{
          background: '#f8fafc',
          border: '1px solid #e2e8f0',
          borderRadius: '10px',
          padding: '20px',
          marginBottom: '20px'
        }}>
          <h3 style={{ margin: '0 0 15px 0', color: '#1e293b' }}>📍 Current Location</h3>
          <div style={{ 
            display: 'grid', 
            gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
            gap: '10px',
            fontSize: '14px'
          }}>
            <div><strong>City:</strong> {location.city}</div>
            <div><strong>Region:</strong> {location.region}</div>
            <div><strong>Method:</strong> {location.method}</div>
            <div><strong>Address:</strong> {location.address}</div>
          </div>
        </div>
      )}

      {/* Test Controls */}
      <div style={{
        display: 'flex',
        gap: '10px',
        marginBottom: '20px',
        flexWrap: 'wrap'
      }}>
        <button 
          onClick={testAll}
          disabled={isTestingAll}
          style={{
            background: '#10b981',
            color: 'white',
            border: 'none',
            padding: '12px 20px',
            borderRadius: '8px',
            cursor: isTestingAll ? 'not-allowed' : 'pointer',
            opacity: isTestingAll ? 0.6 : 1
          }}
        >
          {isTestingAll ? '🔄 Testing...' : '🚀 Test All'}
        </button>
        
        <button onClick={testGPS} style={buttonStyle}>
          📍 Test GPS
        </button>
        
        <button onClick={testIPGeolocation} style={buttonStyle}>
          🌐 Test IP Location
        </button>
        
        <button onClick={testYandexAPI} style={buttonStyle}>
          🗺️ Test Yandex API
        </button>
        
        <button onClick={testOpenStreetMap} style={{...buttonStyle, background: '#10b981'}}>
          🗺️ Test OSM (FREE)
        </button>
        
        <button onClick={testIPServices} style={buttonStyle}>
          🔧 Test IP Services
        </button>
        
        <button onClick={testEnvironmentVars} style={buttonStyle}>
          🔑 Test ENV Vars
        </button>
        
        <button 
          onClick={clearResults} 
          style={{...buttonStyle, background: '#ef4444'}}
        >
          🗑️ Clear
        </button>
      </div>

      {/* Test Results */}
      <div style={{
        background: '#ffffff',
        border: '1px solid #e2e8f0',
        borderRadius: '10px',
        overflow: 'hidden'
      }}>
        <div style={{
          background: '#f1f5f9',
          padding: '15px',
          borderBottom: '1px solid #e2e8f0',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center'
        }}>
          <h3 style={{ margin: 0, color: '#1e293b' }}>📊 Test Results</h3>
          <span style={{ fontSize: '14px', color: '#64748b' }}>
            {testResults.length} results
          </span>
        </div>
        
        <div style={{ maxHeight: '500px', overflowY: 'auto' }}>
          {testResults.length === 0 ? (
            <div style={{ padding: '40px', textAlign: 'center', color: '#64748b' }}>
              Hali test o'tkazilmagan. Yuqoridagi tugmalardan birini bosing.
            </div>
          ) : (
            testResults.map((result) => (
              <div 
                key={result.id}
                style={{
                  padding: '15px',
                  borderBottom: '1px solid #f1f5f9',
                  borderLeft: `4px solid ${getStatusColor(result.status)}`
                }}
              >
                <div style={{
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'flex-start',
                  marginBottom: result.data || result.error ? '10px' : '0'
                }}>
                  <div style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '8px'
                  }}>
                    <span>{getStatusIcon(result.status)}</span>
                    <strong style={{ color: '#1e293b' }}>{result.name}</strong>
                  </div>
                  <span style={{ fontSize: '12px', color: '#64748b' }}>
                    {result.timestamp}
                  </span>
                </div>
                
                {result.data && (
                  <div style={{
                    background: '#f8fafc',
                    padding: '10px',
                    borderRadius: '6px',
                    fontSize: '13px',
                    fontFamily: 'monospace'
                  }}>
                    <pre style={{ 
                      margin: 0, 
                      whiteSpace: 'pre-wrap',
                      wordBreak: 'break-word' 
                    }}>
                      {typeof result.data === 'object' 
                        ? JSON.stringify(result.data, null, 2)
                        : result.data
                      }
                    </pre>
                  </div>
                )}
                
                {result.error && (
                  <div style={{
                    background: '#fef2f2',
                    color: '#dc2626',
                    padding: '10px',
                    borderRadius: '6px',
                    fontSize: '13px'
                  }}>
                    ⚠️ {result.error}
                  </div>
                )}
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
};

const buttonStyle = {
  background: '#3b82f6',
  color: 'white',
  border: 'none',
  padding: '10px 16px',
  borderRadius: '6px',
  cursor: 'pointer',
  fontSize: '14px'
};

export default LocationTest;
