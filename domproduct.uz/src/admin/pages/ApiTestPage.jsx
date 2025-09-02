import React, { useState } from 'react';
import YandexMapsTest from '../../components/YandexMapsTest';

const ApiTestPage = () => {
  const [testResults, setTestResults] = useState([]);
  const [isTestingAll, setIsTestingAll] = useState(false);

  const addResult = (name, status, data, error = null) => {
    const result = {
      id: Date.now() + Math.random(),
      name,
      status,
      data,
      error,
      timestamp: new Date().toLocaleTimeString()
    };
    setTestResults(prev => [result, ...prev]);
  };

  // Google Maps API Test
  const testGoogleAPI = async () => {
    try {
      addResult('Google Maps API', 'info', 'Testing Google Geocoding...');
      
      const apiKey = import.meta.env.VITE_GOOGLE_MAPS_API_KEY;
      
      if (!apiKey || apiKey === 'undefined') {
        addResult('Google Maps API', 'error', null, 'API key not configured');
        return;
      }
      
      const response = await fetch(
        `https://maps.googleapis.com/maps/api/geocode/json?address=Tashkent,Uzbekistan&key=${apiKey}`
      );
      
      const data = await response.json();
      
      if (data.status === 'OK') {
        addResult('Google Maps API', 'success', {
          status: data.status,
          results_count: data.results.length,
          first_result: data.results[0]?.formatted_address,
          location: data.results[0]?.geometry?.location
        });
      } else {
        addResult('Google Maps API', 'error', data, `API Error: ${data.status}`);
      }
    } catch (error) {
      addResult('Google Maps API', 'error', null, error.message);
    }
  };

  // Yandex API Test
  const testYandexAPI = async () => {
    try {
      addResult('Yandex Maps API', 'info', 'Testing Yandex Geocoder...');
      
      const apiKey = import.meta.env.VITE_YANDEX_MAPS_API_KEY;
      
      let url = 'https://geocode-maps.yandex.ru/1.x/?format=json&geocode=Tashkent,Uzbekistan&results=1&lang=uz';
      if (apiKey && apiKey !== 'undefined') {
        url += `&apikey=${apiKey}`;
      }
      
      const response = await fetch(url);
      const data = await response.json();
      
      if (data.response && data.response.GeoObjectCollection) {
        const geoObjects = data.response.GeoObjectCollection.featureMember;
        if (geoObjects && geoObjects.length > 0) {
          addResult('Yandex Maps API', 'success', {
            results_count: geoObjects.length,
            first_result: geoObjects[0].GeoObject.metaDataProperty.GeocoderMetaData.text,
            coordinates: geoObjects[0].GeoObject.Point.pos
          });
        } else {
          addResult('Yandex Maps API', 'error', data, 'No results found');
        }
      } else {
        addResult('Yandex Maps API', 'error', data, 'Invalid response format');
      }
    } catch (error) {
      addResult('Yandex Maps API', 'error', null, error.message);
    }
  };

  // IP Geolocation Test
  const testIPGeolocation = async () => {
    const services = [
      { name: 'ipapi.co', url: 'https://ipapi.co/json/' },
      { name: 'ipinfo.io', url: 'https://ipinfo.io/json' },
      { name: 'ip-api.com', url: 'http://ip-api.com/json/' }
    ];

    for (const service of services) {
      try {
        addResult(`IP: ${service.name}`, 'info', 'Testing...');
        
        const response = await fetch(service.url);
        const data = await response.json();
        
        addResult(`IP: ${service.name}`, 'success', {
          ip: data.ip || data.query,
          city: data.city,
          region: data.region || data.regionName,
          country: data.country || data.countryCode,
          coordinates: data.loc ? data.loc.split(',') : [data.lat, data.lon]
        });
      } catch (error) {
        addResult(`IP: ${service.name}`, 'error', null, error.message);
      }
    }
  };

  // OpenStreetMap Test
  const testOpenStreetMap = async () => {
    try {
      addResult('OpenStreetMap', 'info', 'Testing OSM Nominatim...');
      
      const response = await fetch(
        'https://nominatim.openstreetmap.org/search?format=json&q=Tashkent,Uzbekistan&limit=1&accept-language=uz',
        {
          headers: {
            'User-Agent': 'DomProduct-SPA/1.0 (https://domproduct.uz)'
          }
        }
      );
      
      const data = await response.json();
      
      if (data && data.length > 0) {
        addResult('OpenStreetMap', 'success', {
          api_cost: 'FREE - No API key required!',
          display_name: data[0].display_name,
          latitude: data[0].lat,
          longitude: data[0].lon,
          importance: data[0].importance,
          licence: data[0].licence
        });
      } else {
        addResult('OpenStreetMap', 'error', data, 'No results found');
      }
    } catch (error) {
      addResult('OpenStreetMap', 'error', null, error.message);
    }
  };

  // Environment Test
  const testEnvironment = () => {
    addResult('Environment Check', 'info', 'Checking environment variables...');
    
    const vars = {
      'VITE_GOOGLE_MAPS_API_KEY': import.meta.env.VITE_GOOGLE_MAPS_API_KEY,
      'VITE_YANDEX_MAPS_API_KEY': import.meta.env.VITE_YANDEX_MAPS_API_KEY,
      'NODE_ENV': import.meta.env.NODE_ENV,
      'MODE': import.meta.env.MODE
    };

    const envData = {};
    Object.entries(vars).forEach(([key, value]) => {
      envData[key] = value ? 
        (key.includes('API_KEY') ? `${value.substring(0, 8)}...` : value) : 
        'Not set';
    });

    addResult('Environment Check', 'success', envData);
  };

  // Test All
  const testAll = async () => {
    setIsTestingAll(true);
    setTestResults([]);
    
    addResult('Comprehensive API Test', 'info', 'Starting all API tests...');
    
    // Environment check
    testEnvironment();
    
    // API tests
    await testOpenStreetMap();
    await testIPGeolocation();
    await testGoogleAPI();
    await testYandexAPI();
    
    addResult('Comprehensive API Test', 'success', 'All tests completed!');
    setIsTestingAll(false);
  };

  const clearResults = () => setTestResults([]);

  const getStatusColor = (status) => {
    switch (status) {
      case 'success': return '#10b981';
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
    <div style={{ padding: '20px', maxWidth: '1200px', margin: '0 auto' }}>
      {/* Header */}
      <div style={{ 
        background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
        color: 'white',
        padding: '30px',
        borderRadius: '15px',
        marginBottom: '20px',
        textAlign: 'center'
      }}>
        <h1>🧪 API Test Dashboard</h1>
        <p>Geocoding API larni sinovdan o'tkazish</p>
        <div style={{ fontSize: '14px', opacity: 0.9, marginTop: '10px' }}>
          Google Maps | Yandex Maps | OpenStreetMap | IP Geolocation
        </div>
      </div>

      {/* API Status Cards */}
      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))',
        gap: '15px',
        marginBottom: '20px'
      }}>
        <div style={{
          background: '#f0fdf4',
          border: '1px solid #bbf7d0',
          borderRadius: '10px',
          padding: '15px'
        }}>
          <h3 style={{ margin: '0 0 10px 0', color: '#059669' }}>🗺️ OpenStreetMap</h3>
          <div style={{ fontSize: '14px', color: '#047857' }}>
            <div>✅ FREE - API key yo'q</div>
            <div>✅ Unlimited requests</div>
            <div>✅ Uzbek language support</div>
          </div>
        </div>
        
        <div style={{
          background: '#fef3c7',
          border: '1px solid #fcd34d',
          borderRadius: '10px',
          padding: '15px'
        }}>
          <h3 style={{ margin: '0 0 10px 0', color: '#d97706' }}>🌐 IP Geolocation</h3>
          <div style={{ fontSize: '14px', color: '#92400e' }}>
            <div>✅ FREE tiers available</div>
            <div>⚠️ Approximate location</div>
            <div>✅ Multiple providers</div>
          </div>
        </div>
        
        <div style={{
          background: '#fef2f2',
          border: '1px solid #fecaca',
          borderRadius: '10px',
          padding: '15px'
        }}>
          <h3 style={{ margin: '0 0 10px 0', color: '#dc2626' }}>🔧 Paid APIs</h3>
          <div style={{ fontSize: '14px', color: '#991b1b' }}>
            <div>⚠️ Google Maps - $5/1000 req</div>
            <div>⚠️ Yandex - API key required</div>
            <div>⚠️ Rate limits apply</div>
          </div>
        </div>
      </div>

      {/* Controls */}
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
            opacity: isTestingAll ? 0.6 : 1,
            fontWeight: 'bold'
          }}
        >
          {isTestingAll ? '🔄 Testing...' : '🚀 Test All APIs'}
        </button>
        
        <button onClick={testOpenStreetMap} style={buttonStyle}>
          🗺️ Test OSM
        </button>
        
        <button onClick={testIPGeolocation} style={buttonStyle}>
          🌐 Test IP Services
        </button>
        
        <button onClick={testGoogleAPI} style={buttonStyle}>
          🔧 Test Google
        </button>
        
        <button onClick={testYandexAPI} style={buttonStyle}>
          🔧 Test Yandex
        </button>
        
        <button onClick={testEnvironment} style={buttonStyle}>
          🔑 Check ENV
        </button>
        
        <button 
          onClick={clearResults} 
          style={{...buttonStyle, background: '#ef4444'}}
        >
          🗑️ Clear
        </button>
      </div>

      {/* Results */}
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
          <h3 style={{ margin: 0, color: '#1e293b' }}>📊 API Test Results</h3>
          <span style={{ fontSize: '14px', color: '#64748b' }}>
            {testResults.length} results
          </span>
        </div>
        
        <div style={{ maxHeight: '500px', overflowY: 'auto' }}>
          {testResults.length === 0 ? (
            <div style={{ padding: '40px', textAlign: 'center', color: '#64748b' }}>
              <div style={{ fontSize: '48px', marginBottom: '10px' }}>🧪</div>
              <div>API testlarini boshlash uchun yuqoridagi tugmalardan birini bosing</div>
              <div style={{ fontSize: '14px', marginTop: '10px' }}>
                OpenStreetMap eng yaxshi tanlov - bepul va cheklovsiz!
              </div>
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
                    padding: '12px',
                    borderRadius: '6px',
                    fontSize: '13px',
                    fontFamily: 'monospace',
                    border: '1px solid #e2e8f0'
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
                    padding: '12px',
                    borderRadius: '6px',
                    fontSize: '14px',
                    border: '1px solid #fecaca'
                  }}>
                    ⚠️ {result.error}
                  </div>
                )}
              </div>
            ))
          )}
        </div>
      </div>

      {/* Yandex Maps Test Component */}
      <div style={{ marginTop: '30px' }}>
        <div style={{
          background: '#f1f5f9',
          padding: '20px',
          borderRadius: '10px',
          marginBottom: '20px'
        }}>
          <h2 style={{ margin: '0 0 10px 0', color: '#1e293b' }}>🔧 Yandex Maps Advanced Testing</h2>
          <p style={{ margin: 0, color: '#64748b' }}>
            Yandex Maps API bilan chuqurroq testlar va utilities
          </p>
        </div>
        <YandexMapsTest />
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

export default ApiTestPage;
