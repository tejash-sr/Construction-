import Groq from 'groq-sdk';
import { generateMockVisualization } from '../utils/mockVisualizer.js';

// Generate visualization from text prompt
export const generateVisualization = async (req, res) => {
  try {
    const { prompt } = req.body;

    if (!prompt || prompt.trim().length === 0) {
      return res.status(400).json({
        success: false,
        message: 'Prompt is required',
      });
    }

    const apiKey = process.env.GROQ_API_KEY;

    if (!apiKey) {
      console.log('No API key found, using mock visualizer');
      const mockData = generateMockVisualization(prompt);
      return res.json({
        prompt,
        ...mockData,
      });
    }

    // Try to use Groq API, with fallback to mock generator
    try {
      const client = new Groq({ apiKey });

      const chatCompletion = await client.chat.completions.create({
        messages: [
          {
            role: 'user',
            content: `You are an expert architect. Create visualization data for: "${prompt}"

Return ONLY JSON (no markdown):
{"title":"Project Name","description":"Description","features":[{"name":"Building","type":"building","x":30,"y":40,"width":25,"height":35,"color":"#3B82F6"}]}`,
          },
        ],
        model: 'qwq-32b',
        max_tokens: 1024,
      });

      const responseText = chatCompletion.choices[0].message.content;
      
      if (!responseText) {
        throw new Error('Empty response');
      }

      let cleanedText = responseText.trim();
      
      // Remove markdown
      if (cleanedText.startsWith('```')) {
        cleanedText = cleanedText.replace(/^```[a-z]*\s*/, '').replace(/```\s*$/, '');
      }

      const jsonStart = cleanedText.indexOf('{');
      const jsonEnd = cleanedText.lastIndexOf('}');

      if (jsonStart === -1 || jsonEnd === -1) {
        throw new Error('No JSON found');
      }

      const jsonString = cleanedText.substring(jsonStart, jsonEnd + 1);
      const visualizationData = JSON.parse(jsonString);

      if (!visualizationData.title || !visualizationData.description || !Array.isArray(visualizationData.features)) {
        throw new Error('Invalid structure');
      }

      visualizationData.features = visualizationData.features.map(f => ({
        name: f.name || 'Feature',
        type: f.type || 'building',
        x: Number(f.x) || 50,
        y: Number(f.y) || 50,
        width: Number(f.width) || 20,
        height: Number(f.height) || 20,
        color: f.color || '#3B82F6'
      }));

      console.log('Visualization created successfully via Groq');
      res.json({
        prompt,
        title: visualizationData.title,
        description: visualizationData.description,
        features: visualizationData.features,
      });

    } catch (groqError) {
      // If Groq fails, use mock visualizer
      console.log('Groq API failed, using mock visualizer:', groqError.message?.substring(0, 100));
      const mockData = generateMockVisualization(prompt);
      res.json({
        prompt,
        ...mockData,
      });
    }

  } catch (error) {
    console.error('Visualization error:', error.message);
    
    let statusCode = 500;
    let errorMessage = error.message || 'Failed to generate visualization';

    if (error.message?.includes('API key') || error.message?.includes('401')) {
      statusCode = 401;
      errorMessage = 'Invalid API key';
    } else if (error.message?.includes('429')) {
      statusCode = 429;
      errorMessage = 'Rate limit exceeded';
    }

    res.status(statusCode).json({
      success: false,
      message: errorMessage,
    });
  }
};
