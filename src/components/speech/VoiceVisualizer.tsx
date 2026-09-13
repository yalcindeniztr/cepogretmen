import React from 'react';
import { Volume2, Mic, Square } from 'lucide-react';
import { SpeechService } from '../../services/speech/speechService';

interface VoiceVisualizerProps {
  isSpeaking: boolean;
  isListening: boolean;
  onStopSpeaking: () => void;
  onStopListening: () => void;
  currentSpokenText?: string;
}

export const VoiceVisualizer: React.FC<VoiceVisualizerProps> = ({
  isSpeaking,
  isListening,
  onStopSpeaking,
  onStopListening,
  currentSpokenText
}) => {
  if (!isSpeaking && !isListening) return null;

  return (
    <div className="fixed bottom-6 right-6 z-50 flex items-center gap-3 bg-white/95 backdrop-blur-md border border-maarif-300 p-4 rounded-2xl shadow-[0_10px_30px_rgba(12,140,233,0.3),-4px_-4px_12px_rgba(255,255,255,0.9)] transition-all animate-bounce-short max-w-md">
      <div className={`p-2.5 rounded-xl text-white ${isListening ? 'bg-rose-500 animate-pulse' : 'bg-maarif-500'}`}>
        {isListening ? <Mic className="w-5 h-5 animate-spin-slow" /> : <Volume2 className="w-5 h-5 animate-pulse" />}
      </div>

      <div className="flex-1 min-w-0">
        <div className="flex items-center gap-2">
          <span className="text-xs font-bold uppercase tracking-wider text-maarif-700">
            {isListening ? 'Sesinizi Dinliyor...' : 'Maarif Asistanı Konuşuyor'}
          </span>
          {/* Animated audio wave bars */}
          <div className="flex items-center gap-0.5 h-3">
            <span className="w-1 h-3 bg-maarif-500 rounded-full animate-pulse" />
            <span className="w-1 h-2 bg-maarif-400 rounded-full animate-pulse delay-75" />
            <span className="w-1 h-4 bg-maarif-600 rounded-full animate-pulse delay-150" />
            <span className="w-1 h-1.5 bg-maarif-300 rounded-full animate-pulse" />
          </div>
        </div>
        {currentSpokenText && (
          <p className="text-xs text-slate-600 truncate mt-0.5">
            "{currentSpokenText}"
          </p>
        )}
      </div>

      <button
        onClick={isSpeaking ? onStopSpeaking : onStopListening}
        className="p-2 rounded-xl bg-slate-100 hover:bg-rose-100 text-slate-600 hover:text-rose-600 transition-colors shadow-sm"
        title="Durdur"
      >
        <Square className="w-4 h-4" />
      </button>
    </div>
  );
};
