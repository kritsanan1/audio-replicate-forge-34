
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Upload, Mic, Play, Square, Download, Zap, AudioWaveform } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import VoiceCloner from "@/components/VoiceCloner";
import AudioVisualizer from "@/components/AudioVisualizer";
import TextToSpeech from "@/components/TextToSpeech";

const Index = () => {
  const [activeTab, setActiveTab] = useState<'clone' | 'synthesize'>('clone');
  const { toast } = useToast();

  return (
    <div className="min-h-screen bg-cyber-dark text-white">
      {/* Hero Section */}
      <div className="relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-cyber-red/10 via-transparent to-cyber-orange/10" />
        <div className="relative container mx-auto px-4 py-20 text-center">
          <div className="space-y-6 max-w-4xl mx-auto">
            <h1 className="text-6xl md:text-8xl font-bold mb-6">
              <span className="neon-text">AUDIO</span>
              <br />
              <span className="text-white">FORGE</span>
            </h1>
            <p className="text-xl md:text-2xl text-gray-300 max-w-2xl mx-auto leading-relaxed">
              Clone voices with cutting-edge AI technology. Transform any voice into a digital replica 
              with unprecedented accuracy and quality.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center mt-8">
              <Button 
                className="cyber-button text-lg px-8 py-4"
                onClick={() => document.getElementById('forge-section')?.scrollIntoView({ behavior: 'smooth' })}
              >
                <Zap className="w-5 h-5 mr-2" />
                Start Cloning
              </Button>
              <Button 
                variant="outline" 
                className="border-cyber-red text-cyber-red hover:bg-cyber-red hover:text-white text-lg px-8 py-4"
              >
                <AudioWaveform className="w-5 h-5 mr-2" />
                View Demo
              </Button>
            </div>
          </div>
        </div>
      </div>

      {/* Features Grid */}
      <div className="container mx-auto px-4 py-20">
        <div className="grid md:grid-cols-3 gap-8">
          <Card className="cyber-card text-center">
            <Mic className="w-12 h-12 text-cyber-red mx-auto mb-4" />
            <h3 className="text-xl font-bold mb-2">Voice Cloning</h3>
            <p className="text-gray-400">
              Upload audio samples and create high-fidelity voice replicas using advanced AI models.
            </p>
          </Card>
          <Card className="cyber-card text-center">
            <AudioWaveform className="w-12 h-12 text-cyber-orange mx-auto mb-4" />
            <h3 className="text-xl font-bold mb-2">Real-time Processing</h3>
            <p className="text-gray-400">
              Watch your audio transform in real-time with live waveform visualization.
            </p>
          </Card>
          <Card className="cyber-card text-center">
            <Download className="w-12 h-12 text-cyber-amber mx-auto mb-4" />
            <h3 className="text-xl font-bold mb-2">Export Quality</h3>
            <p className="text-gray-400">
              Download professional-grade audio files ready for any application.
            </p>
          </Card>
        </div>
      </div>

      {/* Main Forge Section */}
      <div id="forge-section" className="container mx-auto px-4 py-20">
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-4xl font-bold mb-4">
              <span className="neon-text">Voice Forge</span>
            </h2>
            <p className="text-gray-400 text-lg">
              Select your mode and start creating synthetic voices
            </p>
          </div>

          {/* Tab Navigation */}
          <div className="flex justify-center mb-8">
            <div className="bg-cyber-gray rounded-lg p-1 flex">
              <button
                className={`px-6 py-3 rounded-md font-medium transition-all duration-300 ${
                  activeTab === 'clone' 
                    ? 'bg-cyber-red text-white shadow-lg' 
                    : 'text-gray-400 hover:text-white'
                }`}
                onClick={() => setActiveTab('clone')}
              >
                Clone Voice
              </button>
              <button
                className={`px-6 py-3 rounded-md font-medium transition-all duration-300 ${
                  activeTab === 'synthesize' 
                    ? 'bg-cyber-red text-white shadow-lg' 
                    : 'text-gray-400 hover:text-white'
                }`}
                onClick={() => setActiveTab('synthesize')}
              >
                Text to Speech
              </button>
            </div>
          </div>

          {/* Content */}
          <div className="space-y-8">
            {activeTab === 'clone' && <VoiceCloner />}
            {activeTab === 'synthesize' && <TextToSpeech />}
          </div>
        </div>
      </div>

      {/* Footer */}
      <footer className="border-t border-cyber-red/20 py-12">
        <div className="container mx-auto px-4 text-center">
          <p className="text-gray-400">
            © 2024 Audio Forge. Powered by cutting-edge AI technology.
          </p>
        </div>
      </footer>
    </div>
  );
};

export default Index;
