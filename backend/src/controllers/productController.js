const { VertexAI } = require('@google-cloud/vertexai');
const Product = require('../models/Product');
const { uploadBase64Image, generateFilename, imageUrlToBase64 } = require('../utils/storage');

// Initialize Vertex AI
let vertexAI = null;
let textModel = null;
let imageModel = null;

try {
  vertexAI = new VertexAI({
    project: process.env.GOOGLE_PROJECT_ID,
    location: process.env.GOOGLE_LOCATION || 'us-central1',
  });
  
  // Text model for product summary
  textModel = vertexAI.getGenerativeModel({
    model: process.env.VERTEX_MODEL || 'gemini-1.5-flash',
  });
  
  // Image model for enhancement (Nano Banana!)
  imageModel = vertexAI.getGenerativeModel({
    model: 'gemini-2.5-flash-image'
  });
  
  console.log('✅ Vertex AI models initialized successfully');
} catch (error) {
  console.error('❌ Failed to initialize Vertex AI:', error.message);
}

/**
 * Generate product summary using Gemini
 * @param {string} transcript - Voice transcript
 * @param {Object} vision - Vision AI results
 * @returns {Promise<Object>} - Product AI summary
 */
async function generateProductSummary(transcript, vision) {
  if (!textModel) {
    console.warn('⚠️ Text model not available, returning fallback summary');
    return {
      productName: 'Handmade Craft Product',
      description: 'A beautiful handmade product crafted with care and attention to detail.',
      bulletPoints: [
        'Handmade with premium materials',
        'Unique design and craftsmanship',
        'Perfect for gifts or personal use'
      ],
      priceSuggestion: 45,
      tags: ['handmade', 'craft', 'artisan'],
      category: 'Crafts'
    };
  }

  const labels = vision.labels ? vision.labels.join(', ') : 'craft product';
  const colors = vision.colors ? vision.colors.map(c => c.color).join(', ') : 'mixed colors';
  
  const prompt = `
You are an expert product marketing specialist. Create a compelling product listing based on this information:

**Voice Description:**
"${transcript}"

**Visual Analysis:**
- Detected objects: ${labels}
- Dominant colors: ${colors}
- Text in image: ${vision.text || 'none'}

**Instructions:**
Return a JSON object with these fields:
{
  "productName": "A catchy, SEO-friendly product name (max 60 chars)",
  "description": "Compelling 2-3 sentence description highlighting uniqueness and benefits",
  "bulletPoints": ["3-5 key selling points as short bullet points"],
  "priceSuggestion": "Suggested price as a number (USD)",
  "tags": ["5-8 relevant tags for searchability"],
  "category": "Product category (e.g., 'Home Decor', 'Jewelry', 'Art')"
}

**Important:** Return ONLY the JSON object, no other text.
`;

  try {
    const result = await textModel.generateContent({
      contents: [{ role: 'user', parts: [{ text: prompt }] }],
      generationConfig: {
        temperature: 0.3,
        maxOutputTokens: 1024,
      }
    });

    const responseText = result.response.candidates[0].content.parts[0].text;
    console.log('Raw AI response:', responseText);
    
    // Clean and parse JSON
    const cleanJson = responseText
      .replace(/```json\s*|\s*```/g, '')
      .replace(/^[^{]*/, '')
      .replace(/[^}]*$/, '}');
    
    const parsed = JSON.parse(cleanJson);
    
    // Validate and provide defaults
    return {
      productName: parsed.productName || 'Handmade Craft Product',
      description: parsed.description || 'A beautiful handmade product.',
      bulletPoints: Array.isArray(parsed.bulletPoints) ? parsed.bulletPoints : [
        'Handmade with care',
        'Unique design',
        'Quality materials'
      ],
      priceSuggestion: typeof parsed.priceSuggestion === 'number' ? parsed.priceSuggestion : 45,
      tags: Array.isArray(parsed.tags) ? parsed.tags : ['handmade', 'craft'],
      category: parsed.category || 'Crafts'
    };
    
  } catch (error) {
    console.error('❌ Product summary generation error:', error.message);
    
    // Fallback summary
    return {
      productName: 'Handmade Craft Product',
      description: 'A unique handmade product created with attention to detail.',
      bulletPoints: [
        'Handcrafted with premium materials',
        'One-of-a-kind design',
        'Perfect for home or gifting'
      ],
      priceSuggestion: 45,
      tags: ['handmade', 'craft', 'artisan', 'unique'],
      category: 'Crafts'
    };
  }
}

/**
 * Enhance image using Gemini 2.5 Flash Image (Nano Banana)
 * @param {string} originalImageUrl - Cloudinary URL of original image
 * @param {string} productName - Product name for context
 * @returns {Promise<string>} - Enhanced image URL
 */
