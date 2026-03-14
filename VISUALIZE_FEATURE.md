# 🎨 AI Visualizer Feature

## Overview

The **AI Visualizer** is a powerful feature that allows users to input text descriptions of construction projects, building layouts, or site plans and receive AI-generated interactive visualizations.

## How It Works

### User Flow
1. User navigates to the **Visualize** page from the navbar
2. User enters a detailed text prompt describing their project
3. Frontend sends the prompt to the backend API
4. Backend uses Groq AI to analyze and generate visualization data
5. Frontend renders an interactive SVG visualization with:
   - Grid background for reference
   - Colored feature blocks representing buildings, parking, parks, etc.
   - North arrow for orientation
   - Detailed description
   - Feature list with color legend

### Example Input
```
A 10-story office building with ground floor retail, basement parking for 200 cars, 
green courtyard with landscaping, and rooftop terrace.
```

### Example Output
- Title: "Modern Office Complex"
- Description: Detailed breakdown of the project
- Features: 
  - Office Tower (Building - Blue)
  - Ground Retail (Building - Cyan)
  - Basement Parking (Parking - Gray)
  - Landscaped Courtyard (Park - Green)
  - Rooftop Terrace (Other - Light Blue)

## Architecture

### Frontend (`src/pages/Visualize.tsx`)
- React component with TypeScript
- Form input for text prompts
- Example suggestions for easy testing
- SVG-based visualization rendering
- Styled with Tailwind CSS and shadcn/ui
- Animated with Framer Motion

### Backend
#### Route: `POST /api/visualize`
**Location**: `backend/routes/visualizeRoutes.js`

**Request Body**:
```json
{
  "prompt": "Description of the project to visualize"
}
```

**Response**:
```json
{
  "prompt": "User's input",
  "title": "Generated project name",
  "description": "Detailed description of the layout",
  "features": [
    {
      "name": "Feature Name",
      "type": "building|parking|park|pool|court|road|water|other",
      "x": 150,
      "y": 200,
      "color": "#3b82f6"
    }
  ]
}
```

#### Controller: `backend/controllers/visualizeController.js`
- Handles POST requests to `/api/visualize`
- Uses Groq API to process prompts
- Generates structured JSON with visualization data
- Automatically calculates x,y positions for features

## Configuration

### Prerequisites
1. **Groq API Key** - Free account at https://console.groq.com
   - Sign up for free
   - Generate API key from dashboard
   - Add to `backend/.env` as `GROQ_API_KEY`

### Environment Variables
```env
# backend/.env
GROQ_API_KEY=your_groq_api_key_here
```

## Features

### ✅ Implemented
- [x] Text-to-visualization AI conversion
- [x] Interactive SVG canvas with grid
- [x] Multiple feature types (building, parking, park, pool, etc.)
- [x] Color-coded features
- [x] North arrow orientation
- [x] Responsive design (mobile & desktop)
- [x] Example prompts for quick testing
- [x] Loading states and error handling
- [x] Toast notifications for feedback
- [x] Feature list with legend

### 🔮 Future Enhancements
- [ ] 3D visualization with Three.js
- [ ] Add dimensions/measurements to features
- [ ] Export visualization as image/PDF
- [ ] Save visualizations to user profile
- [ ] Collaboration/sharing features
- [ ] Multiple visualization styles
- [ ] Augmented Reality (AR) preview
- [ ] Integration with actual CAD data

## Usage Examples

### Example 1: Residential Township
**Prompt**:
```
A gated community with 50 villas, central park, community center, swimming pool, 
tennis courts, and separate entrance for commercial shops. Each villa has a garden 
and the community has dedicated walking paths.
```

**Expected Output**:
- Title: "Gated Residential Community"
- Features: Villas, Park, Community Center, Pool, Tennis Court, Commercial Area

### Example 2: Shopping Mall
**Prompt**:
```
A 4-story shopping mall with 150 retail spaces on each floor, central food court 
on ground floor, cinema on 3rd floor, kids play area, parking garage for 500 vehicles, 
and emergency exits at all corners.
```

