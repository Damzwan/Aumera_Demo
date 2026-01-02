'use client'

import {useRef, useState} from 'react';
import {useGeminiLive} from "@/app/hooks/useGeminiLive";
import Avatar from "@/app/components/Avatar";


export default function Home() {
    const {status, messages, isStreaming, sendMessage} = useGeminiLive();
    const [input, setInput] = useState('');
    const [mode, setMode] = useState<'reading' | 'writing'>('reading');
    const inputRef = useRef<HTMLTextAreaElement>(null);

    const lastMessage = messages.length > 0 ? messages[messages.length - 1] : null;

    const handleSubmit = () => {
        if (status === 'disconnected') {
            // TODO toast or so...
            return;
        }

        if (!input.trim()) return;
        sendMessage(input);
        setInput('');
        setMode('reading');
    };


    return (
        <main
            className={`min-h-screen bg-zinc-900 text-white overflow-hidden flex flex-col items-center justify-center relative`}>

            <div
                className="absolute inset-0 from-zinc-800 via-zinc-900 to-black opacity-80"/>

            <div className="z-10 transform scale-150 mb-12 transition-all duration-500 ease-in-out">
                <Avatar isStreaming={isStreaming}/>
            </div>

            <div
                className={`
                    z-20 w-full max-w-2xl min-h-45 mx-6
                    relative group transition-all duration-300
                    ${mode === 'writing' ? 'scale-105' : 'scale-100'}
                `}
            >
                <div
                    onClick={() => {
                        if (isStreaming) return
                        setMode('writing')
                        inputRef.current?.focus();
                    }}
                    className={`
                        w-full h-full min-h-45
                        bg-black/80 backdrop-blur-md
                        border-4 border-double border-white/40 rounded-3xl
                        p-8 flex flex-col justify-start items-start
                        cursor-pointer hover:border-white/80 transition-colors
                    `}
                >
                    {/* NAMETAG */}
                    <div
                        className="absolute -top-4 left-8 bg-zinc-900 border-2 border-white/50 px-4 py-1 rounded-full text-sm tracking-widest uppercase font-bold text-zinc-300 shadow-xl">
                        {isStreaming ? 'Oracle' : (mode === 'writing' ? 'You' : 'Aumera')}
                    </div>

                    {/* CONTENT AREA */}
                    <div
                        className="w-full text-xl md:text-2xl leading-relaxed tracking-wide text-zinc-100 h-full max-h-48 overflow-y-auto">

                        {mode === 'reading' && (
                            <div className="animate-in fade-in duration-300">
                                {lastMessage ? (
                                    <>
                                        <span>{lastMessage.text}</span>

                                        {/* Cursor/Indicator */}
                                        {isStreaming ? (
                                            <span
                                                className="inline-block w-3 h-6 bg-white ml-2 animate-pulse align-middle"/>
                                        ) : (
                                            <span className="inline-block ml-2 animate-bounce text-green-400">▼</span>
                                        )}
                                    </>
                                ) : (
                                    <span className="text-zinc-500 italic">
                                        {status === 'connected' ? "Tap here to talk to your Aumera..." : "Summoning your Aumera..."}
                                    </span>
                                )}
                            </div>
                        )}

                        {mode === 'writing' && (
                            <textarea
                                ref={inputRef}
                                value={input}
                                onChange={(e) => setInput(e.target.value)}
                                onKeyDown={(e) => {
                                    if (e.key === 'Enter' && !e.shiftKey) {
                                        e.preventDefault();
                                        handleSubmit();
                                    }
                                }}
                                onBlur={() => !input && setMode('reading')}
                                placeholder="Type your response..."
                                className="w-full h-full bg-transparent border-none outline-none resize-none text-green-300 placeholder-zinc-600 animate-in fade-in zoom-in-95 duration-200"
                                autoFocus
                            />
                        )}
                    </div>

                    {/* HINT TEXTS (Bottom Right) */}
                    {!isStreaming && mode === 'reading' && (
                        <div
                            className="absolute bottom-4 right-6 text-xs text-zinc-500 uppercase tracking-widest animate-pulse">
                            [ Click to Reply ]
                        </div>
                    )}

                    {mode === 'writing' && (
                        <div className="absolute bottom-4 right-6 text-xs text-green-500 uppercase tracking-widest">
                            [ Press Enter ]
                        </div>
                    )}
                </div>
            </div>

            {/* CONNECTION STATUS*/}
            <div
                className="absolute top-6 right-6 flex items-center gap-2 opacity-50 hover:opacity-100 transition-opacity">
                <div className={`w-2 h-2 rounded-full ${status === 'connected' ? 'bg-green-500' : 'bg-red-500'}`}/>
                <span className="text-xs tracking-widest uppercase">{status}</span>
            </div>

        </main>
    );
}