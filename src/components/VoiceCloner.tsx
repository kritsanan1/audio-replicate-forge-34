
import { useState, useRef } from "react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Progress } from "@/components/ui/progress";
import { Upload, Mic, Play, Square, Download, Loader2, CheckCircle } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import AudioVisualizer from "./AudioVisualizer";

const VoiceCloner = () => {
  const [isRecording, setIsRecording] = useState(false);
  const [audioFile, setAudioFile] = useState<File | null>(null);
  const [isProcessing, setIsProcessing] = useState(false);
  const [progress, setProgress] = useState(0);
  const [predictionId, setPredictionId] = useState<string | null>(null);
  const [clonedVoice, setClonedVoice] = useState<any | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const { toast } = useToast();

  const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      if (file.type.startsWith('audio/')) {
        setAudioFile(file);
        toast({
          title: "Audio file uploaded",
          description: `${file.name} ready for processing`,
        });
      } else {
        toast({
          title: "Invalid file type",
          description: "Please upload an audio file",
          variant: "destructive",
        });
      }
    }
  };

  const startRecording = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      const mediaRecorder = new MediaRecorder(stream);
      const chunks: BlobPart[] = [];

      mediaRecorder.ondataavailable = (event) => {
        chunks.push(event.data);
      };

      mediaRecorder.onstop = () => {
        const blob = new Blob(chunks, { type: 'audio/wav' });
        const file = new File([blob], 'recording.wav', { type: 'audio/wav' });
        setAudioFile(file);
        stream.getTracks().forEach(track => track.stop());
      };

      mediaRecorderRef.current = mediaRecorder;
      mediaRecorder.start();
      setIsRecording(true);

      toast({
        title: "Recording started",
        description: "Speak clearly into your microphone",
      });
    } catch (error) {
      toast({
        title: "Recording failed",
        description: "Please check your microphone permissions",
        variant: "destructive",
      });
    }
  };

  const stopRecording = () => {
    if (mediaRecorderRef.current && isRecording) {
      mediaRecorderRef.current.stop();
      setIsRecording(false);
      toast({
        title: "Recording stopped",
        description: "Audio captured successfully",
      });
    }
  };

  const convertFileToBase64 = (file: File): Promise<string> => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = () => {
        const base64 = reader.result as string;
        // Remove data URL prefix (data:audio/wav;base64,)
        const base64Data = base64.split(',')[1];
        resolve(base64Data);
      };
      reader.onerror = reject;
      reader.readAsDataURL(file);
    });
  };

  const checkPredictionStatus = async (id: string) => {
    try {
      const { data, error } = await supabase.functions.invoke('voice-clone', {
        body: { action: 'status', predictionId: id }
      });

      if (error) throw error;

      const prediction = data;
      
      if (prediction.status === 'processing') {
        setProgress(prev => Math.min(prev + 10, 90));
        setTimeout(() => checkPredictionStatus(id), 2000);
      } else if (prediction.status === 'succeeded') {
        setProgress(100);
        setClonedVoice(prediction.output);
        setPreviewUrl(prediction.output.preview);
        setIsProcessing(false);
        toast({
          title: "Voice cloned successfully!",
          description: `Voice ID: ${prediction.output.voice_id}`,
        });
      } else if (prediction.status === 'failed') {
        setIsProcessing(false);
        setProgress(0);
        toast({
          title: "Voice cloning failed",
          description: prediction.logs || "Please try again with a different audio file",
          variant: "destructive",
        });
      }
    } catch (error) {
      console.error('Status check error:', error);
      setTimeout(() => checkPredictionStatus(id), 5000); // Retry after 5 seconds
    }
  };

  const processVoiceCloning = async () => {
    if (!audioFile) {
      toast({
        title: "No audio file",
        description: "Please upload or record audio first",
        variant: "destructive",
      });
      return;
    }

    setIsProcessing(true);
    setProgress(10);
    setClonedVoice(null);
    setPreviewUrl(null);

    try {
      const audioData = await convertFileToBase64(audioFile);
      
      const { data, error } = await supabase.functions.invoke('voice-clone', {
        body: {
          action: 'clone',
          audioData,
          fileName: audioFile.name
        }
      });

      if (error) throw error;

      const prediction = data;
      setPredictionId(prediction.id);
      setProgress(20);

      // Start polling for status
      setTimeout(() => checkPredictionStatus(prediction.id), 2000);

    } catch (error: any) {
      setIsProcessing(false);
      setProgress(0);
      toast({
        title: "Cloning failed",
        description: error.message || "Please try again with a different audio file",
        variant: "destructive",
      });
    }
  };

  const playPreview = () => {
    if (previewUrl) {
      const audio = new Audio(previewUrl);
      audio.play().catch(console.error);
    }
  };

  return (
    <div className="space-y-6">
      <Card className="cyber-card">
        <h3 className="text-2xl font-bold mb-6 neon-text">Voice Input</h3>
        
        <div className="grid md:grid-cols-2 gap-6">
          {/* File Upload */}
          <div className="space-y-4">
            <h4 className="text-lg font-semibold text-cyber-orange">Upload Audio File</h4>
            <div 
              className="border-2 border-dashed border-cyber-red/30 rounded-lg p-8 text-center hover:border-cyber-red/60 transition-colors cursor-pointer"
              onClick={() => fileInputRef.current?.click()}
            >
              <Upload className="w-12 h-12 text-cyber-red mx-auto mb-4" />
              <p className="text-gray-300 mb-2">
                {audioFile ? audioFile.name : "Click to upload audio file"}
              </p>
              <p className="text-sm text-gray-500">
                Supports MP3, WAV, M4A files (max 10MB)
              </p>
            </div>
            <Input
              ref={fileInputRef}
              type="file"
              accept="audio/*"
              onChange={handleFileUpload}
              className="hidden"
            />
          </div>

          {/* Recording */}
          <div className="space-y-4">
            <h4 className="text-lg font-semibold text-cyber-orange">Record Audio</h4>
            <div className="border-2 border-dashed border-cyber-orange/30 rounded-lg p-8 text-center">
              <Mic className={`w-12 h-12 mx-auto mb-4 ${isRecording ? 'text-cyber-red animate-pulse' : 'text-cyber-orange'}`} />
              <p className="text-gray-300 mb-4">
                {isRecording ? "Recording... Click stop when done" : "Record your voice sample"}
              </p>
              <Button
                onClick={isRecording ? stopRecording : startRecording}
                className={isRecording ? "bg-cyber-red hover:bg-cyber-red/80" : "cyber-button"}
              >
                {isRecording ? <Square className="w-4 h-4 mr-2" /> : <Mic className="w-4 h-4 mr-2" />}
                {isRecording ? "Stop Recording" : "Start Recording"}
              </Button>
            </div>
          </div>
        </div>

        {audioFile && (
          <div className="mt-6 p-4 bg-cyber-gray rounded-lg">
            <div className="flex items-center justify-between mb-2">
              <span className="text-sm text-gray-300">Audio Preview</span>
              <span className="text-sm text-cyber-orange">{audioFile.name}</span>
            </div>
            <AudioVisualizer />
          </div>
        )}
      </Card>

      <Card className="cyber-card">
        <h3 className="text-2xl font-bold mb-6 neon-text">Voice Processing</h3>
        
        {isProcessing && (
          <div className="space-y-4 mb-6">
            <div className="flex items-center justify-between">
              <span className="text-cyber-orange">Processing voice...</span>
              <span className="text-sm text-gray-400">{Math.round(progress)}%</span>
            </div>
            <Progress value={progress} className="h-2" />
            <div className="flex items-center space-x-2 text-sm text-gray-400">
              <Loader2 className="w-4 h-4 animate-spin" />
              <span>Analyzing audio patterns and generating voice model...</span>
            </div>
          </div>
        )}

        <div className="flex flex-col sm:flex-row gap-4">
          <Button
            onClick={processVoiceCloning}
            disabled={!audioFile || isProcessing}
            className="cyber-button flex-1"
          >
            {isProcessing ? (
              <>
                <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                Processing...
              </>
            ) : (
              <>
                <Upload className="w-4 h-4 mr-2" />
                Clone Voice
              </>
            )}
          </Button>

          {previewUrl && (
            <Button
              onClick={playPreview}
              variant="outline"
              className="border-cyber-green text-cyber-green hover:bg-cyber-green hover:text-white"
            >
              <Play className="w-4 h-4 mr-2" />
              Play Preview
            </Button>
          )}
        </div>

        {clonedVoice && (
          <div className="mt-6 p-4 bg-gradient-to-r from-cyber-red/10 to-cyber-orange/10 border border-cyber-red/30 rounded-lg">
            <div className="flex items-center space-x-2 mb-2">
              <CheckCircle className="w-5 h-5 text-cyber-green" />
              <span className="text-cyber-green font-semibold">Voice Clone Ready</span>
            </div>
            <p className="text-sm text-gray-300">
              Voice ID: <code className="bg-cyber-gray px-2 py-1 rounded text-cyber-orange">{clonedVoice.voice_id}</code>
            </p>
            <p className="text-sm text-gray-400 mt-2">
              Your voice has been successfully cloned and is ready for text-to-speech synthesis.
            </p>
          </div>
        )}
      </Card>
    </div>
  );
};

export default VoiceCloner;