**Expected Output**:
- Title: "Modern Shopping Mall"
- Features: Retail Space, Food Court, Cinema, Kids Play Area, Parking Garage

### Example 3: Hospital Campus
**Prompt**:
```
A 200-bed hospital campus with separate emergency ward building, surgical theaters, 
ICU block, cafeteria, pharmacy, diagnostic lab, staff quarters, parking, and 
dedicated ambulance entrance with porte-cochere.
```

**Expected Output**:
- Title: "Hospital Complex"
- Features: Hospital Building, Emergency Ward, Surgical Block, ICU, Support Services

## Testing

### Manual Testing Steps

1. **Start Backend**:
   ```bash
   cd backend
   npm run dev
   ```

2. **Start Frontend**:
   ```bash
   npm run dev
   ```

3. **Access Visualizer**:
   - Open http://localhost:8080
   - Login/Signup
   - Click "Visualize" in navbar
   - Enter a prompt and click "Visualize"

4. **Test with Examples**:
   - Use the provided example cards
   - Modify prompts slightly to test variations
   - Try very detailed descriptions
   - Try vague descriptions (test error handling)

### API Testing (Curl)
```bash
curl -X POST http://localhost:5000/api/visualize \
  -H "Content-Type: application/json" \
  -d '{"prompt":"A simple house with garage and garden"}'
```

## Browser Integration

### Navbar
The "Visualize" link is added to the main navigation:
- Desktop: Visible in horizontal navbar
- Mobile: Included in hamburger menu
- Path: `/visualize`
- Access: Requires authentication (ProtectedRoute)

### Routing
- **File**: `src/App.tsx`
- **Route**: `/visualize` → `<Visualize />` component
- **Protection**: ProtectedRoute wrapper
- **Import**: `import Visualize from "./pages/Visualize"`

## File Structure

```
Project Root/
├── src/
│   ├── pages/
│   │   └── Visualize.tsx          # Frontend visualization page
│   ├── components/
│   │   └── layout/
│   │       └── Navbar.tsx        # Updated with Visualize link
│   └── App.tsx                   # Updated with Visualize route
│
└── backend/
    ├── controllers/
    │   └── visualizeController.js  # Handles visualization logic
    ├── routes/
    │   └── visualizeRoutes.js      # POST /api/visualize endpoint
    ├── server.js                   # Updated with visualizeRoutes
    ├── utils/
    │   └── aiService.js            # Groq AI integration
    ├── package.json                # Added groq-sdk
    └── .env                        # Added GROQ_API_KEY
```

## Performance Considerations

1. **API Calls**: Each visualization generates one API call to Groq
2. **Response Time**: Typically 2-5 seconds
3. **Rate Limiting**: Groq free tier has limits (check documentation)
4. **Error Handling**: Graceful fallbacks if API fails
5. **Caching**: Consider caching popular prompts in future versions

## Security Notes

- ✅ Groq API key stored in backend environment variables
- ✅ Frontend makes secure POST requests
- ✅ No sensitive data exposed to client
- ✅ Protected route requires authentication
- ✅ Input validation on backend

## Troubleshooting

### Issue: "GROQ_API_KEY is not configured"
**Solution**: Add GROQ_API_KEY to backend/.env
```env
GROQ_API_KEY=your_actual_key_here
```

### Issue: "Failed to generate visualization"
**Solution**: 
- Check GROQ_API_KEY is valid
- Check Groq API dashboard for rate limits
- Ensure internet connection
- Check backend logs for detailed error

### Issue: Visualization not showing
**Solution**:
- Check browser console for JavaScript errors
- Verify API response in Network tab (DevTools)
- Check if backend is running on port 5000
- Clear browser cache and refresh

## Links & Resources

- **Groq Documentation**: https://console.groq.com/docs
- **Groq API Keys**: https://console.groq.com/keys
- **Feature Requests**: Contact development team
- **Bug Reports**: Create issue in GitHub

---

**Last Updated**: March 14, 2026  
**Feature Status**: ✅ Production Ready  
**Requires**: Groq API Key (Free tier available)
