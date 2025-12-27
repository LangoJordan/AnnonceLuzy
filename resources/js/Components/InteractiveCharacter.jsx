import { useEffect, useRef, useState } from 'react';
import { Sparkles } from 'lucide-react';

export default function InteractiveCharacter() {
  const containerRef = useRef(null);
  const [mousePos, setMousePos] = useState({ x: 0, y: 0 });
  const [isVisible, setIsVisible] = useState(true);

  useEffect(() => {
    const handleMouseMove = (e) => {
      if (containerRef.current) {
        const rect = containerRef.current.getBoundingClientRect();
        const centerX = rect.left + rect.width / 2;
        const centerY = rect.top + rect.height / 2;
        
        const angle = Math.atan2(e.clientY - centerY, e.clientX - centerX);
        const distance = 8;
        
        setMousePos({
          x: Math.cos(angle) * distance,
          y: Math.sin(angle) * distance
        });
      }
    };

    window.addEventListener('mousemove', handleMouseMove);
    return () => window.removeEventListener('mousemove', handleMouseMove);
  }, []);

  return (
    <div
      ref={containerRef}
      className="fixed bottom-8 right-8 z-30 hidden lg:block"
      onMouseEnter={() => setIsVisible(true)}
      onMouseLeave={() => setIsVisible(true)}
    >
      {/* Animated background glow */}
      <div className="absolute inset-0 rounded-full bg-gradient-to-r from-purple-600/20 to-pink-600/20 blur-2xl animate-pulse"></div>
      
      {/* Main character container */}
      <div className="relative w-32 h-40 flex items-center justify-center">
        {/* Head */}
        <div className="relative">
          {/* Head glow effect */}
          <div className="absolute inset-0 rounded-full bg-gradient-to-br from-purple-400 to-pink-400 opacity-0 group-hover:opacity-30 blur-lg transition-opacity duration-300"></div>
          
          {/* Head */}
          <div className="relative w-24 h-28 bg-gradient-to-br from-yellow-300 to-yellow-400 rounded-3xl shadow-2xl overflow-hidden border-4 border-yellow-200">
            {/* Shine effect */}
            <div className="absolute top-2 left-4 w-6 h-6 bg-white/40 rounded-full blur-sm"></div>
            
            {/* Eyes */}
            <div className="absolute top-8 left-0 right-0 flex justify-center gap-4 px-4">
              {/* Left eye */}
              <div className="relative w-5 h-5 bg-white rounded-full overflow-hidden">
                <div 
                  className="absolute w-3 h-3 bg-gray-900 rounded-full transition-transform duration-100"
                  style={{
                    transform: `translate(${mousePos.x * 0.5}px, ${mousePos.y * 0.5}px)`,
                    left: '4px',
                    top: '2px'
                  }}
                ></div>
              </div>
              
              {/* Right eye */}
              <div className="relative w-5 h-5 bg-white rounded-full overflow-hidden">
                <div 
                  className="absolute w-3 h-3 bg-gray-900 rounded-full transition-transform duration-100"
                  style={{
                    transform: `translate(${mousePos.x * 0.5}px, ${mousePos.y * 0.5}px)`,
                    left: '4px',
                    top: '2px'
                  }}
                ></div>
              </div>
            </div>
            
            {/* Mouth */}
            <div className="absolute bottom-6 left-1/2 -translate-x-1/2">
              <div className="w-6 h-3 border-4 border-gray-900 rounded-full border-t-0 opacity-80"></div>
            </div>
            
            {/* Blush marks */}
            <div className="absolute bottom-10 left-1 w-4 h-2 bg-pink-400 rounded-full blur-sm opacity-60"></div>
            <div className="absolute bottom-10 right-1 w-4 h-2 bg-pink-400 rounded-full blur-sm opacity-60"></div>
          </div>
          
          {/* Antenna with sparkle */}
          <div className="absolute -top-2 left-1/2 -translate-x-1/2 w-1 h-6 bg-gradient-to-t from-purple-400 to-purple-300 rounded-full">
            <div className="absolute -top-1 left-1/2 -translate-x-1/2 animate-bounce">
              <Sparkles className="w-4 h-4 text-purple-500" />
            </div>
          </div>
        </div>
        
        {/* Body hint */}
        <div className="absolute bottom-0 w-20 h-12 bg-gradient-to-b from-yellow-300 to-yellow-400 rounded-b-2xl border-4 border-yellow-200 border-t-0 opacity-40"></div>
        
        {/* Floating particles around character */}
        <div className="absolute top-0 right-0 w-2 h-2 bg-purple-400 rounded-full animate-ping opacity-60"></div>
        <div className="absolute bottom-10 left-0 w-1.5 h-1.5 bg-pink-400 rounded-full animate-pulse opacity-40"></div>
        <div className="absolute top-12 left-0 w-2 h-2 bg-blue-400 rounded-full animate-bounce opacity-50"></div>
      </div>
      
      {/* Speech bubble hint */}
      <div className="mt-4 text-center opacity-0 hover:opacity-100 transition-opacity duration-300">
        <p className="text-xs font-semibold text-purple-600 bg-white/80 backdrop-blur-sm px-3 py-1 rounded-full whitespace-nowrap">
          Bonjour! 👋
        </p>
      </div>
    </div>
  );
}
