
import React from 'react';

interface SplashViewProps {
  onStart: () => void;
}

const SplashView: React.FC<SplashViewProps> = ({ onStart }) => {
  return (
    <div className="h-full w-full flex flex-col items-center justify-center p-4 relative overflow-y-auto overflow-x-hidden bg-background-dark">
      {/* Animated World Map Silhouette */}
      <div className="absolute inset-0 z-0 opacity-[0.07] scale-110 pointer-events-none flex items-center justify-center">
        <img 
          src="https://picsum.photos/1920/1080?grayscale" 
          alt="Abstract Network" 
          className="w-full h-full object-cover mix-blend-screen" 
        />
        <div className="absolute inset-0 bg-background-dark/80"></div>
      </div>

      <div className="relative z-20 flex flex-col items-center py-20">
        {/* Glow backdrop */}
        <div className="absolute -inset-10 bg-primary/20 blur-[120px] rounded-full animate-pulse-slow"></div>

        <div className="group relative">
           <h1 className="text-5xl sm:text-7xl md:text-8xl lg:text-9xl font-black uppercase tracking-tighter text-white text-center drop-shadow-[0_0_20px_rgba(19,236,91,0.4)] animate-flicker">
            THE LAST LOGIN
          </h1>
          {/* Subtle Glitch Text Elements */}
          <div className="absolute -top-1 -left-1 text-danger opacity-20 pointer-events-none select-none blur-[1px] animate-pulse w-full text-center">THE LAST LOGIN</div>
          <div className="absolute -bottom-1 -right-1 text-accent-cyan opacity-20 pointer-events-none select-none blur-[1px] animate-pulse w-full text-center">THE LAST LOGIN</div>
        </div>

        <div className="flex items-center gap-4 mt-4">
          <div className="h-px w-8 sm:w-16 bg-primary/30"></div>
          <h2 className="text-xs sm:text-sm font-medium uppercase tracking-[0.4em] text-primary/80 font-mono text-center">
            EDUCATIONAL FORENSIC SIMULATION
          </h2>
          <div className="h-px w-8 sm:w-16 bg-primary/30"></div>
        </div>

        <div className="mt-20 flex flex-col items-center gap-8">
          <button 
            onClick={onStart}
            className="group relative flex h-14 w-72 items-center justify-center overflow-hidden rounded-lg bg-transparent border border-primary/50 text-primary transition-all duration-300 hover:bg-primary hover:text-black hover:shadow-[0_0_40px_rgba(19,236,91,0.5)] active:scale-95"
          >
            <div className="absolute inset-0 w-full translate-x-[-100%] bg-gradient-to-r from-transparent via-white/20 to-transparent transition-transform duration-1000 group-hover:translate-x-[100%]"></div>
            <span className="material-symbols-outlined mr-3 text-2xl group-hover:scale-110 transition-transform">terminal</span>
            <span className="text-sm font-bold tracking-[0.2em] uppercase">INITIATE_SYSTEM</span>
          </button>

          <div className="flex items-center gap-6 text-[10px] uppercase tracking-widest text-gray-500 font-mono">
            <div className="flex items-center gap-1.5">
              <span className="material-symbols-outlined text-[14px]">encrypted</span>
              <span>CONNECTION_SECURE</span>
            </div>
            <span>//</span>
            <div className="flex items-center gap-1.5">
              <span className="w-1.5 h-1.5 rounded-full bg-primary animate-pulse"></span>
              <span>VER_2.4.91_BETA</span>
            </div>
          </div>
        </div>
      </div>

      {/* Decorative Corners */}
      <div className="absolute left-4 top-4 sm:left-10 sm:top-10 w-12 h-12 sm:w-24 sm:h-24 border-t-2 border-l-2 border-primary/20 pointer-events-none"></div>
      <div className="absolute right-4 top-4 sm:right-10 sm:top-10 w-12 h-12 sm:w-24 sm:h-24 border-t-2 border-r-2 border-primary/20 pointer-events-none"></div>
      <div className="absolute left-4 bottom-4 sm:left-10 sm:bottom-10 w-12 h-12 sm:w-24 sm:h-24 border-b-2 border-l-2 border-primary/20 pointer-events-none"></div>
      <div className="absolute right-4 bottom-4 sm:right-10 sm:bottom-10 w-12 h-12 sm:w-24 sm:h-24 border-b-2 border-r-2 border-primary/20 pointer-events-none"></div>
    </div>
  );
};

export default SplashView;
