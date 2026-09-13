import React, { useState, useEffect } from 'react';
import {
  Volume2,
  VolumeX,
  Mic,
  MicOff,
  Sparkles,
  Bot,
  X,
  Play,
  RotateCcw,
  Calendar,
  FileCheck,
  ShieldCheck,
  Compass,
  ArrowRight
} from 'lucide-react';
import { AppSettings, PlanItem, ExamPaper, EvaluationScale, MebCalendarReminder } from '../../core/types';
import { JarvisVoiceService, JarvisBriefingData } from '../../services/assistant/jarvisVoiceService';
import { SpeechService } from '../../services/speech/speechService';
import { ActiveTab } from '../common/Navbar';

interface JarvisBriefingModalProps {
  isOpen: boolean;
  onClose: () => void;
  settings: AppSettings;
  plans: PlanItem[];
  exams?: ExamPaper[];
  scales?: EvaluationScale[];
  reminders?: MebCalendarReminder[];
  onNavigate: (tab: ActiveTab) => void;
  onOpenMinutesModal: () => void;
  onExportZip: () => void;
}

export const JarvisBriefingModal: React.FC<JarvisBriefingModalProps> = ({
  isOpen,
  onClose,
  settings,
  plans,
  exams = [],
  scales = [],
  reminders = [],
  onNavigate,
  onOpenMinutesModal,
  onExportZip
}) => {
  const [briefingData, setBriefingData] = useState<JarvisBriefingData | null>(null);
  const [isSpeaking, setIsSpeaking] = useState(false);
  const [isListening, setIsListening] = useState(false);
  const [voiceQuery, setVoiceQuery] = useState('');
  const [jarvisResponse, setJarvisResponse] = useState('');

  useEffect(() => {
    if (isOpen) {
      const data = JarvisVoiceService.generateBriefing(settings, plans, exams, scales, reminders);
      setBriefingData(data);
      setJarvisResponse('');
      setVoiceQuery('');

      // Auto-start speaking briefing
      setIsSpeaking(true);
      JarvisVoiceService.playBriefing(
        data.speechScript,
        () => setIsSpeaking(true),
        () => setIsSpeaking(false)
      );
    } else {
      JarvisVoiceService.stopBriefing();
      setIsSpeaking(false);
      setIsListening(false);
    }
  }, [isOpen]);

  const handleToggleSpeak = () => {
    if (isSpeaking) {
      JarvisVoiceService.stopBriefing();
      setIsSpeaking(false);
    } else if (briefingData) {
      setIsSpeaking(true);
      JarvisVoiceService.playBriefing(
        briefingData.speechScript,
        () => setIsSpeaking(true),
        () => setIsSpeaking(false)
      );
    }
  };

  const handleStartListening = () => {
    if (isListening) {
      SpeechService.stopListening();
      setIsListening(false);
      return;
    }

    JarvisVoiceService.stopBriefing();
    setIsSpeaking(false);
    setIsListening(true);
    setVoiceQuery('Dinleniyor... Lütfen konuşun.');

    SpeechService.startListening(
      (transcript) => {
        setIsListening(false);
        setVoiceQuery(transcript);
        processVoiceCommand(transcript);
      },
      (error) => {
        setIsListening(false);
        setVoiceQuery(`Hata: ${error}`);
      },
      () => {
        setIsListening(false);
      }
    );
  };

  const processVoiceCommand = (cmd: string) => {
    const lower = cmd.toLowerCase();
    let reply = '';

    if (lower.includes('yıllık') || lower.includes('plan')) {
      reply = 'Yıllık planlar modülüne yönlendiriliyorsunuz Hocam.';
      onNavigate('yearly');
      onClose();
    } else if (lower.includes('sınav') || lower.includes('açık uçlu')) {
      reply = 'Açık uçlu sınav hazırlama ekranı açılıyor.';
      onNavigate('exams');
      onClose();
    } else if (lower.includes('zümre') || lower.includes('tutanak')) {
      reply = 'Zümre karar tutanağı düzenleyicisi açılıyor.';
      onClose();
      onOpenMinutesModal();
    } else if (lower.includes('zip') || lower.includes('paket') || lower.includes('indir')) {
      reply = 'Resmi MEB Zümre teslim paketi zip olarak hazırlanıyor.';
      onClose();
      onExportZip();
    } else if (lower.includes('kitap') || lower.includes('kütüphane')) {
      reply = 'Tarih ders kitapları ve kütüphane açılıyor.';
      onNavigate('library');
      onClose();
    } else {
      reply = `Komutunuz algılandı: "${cmd}". Maarif Modeline göre planlama ve sınav hazırlama işlemlerinize devam edebilirsiniz.`;
    }

    setJarvisResponse(reply);
    SpeechService.speak(reply);
  };

  if (!isOpen || !briefingData) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 bg-slate-950/75 backdrop-blur-lg animate-in fade-in duration-200">
      <div className="relative w-full max-w-2xl bg-gradient-to-b from-slate-900 via-slate-900 to-indigo-950 text-white rounded-3xl shadow-[0_25px_70px_rgba(12,140,233,0.35)] border border-sky-500/30 overflow-hidden flex flex-col">
        {/* Top Holographic Bar */}
        <div className="p-5 bg-gradient-to-r from-sky-900/60 via-indigo-900/60 to-purple-900/60 border-b border-sky-500/20 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-gradient-to-tr from-sky-500 via-indigo-500 to-purple-600 flex items-center justify-center shadow-[0_0_20px_rgba(56,189,248,0.5)] border border-white/30">
              <Bot className="w-5 h-5 text-white" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="font-extrabold text-base tracking-tight text-sky-100">
                  Maarif Jarvis Sesli Asistan
                </h3>
                <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-sky-500/20 text-sky-300 border border-sky-400/30">
                  Aktif HUD
                </span>
              </div>
              <p className="text-xs text-sky-300/80">
                {settings.schoolName} • Akıllı Tarih Komuta Merkezi
              </p>
            </div>
          </div>
          <button
            onClick={() => {
              JarvisVoiceService.stopBriefing();
              onClose();
            }}
            className="p-2 rounded-xl text-slate-400 hover:text-white hover:bg-white/10 transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Center: Hologram Equalizer Waveform */}
        <div className="p-6 flex flex-col items-center justify-center relative overflow-hidden bg-radial from-sky-500/10 via-transparent to-transparent">
          {/* Circular Cyber Ring */}
          <div className="relative w-32 h-32 flex items-center justify-center">
            <div
              className={`absolute inset-0 rounded-full border-2 border-sky-400/40 border-dashed ${
                isSpeaking ? 'animate-spin-slow' : ''
              }`}
            />
            <div
              className={`absolute inset-2 rounded-full border border-indigo-400/50 ${
                isSpeaking ? 'animate-pulse scale-105' : ''
              }`}
            />
            <div className="w-20 h-20 rounded-full bg-gradient-to-tr from-sky-600 to-indigo-600 flex items-center justify-center shadow-[0_0_35px_rgba(12,140,233,0.6)]">
              {isSpeaking ? (
                <Volume2 className="w-8 h-8 text-white animate-bounce" />
              ) : (
                <Bot className="w-8 h-8 text-white" />
              )}
            </div>
          </div>

          {/* Dynamic Audio Equalizer Bars */}
          <div className="flex items-center gap-1.5 mt-5 h-8">
            {[40, 75, 100, 60, 90, 45, 80, 100, 70, 50, 85, 30].map((h, i) => (
              <div
                key={i}
                style={{
                  height: isSpeaking ? `${h}%` : '20%',
                  transition: 'height 0.2s ease-in-out'
                }}
                className={`w-1.5 rounded-full bg-gradient-to-t ${
                  isSpeaking
                    ? 'from-sky-500 via-indigo-400 to-purple-400 animate-pulse'
                    : 'from-slate-700 to-slate-600'
                }`}
              />
            ))}
          </div>

          {/* Subtitle / Status */}
          <div className="mt-3 text-center">
            <span className="text-xs font-bold uppercase tracking-widest text-sky-400">
              {isSpeaking ? 'Jarvis Sesli Brifing Veriyor...' : isListening ? 'Sizi Dinliyor...' : 'Sistem Hazır'}
            </span>
          </div>
        </div>

        {/* Transcript Box */}
        <div className="px-6 py-3 bg-slate-950/60 border-t border-b border-sky-500/20 max-h-44 overflow-y-auto">
          <p className="text-xs text-sky-100/90 leading-relaxed font-sans">
            "{briefingData.speechScript}"
          </p>

          {voiceQuery && (
            <div className="mt-2.5 p-2 rounded-lg bg-sky-900/40 border border-sky-400/30 text-xs text-sky-200">
              <strong>Algılanan Ses:</strong> {voiceQuery}
            </div>
          )}

          {jarvisResponse && (
            <div className="mt-2 p-2 rounded-lg bg-indigo-900/40 border border-indigo-400/30 text-xs text-indigo-200 font-semibold">
              <strong>Jarvis Yanıtı:</strong> {jarvisResponse}
            </div>
          )}
        </div>

        {/* Control Action Bar */}
        <div className="p-4 sm:p-5 bg-slate-900/90 flex flex-wrap items-center justify-between gap-3">
          <div className="flex items-center gap-2">
            <button
              onClick={handleToggleSpeak}
              className="flex items-center gap-1.5 px-3.5 py-2 rounded-xl text-xs font-bold bg-sky-500 hover:bg-sky-400 text-slate-950 shadow-md transition-all cursor-pointer"
            >
              {isSpeaking ? (
                <>
                  <VolumeX className="w-4 h-4" />
                  <span>Sustur</span>
                </>
              ) : (
                <>
                  <Play className="w-4 h-4" />
                  <span>Tekrar Oynat</span>
                </>
              )}
            </button>

            <button
              onClick={handleStartListening}
              className={`flex items-center gap-1.5 px-3.5 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                isListening
                  ? 'bg-rose-600 text-white animate-pulse'
                  : 'bg-indigo-600 hover:bg-indigo-500 text-white shadow-md'
              }`}
            >
              {isListening ? (
                <>
                  <MicOff className="w-4 h-4" />
                  <span>Dinlemeyi Bitir</span>
                </>
              ) : (
                <>
                  <Mic className="w-4 h-4" />
                  <span>Sesle Komut Ver</span>
                </>
              )}
            </button>
          </div>

          {/* Quick Shortcuts */}
          <div className="flex items-center gap-2 text-xs">
            <button
              onClick={() => {
                JarvisVoiceService.stopBriefing();
                onClose();
                onNavigate('yearly');
              }}
              className="px-2.5 py-1.5 rounded-lg bg-white/10 hover:bg-white/20 text-sky-200 border border-white/15 transition-all cursor-pointer"
            >
              Yıllık Planlara Git →
            </button>
            <button
              onClick={() => {
                JarvisVoiceService.stopBriefing();
                onClose();
                onNavigate('exams');
              }}
              className="px-2.5 py-1.5 rounded-lg bg-white/10 hover:bg-white/20 text-sky-200 border border-white/15 transition-all cursor-pointer"
            >
              Sınav Hazırla →
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
