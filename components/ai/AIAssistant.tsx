import React from "react";
import {MessageSquare,X,Compass,Sparkles,Send,ChevronDown,Menu,Bot,HelpCircle,Clock,Plus} from "lucide-react";
import { Message } from "@/types/types";
import { AnimatePresence, motion } from "framer-motion";

interface AIAssistantProps {
    onSelectPropertyByTitle: (title: string) => void;
}

export default function AIAssistant({ onSelectPropertyByTitle }: AIAssistantProps) {
    const [isOpen, setIsOpen] = React.useState(false);
    const [messages, setMessages] = React.useState<Message[]>([
        {
            id: "welcome_msg",
            text: "Welcome to **Ese Imperial Luxury Homes**. I am your digital concierge. \n\nI can help you filter properties in Nigeria or internationally, convert prices dynamically, schedule viewing tours, or explain premium structural specifications. \n\nHow can I guide your next high-value acquisition today?",
            sender: "ai",
            timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
        }
    ]);
    const [inputText, setInputText] = React.useState("");
    const [isSending, setIsSending] = React.useState(false);
    const scrollRef = React.useRef<HTMLDivElement>(null);

    // Quick Chips to bootstrap client questions
    const defaultChips = [
        { label: "Mansion in Lekki Plan", query: "Can you recommend a luxurious mansion listing in Lekki Phase 1?" },
        { label: "Explore London", query: "Show me elite residences in London" },
        { label: "Penthouse in Dubai", query: "Do we have a duplex penthouse with Burj Khalifa views?" },
        { label: "Schedule tour", query: "How do I book a high-precision 3D Virtual Tour?" }
    ];

    React.useEffect(() => {
        if (scrollRef.current) {
            scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
        }
    }, [messages, isOpen]);

    const handleSend = async (textToSend?: string) => {
        const finalQuery = (textToSend || inputText).trim();
        if (!finalQuery) return;

        // Push client user message
        const userMessage: Message = {
            id: `client_${Date.now()}`,
            text: finalQuery,
            sender: "user",
            timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
        };

        setMessages((prev) => [...prev, userMessage]);
        setInputText("");
        setIsSending(true);

        try {
            const response = await fetch("/api/gemini/chat", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                // Send history as well for multi-turn chats!
                body: JSON.stringify({
                    message: finalQuery,
                    history: messages.slice(-8) // keep context light but sufficient (max 8 messages)
                })
            });

            if (response.ok) {
                const data = await response.json();

                // Push AI model answer
                const aiMessage: Message = {
                    id: `ai_${Date.now()}`,
                    text: data.reply || "I apologize, my neural link experienced a brief disconnection. Please resubmit your command.",
                    sender: "ai",
                    timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
                };
                setMessages((prev) => [...prev, aiMessage]);

                // Smart trigger: check if the response mentioned one of our listings and let the user open it!
                // We look for certain key phrases in the reply and can let user jump to specific modal
                // Note: we'll handle title selection if the user wants to jump, or provide an inline link!
            } else {
                const err = await response.json();
                throw new Error(err.details || "Gemini service returned an error status.");
            }
        } catch (err: any) {
            setMessages((prev) => [
                ...prev,
                {
                    id: `ai_error_${Date.now()}`,
                    text: `**System Communication Interruption:** ${err.message || "An issue occurred. Ensure your GEMINI_API_KEY is configured in Settings."}`,
                    sender: "ai",
                    timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
                }
            ]);
        } finally {
            setIsSending(false);
        }
    };

    return (
        <div className="fixed bottom-6 right-6 z-40 font-mono text-xs text-clay" id="ai-assistant-widget-container">

            <AnimatePresence mode="wait">
                {/* Floating Action Trigger Button */}
                {!isOpen && (
                    <motion.button
                        key="chat-trigger-btn"
                        initial={{ scale: 0.8, opacity: 0 }}
                        animate={{ scale: 1, opacity: 1 }}
                        exit={{ scale: 0.8, opacity: 0 }}
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                        onClick={() => setIsOpen(true)}
                        id="launch-ai-chat-btn"
                        className="bg-clay hover:bg-primary-gold text-marble hover:text-clay p-4 rounded-full shadow-2xl flex items-center justify-center space-x-2 border border-primary-gold/30 cursor-pointer relative"
                    >
                        {/* Notification bubble */}
                        <span className="absolute -top-1 -right-1 w-3 h-3 bg-primary-gold rounded-full border-2 border-clay animate-ping pointer-events-none" />
                        <Bot className="h-6 w-6 stroke-[1.5]" />
                        <span className="hidden md:inline font-mono text-[10px] tracking-widest uppercase pr-1 font-bold">
                            Digital Concierge
                        </span>
                    </motion.button>
                )}

                {/* Main chat widget drawer */}
                {isOpen && (
                    <motion.div
                        key="chat-dialog-box"
                        initial={{ opacity: 0, scale: 0.92, y: 35 }}
                        animate={{ opacity: 1, scale: 1, y: 0 }}
                        exit={{ opacity: 0, scale: 0.92, y: 35 }}
                        transition={{ type: "spring", damping: 24, stiffness: 320 }}
                        className="bg-white border border-clay/15 rounded-sm shadow-2xl w-[90vw] md:w-[410px] h-[550px] flex flex-col justify-between overflow-hidden"
                        id="ai-assistant-dialog-box"
                    >
                        {/* Draggable-feel luxury header banner */}
                        <div className="bg-clay text-marble px-5 py-4 flex items-center justify-between border-b border-primary-gold/20">
                            <div className="flex items-center space-x-2.5">
                                <div className="p-1.5 bg-primary-gold text-clay rounded-full shadow-md">
                                    <Bot className="h-5 w-5" />
                                </div>
                                <div>
                                    <span className="text-primary-gold font-bold tracking-widest text-[9px] uppercase block">
                                        Concierge Intel
                                    </span>
                                    <h3 className="font-display font-medium text-xs tracking-wide text-marble">
                                        Ese Imperial Digital Partner
                                    </h3>
                                </div>
                            </div>

                            <button
                                onClick={() => setIsOpen(false)}
                                className="text-marble/50 hover:text-white cursor-pointer p-1"
                            >
                                <X className="h-5 w-5" />
                            </button>
                        </div>

                        {/* Core Chat Scroll stream */}
                        <div
                            ref={scrollRef}
                            className="flex-1 p-5 overflow-y-auto space-y-4 bg-marble"
                            id="ai-chat-scroll-stream"
                        >
                            <AnimatePresence initial={false}>
                                {messages.map((message) => {
                                    const isAi = message.sender === "ai";

                                    return (
                                        <motion.div
                                            key={message.id}
                                            initial={{ opacity: 0, y: 15 }}
                                            animate={{ opacity: 1, y: 0 }}
                                            transition={{ duration: 0.25 }}
                                            className={`flex ${isAi ? "justify-start" : "justify-end"}`}
                                        >
                                            <div className={`max-w-[85%] rounded-xs p-3.5 leading-relaxed text-slate-800 border ${isAi
                                                    ? "bg-white border-clay/10 shadow-xs"
                                                    : "bg-clay text-marble border-clay/10 shadow-sm"
                                                }`}>
                                                {/* Simplified bolding representation */}
                                                <p className="whitespace-pre-wrap font-sans text-xs [line-height:1.55]">
                                                    {message.text.split("**").map((part, index) =>
                                                        index % 2 === 1 ? <strong key={index} className="font-bold text-primary-gold">{part}</strong> : part
                                                    )}
                                                </p>

                                                <span className="block text-[8px] opacity-40 font-mono text-right mt-1">
                                                    {message.timestamp}
                                                </span>
                                            </div>
                                        </motion.div>
                                    );
                                })}
                            </AnimatePresence>

                            {isSending && (
                                <div className="flex justify-start">
                                    <div className="bg-white border border-clay/10 rounded-xs p-3.5 flex items-center space-x-2">
                                        <Sparkles className="h-3.5 w-3.5 text-primary-gold animate-spin-slow" />
                                        <span className="text-[10px] text-clay/55 font-mono">Consulting listings databank...</span>
                                    </div>
                                </div>
                            )}
                        </div>

                        {/* Quick-select prompts list */}
                        {messages.length === 1 && (
                            <div className="px-4 py-2 border-t border-clay/5 bg-white flex space-x-2 overflow-x-auto select-none">
                                {defaultChips.map((ch, i) => (
                                    <button
                                        key={i}
                                        type="button"
                                        onClick={() => handleSend(ch.query)}
                                        className="flex-shrink-0 bg-marble hover:bg-primary-gold/10 text-[10px] hover:text-clay py-1 px-2.5 rounded-lg border border-clay/10 active:scale-95 duration-100 cursor-pointer"
                                    >
                                        {ch.label}
                                    </button>
                                ))}
                            </div>
                        )}

                        {/* Typing dock */}
                        <div className="p-4 border-t border-clay/10 bg-white">
                            <div className="flex items-center space-x-2">
                                <input
                                    type="text"
                                    id="ai-assistant-text-field"
                                    value={inputText}
                                    onChange={(e) => setInputText(e.target.value)}
                                    placeholder="Ask about mansions, converted prices, etc..."
                                    onKeyDown={(e) => e.key === "Enter" && handleSend()}
                                    disabled={isSending}
                                    className="flex-1 bg-marble text-clay px-3.5 py-3 border border-clay/15 rounded-xs focus:outline-hidden focus:border-primary-gold"
                                />
                                <button
                                    type="button"
                                    onClick={() => handleSend()}
                                    disabled={isSending || !inputText.trim()}
                                    className="bg-clay text-marble hover:bg-primary-gold hover:text-clay p-3 rounded-xs duration-150 disabled:opacity-40 cursor-pointer"
                                >
                                    <Send className="h-4 w-4" />
                                </button>
                            </div>
                        </div>

                    </motion.div>
                )}
            </AnimatePresence>

        </div>
    );
}
