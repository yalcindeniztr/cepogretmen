import React, { useState, useRef, useEffect } from 'react';
import {
  Bot,
  Send,
  Mic,
  Volume2,
  VolumeX,
  Sparkles,
  HelpCircle,
  BookOpen,
  Calendar,
  CheckCircle2,
  Lightbulb
} from 'lucide-react';
import { AppSettings } from '../../core/types';
import { GeminiService } from '../../services/ai/geminiService';
import { SpeechService } from '../../services/speech/speechService';
import { EmbossedCard } from '../../components/3d/EmbossedCard';
import { EmbossedButton } from '../../components/3d/EmbossedButton';

interface Message {
  id: string;
  sender: 'user' | 'assistant';
  text: string;
  time: string;
}

interface MaarifAssistantViewProps {
  settings: AppSettings;
}

export const MaarifAssistantView: React.FC<MaarifAssistantViewProps> = ({ settings }) => {
  const [messages, setMessages] = useState<Message[]>([
    {
      id: 'msg-welcome',
      sender: 'assistant',
      text: `Merhaba Sayın ${settings.teacherName}! Ben ${settings.schoolName} için yapılandırılmış Türkiye Yüzyılı Maarif Modeli ve Tarih Dersi Rehberinizim. MEB mevzuatı, yönetmelikler, yıllık ve günlük ders planları, MEBİ, EBA, OGM materyalleri veya sınav ölçekleri konusunda bana danışabilirsiniz. Dilerseniz mikrofon butonuna basarak konuşabilir, yanıtlarımı sesli olarak dinleyebilirsiniz.`,
      time: 'Şimdi'
    }
  ]);
  const [inputText, setInputText] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [isListening, setIsListening] = useState(false);
  const [autoSpeak, setAutoSpeak] = useState(true);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const handleSendMessage = async (textToSend?: string) => {
    const text = textToSend || inputText;
    if (!text.trim() || isLoading) return;

    const userMsg: Message = {
      id: `user-${Date.now()}`,
      sender: 'user',
      text: text.trim(),
      time: new Date().toLocaleTimeString('tr-TR', { hour: '2-digit', minute: '2-digit' })
    };

    setMessages(prev => [...prev, userMsg]);
    setInputText('');
    setIsLoading(true);

    try {
      const response = await GeminiService.askMaarifAssistant(userMsg.text, settings.geminiApiKey);
      const assistantMsg: Message = {
        id: `ai-${Date.now()}`,
        sender: 'assistant',
        text: response,
        time: new Date().toLocaleTimeString('tr-TR', { hour: '2-digit', minute: '2-digit' })
      };
      setMessages(prev => [...prev, assistantMsg]);

      if (autoSpeak) {
        SpeechService.speak(response);
      }
    } catch (e) {
      console.error(e);
      setMessages(prev => [
        ...prev,
        {
          id: `ai-err-${Date.now()}`,
          sender: 'assistant',
          text: 'Üzgünüm, şu anda yanıt oluşturulurken bir aksaklık oluştu. Lütfen sorunuzu tekrar deneyiniz.',
          time: 'Şimdi'
        }
      ]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleMicListen = () => {
    if (isListening) return;
    setIsListening(true);

    SpeechService.startListening(
      (transcript) => {
        setIsListening(false);
        setInputText(transcript);
        handleSendMessage(transcript);
      },
      (err) => {
        setIsListening(false);
        alert(`Ses algılama hatası: ${err}`);
      },
      () => {
        setIsListening(false);
      }
    );
  };

  const handleSpeakText = (text: string) => {
    SpeechService.speak(text);
  };

  const sampleQuestions = [
    'Maarif Modeli 9. sınıf Tarih dersinde hangi beceriler öne çıkar?',
    'MEB yönetmeliğine göre ortak sınavlarda soru hazırlama kuralları nelerdir?',
    'Ders içi etkinliklere katılım puanı verirken hangi ölçekler zorunludur?',
    'Zümre öğretmenler kurulunda hangi kararların alınması şarttır?',
    'Tarih dersinde MEBİ ve OGM Materyal nasıl verimli kullanılır?'
  ];

  return (
    <div className="space-y-6 pb-12">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 flex items-center gap-2.5">
            <Bot className="w-7 h-7 text-purple-600" />
            <span>Yapay Zeka Maarif Rehberi & Sesli Asistan</span>
          </h1>
          <p className="text-xs sm:text-sm text-slate-600 mt-1">
            MEB mevzuatı, Maarif planları, erdem-değer çerçevesi ve ders materyalleri uzmanınız.
          </p>
        </div>

        {/* Audio Toggle */}
        <div className="flex items-center gap-2 bg-white px-3 py-1.5 rounded-xl border border-slate-200 shadow-sm">
          <button
            onClick={() => setAutoSpeak(!autoSpeak)}
            className={`flex items-center gap-1.5 text-xs font-bold cursor-pointer transition-colors ${
              autoSpeak ? 'text-purple-700' : 'text-slate-400'
            }`}
          >
            {autoSpeak ? <Volume2 className="w-4 h-4 text-purple-600" /> : <VolumeX className="w-4 h-4" />}
            <span>Sesli Yanıt: {autoSpeak ? 'Açık' : 'Kapalı'}</span>
          </button>
        </div>
      </div>

      {/* Main Chat Interface */}
      <div className="bg-white rounded-3xl border border-slate-200 shadow-sm flex flex-col h-[650px] overflow-hidden">
        {/* Messages Scroll Area */}
        <div className="flex-1 p-4 sm:p-6 overflow-y-auto space-y-4 bg-slate-50/50">
          {messages.map((msg) => {
            const isMe = msg.sender === 'user';
            return (
              <div
                key={msg.id}
                className={`flex gap-3 ${isMe ? 'justify-end' : 'justify-start'}`}
              >
                {!isMe && (
                  <div className="w-9 h-9 rounded-2xl bg-gradient-to-tr from-purple-600 to-indigo-500 text-white flex items-center justify-center shrink-0 shadow-md">
                    <Bot className="w-5 h-5" />
                  </div>
                )}

                <div
                  className={`max-w-2xl rounded-2xl p-4 shadow-xs text-xs sm:text-sm leading-relaxed ${
                    isMe
                      ? 'bg-gradient-to-r from-maarif-600 to-maarif-700 text-white rounded-br-none'
                      : 'bg-white border border-slate-200/80 text-slate-800 rounded-bl-none shadow-[2px_2px_8px_rgba(0,0,0,0.04)]'
                  }`}
                >
                  <p className="whitespace-pre-wrap">{msg.text}</p>

                  <div className="mt-2 flex items-center justify-between text-[10px] text-slate-400 border-t border-slate-100/40 pt-1.5">
                    <span>{msg.time}</span>
                    {!isMe && (
                      <button
                        onClick={() => handleSpeakText(msg.text)}
                        className="inline-flex items-center gap-1 text-purple-600 hover:text-purple-800 font-semibold cursor-pointer"
                      >
                        <Volume2 className="w-3 h-3" />
                        Seslendir
                      </button>
                    )}
                  </div>
                </div>
              </div>
            );
          })}

          {isLoading && (
            <div className="flex gap-3 items-center text-xs text-purple-700 bg-purple-50 p-3 rounded-2xl border border-purple-200 max-w-sm animate-pulse">
              <Bot className="w-4 h-4 animate-spin-slow" />
              <span>Yapay zeka Maarif mevzuatını ve kaynakları inceliyor...</span>
            </div>
          )}

          <div ref={messagesEndRef} />
        </div>

        {/* Suggested Quick Questions */}
        <div className="px-4 py-2.5 bg-slate-100/80 border-t border-slate-200 overflow-x-auto scrollbar-none flex items-center gap-2">
          <span className="text-[11px] font-bold text-slate-500 flex items-center gap-1 shrink-0">
            <Lightbulb className="w-3.5 h-3.5 text-amber-500" /> Örnek Sorular:
          </span>
          {sampleQuestions.map((q, i) => (
            <button
              key={i}
              onClick={() => handleSendMessage(q)}
              className="text-xs px-3 py-1 rounded-xl bg-white border border-slate-200 text-slate-700 hover:bg-purple-50 hover:text-purple-700 hover:border-purple-300 transition-colors whitespace-nowrap cursor-pointer shadow-2xs shrink-0"
            >
              {q}
            </button>
          ))}
        </div>

        {/* Input Bar with Microphone */}
        <div className="p-3 sm:p-4 bg-white border-t border-slate-200 flex items-center gap-2">
          <button
            type="button"
            onClick={handleMicListen}
            className={`p-3 rounded-2xl border cursor-pointer transition-all ${
              isListening
                ? 'bg-rose-500 text-white animate-pulse border-rose-600 shadow-md'
                : 'bg-slate-100 text-slate-700 hover:bg-slate-200 border-slate-200'
            }`}
            title="Mikrofon ile sesli konuşun"
          >
            <Mic className="w-5 h-5" />
          </button>

          <input
            type="text"
            placeholder="Mevzuat, plan, MEBİ, EBA veya Maarif modeli hakkında soru sorun veya sesle konuşun..."
            value={inputText}
            onChange={(e) => setInputText(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === 'Enter') handleSendMessage();
            }}
            className="flex-1 px-4 py-3 text-xs sm:text-sm bg-slate-50 border border-slate-200 rounded-2xl focus:outline-none focus:border-purple-500 transition-colors"
          />

          <EmbossedButton
            variant="purple"
            size="md"
            icon={<Send className="w-4 h-4" />}
            onClick={() => handleSendMessage()}
            disabled={isLoading || !inputText.trim()}
          >
            Gönder
          </EmbossedButton>
        </div>
      </div>
    </div>
  );
};
