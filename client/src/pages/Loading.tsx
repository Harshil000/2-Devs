import React, { useEffect, useState } from 'react';
import { Loader2, Moon as Balloon, Stars } from 'lucide-react';

const LoadingScreen = () => {
    const [progress, setProgress] = useState(0);

    useEffect(() => {

        const progressInterval = setInterval(() => {
            setProgress(prev => {
                if (prev >= 100) {
                    clearInterval(progressInterval);
                    return 100;
                }
                return prev + 1;
            });
        }, 30);

        return () => {
            clearInterval(progressInterval);
        };
    }, []);

    return (
        <div className="min-h-screen bg-gradient-to-br from-gray-900 to-blue-900 flex items-center justify-center relative overflow-hidden">
            {/* Animated background elements */}
            <div className="absolute inset-0 overflow-hidden">
                {[...Array(20)].map((_, i) => (
                    <Stars
                        key={i}
                        className="absolute text-blue-400/20 animate-pulse"
                        style={{
                            top: `${Math.random() * 100}%`,
                            left: `${Math.random() * 100}%`,
                            animationDelay: `${Math.random() * 2}s`,
                            transform: `scale(${Math.random() * 0.5 + 0.5})`,
                        }}
                    />
                ))}
            </div>

            <div className="relative z-10 bg-gray-800/80 backdrop-blur-lg p-12 rounded-2xl shadow-2xl border border-gray-700 flex flex-col items-center max-w-md w-full mx-4">
                <div className="relative mb-8">
                    <Balloon className="w-20 h-20 text-blue-400 animate-bounce" />
                </div>

                <h1 className="text-3xl font-bold text-blue-400 mb-4 text-center">
                    Balloon Pop!
                </h1>
            </div>
        </div>
    );
};

export default LoadingScreen;