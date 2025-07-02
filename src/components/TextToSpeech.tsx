import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Play, Download, Loader2, Volume2 } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { useClonedVoices } from "@/hooks/useClonedVoices";
import { supabase } from "@/integrations/supabase/client";
import AudioVisualizer from "./AudioVisualizer";

const TextToSpeech = () => {
  const [text, setText] = useState("");
  const [selectedVoice, setSelectedVoice] = useState<string>("");
  const [isGenerating, setIsGenerating] = useState(false);
  const [audioUrl, setAudioUrl] = useState<string | null>(null);
  const [predictionId, setPredictionId] = useState<string | null>(null);
  const [progress, setProgress] = useState(0);
  const { toast } = useToast();
  const { data: clonedVoices = [], isLoading: voicesLoading } = useClonedVoices();

  const checkSynthesisStatus = async (id: string) => {
    try {
      const { data, error } = await supabase.functions.invoke('voice-clone', {
        body: { action: 'status', predictionId: id }
      });

      if (error) throw error;

      const prediction = data;
      
      if (prediction.status === 'processing') {
        setProgress(prev => Math.min(prev + 10, 90));
        setTimeout(() => checkSynthesisStatus(id), 2000);
      } else if (prediction.status === 'succeeded') {
        setProgress(100);
        setAudioUrl(prediction.output);
        setIsGenerating(false);
        toast({
          title: "Speech generated successfully!",
          description: "Your text has been converted to speech using your cloned voice",
        });
      } else if (prediction.status === 'failed') {
        setIsGenerating(false);
        setProgress(0);
        toast({
          title: "Speech generation failed",
          description: prediction.logs || "Please try again with different text",
          variant: "destructive",
        });
      }
    } catch (error) {
      console.error('Status check error:', error);
      setTimeout(() => checkSynthesisStatus(id), 5000); // Retry after 5 seconds
    }
  };

  const generateSpeech = async () => {
    if (!text.trim()) {
      toast({
        title: "No text provided",
        description: "Please enter some text to convert to speech",
        variant: "destructive",
      });
      return;
    }

    if (!selectedVoice) {
      toast({
        title: "No voice selected",
        description: "Please select a cloned voice first",
        variant: "destructive",
      });
      return;
    }

    if (text.length > 5000) {
      toast({
        title: "Text too long",
        description: "Please limit your text to 5000 characters or less",
        variant: "destructive",
      });
      return;
    }

    setIsGenerating(true);
    setProgress(10);
    setAudioUrl(null);
    
    try {
      const { data, error } = await supabase.functions.invoke('voice-clone', {
        body: {
          action: 'synthesize',
          text: text,
          voice_id: selectedVoice,
          speed: 1.0,
          volume: 1.0,
          pitch: 0,
          emotion: "neutral"
        }
      });

      if (error) throw error;

      const prediction = data;
      setPredictionId(prediction.id);
      setProgress(20);

      // Start polling for status
      setTimeout(() => checkSynthesisStatus(prediction.id), 2000);

    } catch (error: any) {
      setIsGenerating(false);
      setProgress(0);
      toast({
        title: "Generation failed",
        description: error.message || "Please try again with different text",
        variant: "destructive",
      });
    }
  };

  const playAudio = () => {
    if (audioUrl) {
      const audio = new Audio(audioUrl);
      audio.play().catch(console.error);
    }
  };

  const downloadAudio = () => {
    if (audioUrl) {
      const link = document.createElement('a');
      link.href = audioUrl;
      link.download = 'generated-speech.mp3';
      link.click();
    }
  };

  return (
    <div className="space-y-6">
      <Card className="cyber-card">
        <h3 className="text-2xl font-bold mb-6 neon-text">Text to Speech</h3>
        
        <div className="space-y-6">
          {/* Voice Selection */}
          <div className="space-y-2">
            <label className="text-lg font-semibold text-cyber-orange">Select Cloned Voice</label>
            <Select value={selectedVoice} onValueChange={setSelectedVoice}>
              <SelectTrigger className="bg-cyber-gray border-cyber-red/30 text-white">
                <SelectValue placeholder={voicesLoading ? "Loading voices..." : "Choose a cloned voice"} />
              </SelectTrigger>
              <SelectContent className="bg-cyber-gray border-cyber-red/30">
                {clonedVoices.length === 0 ? (
                  <SelectItem value="none" disabled>
                    No cloned voices available. Clone a voice first!
                  </SelectItem>
                ) : (
                  clonedVoices.map((voice) => (
                    <SelectItem key={voice.id} value={voice.voice_id}>
                      <div className="flex items-center space-x-2">
                        <Volume2 className="w-4 h-4" />
                        <span>{voice.name}</span>
                        <span className="text-xs text-gray-400">
                          ({new Date(voice.created_at).toLocaleDateString()})
                        </span>
                      </div>
                    </SelectItem>
                  ))
                )}
              </SelectContent>
            </Select>
          </div>

          {/* Text Input */}
          <div className="space-y-2">
            <label className="text-lg font-semibold text-cyber-orange">Text to Convert</label>
            <Textarea
              value={text}
              onChange={(e) => setText(e.target.value)}
              placeholder="Enter the text you want to convert to speech using your cloned voice... Use <#2.5#> for pauses (e.g., Hello <#1.0#> world)"
              className="min-h-32 bg-cyber-gray border-cyber-red/30 text-white placeholder:text-gray-400 resize-none"
              maxLength={5000}
            />
            <div className="text-right text-sm text-gray-400">
              {text.length}/5000 characters
            </div>
          </div>

          {/* Processing Progress */}
          {isGenerating && (
            <div className="space-y-4 p-4 bg-gradient-to-r from-cyber-orange/10 to-cyber-amber/10 border border-cyber-orange/30 rounded-lg">
              <div className="flex items-center justify-between">
                <span className="text-cyber-orange">Generating speech...</span>
                <span className="text-sm text-gray-400">{Math.round(progress)}%</span>
              </div>
              <div className="w-full bg-cyber-gray rounded-full h-2">
                <div 
                  className="bg-gradient-to-r from-cyber-orange to-cyber-amber h-2 rounded-full transition-all duration-300"
                  style={{ width: `${progress}%` }}
                />
              </div>
              <div className="flex items-center space-x-2 text-sm text-gray-400">
                <Loader2 className="w-4 h-4 animate-spin" />
                <span>Converting text to speech using your cloned voice...</span>
              </div>
            </div>
          )}

          {/* Generate Button */}
          <Button
            onClick={generateSpeech}
            disabled={isGenerating || !text.trim() || !selectedVoice}
            className="cyber-button w-full"
          >
            {isGenerating ? (
              <>
                <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                Generating Speech...
              </>
            ) : (
              <>
                <Volume2 className="w-4 h-4 mr-2" />
                Generate Speech
              </>
            )}
          </Button>

          {/* Audio Output */}
          {audioUrl && (
            <div className="space-y-4 p-4 bg-gradient-to-r from-cyber-green/10 to-cyber-amber/10 border border-cyber-green/30 rounded-lg">
              <div className="flex items-center space-x-2 mb-2">
                <div className="w-2 h-2 bg-cyber-green rounded-full animate-pulse" />
                <span className="text-cyber-green font-semibold">Speech Generated</span>
              </div>
              
              <AudioVisualizer />
              
              <div className="flex gap-3">
                <Button
                  onClick={playAudio}
                  variant="outline"
                  className="border-cyber-green text-cyber-green hover:bg-cyber-green hover:text-white flex-1"
                >
                  <Play className="w-4 h-4 mr-2" />
                  Play Audio
                </Button>
                <Button
                  onClick={downloadAudio}
                  variant="outline"
                  className="border-cyber-amber text-cyber-amber hover:bg-cyber-amber hover:text-white flex-1"
                >
                  <Download className="w-4 h-4 mr-2" />
                  Download MP3
                </Button>
              </div>
            </div>
          )}
        </div>
      </Card>
    </div>
  );
};

export default TextToSpeech;