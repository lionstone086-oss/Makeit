
import React, { useState, useEffect, useRef } from 'react';
import { GoogleGenAI, Modality } from '@google/genai';
import { Mic, X, Volume2, Pulse } from 'lucide-react';

// Manual Base64 Implementation as per guidelines
function decode(base64: string) {
  const binaryString = atob(base64);
  const bytes = new Uint8Array(binaryString.length);
  for (let i = 0; i < binaryString.length; i++) {
    bytes[i] = binaryString.charCodeAt(i);
  }
  return bytes;
}

function encode(bytes: Uint8Array) {
  let binary = '';
  for (let i = 0; i < bytes.byteLength; i++) {
    binary += String.fromCharCode(bytes[i]);
  }
  return btoa(binary);
}

async function decodeAudioData(data: Uint8Array, ctx: AudioContext, sampleRate: number, numChannels: number): Promise<AudioBuffer> {
  const dataInt16 = new Int16Array(data.buffer);
  const frameCount = dataInt16.length / numChannels;
  const buffer = ctx.createBuffer(numChannels, frameCount, sampleRate);
  for (let channel = 0; channel < numChannels; channel++) {
    const channelData = buffer.getChannelData(channel);
    for (let i = 0; i < frameCount; i++) {
      channelData[i] = dataInt16[i * numChannels + channel] / 32768.0;
    }
  }
  return buffer;
}

const LiveMentor: React.FC<{ onClose: () => void }> = ({ onClose }) => {
  const [isActive, setIsActive] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const sessionRef = useRef<any>(null);
  const audioContextRef = useRef<AudioContext | null>(null);
  const nextStartTimeRef = useRef(0);
  const sourcesRef = useRef<Set<AudioBufferSourceNode>>(new Set());

  const startSession = async () => {
    try {
      const ai = new GoogleGenAI({ apiKey: process.env.API_KEY || '' });
      const inputCtx = new (window.AudioContext || (window as any).webkitAudioContext)({ sampleRate: 16000 });
      const outputCtx = new (window.AudioContext || (window as any).webkitAudioContext)({ sampleRate: 24000 });
      audioContextRef.current = outputCtx;

      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      
      const sessionPromise = ai.live.connect({
        model: 'gemini-2.5-flash-native-audio-preview-12-2025',
        callbacks: {
          onopen: () => {
            setIsActive(true);
            const source = inputCtx.createMediaStreamSource(stream);
            const scriptProcessor = inputCtx.createScriptProcessor(4096, 1, 1);
            scriptProcessor.onaudioprocess = (e) => {
              const inputData = e.inputBuffer.getChannelData(0);
              const int16 = new Int16Array(inputData.length);
              for (let i = 0; i < inputData.length; i++) int16[i] = inputData[i] * 32768;
              const pcmBlob = {
                data: encode(new Uint8Array(int16.buffer)),
                mimeType: 'audio/pcm;rate=16000'
              };
              sessionPromise.then(s => s.sendRealtimeInput({ media: pcmBlob }));
            };
            source.connect(scriptProcessor);
            scriptProcessor.connect(inputCtx.destination);
          },
          onmessage: async (msg) => {
            const base64 = msg.serverContent?.modelTurn?.parts[0]?.inlineData?.data;
            if (base64 && audioContextRef.current) {
              nextStartTimeRef.current = Math.max(nextStartTimeRef.current, audioContextRef.current.currentTime);
              const buffer = await decodeAudioData(decode(base64), audioContextRef.current, 24000, 1);
              const source = audioContextRef.current.createBufferSource();
              source.buffer = buffer;
              source.connect(audioContextRef.current.destination);
              source.start(nextStartTimeRef.current);
              nextStartTimeRef.current += buffer.duration;
              sourcesRef.current.add(source);
              source.onended = () => sourcesRef.current.delete(source);
            }
            if (msg.serverContent?.interrupted) {
              sourcesRef.current.forEach(s => s.stop());
              sourcesRef.current.clear();
              nextStartTimeRef.current = 0;
            }
          },
          onerror: (e) => setError("Connection Error"),
          onclose: () => setIsActive(false)
        },
        config: {
          responseModalities: [Modality.AUDIO],
          speechConfig: { voiceConfig: { prebuiltVoiceConfig: { voiceName: 'Puck' } } },
          systemInstruction: 'You are a helpful hands-on mentor for the MORE skills program. Help the student with technical, trades, or creative projects. Speak concisely.'
        }
      });
      sessionRef.current = await sessionPromise;
    } catch (e) {
      setError(e instanceof Error ? e.message : "Failed to start AI");
    }
  };

  useEffect(() => {
    startSession();
    return () => {
      sessionRef.current?.close();
      audioContextRef.current?.close();
    };
  }, []);

  return (
    <div className="fixed inset-0 bg-slate-900/95 backdrop-blur-xl z-[100] flex flex-col items-center justify-center p-6 text-white text-center animate-in fade-in duration-300">
      <button onClick={onClose} className="absolute top-8 right-8 p-3 hover:bg-white/10 rounded-full transition-colors">
        <X className="w-8 h-8" />
      </button>

      {error ? (
        <div className="space-y-4">
          <p className="text-red-400 font-bold">{error}</p>
          <button onClick={onClose} className="px-8 py-3 bg-white text-slate-900 rounded-2xl font-black">Close</button>
        </div>
      ) : (
        <div className="space-y-12 max-w-sm w-full">
          <div className="relative">
            <div className={`w-48 h-48 rounded-full border-4 border-indigo-500/30 flex items-center justify-center mx-auto transition-all duration-1000 ${isActive ? 'scale-110 shadow-[0_0_80px_rgba(99,102,241,0.5)]' : 'scale-100'}`}>
                <div className={`w-32 h-32 rounded-full bg-gradient-to-tr from-indigo-600 to-blue-500 flex items-center justify-center animate-pulse`}>
                    <Mic className="w-12 h-12" />
                </div>
                {isActive && (
                    <div className="absolute inset-0 flex items-center justify-center">
                        <div className="w-64 h-64 border-2 border-indigo-400/20 rounded-full animate-ping"></div>
                    </div>
                )}
            </div>
          </div>

          <div className="space-y-2">
            <h2 className="text-3xl font-black">{isActive ? 'AI Mentor is Live' : 'Connecting...'}</h2>
            <p className="text-slate-400 font-medium">{isActive ? 'Go ahead, ask about your current project!' : 'Waking up your personal skills coach'}</p>
          </div>

          <div className="pt-8">
            <div className="flex gap-1 items-center justify-center h-8">
               {[1,2,3,4,5].map(i => (
                 <div key={i} className={`w-1 bg-indigo-400 rounded-full transition-all duration-300 ${isActive ? 'animate-bounce' : 'h-2 opacity-20'}`} style={{ animationDelay: `${i*0.1}s`, height: isActive ? '32px' : '8px' }}></div>
               ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default LiveMentor;
