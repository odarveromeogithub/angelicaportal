import React, { useEffect, useRef, useState, useCallback } from "react";
import { Button } from "@/app/core/components/ui/button";
import { Camera, Upload, X } from "lucide-react";
import { toast } from "sonner";
import {
  loadFaceApiModels,
  validateFaceInImage,
} from "@/app/core/lib/faceValidation";
import { useFaceDetection } from "@/app/core/hooks/useFaceDetection";

interface FacialVerificationCameraProps {
  onCapture: (imageData: string) => void;
  onClose: () => void;
}

export const FacialVerificationCamera: React.FC<
  FacialVerificationCameraProps
> = ({ onCapture, onClose }) => {
  const videoRef = useRef<HTMLVideoElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const streamRef = useRef<MediaStream | null>(null);

  const [isLoading, setIsLoading] = useState(true);
  const [showUpload, setShowUpload] = useState(false);

  const captureSelfie = useCallback(() => {
    if (!videoRef.current || !canvasRef.current) return;

    const video = videoRef.current;
    const canvas = canvasRef.current;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    canvas.width = video.videoWidth;
    canvas.height = video.videoHeight;
    ctx.drawImage(video, 0, 0, canvas.width, canvas.height);

    const imageData = canvas.toDataURL("image/png");
    onCapture(imageData);
    onClose();
  }, [onCapture, onClose]);

  const {
    isFaceCentered,
    isCapturing,
    countdownSeconds,
    startDetection,
    stopDetection,
  } = useFaceDetection(videoRef, canvasRef, {
    onAutoCapture: captureSelfie,
  });

  // Load face-api models
  useEffect(() => {
    const loadModels = async () => {
      try {
        await loadFaceApiModels();
        setIsLoading(false);
      } catch (err) {
        console.error("Failed to load face detection models:", err);
        toast.error("Failed to load face detection models");
      }
    };

    loadModels();
  }, []);

  // Start camera and face detection
  useEffect(() => {
    if (isLoading) return;

    const startCamera = async () => {
      try {
        const stream = await navigator.mediaDevices.getUserMedia({
          video: {
            width: { ideal: 640 },
            height: { ideal: 480 },
            facingMode: "user",
          },
        });

        if (videoRef.current) {
          videoRef.current.srcObject = stream;
          streamRef.current = stream;

          videoRef.current.onloadedmetadata = () => {
            videoRef.current?.play();
            startDetection();
          };
        }
      } catch (err) {
        console.error("Camera access error:", err);
        toast.error("Unable to access camera. Please check permissions.");
        onClose();
      }
    };

    startCamera();

    return () => {
      stopDetection();
      if (streamRef.current) {
        streamRef.current.getTracks().forEach((track) => track.stop());
      }
    };
  }, [isLoading, onClose, startDetection, stopDetection]);

  const handleUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    e.target.value = "";

    toast.loading("Validating face in photo...", { id: "upload-validation" });

    try {
      const reader = new FileReader();
      reader.onload = async (event) => {
        const imageData = event.target?.result as string;

        const result = await validateFaceInImage(imageData);

        if (!result.valid) {
          toast.error(result.error || "Validation failed", {
            id: "upload-validation",
          });
          return;
        }

        if (streamRef.current) {
          streamRef.current.getTracks().forEach((track) => track.stop());
        }
        stopDetection();

        onCapture(imageData);
        toast.success("✓ Photo uploaded successfully with face detected!", {
          id: "upload-validation",
        });
      };
      reader.readAsDataURL(file);
    } catch (err) {
      console.error("Upload error:", err);
      toast.error("❌ Failed to upload photo", { id: "upload-validation" });
    }
  };

  if (isLoading) {
    return (
      <div className="flex flex-col items-center justify-center gap-4 p-8 bg-slate-50 rounded-lg">
        <div className="w-12 h-12 border-4 border-slate-200 border-t-blue-500 rounded-full animate-spin" />
        <p className="text-sm text-slate-600">Loading face detection...</p>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <div
        className="relative w-full bg-black rounded-lg overflow-hidden"
        style={{ aspectRatio: "4/3" }}
      >
        <video
          ref={videoRef}
          autoPlay
          playsInline
          muted
          className="w-full h-full object-cover"
        />
        <canvas ref={canvasRef} className="absolute inset-0 w-full h-full" />

        {/* Overlay guidance */}
        <div className="absolute inset-0 flex flex-col items-center justify-between p-4 pointer-events-none">
          <div className="text-white text-sm font-medium text-center">
            {countdownSeconds !== null ? (
              <div className="flex flex-col items-center gap-2">
                <span className="text-green-400 font-semibold">
                  Capturing in
                </span>
                <div className="w-16 h-16 rounded-full border-4 border-green-400 flex items-center justify-center">
                  <span className="text-2xl font-bold text-green-400">
                    {countdownSeconds}
                  </span>
                </div>
              </div>
            ) : null}
          </div>

          {/* Semi-transparent mask */}
          <svg className="absolute inset-0 w-full h-full" viewBox="0 0 640 480">
            <defs>
              <mask id="face-mask">
                <rect width="640" height="480" fill="white" />
                <ellipse cx="320" cy="240" rx="120" ry="140" fill="black" />
              </mask>
            </defs>
            <rect
              width="640"
              height="480"
              fill="black"
              opacity="0.3"
              mask="url(#face-mask)"
            />
          </svg>
        </div>
      </div>

      {/* Controls */}
      <div className="flex gap-2">
        <Button
          onClick={captureSelfie}
          disabled={!isFaceCentered || isCapturing || countdownSeconds !== null}
          className="flex-1"
          size="lg"
        >
          <Camera className="w-4 h-4 mr-2" />
          {isCapturing ? "Capturing..." : "Capture Selfie"}
        </Button>

        {!showUpload && (
          <Button
            onClick={() => setShowUpload(true)}
            variant="outline"
            size="lg"
          >
            <Upload className="w-4 h-4" />
          </Button>
        )}

        <Button onClick={onClose} variant="outline" size="lg">
          <X className="w-4 h-4" />
        </Button>
      </div>

      {/* Upload input */}
      {showUpload && (
        <div className="flex gap-2">
          <input
            type="file"
            accept="image/*"
            onChange={handleUpload}
            className="flex-1 px-4 py-2 border border-slate-200 rounded-md text-sm"
          />
          <Button onClick={() => setShowUpload(false)} variant="outline">
            Cancel
          </Button>
        </div>
      )}

      <p className="text-xs text-slate-500 text-center">
        Position your face in the center circle - will auto-capture after 1
        second. Button enabled only when face is centered.
      </p>
    </div>
  );
};
