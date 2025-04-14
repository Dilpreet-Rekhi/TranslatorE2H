const axios = require('axios');

// For production - using Google Cloud Translation API
const translateWithGoogle = async (text, targetLang = 'hi') => {
  try {
    const response = await axios.post(
      `https://translation.googleapis.com/language/translate/v2?key=${process.env.GOOGLE_API_KEY}`,
      {
        q: text,
        target: targetLang
      }
    );
    return response.data.data.translations[0].translatedText;
  } catch (error) {
    console.error('Google Translate error:', error);
    throw error;
  }
};

// Fallback mock translation
const mockTranslate = (text, domain = 'common') => {
  const translations = {
    common: "यह एक सामान्य प्रशासनिक पाठ का अनुवाद है।",
    education: "शिक्षा क्षेत्र के लिए विशेष अनुवाद।",
    healthcare: "स्वास्थ्य सेवा संबंधी शब्दावली के साथ अनुवाद।",
    legal: "कानूनी दस्तावेज़ के लिए प्रमाणित अनुवाद।"
  };
  return translations[domain] || translations.common;
};

exports.translateText = async (text, domain) => {
  if (process.env.NODE_ENV === 'production') {
    try {
      return await translateWithGoogle(text);
    } catch {
      return mockTranslate(text, domain);
    }
  }
  return mockTranslate(text, domain);
};