async function enhanceProductImage(originalImageUrl, productName) {
  if (!imageModel) {
    console.warn('⚠️ Image model not available, returning original image');
    return originalImageUrl;
  }

  try {
    console.log('Enhancing image with Gemini 2.5 Flash Image...');
    
    // Convert image URL to base64 for the model
    const imageBase64 = await imageUrlToBase64(originalImageUrl);
    
    const enhancementPrompt = `Transform this product image into professional e-commerce quality:

- Clean, minimal white or neutral background
- Professional lighting with soft shadows
- Sharp focus on the product details  
- Remove any clutter or distracting elements
- Maintain the authentic look and colors of the product
- High-resolution marketplace photography style

Product: ${productName}
Style: Professional product photography for online marketplace`;

    const result = await imageModel.generateContent({
      contents: [{
        role: 'user',
        parts: [
          {
            inline_data: {
              mime_type: 'image/jpeg',
              data: imageBase64
            }
          },
          {
            text: enhancementPrompt
          }
        ]
      }],
      generationConfig: {
        temperature: 0.1, // Low temperature for consistent professional results
      }
    });

    // Extract the enhanced image
    const enhancedImagePart = result.response.candidates[0].content.parts.find(
      part => part.inline_data && part.inline_data.mime_type.startsWith('image/')
    );

    if (!enhancedImagePart) {
      console.warn('⚠️ No enhanced image returned, using original');
      return originalImageUrl;
    }

    // Upload enhanced image to Cloudinary
    const enhancedBase64 = `data:${enhancedImagePart.inline_data.mime_type};base64,${enhancedImagePart.inline_data.data}`;
    const enhancedFilename = generateFilename(productName, 'enhanced');
    const enhancedImageUrl = await uploadBase64Image(enhancedBase64, enhancedFilename, 'products/enhanced');
    
    console.log('✅ Image enhanced successfully');
    return enhancedImageUrl;
    
  } catch (error) {
    console.error('❌ Image enhancement error:', error.message);
    console.warn('⚠️ Using original image due to enhancement failure');
    return originalImageUrl;
  }
}

/**
 * Controller: Process complete product (transcript + image + vision)
 */
exports.processProduct = async (req, res) => {
  console.log('Product processing started');
  
  try {
    const { transcript, imageUrl, vision, userId, sessionId } = req.body;
    
    // Validate required fields
    if (!transcript || !imageUrl || !vision) {
      return res.status(400).json({
        success: false,
        error: 'Missing required fields',
        message: 'transcript, imageUrl, and vision are required'
      });
    }

    console.log('Processing product with:', {
      transcriptLength: transcript.length,
      imageUrl: imageUrl.substring(0, 50) + '...',
      visionLabels: vision.labels?.length || 0
    });

    // Step 1: Generate product summary
    console.log('Step 1: Generating product summary...');
    const aiSummary = await generateProductSummary(transcript, vision);
    console.log('Product summary generated:', aiSummary.productName);

    // Step 2: Enhance image
    console.log('Step 2: Enhancing product image...');
    const enhancedImageUrl = await enhanceProductImage(imageUrl, aiSummary.productName);
    console.log('Image enhancement completed');

    // Step 3: Save product to database
    console.log('Step 3: Saving product to database...');
    const product = new Product({
      userId: userId || null,
      sessionId: sessionId || null,
      transcript,
      originalImageUrl: imageUrl,
      vision,
      ai: aiSummary,
      enhancedImageUrl,
      status: 'ready_for_approval'
    });

    await product.save();
    console.log('✅ Product saved with ID:', product._id);

    return res.status(200).json({
      success: true,
      productId: product._id,
      enhancedImageUrl,
      product: {
        id: product._id,
        productName: aiSummary.productName,
        description: aiSummary.description,
        bulletPoints: aiSummary.bulletPoints,
        priceSuggestion: aiSummary.priceSuggestion,
        tags: aiSummary.tags,
        category: aiSummary.category,
        originalImageUrl: imageUrl,
        enhancedImageUrl,
        status: product.status
      }
    });
    
  } catch (error) {
    console.error('❌ Error in product processing:', error);
    
    return res.status(500).json({
      success: false,
      error: 'Internal server error',
      message: 'Failed to process product',
      details: error.message
    });
  }
};

/**
 * Controller: Get product by ID
 */
exports.getProduct = async (req, res) => {
  try {
    const { id } = req.params;
    
    const product = await Product.findById(id);
    
    if (!product) {
      return res.status(404).json({
        success: false,
        error: 'Product not found'
      });
    }
    
    return res.status(200).json({
      success: true,
      product
    });
    
  } catch (error) {
    console.error('❌ Error getting product:', error);
    
    return res.status(500).json({
      success: false,
      error: 'Internal server error',
      details: error.message
    });
  }
};

/**
 * Controller: Approve product
 */
exports.approveProduct = async (req, res) => {
  try {
    const { id } = req.params;
    
    const product = await Product.findByIdAndUpdate(
      id,
      {
        approved: true,
        approvedAt: new Date(),
        status: 'approved'
      },
      { new: true }
    );
    
    if (!product) {
      return res.status(404).json({
        success: false,
        error: 'Product not found'
      });
    }
    
    console.log('✅ Product approved:', product._id);
    
    return res.status(200).json({
      success: true,
      product
    });
    
  } catch (error) {
    console.error('❌ Error approving product:', error);
    
    return res.status(500).json({
      success: false,
      error: 'Internal server error',
      details: error.message
    });
  }
};