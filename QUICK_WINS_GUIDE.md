# Quick Wins Implementation Guide

This guide provides immediate, low-risk improvements that can be implemented right away to improve the Audio Forge project structure.

## 🚀 Immediate Improvements (30 minutes each)

### 1. Extract Constants (30 min)

Create a constants file to centralize configuration:

```typescript
// src/shared/constants/audio.constants.ts
export const AUDIO_CONFIG = {
  MAX_FILE_SIZE: 10 * 1024 * 1024, // 10MB
  SUPPORTED_FORMATS: ['mp3', 'wav', 'm4a', 'audio/mp3', 'audio/wav', 'audio/m4a'],
  SAMPLE_RATE: 44100,
  MAX_DURATION: 300, // 5 minutes
  MIN_DURATION: 1, // 1 second
} as const;

export const UI_CONFIG = {
  TOAST_DURATION: 5000,
  PROGRESS_UPDATE_INTERVAL: 2000,
  ANIMATION_DURATION: 300,
} as const;

export const API_CONFIG = {
  RETRY_ATTEMPTS: 3,
  TIMEOUT: 30000,
  POLLING_INTERVAL: 2000,
} as const;
```

**Benefits**: Centralized configuration, easier maintenance, no magic numbers

### 2. Create Utility Functions (45 min)

Extract common utility functions:

```typescript
// src/shared/utils/audio.utils.ts
export const validateAudioFile = (file: File): { isValid: boolean; error?: string } => {
  if (!file.type.startsWith('audio/')) {
    return { isValid: false, error: 'Please upload an audio file' };
  }
  
  if (file.size > AUDIO_CONFIG.MAX_FILE_SIZE) {
    return { isValid: false, error: 'File size must be less than 10MB' };
  }
  
  return { isValid: true };
};

export const formatFileSize = (bytes: number): string => {
  if (bytes === 0) return '0 Bytes';
  const k = 1024;
  const sizes = ['Bytes', 'KB', 'MB', 'GB'];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
};

export const formatDuration = (seconds: number): string => {
  const mins = Math.floor(seconds / 60);
  const secs = Math.floor(seconds % 60);
  return `${mins}:${secs.toString().padStart(2, '0')}`;
};
```

**Benefits**: Reusable functions, consistent validation, better error messages

### 3. Extract Custom Hooks (60 min)

Create reusable hooks for common functionality:

```typescript
// src/shared/hooks/useFileUpload.ts
export const useFileUpload = (onFileSelect: (file: File) => void) => {
  const fileInputRef = useRef<HTMLInputElement>(null);
  
  const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      const validation = validateAudioFile(file);
      if (validation.isValid) {
        onFileSelect(file);
      } else {
        toast({
          title: "Invalid file",
          description: validation.error,
          variant: "destructive",
        });
      }
    }
  };
  
  const triggerFileSelect = () => {
    fileInputRef.current?.click();
  };
  
  return { fileInputRef, handleFileUpload, triggerFileSelect };
};

// src/shared/hooks/useAudioRecording.ts
export const useAudioRecording = () => {
  const [isRecording, setIsRecording] = useState(false);
  const [recordedFile, setRecordedFile] = useState<File | null>(null);
  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  
  const startRecording = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      const mediaRecorder = new MediaRecorder(stream);
      const chunks: BlobPart[] = [];

      mediaRecorder.ondataavailable = (event) => chunks.push(event.data);
      mediaRecorder.onstop = () => {
        const blob = new Blob(chunks, { type: 'audio/wav' });
        const file = new File([blob], 'recording.wav', { type: 'audio/wav' });
        setRecordedFile(file);
        stream.getTracks().forEach(track => track.stop());
      };

      mediaRecorderRef.current = mediaRecorder;
      mediaRecorder.start();
      setIsRecording(true);
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
    }
  };
  
  return { isRecording, recordedFile, startRecording, stopRecording };
};
```

**Benefits**: Reusable logic, cleaner components, easier testing

## 🎯 Medium Impact Improvements (1-2 hours each)

### 4. Create Service Layer (90 min)

Extract API calls into dedicated services:

