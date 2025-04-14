const Translation = require('../models/Translation');
const { translateText } = require('../services/translation');

exports.translate = async (req, res) => {
  try {
    const { text, domain } = req.body;
    
    if (!text || text.length > 5000) {
      return res.status(400).json({ 
        success: false,
        error: 'Invalid text input (max 5000 characters)' 
      });
    }

    const translatedText = await translateText(text, domain);
    
    const newTranslation = new Translation({
      originalText: text,
      translatedText,
      domain,
      user: req.user?.id,
      ipAddress: req.ip
    });
    
    await newTranslation.save();

    res.json({ 
      success: true,
      translatedText,
      domain
    });
    
  } catch (err) {
    console.error('Translation error:', err);
    res.status(500).json({ 
      success: false,
      error: 'Server error during translation' 
    });
  }
};