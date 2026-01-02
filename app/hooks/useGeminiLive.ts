import {useState, useRef, useEffect, useCallback} from 'react';

export type Message = {
    role: 'user' | 'model';
    text: string;
};

export function useGeminiLive() {
    const [status, setStatus] = useState<'disconnected' | 'connecting' | 'connected'>('disconnected');
    const [messages, setMessages] = useState<Message[]>([]);
    const [isStreaming, setIsStreaming] = useState(false);

    const wsRef = useRef<WebSocket | null>(null);

    const connect = useCallback(async () => {
        if (wsRef.current && (wsRef.current.readyState === WebSocket.OPEN || wsRef.current.readyState === WebSocket.CONNECTING)) {
            return;
        }

        try {
            setStatus('connecting');
            const response = await fetch('/api/token', {method: 'POST'});
            if (!response.ok) throw new Error('Token fetch failed');

            const {token} = await response.json();
            if (!token) throw new Error('Failed to get token');

            const url = `wss://generativelanguage.googleapis.com/ws/google.ai.generativelanguage.v1alpha.GenerativeService.BidiGenerateContentConstrained?access_token=${token}`;
            const ws = new WebSocket(url);

            ws.onopen = () => {
                setStatus('connected');
                ws.send(JSON.stringify({
                    setup: {
                        model: "models/gemini-2.0-flash-exp",
                        generation_config: {response_modalities: ["TEXT"]}
                    }
                }));
            };

            ws.onmessage = async (event) => {
                let msgData;
                if (event.data instanceof Blob) {
                    msgData = await event.data.text();
                } else {
                    msgData = event.data;
                }

                try {
                    const msg = JSON.parse(msgData);

                    if (msg.serverContent?.turnComplete) {
                        setIsStreaming(false);
                        return;
                    }

                    if (msg.serverContent?.modelTurn?.parts) {
                        const textPart = msg.serverContent.modelTurn.parts.find((p: { text: string }) => p.text);
                        if (textPart) {
                            setIsStreaming(true);
                            setMessages(prev => {
                                const lastMsg = prev[prev.length - 1];
                                if (lastMsg && lastMsg.role === 'model') {
                                    return [
                                        ...prev.slice(0, -1),
                                        {...lastMsg, text: lastMsg.text + textPart.text}
                                    ];
                                } else {
                                    return [...prev, {role: 'model', text: textPart.text}];
                                }
                            });
                        }
                    }
                } catch (e) {
                    console.error("Parse error", e);
                }
            };

            ws.onerror = (err) => {
                console.error("WebSocket Error", err);
                // Don't set status here; wait for onclose
            };

            ws.onclose = (ev) => {
                console.log("WebSocket Closed:", ev.reason);
                setStatus('disconnected');
                wsRef.current = null; // <--- CRITICAL: Allow reconnection
            };

            wsRef.current = ws;

        } catch (e) {
            console.error("Connection failed", e);
            setStatus('disconnected');
            wsRef.current = null;
        }
    }, []);

    const sendMessage = useCallback((text: string) => {
        if (!wsRef.current || wsRef.current.readyState !== WebSocket.OPEN) {
            console.error("Socket not connected, cannot send message");
            return;
        }

        setMessages(prev => [...prev, {role: 'user', text}]);

        const payload = {
            client_content: {
                turns: [{role: "user", parts: [{text}]}],
                turn_complete: true
            }
        };
        wsRef.current.send(JSON.stringify(payload));
    }, []);

    useEffect(() => {
        connect();
        return () => {
            if (wsRef.current) {
                wsRef.current.close();
                wsRef.current = null;
            }
        };
    }, [connect]);

    useEffect(() => {
        const handleOnline = () => {
            setTimeout(() => connect(), 1000); // Add a small delay to ensure network is fully stable
        };

        const handleOffline = () => {
            if (wsRef.current) {
                wsRef.current.close();
                wsRef.current = null;
            }
            setStatus('disconnected');
        };

        window.addEventListener('online', handleOnline);
        window.addEventListener('offline', handleOffline);

        return () => {
            window.removeEventListener('online', handleOnline);
            window.removeEventListener('offline', handleOffline);
        };
    }, [connect]);

    return {status, messages, isStreaming, sendMessage};
}