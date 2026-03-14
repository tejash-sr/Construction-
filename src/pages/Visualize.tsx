import { useState } from 'react';
import { Sparkles, Send, MapPin } from 'lucide-react';
import { motion } from 'framer-motion';
import Layout from '@/components/layout/Layout';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card } from '@/components/ui/card';
import { useToast } from '@/hooks/use-toast';

interface VisualizationResult {
  prompt: string;
  description: string;
  features: Array<{
    name: string;
    x: number;
    y: number;
    width?: number;
    height?: number;
    type: string;
    color: string;
  }>;
  title: string;
}

const Visualize = () => {
  const [prompt, setPrompt] = useState('');
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<VisualizationResult | null>(null);
  const { toast } = useToast();

  const handleVisualize = async () => {
    if (!prompt.trim()) {
      toast({
        title: 'Error',
        description: 'Please enter a prompt to visualize',
        variant: 'destructive',
      });
      return;
    }

    setLoading(true);
    try {
      const apiUrl = import.meta.env.VITE_API_URL || 'http://localhost:5000';
      const response = await fetch(`${apiUrl}/api/visualize`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ prompt }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Failed to generate visualization');
      }

      const responseData = await response.json();
      
      // Extract data from the response
      const visualizationData = responseData.data || responseData;
      setResult(visualizationData);
      
      toast({
        title: 'Success',
        description: 'Visualization generated successfully!',
      });
    } catch (error) {
      console.error('Visualization error:', error);
      toast({
        title: 'Error',
        description: error instanceof Error ? error.message : 'Failed to generate visualization',
        variant: 'destructive',
      });
    } finally {
      setLoading(false);
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !loading) {
      handleVisualize();
    }
  };

  return (
    <Layout>
      <div className="min-h-screen bg-gradient-to-br from-primary/5 via-background to-primary/10 pt-32 pb-16">
        <div className="container mx-auto px-4">
          {/* Header Section */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="text-center mb-12"
          >
            <div className="flex items-center justify-center gap-3 mb-4">
              <Sparkles className="h-8 w-8 text-primary" />
              <h1 className="text-4xl md:text-5xl font-bold">AI Visualizer</h1>
            </div>
            <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
              Describe any construction project, site layout, or blueprint in words and watch it come to life with AI-powered visualization
            </p>
          </motion.div>

          {/* Input Section */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.1 }}
            className="max-w-2xl mx-auto mb-12"
          >
            <Card className="p-6 border-2 border-primary/20 hover:border-primary/40 transition-colors">
              <label className="block text-sm font-semibold mb-3">
                Describe what you want to visualize
              </label>
              <div className="flex gap-3">
                <Input
                  placeholder="E.g., A modern 5-story office building with a courtyard, parking area, and landscaping..."
                  value={prompt}
                  onChange={(e) => setPrompt(e.target.value)}
                  onKeyPress={handleKeyPress}
                  disabled={loading}
                  className="text-base"
                />
                <Button
                  onClick={handleVisualize}
                  disabled={loading}
                  className="gap-2 whitespace-nowrap"
                >
                  {loading ? (
                    <>
                      <div className="animate-spin h-4 w-4 border-2 border-current border-t-transparent rounded-full" />
                      Generating...
                    </>
                  ) : (
                    <>
                      <Send className="h-4 w-4" />
                      Visualize
                    </>
                  )}
                </Button>
              </div>
              <p className="text-xs text-muted-foreground mt-3">
                ✨ Tip: Be descriptive! Include details like building size, rooms, areas, and layout preferences
              </p>
            </Card>
          </motion.div>

          {/* Visualization Canvas */}
          {result && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
              className="max-w-4xl mx-auto space-y-6"
            >
              {/* Title */}
              <div className="text-center">
                <h2 className="text-3xl font-bold text-primary mb-2">{result.title}</h2>
                <p className="text-muted-foreground">{result.prompt}</p>
              </div>

              {/* SVG Visualization */}
              <Card className="p-6 border-2 border-primary/20 overflow-auto">
                <svg
                  viewBox="0 0 800 600"
                  className="w-full border border-primary/10 rounded-lg bg-gradient-to-br from-white/50 to-primary/5"
                >
                  {/* Grid Background */}
                  <defs>
                    <pattern id="grid" width="40" height="40" patternUnits="userSpaceOnUse">
                      <path
                        d="M 40 0 L 0 0 0 40"
                        fill="none"
                        stroke="#e5e7eb"
                        strokeWidth="0.5"
                      />
                    </pattern>
                  </defs>
                  <rect width="800" height="600" fill="url(#grid)" />

                  {/* Features/Structures */}
                  {result.features.map((feature, index) => {
                    const x = (feature.x / 100) * 800;
                    const y = (feature.y / 100) * 600;
                    const width = ((feature.width || 15) / 100) * 800;
                    const height = ((feature.height || 15) / 100) * 600;
                    
                    return (
                      <g key={index}>
                        {/* Building/Feature Rectangle */}
                        <rect
                          x={x - width / 2}
                          y={y - height / 2}
                          width={width}
                          height={height}
                          fill={feature.color}
                          fillOpacity="0.8"
                          stroke="#333"
                          strokeWidth="1.5"
                          rx="4"
                          className="transition-all hover:fill-opacity-100"
                        />

                        {/* Label Background */}
                        <rect
                          x={x - (feature.name.length * 2.5)}
                          y={y + height / 2 + 5}
                          width={feature.name.length * 5}
                          height="16"
                          fill="white"
                          fillOpacity="0.95"
                          rx="2"
                        />

                        {/* Feature Name Label */}
                        <text
                          x={x}
                          y={y + height / 2 + 18}
                          textAnchor="middle"
                          fontSize="11"
                          fontWeight="600"
                          fill="#1f2937"
                          className="pointer-events-none"
                        >
                          {feature.name}
                        </text>

                        {/* Feature Type Icon */}
                        <text
                          x={x}
                          y={y + 5}
                          textAnchor="middle"
                          fontSize="14"
                          fontWeight="bold"
                          fill="white"
                          className="pointer-events-none"
                        >
                          {feature.type.charAt(0).toUpperCase()}
                        </text>
                      </g>
                    );
                  })}

                  {/* North Arrow */}
                  <g className="text-primary">
                    <line x1="750" y1="50" x2="750" y2="100" stroke="currentColor" strokeWidth="2" />
                    <polygon
                      points="750,40 745,55 755,55"
                      fill="currentColor"
                    />
                    <text x="750" y="120" textAnchor="middle" fontSize="12" fontWeight="bold" fill="currentColor">
                      N
                    </text>
                  </g>
                </svg>
              </Card>

              {/* Description */}
              <Card className="p-6 border-primary/20">
                <h3 className="text-lg font-semibold mb-3 flex items-center gap-2">
                  <MapPin className="h-5 w-5 text-primary" />
                  Description
                </h3>
                <p className="text-muted-foreground leading-relaxed">
                  {result.description}
                </p>
              </Card>

              {/* Features List */}
              <Card className="p-6 border-primary/20">
                <h3 className="text-lg font-semibold mb-4">Layout Elements</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {result.features.map((feature, index) => (
                    <div 
                      key={index} 
                      className="flex items-start gap-3 p-3 rounded-lg bg-primary/5 border border-primary/10"
                    >
                      <div
                        className="w-4 h-4 rounded mt-1 flex-shrink-0"
                        style={{ backgroundColor: feature.color }}
                      />
                      <div>
                        <p className="font-semibold">{feature.name}</p>
                        <p className="text-xs text-muted-foreground capitalize">{feature.type}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </Card>

              {/* Try Another */}
              <div className="text-center">
                <Button
                  variant="outline"
                  onClick={() => setResult(null)}
                  className="gap-2"
                >
                  <Sparkles className="h-4 w-4" />
                  Try Another Visualization
                </Button>
              </div>
            </motion.div>
          )}

          {/* Examples Section */}
          {!result && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.2 }}
              className="max-w-4xl mx-auto mt-16"
            >
              <h3 className="text-2xl font-bold mb-6 text-center">Try These Examples</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {[
                  {
                    title: 'Modern Office Complex',
                    desc: 'A 10-story office building with ground floor retail, basement parking for 200 cars, green courtyard with landscaping, and rooftop terrace.',
                  },
                  {
                    title: 'Residential Township',
                    desc: 'A gated community with 50 villas, central park, community center, swimming pool, tennis courts, and separate entrance for commercial shops.',
                  },
                  {
                    title: 'Shopping Mall Layout',
                    desc: 'A 4-story shopping mall with 150 retail spaces, food court, cinema, kids play area, parking for 500 vehicles, and emergency exits.',
                  },
                  {
                    title: 'Hospital Campus',
                    desc: 'A 200-bed hospital with emergency ward, surgical theaters, ICU, cafeteria, pharmacy, lab, parking, and ambulance entrance.',
                  },
                ].map((example, index) => (
                  <motion.button
                    key={index}
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    onClick={() => setPrompt(example.desc)}
                    className="text-left p-4 rounded-lg border border-primary/20 hover:border-primary/40 bg-card hover:bg-primary/5 transition-all"
                  >
                    <p className="font-semibold text-primary mb-2">{example.title}</p>
                    <p className="text-sm text-muted-foreground">{example.desc}</p>
                  </motion.button>
                ))}
              </div>
            </motion.div>
          )}
        </div>
      </div>
    </Layout>
  );
};

export default Visualize;
