import React, { useState } from 'react';
import axios from 'axios';
import YandexMapsTest from '../components/YandexMapsTest';

const ApiTestPage = () => {
  const [testResults, setTestResults] = useState({});
  const [isLoading, setIsLoading] = useState(false);

  // Test koordinatalari - Toshkent markaziy qismi
  const testCoordinates = {
    lat: 41.2995,
    lng: 69.2401
  };

  // Google Maps API test
  const testGoogleAPI = async () => {
    try {
      setIsLoading(true);
      const apiKey = import.meta.env.VITE_GOOGLE_MAPS_API_KEY;
      
      if (!apiKey || apiKey === 'undefined') {
        setTestResults(prev => ({
          ...prev,
          google: { success: false, error: 'API key o\'rnatilmagan' }
        }));
        return;
      }

      const response = await axios.get(
        `https://maps.googleapis.com/maps/api/geocode/json?latlng=${testCoordinates.lat},${testCoordinates.lng}&key=${apiKey}&language=uz`
      );

      if (response.data.status === 'OK') {
        setTestResults(prev => ({
          ...prev,
          google: { 
            success: true, 
            data: response.data.results[0]?.formatted_address || 'Manzil topilmadi',
            status: response.data.status
          }
        }));
      } else {
        setTestResults(prev => ({
          ...prev,
          google: { 
            success: false, 
            error: response.data.status,
            message: response.data.error_message 
          }
        }));
      }
    } catch (error) {
      setTestResults(prev => ({
        ...prev,
        google: { 
          success: false, 
          error: error.message,
          details: error.response?.data 
        }
      }));
    }
  };

  // Yandex Maps API test
  const testYandexAPI = async () => {
    try {
      setIsLoading(true);
      const apiKey = import.meta.env.VITE_YANDEX_MAPS_API_KEY;
      const keyParam = apiKey && apiKey !== 'undefined' ? `&apikey=${apiKey}` : '';
      
      const response = await axios.get(
        `https://geocode-maps.yandex.ru/1.x/?format=json&geocode=${testCoordinates.lng},${testCoordinates.lat}&results=1&lang=uz${keyParam}`
      );

      const geoObjects = response.data.response.GeoObjectCollection.featureMember;
      if (geoObjects && geoObjects.length > 0) {
        const address = geoObjects[0].GeoObject.metaDataProperty.GeocoderMetaData.text;
        setTestResults(prev => ({
          ...prev,
          yandex: { 
            success: true, 
            data: address,
            found: geoObjects.length
          }
        }));
      } else {
        setTestResults(prev => ({
          ...prev,
          yandex: { 
            success: false, 
            error: 'Natija topilmadi' 
          }
        }));
      }
    } catch (error) {
      setTestResults(prev => ({
        ...prev,
        yandex: { 
          success: false, 
          error: error.message,
          details: error.response?.data 
        }
      }));
    }
  };

  // IP Geolocation test
  const testIPGeolocation = async () => {
    try {
      setIsLoading(true);
      const response = await axios.get('https://ipapi.co/json/');
      
      if (response.data && !response.data.error) {
        setTestResults(prev => ({
          ...prev,
          ipapi: { 
            success: true, 
            data: {
              city: response.data.city,
              region: response.data.region,
              country: response.data.country_name,
              coordinates: `${response.data.latitude}, ${response.data.longitude}`
            }
          }
        }));
      } else {
        setTestResults(prev => ({
          ...prev,
          ipapi: { 
            success: false, 
            error: response.data.reason || 'Noma\'lum xatolik' 
          }
        }));
      }
    } catch (error) {
      setTestResults(prev => ({
        ...prev,
        ipapi: { 
          success: false, 
          error: error.message 
        }
      }));
    }
  };

  // Barcha testlarni ishga tushirish
  const runAllTests = async () => {
    setIsLoading(true);
    setTestResults({});
    
    await Promise.all([
      testGoogleAPI(),
      testYandexAPI(), 
      testIPGeolocation()
    ]);
    
    setIsLoading(false);
  };

  const getStatusIcon = (result) => {
    if (!result) return '⏳';
    return result.success ? '✅' : '❌';
  };

  const getStatusColor = (result) => {
    if (!result) return '#999';
    return result.success ? '#4CAF50' : '#f44336';
  };

  return (
    <div style={{ padding: '20px', maxWidth: '800px', margin: '0 auto' }}>
      <h2>🔑 API Test Dashboard</h2>
      <p>Bu sahifa API kalitlarining to'g'ri ishlashini tekshiradi.</p>
      
      <div style={{ marginBottom: '20px' }}>
        <button 
          onClick={runAllTests}
          disabled={isLoading}
          style={{
            background: '#2e7d32',
            color: 'white',
            border: 'none',
            padding: '12px 24px',
            borderRadius: '8px',
            fontSize: '16px',
            cursor: isLoading ? 'not-allowed' : 'pointer',
            opacity: isLoading ? 0.6 : 1
          }}
        >
          {isLoading ? 'Test qilinmoqda...' : 'Barcha API larni test qilish'}
        </button>
      </div>

      <div style={{ display: 'grid', gap: '20px' }}>
        {/* Google Maps API */}
        <div style={{
          border: '1px solid #ddd',
          borderRadius: '12px',
          padding: '20px',
          backgroundColor: 'white'
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '10px' }}>
            <span style={{ fontSize: '24px' }}>{getStatusIcon(testResults.google)}</span>
            <h3 style={{ margin: 0 }}>Google Maps Geocoding API</h3>
            <button 
              onClick={testGoogleAPI}
              style={{
                background: '#4285f4',
                color: 'white',
                border: 'none',
                padding: '4px 8px',
                borderRadius: '4px',
                fontSize: '12px',
                cursor: 'pointer'
              }}
            >
              Test
            </button>
          </div>
          
          {testResults.google && (
            <div style={{
              padding: '10px',
              borderRadius: '8px',
              backgroundColor: testResults.google.success ? '#e8f5e8' : '#ffeaea',
              border: `1px solid ${getStatusColor(testResults.google)}`
            }}>
              {testResults.google.success ? (
                <div>
                  <strong>✅ Muvaffaqiyatli!</strong>
                  <p><strong>Manzil:</strong> {testResults.google.data}</p>
                  <p><strong>Status:</strong> {testResults.google.status}</p>
                </div>
              ) : (
                <div>
                  <strong>❌ Xatolik!</strong>
                  <p><strong>Sabab:</strong> {testResults.google.error}</p>
                  {testResults.google.message && (
                    <p><strong>Tafsilot:</strong> {testResults.google.message}</p>
                  )}
                </div>
              )}
            </div>
          )}
        </div>

        {/* Yandex Maps API */}
        <div style={{
          border: '1px solid #ddd',
          borderRadius: '12px',
          padding: '20px',
          backgroundColor: 'white'
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '10px' }}>
            <span style={{ fontSize: '24px' }}>{getStatusIcon(testResults.yandex)}</span>
            <h3 style={{ margin: 0 }}>Yandex Maps Geocoder API</h3>
            <button 
              onClick={testYandexAPI}
              style={{
                background: '#ff0000',
                color: 'white',
                border: 'none',
                padding: '4px 8px',
                borderRadius: '4px',
                fontSize: '12px',
                cursor: 'pointer'
              }}
            >
              Test
            </button>
          </div>
          
          {testResults.yandex && (
            <div style={{
              padding: '10px',
              borderRadius: '8px',
              backgroundColor: testResults.yandex.success ? '#e8f5e8' : '#ffeaea',
              border: `1px solid ${getStatusColor(testResults.yandex)}`
            }}>
              {testResults.yandex.success ? (
                <div>
                  <strong>✅ Muvaffaqiyatli!</strong>
                  <p><strong>Manzil:</strong> {testResults.yandex.data}</p>
                  <p><strong>Topilgan:</strong> {testResults.yandex.found} natija</p>
                </div>
              ) : (
                <div>
                  <strong>❌ Xatolik!</strong>
                  <p><strong>Sabab:</strong> {testResults.yandex.error}</p>
                </div>
              )}
            </div>
          )}
        </div>

        {/* IP Geolocation */}
        <div style={{
          border: '1px solid #ddd',
          borderRadius: '12px',
          padding: '20px',
          backgroundColor: 'white'
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '10px' }}>
            <span style={{ fontSize: '24px' }}>{getStatusIcon(testResults.ipapi)}</span>
            <h3 style={{ margin: 0 }}>IP Geolocation (ipapi.co)</h3>
            <button 
              onClick={testIPGeolocation}
              style={{
                background: '#34495e',
                color: 'white',
                border: 'none',
                padding: '4px 8px',
                borderRadius: '4px',
                fontSize: '12px',
                cursor: 'pointer'
              }}
            >
              Test
            </button>
          </div>
          
          {testResults.ipapi && (
            <div style={{
              padding: '10px',
              borderRadius: '8px',
              backgroundColor: testResults.ipapi.success ? '#e8f5e8' : '#ffeaea',
              border: `1px solid ${getStatusColor(testResults.ipapi)}`
            }}>
              {testResults.ipapi.success ? (
                <div>
                  <strong>✅ Muvaffaqiyatli!</strong>
                  <p><strong>Shahar:</strong> {testResults.ipapi.data.city}</p>
                  <p><strong>Viloyat:</strong> {testResults.ipapi.data.region}</p>
                  <p><strong>Mamlakat:</strong> {testResults.ipapi.data.country}</p>
                  <p><strong>Koordinatalar:</strong> {testResults.ipapi.data.coordinates}</p>
                </div>
              ) : (
                <div>
                  <strong>❌ Xatolik!</strong>
                  <p><strong>Sabab:</strong> {testResults.ipapi.error}</p>
                </div>
              )}
            </div>
          )}
        </div>
      </div>

      {/* Environment Info */}
      <div style={{
        marginTop: '30px',
        padding: '20px',
        backgroundColor: '#f5f5f5',
        borderRadius: '12px'
      }}>
        <h4>🔧 Environment Ma'lumotlari</h4>
        <div style={{ fontFamily: 'monospace', fontSize: '14px' }}>
          <p><strong>Mode:</strong> {import.meta.env.MODE}</p>
          <p><strong>Google API Key:</strong> {import.meta.env.VITE_GOOGLE_MAPS_API_KEY ? '✅ O\'rnatilgan' : '❌ O\'rnatilmagan'}</p>
          <p><strong>Yandex API Key:</strong> {import.meta.env.VITE_YANDEX_MAPS_API_KEY ? '✅ O\'rnatilgan' : '❌ O\'rnatilmagan'}</p>
          <p><strong>API Base URL:</strong> {import.meta.env.VITE_API_BASE_URL || 'O\'rnatilmagan'}</p>
        </div>
      </div>

      {/* Qo'llanma */}
      <div style={{
        marginTop: '20px',
        padding: '20px',
        backgroundColor: '#e3f2fd',
        borderRadius: '12px',
        border: '1px solid #2196f3'
      }}>
        <h4>📖 API Key O'rnatish Qo'llanmasi</h4>
        <ol>
          <li><strong>Google API Key:</strong> Google Cloud Console da Geocoding API yoqing</li>
          <li><strong>Yandex API Key:</strong> Yandex Developer da loyiha yarating</li>
          <li><strong>Environment:</strong> .env.development fayliga kalitlarni qo'shing</li>
          <li><strong>Test:</strong> Bu sahifada testlarni ishga tushiring</li>
        </ol>
        <p>
          <strong>Batafsil qo'llanma:</strong> API_KEYS_SETUP.md faylini o'qing
        </p>
      </div>

      {/* Yandex Maps Advanced Test */}
      <div style={{ marginTop: '30px' }}>
        <YandexMapsTest />
      </div>
    </div>
  );
};

export default ApiTestPage;
