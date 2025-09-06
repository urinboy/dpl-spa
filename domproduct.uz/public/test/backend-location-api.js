/**
 * Location API Endpoint - Backend uchun namuna
 * Bu faylni backend developerga yuborish mumkin
 */

// POST /api/user-location
// Foydalanuvchi joylashuvini saqlash

const express = require('express');
const router = express.Router();

// Foydalanuvchi joylashuvi modeli (MongoDB/PostgreSQL uchun namuna)
const UserLocationSchema = {
  userId: String, // foydalanuvchi IDsi
  sessionId: String, // session IDsi
  position: {
    latitude: Number,
    longitude: Number
  },
  address: String, // to'liq manzil
  city: String, // shahar nomi
  region: String, // viloyat/oblast
  country: String, // mamlakat
  method: String, // 'gps', 'ip', 'manual'
  accuracy: Number, // GPS accuracy (metrda)
  isp: String, // internet provayder (IP usulida)
  timezone: String, // vaqt mintaqasi
  userAgent: String, // brauzer ma'lumotlari
  ipAddress: String, // IP manzil
  timestamp: Date, // saqlangan vaqt
  isActive: Boolean // joriy joylashuv emasligini belgilash
};

// Joylashuvni saqlash
router.post('/user-location', async (req, res) => {
  try {
    const {
      userId,
      sessionId,
      position,
      address,
      city,
      region,
      country,
      method,
      accuracy,
      isp,
      timezone,
      userAgent,
      timestamp
    } = req.body;

    // IP manzilni request dan olish
    const ipAddress = req.ip || req.connection.remoteAddress || req.headers['x-forwarded-for'];

    // Oldingi joylashuvlarni nofaol qilish
    await UserLocation.updateMany(
      { userId: userId },
      { isActive: false }
    );

    // Yangi joylashuvni saqlash
    const locationData = new UserLocation({
      userId,
      sessionId,
      position,
      address,
      city,
      region,
      country,
      method,
      accuracy,
      isp,
      timezone,
      userAgent,
      ipAddress,
      timestamp: new Date(timestamp),
      isActive: true
    });

    await locationData.save();

    // Analytics uchun ma'lumotlar
    // Bu yerda location analytics ni yangilash mumkin
    await updateLocationAnalytics(city, region, country);

    res.status(201).json({
      success: true,
      message: 'Joylashuv muvaffaqiyatli saqlandi',
      locationId: locationData._id
    });

  } catch (error) {
    console.error('Joylashuvni saqlashda xatolik:', error);
    res.status(500).json({
      success: false,
      message: 'Server xatoligi',
      error: error.message
    });
  }
});

// Foydalanuvchi joylashuvini olish
router.get('/user-location/:userId', async (req, res) => {
  try {
    const { userId } = req.params;

    const userLocation = await UserLocation.findOne({
      userId: userId,
      isActive: true
    }).sort({ timestamp: -1 });

    if (!userLocation) {
      return res.status(404).json({
        success: false,
        message: 'Foydalanuvchi joylashuvi topilmadi'
      });
    }

    res.json({
      success: true,
      data: {
        position: userLocation.position,
        address: userLocation.address,
        city: userLocation.city,
        region: userLocation.region,
        country: userLocation.country,
        method: userLocation.method,
        timestamp: userLocation.timestamp
      }
    });

  } catch (error) {
    console.error('Joylashuvni olishda xatolik:', error);
    res.status(500).json({
      success: false,
      message: 'Server xatoligi',
      error: error.message
    });
  }
});

// Joylashuv statistikasini yangilash
async function updateLocationAnalytics(city, region, country) {
  try {
    // LocationAnalytics kolleksiyasida ma'lumotlarni yangilash
    await LocationAnalytics.findOneAndUpdate(
      { city, region, country },
      { 
        $inc: { userCount: 1 },
        $set: { lastUpdated: new Date() }
      },
      { upsert: true }
    );
  } catch (error) {
    console.error('Analytics yangilashda xatolik:', error);
  }
}

// Eng ko'p foydalaniladigan shaharlar
router.get('/popular-cities', async (req, res) => {
  try {
    const popularCities = await LocationAnalytics
      .find({ country: 'O\'zbekiston' })
      .sort({ userCount: -1 })
      .limit(10)
      .select('city region userCount');

    res.json({
      success: true,
      data: popularCities
    });

  } catch (error) {
    console.error('Popular shaharlarni olishda xatolik:', error);
    res.status(500).json({
      success: false,
      message: 'Server xatoligi'
    });
  }
});

module.exports = router;

/* 
Qo'shimcha xususiyatlar:

1. Rate Limiting - tez-tez so'rov jo'natishni cheklash
2. Data Validation - kelayotgan ma'lumotlarni tekshirish  
3. Geofencing - ma'lum hududlar uchun maxsus xizmatlar
4. Location History - foydalanuvchi joylashuv tarixi
5. Privacy Settings - joylashuvni yashirish imkoniyati
6. Location-based Recommendations - joylashuvga qarab tavsiyalar
7. Delivery Zones - yetkazib berish hududlarini aniqlash
8. Security - suspicious location changes detection
*/
