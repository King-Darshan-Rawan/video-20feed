import { Mic, MicOff, Video, VideoOff, Phone, Gift, User, UserCheck } from "lucide-react";
import { useState } from "react";

export default function Index() {
  const [isMuted, setIsMuted] = useState(false);
  const [isVideoOn, setIsVideoOn] = useState(true);
  const [isMale, setIsMale] = useState(true);

  return (
    <div className="h-screen w-full bg-video-gradient flex flex-col overflow-hidden">
      {/* Top Bar */}
      <div className="flex-shrink-0 p-4 sm:p-6">
        <div className="glass rounded-2xl p-4 text-center">
          <h1 className="text-xl sm:text-2xl font-bold text-white">
            Lumi
          </h1>
        </div>
      </div>

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col lg:flex-row gap-4 sm:gap-6 px-4 sm:px-6 pb-4 sm:pb-6 min-h-0">
        {/* AI Character Preview - Full Width */}
        <div className="flex-1 min-h-0">
          <div className="glass-dark rounded-3xl h-full py-6 pr-6 pl-0 -ml-0.5 flex items-center justify-center">
            {/* Placeholder for Lottie animation */}
            <div className="w-full h-full bg-gradient-to-br from-call-primary/20 to-purple-500/20 rounded-2xl flex items-center justify-center border border-white/5 relative overflow-hidden">
              <div className="text-center">
                <div className="w-24 h-24 sm:w-32 sm:h-32 bg-gradient-to-br from-call-primary to-purple-500 rounded-full flex items-center justify-center mx-auto mb-4 animate-pulse">
                  <div className="w-12 h-12 sm:w-16 sm:h-16 bg-white/20 rounded-full"></div>
                </div>
                <p className="text-white/80 text-sm sm:text-base font-medium">
                  AI Assistant
                </p>
                <p className="text-white/50 text-xs sm:text-sm mt-1">
                  Character animation will appear here
                </p>
              </div>

              {/* Animated background elements */}
              <div className="absolute inset-0 overflow-hidden">
                <div className="absolute -top-4 -right-4 w-16 h-16 bg-call-primary/10 rounded-full animate-bounce"></div>
                <div className="absolute -bottom-6 -left-6 w-20 h-20 bg-purple-500/10 rounded-full animate-pulse"></div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Bottom Control Bar */}
      <div className="flex-shrink-0 p-4 sm:p-6">
        <div className="glass rounded-2xl p-4">
          <div className="flex items-center justify-center gap-4 sm:gap-6">
            {/* Mute Button */}
            <button
              onClick={() => setIsMuted(!isMuted)}
              className={`w-12 h-12 sm:w-14 sm:h-14 rounded-full flex items-center justify-center transition-all duration-200 hover:scale-105 ${
                isMuted
                  ? "bg-call-danger/80 hover:bg-call-danger"
                  : "bg-white/10 hover:bg-white/20"
              }`}
            >
              {isMuted ? (
                <MicOff className="w-5 h-5 sm:w-6 sm:h-6 text-white" />
              ) : (
                <Mic className="w-5 h-5 sm:w-6 sm:h-6 text-white" />
              )}
            </button>

            {/* Video Toggle Button */}
            <button
              onClick={() => setIsVideoOn(!isVideoOn)}
              className={`w-12 h-12 sm:w-14 sm:h-14 rounded-full flex items-center justify-center transition-all duration-200 hover:scale-105 ${
                !isVideoOn
                  ? "bg-call-danger/80 hover:bg-call-danger"
                  : "bg-white/10 hover:bg-white/20"
              }`}
            >
              {isVideoOn ? (
                <Video className="w-5 h-5 sm:w-6 sm:h-6 text-white" />
              ) : (
                <VideoOff className="w-5 h-5 sm:w-6 sm:h-6 text-white" />
              )}
            </button>

            {/* End Call Button */}
            <button className="w-12 h-12 sm:w-14 sm:h-14 rounded-full bg-call-danger hover:bg-red-600 flex items-center justify-center transition-all duration-200 hover:scale-105 transform">
              <Phone className="w-5 h-5 sm:w-6 sm:h-6 text-white transform rotate-[135deg]" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
