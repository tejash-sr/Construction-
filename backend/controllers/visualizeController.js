import Groq from 'groq-sdk';
import { analyzeQuote } from '../utils/aiService.js';

const groq = new Groq({
  apiKey: process.env.GROQ_API_KEY,
});

/**
 * Generate visualization data from text prompt using Groq AI
 * @param {Object} req - Express request
 * @param {Object} res - Express response
 */
export const generateVisualization = async (req, res) => {
  try {
    const { prompt } = req.body;

    if (!prompt || prompt.trim().length === 0) {
      return res.status(400).json({
        success: false,
        message: 'Prompt is required',
      });
    }

    // Use Groq to analyze the prompt and generate visualization data
    const message = await groq.messages.create({
      model: 'mixtral-8x7b-32768',
      max_tokens: 1024,
      messages: [
        {
          role: 'user',
          content: `You are an expert architectural visualization assistant. Based on the following prompt, generate a structured JSON response with visualization data.

**Prompt:** ${prompt}

**Required JSON format:**
{
  "title": "Name of the project/visualization",
  "description": "2-3 sentence description of the layout and key features",
  "features": [
    {
      "name": "Feature name",
      "type": "building|parking|park|pool|court|road|water|other",
      "color": "#hexcolor"
    }
  ]
}

Rules:
1. Generate 4-8 features based on the prompt
2. Use realistic hex colors for each feature type
3. Title should be concise (max 50 chars)
4. Description should be detailed but concise
5. Return ONLY valid JSON, no markdown or extra text

Return only the JSON object, no additional text.`,
        },
      ],
    });

    // Extract the JSON from the response
    const content = message.content[0];
    if (content.type !== 'text') {
      throw new Error('Unexpected response type from AI');
    }

    // Parse the JSON response
    let visualizationData;
    try {
      visualizationData = JSON.parse(content.text);
    } catch (parseError) {
      // Try to extract JSON from the text if it's wrapped
      const jsonMatch = content.text.match(/\{[\s\S]*\}/);
      if (jsonMatch) {
        visualizationData = JSON.parse(jsonMatch[0]);
      } else {
        throw new Error('Failed to parse AI response as JSON');
      }
    }

    // Add x, y positions to features for visualization
    const featuresWithPositions = visualizationData.features.map(
      (feature, index) => {
        // Distribute features evenly across the canvas
        const cols = Math.ceil(Math.sqrt(visualizationData.features.length));
        const row = Math.floor(index / cols);
        const col = index % cols;

        return {
          ...feature,
          x: 100 + col * (700 / cols) + Math.random() * 30,
          y: 100 + row * (450 / cols) + Math.random() * 30,
        };
      }
    );

    const result = {
      success: true,
      data: {
        prompt,
        title: visualizationData.title,
        description: visualizationData.description,
        features: featuresWithPositions,
      },
    };

    res.json(result.data);
  } catch (error) {
    console.error('Visualization generation error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to generate visualization',
      error: process.env.NODE_ENV === 'development' ? error.message : undefined,
    });
  }
};
