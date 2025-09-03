import React, { useState, useContext } from 'react';
import OpenStreetMapUtils from '../utils/OpenStreetMapUtils';
import { LocationContext } from '../contexts/LocationContext';

const OpenStreetMapTest = () => {
  const { location } = useContext(LocationContext);
  const [testResults, setTestResults] = useState([]);
  const [isTestingAll, setIsTestingAll] = useState(false);
  const [testInput, setTestInput] = useState({
    lat: 41.2995,
    lon: 69.2401,
    address: 'Tashkent, Uzbekistan'
  });

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

  // 1. Reverse Geocoding Test
  const testReverseGeocode = async () => {
    try {
      addResult('OSM Reverse Geocoding', 'info', 'Testing reverse geocoding...');
      
      const result = await OpenStreetMapUtils.reverseGeocode(
        testInput.lat, 
        testInput.lon, 
        'uz'
      );
      
      addResult('OSM Reverse Geocoding', 'success', result);
    } catch (error) {
      addResult('OSM Reverse Geocoding', 'error', null, error.message);
    }
  };

  // 2. Forward Geocoding Test
  const testForwardGeocode = async () => {
    try {
      addResult('OSM Forward Geocoding', 'info', 'Testing forward geocoding...');
      
      const results = await OpenStreetMapUtils.geocode(testInput.address, 'uz');
      
      addResult('OSM Forward Geocoding', 'success', {
        total_results: results.length,
        results: results.slice(0, 3) // Faqat birinchi 3 ta
      });
    } catch (error) {
      addResult('OSM Forward Geocoding', 'error', null, error.message);
    }
  };

  // 3. City Search Test
  const testCitySearch = async () => {
    try {
      addResult('OSM City Search', 'info', 'Searching cities...');
      
      const cities = ['Tashkent', 'Samarkand', 'Bukhara', 'Andijan', 'Namangan'];
      const results = [];
      
      for (const cityName of cities) {
        try {
          const city = await OpenStreetMapUtils.searchCity(cityName, 'uz');
          results.push(city);
        } catch (error) {
          results.push({ city: cityName, error: error.message });
        }
      }
      
      addResult('OSM City Search', 'success', { cities: results });
    } catch (error) {
      addResult('OSM City Search', 'error', null, error.message);
    }
  };

  // 4. Nearby Cities Test
  const testNearbyCities = async () => {
    try {
      addResult('OSM Nearby Cities', 'info', 'Finding nearby cities...');
      
      const nearby = await OpenStreetMapUtils.findNearbyCities(
        testInput.lat, 
        testInput.lon, 
        100 // 100 km radius
      );
      
      addResult('OSM Nearby Cities', 'success', {
        total_found: nearby.length,
        cities: nearby.slice(0, 5) // Birinchi 5 ta
      });
    } catch (error) {
      addResult('OSM Nearby Cities', 'error', null, error.message);
    }
  };

  // 5. Uzbekistan Cities Test
  const testUzbekistanCities = async () => {
    try {
      addResult('OSM Uzbekistan Cities', 'info', 'Loading Uzbekistan cities...');
      
      const cities = await OpenStreetMapUtils.getUzbekistanCities();
      
      addResult('OSM Uzbekistan Cities', 'success', {
        total_cities: cities.length,
        major_cities: cities.filter(city => city.population > 50000),
        sample: cities.slice(0, 10)
      });
    } catch (error) {
      addResult('OSM Uzbekistan Cities', 'error', null, error.message);
    }
  };

  // 6. Distance Calculation Test
  const testDistanceCalculation = () => {
    try {
      addResult('OSM Distance Calculation', 'info', 'Calculating distances...');
      
      const tashkent = { lat: 41.2995, lon: 69.2401 };
      const samarkand = { lat: 39.6270, lon: 66.9750 };
      const bukhara = { lat: 39.7747, lon: 64.4286 };
      
      const distances = {
        'Tashkent ↔ Samarkand': OpenStreetMapUtils.calculateDistance(
          tashkent.lat, tashkent.lon, samarkand.lat, samarkand.lon
        ).toFixed(2) + ' km',
        'Tashkent ↔ Bukhara': OpenStreetMapUtils.calculateDistance(
          tashkent.lat, tashkent.lon, bukhara.lat, bukhara.lon
        ).toFixed(2) + ' km',
        'Samarkand ↔ Bukhara': OpenStreetMapUtils.calculateDistance(
          samarkand.lat, samarkand.lon, bukhara.lat, bukhara.lon
        ).toFixed(2) + ' km'
      };
      
      addResult('OSM Distance Calculation', 'success', distances);
    } catch (error) {
      addResult('OSM Distance Calculation', 'error', null, error.message);
    }
  };

  // Test All
  const testAll = async () => {
    setIsTestingAll(true);
    setTestResults([]);
    
    addResult('OSM Comprehensive Test', 'info', 'Starting all OpenStreetMap tests...');
    
    // Distance calculation (sync)
    testDistanceCalculation();
    
    // API tests (async)
    await testReverseGeocode();
    await testForwardGeocode();
    await testCitySearch();
    await testNearbyCities();
    await testUzbekistanCities();
    
    addResult('OSM Comprehensive Test', 'success', 'All OpenStreetMap tests completed!');
    setIsTestingAll(false);
  };

  // Built-in OSM Test
  const runOSMBuiltInTest = async () => {
    try {
      addResult('OSM Built-in Test', 'info', 'Running OpenStreetMapUtils.test()...');
      
      const success = await OpenStreetMapUtils.test();
      
      if (success) {
        addResult('OSM Built-in Test', 'success', 'All built-in tests passed!');
      } else {
        addResult('OSM Built-in Test', 'error', null, 'Some built-in tests failed');
      }
    } catch (error) {
      addResult('OSM Built-in Test', 'error', null, error.message);
    }
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
        background: 'linear-gradient(135deg, #10b981 0%, #059669 100%)',
        color: 'white',
        padding: '30px',
        borderRadius: '15px',
        marginBottom: '20px',
        textAlign: 'center'
      }}>
        <h1>🗺️ OpenStreetMap Test Suite</h1>
        <p>Bepul va cheklovsiz geocoding servisi</p>
        <div style={{ fontSize: '14px', opacity: 0.9, marginTop: '10px' }}>
          🚀 API key kerak emas | 🔒 Privacy friendly | 🌍 Global coverage
        </div>
      </div>

      {/* Current Location */}
      {location && (
        <div style={{
          background: '#f0fdf4',
          border: '1px solid #bbf7d0',
          borderRadius: '10px',
          padding: '20px',
          marginBottom: '20px'
        }}>
          <h3 style={{ margin: '0 0 15px 0', color: '#065f46' }}>📍 Current Location Context</h3>
          <div style={{ 
            display: 'grid', 
            gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
            gap: '10px',
            fontSize: '14px',
            color: '#047857'
          }}>
            <div><strong>City:</strong> {location.city}</div>
            <div><strong>Region:</strong> {location.region}</div>
            <div><strong>Method:</strong> {location.method}</div>
            <div><strong>Provider:</strong> {location.provider || 'Unknown'}</div>
          </div>
        </div>
      )}

      {/* Test Inputs */}
      <div style={{
        background: '#f8fafc',
        border: '1px solid #e2e8f0',
        borderRadius: '10px',
        padding: '20px',
        marginBottom: '20px'
      }}>
        <h3 style={{ margin: '0 0 15px 0', color: '#1e293b' }}>🎛️ Test Parameters</h3>
        <div style={{ 
          display: 'grid', 
          gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
          gap: '15px'
        }}>
          <div>
            <label style={{ display: 'block', marginBottom: '5px', fontWeight: 'bold' }}>
              Latitude:
            </label>
            <input
              type="number"
              step="0.0001"
              value={testInput.lat}
              onChange={(e) => setTestInput(prev => ({ ...prev, lat: parseFloat(e.target.value) }))}
              style={{
                width: '100%',
                padding: '8px',
                border: '1px solid #d1d5db',
                borderRadius: '6px'
              }}
            />
          </div>
          <div>
            <label style={{ display: 'block', marginBottom: '5px', fontWeight: 'bold' }}>
              Longitude:
            </label>
            <input
              type="number"
              step="0.0001"
              value={testInput.lon}
              onChange={(e) => setTestInput(prev => ({ ...prev, lon: parseFloat(e.target.value) }))}
              style={{
                width: '100%',
                padding: '8px',
                border: '1px solid #d1d5db',
                borderRadius: '6px'
              }}
            />
          </div>
          <div>
            <label style={{ display: 'block', marginBottom: '5px', fontWeight: 'bold' }}>
              Address for search:
            </label>
            <input
              type="text"
              value={testInput.address}
              onChange={(e) => setTestInput(prev => ({ ...prev, address: e.target.value }))}
              style={{
                width: '100%',
                padding: '8px',
                border: '1px solid #d1d5db',
                borderRadius: '6px'
              }}
            />
          </div>
        </div>
      </div>

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
            opacity: isTestingAll ? 0.6 : 1,
            fontWeight: 'bold'
          }}
        >
          {isTestingAll ? '🔄 Testing...' : '🚀 Test All OSM'}
        </button>
        
        <button onClick={runOSMBuiltInTest} style={buttonStyle}>
          🧪 Built-in Test
        </button>
        
        <button onClick={testReverseGeocode} style={buttonStyle}>
          📍 Reverse Geocode
        </button>
        
        <button onClick={testForwardGeocode} style={buttonStyle}>
          🔍 Forward Geocode
        </button>
        
        <button onClick={testCitySearch} style={buttonStyle}>
          🏙️ City Search
        </button>
        
        <button onClick={testNearbyCities} style={buttonStyle}>
          📍 Nearby Cities
        </button>
        
        <button onClick={testUzbekistanCities} style={buttonStyle}>
          🇺🇿 UZ Cities
        </button>
        
        <button onClick={testDistanceCalculation} style={buttonStyle}>
          📏 Distance Calc
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
          <h3 style={{ margin: 0, color: '#1e293b' }}>📊 OpenStreetMap Test Results</h3>
          <span style={{ fontSize: '14px', color: '#64748b' }}>
            {testResults.length} results
          </span>
        </div>
        
        <div style={{ maxHeight: '600px', overflowY: 'auto' }}>
          {testResults.length === 0 ? (
            <div style={{ padding: '40px', textAlign: 'center', color: '#64748b' }}>
              <div style={{ fontSize: '48px', marginBottom: '10px' }}>🗺️</div>
              <div>OpenStreetMap testlarini boshlash uchun yuqoridagi tugmalardan birini bosing</div>
              <div style={{ fontSize: '14px', marginTop: '10px' }}>
                OSM - bu bepul, ochiq manbali xaritalash servisi
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

      {/* Info Footer */}
      <div style={{
        background: '#f0f9ff',
        border: '1px solid #bae6fd',
        borderRadius: '10px',
        padding: '20px',
        marginTop: '20px',
        fontSize: '14px',
        color: '#0c4a6e'
      }}>
        <h4 style={{ margin: '0 0 10px 0' }}>ℹ️ OpenStreetMap haqida</h4>
        <ul style={{ margin: 0, paddingLeft: '20px' }}>
          <li><strong>100% bepul</strong> - API key kerak emas</li>
          <li><strong>Cheklovlar yo'q</strong> - unlimited requests</li>
          <li><strong>Open source</strong> - community driven</li>
          <li><strong>Privacy friendly</strong> - tracking yo'q</li>
          <li><strong>Global coverage</strong> - butun dunyo bo'ylab</li>
          <li><strong>Multiple languages</strong> - uz, ru, en va boshqalar</li>
        </ul>
        <div style={{ marginTop: '15px', padding: '10px', background: '#e0f2fe', borderRadius: '6px' }}>
          <strong>Eslatma:</strong> Nominatim API dan foydalanganda User-Agent header talab qilinadi. 
          Bu loyihada avtomatik qo'shilgan.
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

export default OpenStreetMapTest;
