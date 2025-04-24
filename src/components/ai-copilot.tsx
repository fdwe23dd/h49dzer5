"use client";

import { useState, useRef, useEffect } from "react";
import { Send, Square, Brain } from "lucide-react";

export default function AICopilot() {
    const [input, setInput] = useState("");
    const [result, setResult] = useState("");
    const [isProcessing, setIsProcessing] = useState(false);
    const [theme, setTheme] = useState<'dark' | 'light'>('dark');
    const [hasMounted, setHasMounted] = useState(false);
    const inputRef = useRef<HTMLInputElement>(null);
    const timeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);

    useEffect(() => {
        setHasMounted(true);
        const storedTheme = localStorage.getItem("theme") as 'dark' | 'light' | null;
        const initialTheme = storedTheme || 'dark';
        setTheme(initialTheme);
        document.documentElement.classList.toggle('dark', initialTheme === 'dark');
    }, []);

    useEffect(() => {
        if (!hasMounted) return;
        document.documentElement.classList.toggle('dark', theme === 'dark');
        localStorage.setItem("theme", theme);
    }, [theme, hasMounted]);

    const toggleTheme = () => {
        setTheme(prev => (prev === 'dark' ? 'light' : 'dark'));
    };

    useEffect(() => {
        if (inputRef.current) {
            inputRef.current.focus();
        }
    }, []);

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (!input.trim() || isProcessing) return;

        setIsProcessing(true);
        setResult("");

        timeoutRef.current = setTimeout(() => {
            setResult(`Here's a response to your query: "${input}"\n\nThis is a simulated response from the AI assistant.`);
            setIsProcessing(false);
            setInput("");
        }, 3000);
    };

    const handleStop = () => {
        if (timeoutRef.current) {
            clearTimeout(timeoutRef.current);
        }
        setIsProcessing(false);
        setResult("");
    };

    useEffect(() => {
        return () => {
            if (timeoutRef.current) {
                clearTimeout(timeoutRef.current);
            }
        };
    }, []);

    if (!hasMounted) return null; // prevent hydration mismatch

    return (
        <div className="p-6 rounded-xl shadow-lg dark:bg-slate-900 bg-slate-100 relative max-w-lg w-full">
            {/* Header */}
            <button onClick={toggleTheme} className="absolute top-7 right-7">
                {theme === "dark" ? "☀️" : "🌙"}
            </button>

            <div className="w-full flex justify-center items-center mb-4">
                <h1 className="text-3xl font-bold tracking-tight text-slate-900 dark:text-slate-100 mr-4">
                    AI Copilot
                </h1>
                <Brain className={`w-12 h-12 pt-1 text-black dark:text-white ${isProcessing ? "animate-pulse" : ""}`} />
            </div>

            {/* Inner Container */}
            <div className="w-full max-w-2xl mx-auto bg-white dark:bg-slate-800 border dark:border-slate-800 rounded-xl shadow-lg p-4">
                {/* Input area */}
                <form onSubmit={handleSubmit} className="flex gap-4 items-center mb-4">
                    <div className="relative flex-grow">
                        <input
                            ref={inputRef}
                            type="text"
                            value={input}
                            onChange={(e) => setInput(e.target.value)}
                            placeholder="Ask me anything..."
                            className="w-full p-3 rounded-lg border dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-slate-100 placeholder:text-slate-400 dark:placeholder:text-slate-500 focus:outline-none focus:ring-2 focus:ring-slate-300 dark:focus:ring-slate-600 transition-all"
                            disabled={isProcessing}
                        />
                    </div>
                    <button
                        type={isProcessing ? "button" : "submit"}
                        onClick={isProcessing ? handleStop : undefined}
                        className={`p-3 rounded-lg flex items-center justify-center transition-all ${
                            isProcessing
                                ? "bg-gray-500 text-white"
                                : "bg-sky-500 text-white hover:bg-sky-600 focus:ring-2 focus:ring-sky-400"
                        }`}
                    >
                        {isProcessing ? <Square className="w-5 h-5" /> : <Send className="w-5 h-5" />}
                    </button>
                </form>

                {/* Result Display Area */}
                <div
                    className={`
                        p-6 mt-4 transition-opacity duration-500 
                        ${(!!result || isProcessing) ? "opacity-100" : "opacity-0 pointer-events-none"}
                        ${(!!result || isProcessing) ? "bg-slate-50" : "bg-transparent"}
                        dark:bg-[#27354c]
                        rounded-lg
                        overflow-y-auto
                    `}
                    style={{ height: "150px" }}
                >
                    {(!!result || isProcessing) && (
                        <div className="animate-fade-in">
                            {result ? (
                                <div className="whitespace-pre-wrap text-slate-700 dark:text-slate-300">
                                    {result}
                                </div>
                            ) : (
                                <div className="flex items-center text-slate-500 dark:text-slate-400">
                                    <div className="flex space-x-1 ml-1">
                                        <div className="w-2 h-2 rounded-full bg-slate-400 dark:bg-slate-600 animate-bounce" style={{ animationDelay: "0ms" }} />
                                        <div className="w-2 h-2 rounded-full bg-slate-400 dark:bg-slate-600 animate-bounce" style={{ animationDelay: "150ms" }} />
                                        <div className="w-2 h-2 rounded-full bg-slate-400 dark:bg-slate-600 animate-bounce" style={{ animationDelay: "300ms" }} />
                                    </div>
                                    <span className="ml-3 text-sm">Thinking...</span>
                                </div>
                            )}
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}
