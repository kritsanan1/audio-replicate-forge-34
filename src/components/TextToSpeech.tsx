
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Play, Download, Loader2, Volume2 } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { useClonedVoices } from "@/hooks/useClonedVoices";
import AudioVisualizer from "./AudioVisualizer";

const TextToSpeech = () => {
  const [text, setText] = useState("");
  const [selectedVoice, setSelectedVoice] = useState<string>("");
  const [isGenerating, setIsGenerating] = useState(false);
  const [audioUrl, setAudioUrl] = useState<string | null>(null);
  const { toast } = useToast();
  const { data: clonedVoices = [], isLoading: voicesLoading } = useClonedVoices();

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

    setIsGenerating(true);
    
    try {
      // This would connect to a text-to-speech service using the cloned voice
      // For now, we'll simulate the process
      await new Promise(resolve => setTimeout(resolve, 3000));
      
      // Mock audio URL - in real implementation, this would come from the TTS service
      setAudioUrl("https://www.soundjay.com/misc/sounds/bell-ringing-05.wav");
      
      toast({
        title: "Speech generated successfully!",
        description: "Your text has been converted to speech using your cloned voice",
      });
    } catch (error) {
      toast({
        title: "Generation failed",
        description: "Failed to generate speech. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsGenerating(false);
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
      link.download = 'generated-speech.wav';
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
              placeholder="Enter the text you want to convert to speech using your cloned voice..."
              className="min-h-32 bg-cyber-gray border-cyber-red/30 text-white placeholder:text-gray-400 resize-none"
              maxLength={1000}
            />
            <div className="text-right text-sm text-gray-400">
              {text.length}/1000 characters
            </div>
          </div>

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
                  Download
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