```typescript
// src/shared/services/voice-cloning.service.ts
import { supabase } from '@/integrations/supabase/client';

export class VoiceCloningService {
  static async cloneVoice(audioData: string, fileName: string) {
    const { data, error } = await supabase.functions.invoke('voice-clone', {
      body: { action: 'clone', audioData, fileName }
    });
    
    if (error) throw new Error(error.message);
    return data;
  }
  
  static async checkStatus(predictionId: string) {
    const { data, error } = await supabase.functions.invoke('voice-clone', {
      body: { action: 'status', predictionId }
    });
    
    if (error) throw new Error(error.message);
    return data;
  }
  
  static async uploadAudio(file: File): Promise<string> {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = () => {
        const base64 = reader.result as string;
        const base64Data = base64.split(',')[1];
        resolve(base64Data);
      };
      reader.onerror = reject;
      reader.readAsDataURL(file);
    });
  }
}
```

**Benefits**: Centralized API logic, easier testing, better error handling

### 5. Improve Error Handling (60 min)

Create consistent error handling:

```typescript
// src/shared/components/common/ErrorBoundary.tsx
export class ErrorBoundary extends React.Component<
  { children: React.ReactNode; fallback?: React.ComponentType<{ error: Error }> },
  { hasError: boolean; error?: Error }
> {
  constructor(props: any) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError(error: Error) {
    return { hasError: true, error };
  }

  componentDidCatch(error: Error, errorInfo: React.ErrorInfo) {
    console.error('Error caught by boundary:', error, errorInfo);
  }

  render() {
    if (this.state.hasError) {
      const FallbackComponent = this.props.fallback || DefaultErrorFallback;
      return <FallbackComponent error={this.state.error!} />;
    }

    return this.props.children;
  }
}

const DefaultErrorFallback = ({ error }: { error: Error }) => (
  <div className="p-6 text-center">
    <h2 className="text-xl font-bold text-red-500 mb-2">Something went wrong</h2>
    <p className="text-gray-600 mb-4">{error.message}</p>
    <Button onClick={() => window.location.reload()}>Reload Page</Button>
  </div>
);
```

**Benefits**: Better user experience, easier debugging, graceful error handling

### 6. Add Loading States (45 min)

Create consistent loading components:

```typescript
// src/shared/components/common/LoadingSpinner.tsx
interface LoadingSpinnerProps {
  size?: 'sm' | 'md' | 'lg';
  message?: string;
  className?: string;
}

export const LoadingSpinner = ({ 
  size = 'md', 
  message, 
  className 
}: LoadingSpinnerProps) => {
  const sizeClasses = {
    sm: 'w-4 h-4',
    md: 'w-8 h-8',
    lg: 'w-12 h-12'
  };

  return (
    <div className={cn('flex flex-col items-center justify-center', className)}>
      <Loader2 className={cn('animate-spin text-cyber-red', sizeClasses[size])} />
      {message && (
        <p className="mt-2 text-sm text-gray-400">{message}</p>
      )}
    </div>
  );
};

// src/shared/components/common/LoadingOverlay.tsx
export const LoadingOverlay = ({ 
  isLoading, 
  message, 
  children 
}: {
  isLoading: boolean;
  message?: string;
  children: React.ReactNode;
}) => {
  return (
    <div className="relative">
      {children}
      {isLoading && (
        <div className="absolute inset-0 bg-black/50 flex items-center justify-center rounded-lg">
          <LoadingSpinner size="lg" message={message} />
        </div>
      )}
    </div>
  );
};
```

**Benefits**: Consistent loading states, better UX, reusable components

## 📋 Implementation Order

1. **Start with Constants** - Lowest risk, immediate benefit
2. **Add Utility Functions** - Improves code quality
3. **Extract Custom Hooks** - Reduces component complexity
4. **Create Service Layer** - Better architecture
5. **Add Error Handling** - Improves reliability
6. **Implement Loading States** - Better user experience

## 🔍 Testing Each Improvement

After each improvement:

1. **Verify Functionality**: Ensure all features still work
2. **Check TypeScript**: No compilation errors
3. **Test User Flows**: Voice cloning and TTS workflows
4. **Review Performance**: No performance regressions

## 📈 Measuring Success

Track these metrics after implementation:

- **Code Quality**: Reduced file sizes, better organization
- **Developer Experience**: Faster development, easier debugging
- **User Experience**: Better error messages, loading states
- **Maintainability**: Easier to add new features

Each of these improvements can be implemented independently and will provide immediate value while setting the foundation for larger structural changes.