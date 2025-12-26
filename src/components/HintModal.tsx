
import React from 'react';

interface HintModalProps {
  isOpen: boolean;
  onClose: () => void;
  hint: string | null;
  isLoading: boolean;
}

const HintModal: React.FC<HintModalProps> = ({ isOpen, onClose, hint, isLoading }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-fade-in">
      <div className="w-full max-w-md glass-panel rounded-xl overflow-hidden border-primary/30 shadow-[0_0_50px_rgba(255,0,0,0.2)]">
        <div className="bg-primary/10 px-6 py-4 border-b border-primary/20 flex justify-between items-center">
          <h3 className="text-primary font-black text-xs tracking-widest uppercase flex items-center gap-2">
            <span className="material-symbols-outlined text-sm">psychology</span>
            Investigator Intel
          </h3>
          <button onClick={onClose} className="text-gray-500 hover:text-white transition-colors">
            <span className="material-symbols-outlined text-xl">close</span>
          </button>
        </div>
        <div className="p-8 flex flex-col items-center text-center gap-6">
          {isLoading ? (
            <div className="py-10 flex flex-col items-center gap-4">
              <div className="size-12 border-2 border-primary border-t-transparent rounded-full animate-spin"></div>
              <p className="text-[10px] font-mono text-primary animate-pulse tracking-[0.2em] uppercase">Decrypting Intelligence...</p>
            </div>
          ) : (
            <>
              <div className="bg-black/40 p-6 rounded-lg border border-white/5 w-full">
                <p className="text-gray-300 font-mono text-sm leading-relaxed italic">
                  "{hint || "No intel available at this time. Keep probing the system, detective."}"
                </p>
              </div>
              <button 
                onClick={onClose}
                className="w-full py-3 bg-primary hover:bg-red-600 text-black font-black text-xs uppercase tracking-widest rounded transition-all"
              >
                Acknowledge
              </button>
            </>
          )}
        </div>
      </div>
    </div>
  );
};

export default HintModal;
