// Mock visualization generator when Groq API models aren't available
// This provides realistic visualization data based on project description keywords

const projectTemplates = {
  office: {
    title: "Modern Office Complex",
    description: "A professional office complex featuring multiple wings, dedicated parking areas, and landscaped grounds.",
    features: [
      { name: "Office Tower A", type: "building", x: 25, y: 35, width: 20, height: 30, color: "#3B82F6" },
      { name: "Office Tower B", type: "building", x: 55, y: 35, width: 20, height: 30, color: "#1E40AF" },
      { name: "Parking Garage", type: "parking", x: 40, y: 70, width: 28, height: 20, color: "#9CA3AF" },
      { name: "Plaza Area", type: "park", x: 25, y: 65, width: 15, height: 15, color: "#10B981" },
    ]
  },
  residential: {
    title: "Residential Community",
    description: "A well-planned residential community with villa blocks, recreational facilities, and central green spaces.",
    features: [
      { name: "Villas Block A", type: "residential", x: 20, y: 25, width: 18, height: 25, color: "#F59E0B" },
      { name: "Villas Block B", type: "residential", x: 55, y: 25, width: 18, height: 25, color: "#D97706" },
      { name: "Community Center", type: "building", x: 40, y: 55, width: 15, height: 15, color: "#8B5CF6" },
      { name: "Central Park", type: "park", x: 30, y: 70, width: 20, height: 18, color: "#10B981" },
      { name: "Swimming Pool", type: "pool", x: 60, y: 65, width: 12, height: 12, color: "#06B6D4" },
    ]
  },
  commercial: {
    title: "Shopping & Retail Center",
    description: "A modern commercial complex with retail spaces, entertainment venues, and ample parking facilities.",
    features: [
      { name: "Retail Mall", type: "retail", x: 20, y: 35, width: 25, height: 28, color: "#EC4899" },
      { name: "Food Court", type: "building", x: 55, y: 35, width: 15, height: 15, color: "#F97316" },
      { name: "Cinema", type: "building", x: 55, y: 55, width: 15, height: 15, color: "#6366F1" },
      { name: "Parking Deck", type: "parking", x: 25, y: 70, width: 35, height: 18, color: "#9CA3AF" },
    ]
  },
  hospital: {
    title: "Medical Facility",
    description: "A comprehensive healthcare complex with multiple specialized departments and emergency facilities.",
    features: [
      { name: "Main Hospital", type: "building", x: 25, y: 30, width: 22, height: 30, color: "#EF4444" },
      { name: "Emergency Ward", type: "building", x: 55, y: 30, width: 18, height: 20, color: "#DC2626" },
      { name: "Diagnostic Lab", type: "building", x: 55, y: 55, width: 15, height: 15, color: "#F87171" },
      { name: "Parking", type: "parking", x: 25, y: 65, width: 20, height: 20, color: "#9CA3AF" },
      { name: "Pharmacy", type: "building", x: 45, y: 70, width: 12, height: 12, color: "#06B6D4" },
    ]
  },
  education: {
    title: "Educational Institution",
    description: "A comprehensive educational campus with academic buildings, sports facilities, and student amenities.",
    features: [
      { name: "Main Building", type: "building", x: 20, y: 25, width: 18, height: 25, color: "#8B5CF6" },
      { name: "Laboratory", type: "building", x: 45, y: 25, width: 14, height: 20, color: "#A78BFA" },
      { name: "Auditorium", type: "building", x: 65, y: 25, width: 15, height: 20, color: "#7C3AED" },
      { name: "Sports Ground", type: "park", x: 25, y: 60, width: 20, height: 25, color: "#10B981" },
      { name: "Cafeteria", type: "building", x: 50, y: 65, width: 15, height: 15, color: "#F59E0B" },
    ]
  },
};

function detectProjectType(prompt) {
  const lowerPrompt = prompt.toLowerCase();
  
  if (lowerPrompt.includes('hospital') || lowerPrompt.includes('medical') || lowerPrompt.includes('clinic')) {
    return 'hospital';
  } else if (lowerPrompt.includes('school') || lowerPrompt.includes('college') || lowerPrompt.includes('university') || lowerPrompt.includes('education')) {
    return 'education';
  } else if (lowerPrompt.includes('mall') || lowerPrompt.includes('retail') || lowerPrompt.includes('shopping') || lowerPrompt.includes('commercial')) {
    return 'commercial';
  } else if (lowerPrompt.includes('villa') || lowerPrompt.includes('residential') || lowerPrompt.includes('township') || lowerPrompt.includes('community')) {
    return 'residential';
  } else {
    return 'office';
  }
}

export function generateMockVisualization(prompt) {
  const projectType = detectProjectType(prompt);
  const template = projectTemplates[projectType];
  
  // Add some variation to features based on specific keywords in prompt
  let features = JSON.parse(JSON.stringify(template.features)); // Deep copy
  
  // Adjust features based on keywords
  if (prompt.toLowerCase().includes('parking') || prompt.toLowerCase().includes('garage')) {
    if (!features.some(f => f.type === 'parking')) {
      features.push({ name: "Parking Area", type: "parking", x: 70, y: 70, width: 15, height: 15, color: "#9CA3AF" });
    }
  }
  
  if (prompt.toLowerCase().includes('park') || prompt.toLowerCase().includes('garden') || prompt.toLowerCase().includes('landscap')) {
    if (features.filter(f => f.type === 'park').length === 0) {
      features.push({ name: "Green Space", type: "park", x: 20, y: 15, width: 20, height: 18, color: "#10B981" });
    }
  }
  
  if (prompt.toLowerCase().includes('pool') || prompt.toLowerCase().includes('swim')) {
    if (features.filter(f => f.type === 'pool').length === 0) {
      features.push({ name: "Swimming Pool", type: "pool", x: 75, y: 40, width: 12, height: 12, color: "#06B6D4" });
    }
  }
  
  return {
    title: template.title,
    description: template.description,
    features: features.map(f => ({
      ...f,
      // Add some randomness to positions
      x: f.x + (Math.random() - 0.5) * 5,
      y: f.y + (Math.random() - 0.5) * 5,
    }))
  };
}
