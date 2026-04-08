/* ============================================================
   weather.js — Geolocation + Open-Meteo API + Mood Mapping
   ============================================================ */

// WMO Weather Codes → Description + Emoji
const WMO_CODES = {
  0:  { desc: 'Clear Sky',       emoji: '☀️' },
  1:  { desc: 'Mainly Clear',    emoji: '🌤️' },
  2:  { desc: 'Partly Cloudy',   emoji: '⛅' },
  3:  { desc: 'Overcast',        emoji: '☁️' },
  45: { desc: 'Fog',             emoji: '🌫️' },
  48: { desc: 'Rime Fog',        emoji: '🌫️' },
  51: { desc: 'Light Drizzle',   emoji: '🌦️' },
  53: { desc: 'Moderate Drizzle',emoji: '🌦️' },
  55: { desc: 'Dense Drizzle',   emoji: '🌧️' },
  56: { desc: 'Freezing Drizzle',emoji: '🌧️' },
  57: { desc: 'Freezing Drizzle',emoji: '🌧️' },
  61: { desc: 'Light Rain',      emoji: '🌧️' },
  63: { desc: 'Moderate Rain',   emoji: '🌧️' },
  65: { desc: 'Heavy Rain',      emoji: '🌧️' },
  66: { desc: 'Freezing Rain',   emoji: '🌧️' },
  67: { desc: 'Heavy Freezing Rain', emoji: '🌧️' },
  71: { desc: 'Light Snow',      emoji: '🌨️' },
  73: { desc: 'Moderate Snow',   emoji: '🌨️' },
  75: { desc: 'Heavy Snow',      emoji: '❄️' },
  77: { desc: 'Snow Grains',     emoji: '❄️' },
  80: { desc: 'Light Showers',   emoji: '🌦️' },
  81: { desc: 'Moderate Showers',emoji: '🌧️' },
  82: { desc: 'Violent Showers', emoji: '⛈️' },
  85: { desc: 'Light Snow Showers', emoji: '🌨️' },
  86: { desc: 'Heavy Snow Showers', emoji: '❄️' },
  95: { desc: 'Thunderstorm',    emoji: '⛈️' },
  96: { desc: 'Thunderstorm with Hail', emoji: '⛈️' },
  99: { desc: 'Heavy Thunderstorm',    emoji: '⛈️' },
};

/**
 * Map WMO weather code to music mood.
 * @param {number} code - WMO weather code
 * @returns {'dreampop'|'lively'|'rhythmic'}
 */
function weatherToMood(code) {
  // Lively: clear/sunny/partly cloudy
  if ([0, 1, 2].includes(code)) return 'lively';

  // Rhythmic: heavy rain, showers, thunderstorms, hail, heavy snow
  if ([65, 66, 67, 77, 80, 81, 82, 85, 86, 95, 96, 99].includes(code)) return 'rhythmic';

  // Dream Pop: everything else (overcast, fog, light-moderate rain/snow, drizzle)
  return 'dreampop';
}

/**
 * Get weather description and emoji for a WMO code.
 */
function getWeatherInfo(code) {
  return WMO_CODES[code] || { desc: 'Unknown', emoji: '🌡️' };
}

/**
 * Fetch user's geolocation. Returns { latitude, longitude } or uses fallback.
 */
function getUserLocation() {
  return new Promise((resolve) => {
    if (!navigator.geolocation) {
      console.warn('Geolocation not supported, using default (New York)');
      resolve({ latitude: 40.71, longitude: -74.01, city: 'New York' });
      return;
    }

    navigator.geolocation.getCurrentPosition(
      (pos) => {
        resolve({
          latitude: pos.coords.latitude,
          longitude: pos.coords.longitude,
          city: null // will be resolved from timezone
        });
      },
      (err) => {
        console.warn('Geolocation denied, using default (New York):', err.message);
        resolve({ latitude: 40.71, longitude: -74.01, city: 'New York' });
      },
      { timeout: 8000, maximumAge: 300000 }
    );
  });
}

/**
 * Fetch current weather from Open-Meteo API.
 * @returns {Promise<{temperature: number, weatherCode: number, windSpeed: number, description: string, emoji: string, mood: string, timezone: string}>}
 */
async function fetchWeather() {
  const loc = await getUserLocation();

  const url = `https://api.open-meteo.com/v1/forecast`
    + `?latitude=${loc.latitude}&longitude=${loc.longitude}`
    + `&current=temperature_2m,weather_code,wind_speed_10m`
    + `&timezone=auto`;

  try {
    const res = await fetch(url);
    if (!res.ok) throw new Error(`HTTP ${res.status}`);
    const data = await res.json();

    const code = data.current.weather_code;
    const info = getWeatherInfo(code);
    const mood = weatherToMood(code);

    // Extract city name from timezone (e.g. "America/New_York" → "New York")
    const tz = data.timezone || '';
    const city = loc.city || tz.split('/').pop().replace(/_/g, ' ');

    return {
      temperature: Math.round(data.current.temperature_2m),
      temperatureUnit: data.current_units.temperature_2m,
      weatherCode: code,
      windSpeed: data.current.wind_speed_10m,
      description: info.desc,
      emoji: info.emoji,
      mood: mood,
      city: city,
      timezone: tz
    };
  } catch (err) {
    console.error('Weather API error:', err);
    // Return a fallback with dreampop mood
    return {
      temperature: '--',
      temperatureUnit: '°C',
      weatherCode: 3,
      windSpeed: 0,
      description: 'Weather unavailable',
      emoji: '🌡️',
      mood: 'dreampop',
      city: 'Unknown',
      timezone: ''
    };
  }
}
