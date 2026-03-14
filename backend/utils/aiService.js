import Groq from 'groq-sdk';
import dotenv from 'dotenv';

dotenv.config();

/**
 * Initialize Groq AI client
 * @returns {Groq} Groq client instance
 */
const getGroqClient = () => {
  const apiKey = process.env.GROQ_API_KEY;
  
  if (!apiKey) {
    throw new Error('GROQ_API_KEY is not configured in environment variables');
  }
  
  return new Groq({ apiKey });
};

/**
 * Analyze a construction quote and provide AI-powered recommendations
 * @param {Object} quoteData - Quote details to analyze
 * @param {string} quoteData.name - Customer name
 * @param {string} quoteData.email - Customer email
 * @param {string} quoteData.phone - Customer phone
 * @param {string} quoteData.projectType - Type of construction project
 * @param {string} quoteData.projectSize - Size/scale of the project
 * @param {string} quoteData.location - Project location
 * @param {string} quoteData.budgetRange - Customer's budget range
 * @param {string} quoteData.timeline - Expected project timeline
 * @param {string} quoteData.description - Detailed project description
 * @returns {Promise<Object>} AI analysis with recommendation, confidence, reasoning, costs, risks
 */
export const analyzeQuote = async (quoteData) => {
  try {
    const groq = getGroqClient();

    // Construct detailed prompt for Tamil Nadu construction context
    const prompt = `You are an expert construction project analyst for INIYAN SPARK, a construction company operating in Tamil Nadu, India. Analyze the following construction quote request and provide a detailed recommendation.

**Quote Details:**
- Customer Name: ${quoteData.name}
- Project Type: ${quoteData.projectType}
- Project Size: ${quoteData.projectSize}
- Location: ${quoteData.location}
- Budget Range: ${quoteData.budgetRange}
- Timeline: ${quoteData.timeline}
- Description: ${quoteData.description}

**Analysis Requirements:**
Consider the following factors in your analysis:
1. **Budget Feasibility**: Is the customer's budget realistic for the project scope in Tamil Nadu market rates?
2. **Timeline Viability**: Is the timeline achievable given the project complexity?
3. **Project Complexity**: Does the project type and size match the company's capabilities?
4. **Profitability**: Will this project generate adequate profit margins (typically 15-25% in construction)?
5. **Risk Assessment**: Identify potential issues (unclear requirements, tight budget, unrealistic timeline)
6. **Location Accessibility**: Is the location accessible for materials and labor in Tamil Nadu?
7. **Customer Profile**: Does the project indicate a serious, well-prepared customer?

**Tamil Nadu Market Context:**
- Typical construction costs: ₹1500-₹2500 per sq.ft for residential, ₹2000-₹3500 for commercial
- Labor availability varies by region (Chennai higher rates than rural areas)
- Material costs have fluctuated 10-15% recently
- Monsoon season (Oct-Dec) can delay projects by 2-4 weeks

**Output Format (JSON only, no additional text):**
{
  "recommendation": "accept" | "reject" | "negotiate",
  "confidence": 75,
  "reasoning": [
    "Brief point 1 explaining the decision",
    "Brief point 2 about budget/timeline",
    "Brief point 3 about opportunities or risks"
  ],
  "estimatedCostRange": {
    "min": 500000,
    "max": 800000,
    "currency": "INR"
  },
  "estimatedDuration": 90,
  "riskFactors": [
    "Budget may be tight for scope",
    "Timeline is aggressive"
  ],
  "opportunities": [
    "Good location for future referrals",
    "Standard project type - proven execution"
  ],
  "suggestedQuotedAmount": 650000,
  "nextSteps": [
    "Schedule site visit to verify measurements",
    "Request detailed floor plans"
  ],
  "redFlags": [
    "Unclear specifications in description"
  ],
  "greenFlags": [
    "Customer has realistic budget expectations",
    "Location is easily accessible"
  ]
}

Provide your analysis now (JSON only):`;

    // Call Groq API with LLaMA 3.3 70B model (best for reasoning)
    const completion = await groq.chat.completions.create({
      messages: [
        {
          role: 'system',
          content: 'You are an expert construction project analyst. Respond only with valid JSON, no additional text or markdown.'
        },
        {
          role: 'user',
          content: prompt
        }
      ],
      model: 'llama-3.3-70b-versatile', // Latest LLaMA model, fast and accurate
      temperature: 0.7, // Balanced creativity and consistency
      max_tokens: 2000,
      response_format: { type: 'json_object' } // Ensure JSON response
    });

    // Parse AI response
    const analysisText = completion.choices[0]?.message?.content;
    
    if (!analysisText) {
      throw new Error('No response from AI model');
    }

    // Parse JSON response
    const analysis = JSON.parse(analysisText);

    // Validate required fields
    if (!analysis.recommendation || !analysis.confidence) {
      throw new Error('Invalid AI response format');
    }

    // Add metadata
    analysis.analyzedAt = new Date().toISOString();
    analysis.model = 'llama-3.3-70b-versatile';
    analysis.provider = 'Groq';

    console.log('✅ AI Analysis completed:', {
      recommendation: analysis.recommendation,
      confidence: analysis.confidence,
      customer: quoteData.name,
      project: quoteData.projectType
    });

    return analysis;

  } catch (error) {
    console.error('❌ AI Analysis error:', error.message);

    // Return fallback analysis on error
    return {
      recommendation: 'manual_review',
      confidence: 0,
      reasoning: [
        'AI analysis is temporarily unavailable',
        'Please review this quote manually',
        `Error: ${error.message}`
      ],
      estimatedCostRange: {
        min: 0,
        max: 0,
        currency: 'INR'
      },
      estimatedDuration: 0,
      riskFactors: ['AI service error - manual review required'],
      opportunities: [],
      suggestedQuotedAmount: 0,
      nextSteps: ['Review quote details manually', 'Contact customer for clarification'],
      redFlags: [],
      greenFlags: [],
      error: true,
      errorMessage: error.message,
      analyzedAt: new Date().toISOString(),
      model: 'fallback',
      provider: 'manual'
    };
  }
};

/**
 * Check if AI service is configured and available
 * @returns {boolean} True if AI service is ready
 */
export const isAIConfigured = () => {
  return !!process.env.GROQ_API_KEY;
};

export default {
  analyzeQuote,
  isAIConfigured
};
