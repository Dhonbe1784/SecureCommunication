import { useState, useEffect, useRef } from "react";
import { Dialog, DialogContent } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Phone, PhoneOff, Mic, MicOff, Video, VideoOff, Monitor, MonitorOff } from "lucide-react";
import { useWebRTC } from "@/hooks/useWebRTC";
import { cn } from "@/lib/utils";

interface VideoCallModalProps {
  isOpen: boolean;
  onClose: () => void;
  conversationId: number | null;
  userId: string;
  sendWebSocketMessage: (message: any) => void;
}

export default function VideoCallModal({
  isOpen,
  onClose,
  conversationId,
  userId,
  sendWebSocketMessage
}: VideoCallModalProps) {
  const [isMuted, setIsMuted] = useState(false);
  const [isVideoEnabled, setIsVideoEnabled] = useState(true);
  const [isScreenSharing, setIsScreenSharing] = useState(false);
  const [callStatus, setCallStatus] = useState<'connecting' | 'connected' | 'ended'>('connecting');
  const [callDuration, setCallDuration] = useState(0);

  const localVideoRef = useRef<HTMLVideoElement>(null);
  const remoteVideoRef = useRef<HTMLVideoElement>(null);

  const {
    localStream,
    remoteStream,
    isConnected,
    startCall,
    endCall,
    toggleMute,
    toggleVideo,
    startScreenShare,
    stopScreenShare,
    error
  } = useWebRTC({
    isVideoCall: true,
    onConnectionStateChange: (state) => {
      if (state === 'connected') {
        setCallStatus('connected');
      } else if (state === 'disconnected') {
        setCallStatus('ended');
        setTimeout(onClose, 1000);
      }
    }
  });

  // Set up video streams
  useEffect(() => {
    if (localVideoRef.current && localStream) {
      localVideoRef.current.srcObject = localStream;
    }
  }, [localStream]);

  useEffect(() => {
    if (remoteVideoRef.current && remoteStream) {
      remoteVideoRef.current.srcObject = remoteStream;
    }
  }, [remoteStream]);

  // Call duration timer
  useEffect(() => {
    let interval: NodeJS.Timeout;
    if (callStatus === 'connected') {
      interval = setInterval(() => {
        setCallDuration(prev => prev + 1);
      }, 1000);
    }
    return () => clearInterval(interval);
  }, [callStatus]);

  // Start call when modal opens
  useEffect(() => {
    if (isOpen && conversationId) {
      startCall();
      setCallStatus('connecting');
      setCallDuration(0);
      
      // Send call start signal via WebSocket
      sendWebSocketMessage({
        type: 'call-start',
        target: conversationId.toString(),
        data: { callType: 'video' }
      });
    }
  }, [isOpen, conversationId, startCall, sendWebSocketMessage]);

  const handleEndCall = () => {
    endCall();
    setCallStatus('ended');
    
    // Send call end signal via WebSocket
    if (conversationId) {
      sendWebSocketMessage({
        type: 'call-end',
        target: conversationId.toString(),
        data: { callType: 'video' }
      });
    }
    
    onClose();
  };

  const handleToggleMute = () => {
    toggleMute();
    setIsMuted(!isMuted);
  };

  const handleToggleVideo = () => {
    toggleVideo();
    setIsVideoEnabled(!isVideoEnabled);
  };

  const handleToggleScreenShare = async () => {
    if (isScreenSharing) {
      await stopScreenShare();
      setIsScreenSharing(false);
    } else {
      try {
        await startScreenShare();
        setIsScreenSharing(true);
      } catch (error) {
        console.error("Failed to start screen sharing:", error);
      }
    }
  };

  const formatDuration = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black z-50 flex flex-col">
      {/* Remote Video */}
      <div className="flex-1 relative">
        <video
          ref={remoteVideoRef}
          className="w-full h-full object-cover"
          autoPlay
          playsInline
        />
        
        {/* Remote video placeholder */}
        {!remoteStream && (
          <div className="absolute inset-0 flex items-center justify-center bg-gray-900">
            <div className="text-center text-white">
              <div className="w-24 h-24 bg-gray-700 rounded-full flex items-center justify-center mx-auto mb-4">
                <Video className="h-12 w-12" />
              </div>
              <p className="text-lg">Waiting for participant...</p>
            </div>
          </div>
        )}

        {/* Local Video */}
        <video
          ref={localVideoRef}
          className="absolute top-4 right-4 w-48 h-36 object-cover rounded-lg border-2 border-white shadow-lg"
          autoPlay
          playsInline
          muted
        />

        {/* Call Status Overlay */}
        {callStatus !== 'connected' && (
          <div className="absolute inset-0 bg-black bg-opacity-50 flex items-center justify-center">
            <div className="text-center text-white">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-white mx-auto mb-4" />
              <p className="text-lg">{callStatus === 'connecting' ? 'Connecting...' : 'Call ended'}</p>
            </div>
          </div>
        )}

        {/* Call Duration */}
        {callStatus === 'connected' && (
          <div className="absolute top-4 left-4 bg-black bg-opacity-50 text-white px-3 py-1 rounded-full text-sm">
            {formatDuration(callDuration)}
          </div>
        )}
      </div>

      {/* Video Call Controls */}
      <div className="absolute bottom-6 left-1/2 transform -translate-x-1/2 flex space-x-4">
        <Button
          variant="secondary"
          size="lg"
          onClick={handleToggleMute}
          className={cn(
            "rounded-full p-3 bg-gray-800 bg-opacity-70 hover:bg-opacity-90",
            isMuted && "bg-red-600 hover:bg-red-700"
          )}
        >
          {isMuted ? (
            <MicOff className="h-5 w-5 text-white" />
          ) : (
            <Mic className="h-5 w-5 text-white" />
          )}
        </Button>

        <Button
          variant="secondary"
          size="lg"
          onClick={handleToggleVideo}
          className={cn(
            "rounded-full p-3 bg-gray-800 bg-opacity-70 hover:bg-opacity-90",
            !isVideoEnabled && "bg-red-600 hover:bg-red-700"
          )}
        >
          {isVideoEnabled ? (
            <Video className="h-5 w-5 text-white" />
          ) : (
            <VideoOff className="h-5 w-5 text-white" />
          )}
        </Button>

        <Button
          variant="secondary"
          size="lg"
          onClick={handleToggleScreenShare}
          className={cn(
            "rounded-full p-3 bg-gray-800 bg-opacity-70 hover:bg-opacity-90",
            isScreenSharing && "bg-blue-600 hover:bg-blue-700"
          )}
        >
          {isScreenSharing ? (
            <MonitorOff className="h-5 w-5 text-white" />
          ) : (
            <Monitor className="h-5 w-5 text-white" />
          )}
        </Button>

        <Button
          variant="destructive"
          size="lg"
          onClick={handleEndCall}
          className="rounded-full p-3"
        >
          <PhoneOff className="h-5 w-5" />
        </Button>
      </div>

      {/* Error Message */}
      {error && (
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 bg-red-600 text-white px-4 py-2 rounded-lg">
          {error}
        </div>
      )}
    </div>
  );
}
