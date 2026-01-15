import { ShieldAlert } from 'lucide-react';

interface USBUnlockedViewProps {
  onClose: () => void;
  videoError?: boolean;
  onComplete: () => void;
}

const USBUnlockedView = ({ onClose, videoError = false }: USBUnlockedViewProps) => {
  return (
    <div className="w-full h-full bg-black text-gray-200 font-mono flex flex-col items-center justify-center p-6">
      <div className="text-center animate-in zoom-in flex flex-col items-center gap-8">
        <div className="w-full max-w-2xl bg-gray-900/80 rounded-lg border border-green-500 overflow-hidden">
          <div className="w-full bg-black aspect-video flex items-center justify-center">
            <video
              className="w-full h-full object-cover"
              controls
              autoPlay
              muted
              playsInline
            >
              <source src={encodeURI('/คลิปยาม.mp4')} type="video/mp4" />
              <source src="https://interactive-examples.mdn.mozilla.net/media/cc0-videos/flower.mp4" type="video/mp4" />
              Your browser does not support the video tag.
            </video>
          </div>
        </div>
        <div className="text-center">
          <div className="flex items-center justify-center gap-2 mb-2">
            <ShieldAlert className="w-5 h-5 text-green-500" />
            <h3 className="text-green-500 font-bold text-xl">ACCESS GRANTED</h3>
          </div>
          <p className="text-gray-400 text-sm mb-2">Evidence Retrieved successfully.</p>
          {videoError && <p className="text-gray-500 text-xs mb-4">ไม่พบไฟล์คลิปยาม.mp4 ในโฟลเดอร์ public/</p>}
          <button
            onClick={onClose}
            className="bg-gray-700 hover:bg-gray-600 text-white font-bold py-2 px-6 rounded-full uppercase text-sm"
          >
            Back
          </button>
        </div>
      </div>
    </div>
  );
};

export default USBUnlockedView;
