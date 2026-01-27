import React, { useEffect, useRef, useState } from "react";
import * as faceapi from "face-api.js";
import { Button } from "@/app/core/components/ui/button";
import { Camera, Upload, X } from "lucide-react";
import { toast } from "sonner";

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
  const detectionIntervalRef = useRef<NodeJS.Timeout | null>(null);
  const steadyCounterRef = useRef(0);
  const autoCaptureTimerRef = useRef<NodeJS.Timeout | null>(null);

  const [isLoading, setIsLoading] = useState(true);
  const [isFaceCentered, setIsFaceCentered] = useState(false);
  const [isCapturing, setIsCapturing] = useState(false);
  const [showUpload, setShowUpload] = useState(false);
  const [countdownSeconds, setCountdownSeconds] = useState<number | null>(null);

  // Load face-api models
  useEffect(() => {
    const loadModels = async () => {
      try {
        const MODEL_URL =
          "https://cdn.jsdelivr.net/npm/@vladmandic/face-api/model/";
        await Promise.all([
          faceapi.nets.tinyFaceDetector.loadFromUri(MODEL_URL),
          faceapi.nets.faceLandmark68Net.loadFromUri(MODEL_URL),
          faceapi.nets.faceExpressionNet.loadFromUri(MODEL_URL),
        ]);
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

          // Wait for video to be ready before starting detection
          videoRef.current.onloadedmetadata = () => {
            videoRef.current?.play();
            // Start face detection loop with faster interval
            detectionIntervalRef.current = setInterval(detectFace, 150);
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
      if (detectionIntervalRef.current) {
        clearInterval(detectionIntervalRef.current);
      }
      if (streamRef.current) {
        streamRef.current.getTracks().forEach((track) => track.stop());
      }
      if (autoCaptureTimerRef.current) {
        clearTimeout(autoCaptureTimerRef.current);
      }
    };
  }, [isLoading, onClose]);

  // Check if face is within center circle bounds
  const isFaceInCenter = (box: any, displaySize: any): boolean => {
    const centerX = displaySize.width / 2;
    const centerY = displaySize.height / 2;
    const targetRadius = Math.min(displaySize.width, displaySize.height) * 0.25; // 25% of screen size

    // Get face center and dimensions
    const faceCenter = {
      x: box.x + box.width / 2,
      y: box.y + box.height / 2,
    };

    // Calculate distance from center
    const distance = Math.sqrt(
      Math.pow(faceCenter.x - centerX, 2) + Math.pow(faceCenter.y - centerY, 2),
    );

    // Check if face is within circle and not too small
    const minFaceSize = Math.min(displaySize.width, displaySize.height) * 0.15; // Min face width/height
    const maxFaceSize = Math.min(displaySize.width, displaySize.height) * 0.6; // Max face width/height

    return (
      distance < targetRadius &&
      box.width >= minFaceSize &&
      box.width <= maxFaceSize &&
      box.height >= minFaceSize &&
      box.height <= maxFaceSize
    );
  };

  const detectFace = async () => {
    if (!videoRef.current || !canvasRef.current) return;

    try {
      const detections = await faceapi
        .detectSingleFace(
          videoRef.current,
          new faceapi.TinyFaceDetectorOptions({
            inputSize: 416,
            scoreThreshold: 0.4, // Lower threshold for better detection
          }),
        )
        .withFaceLandmarks();

      const canvas = canvasRef.current;
      const displaySize = {
        width: videoRef.current.videoWidth || videoRef.current.width,
        height: videoRef.current.videoHeight || videoRef.current.height,
      };

      // Ensure canvas has actual width/height attributes
      if (!canvas.width) canvas.width = displaySize.width;
      if (!canvas.height) canvas.height = displaySize.height;

      faceapi.matchDimensions(canvas, displaySize);
      const resizedDetections = faceapi.resizeResults(detections, displaySize);

      const ctx = canvas.getContext("2d");
      if (!ctx) return;

      // Clear canvas
      ctx.clearRect(0, 0, canvas.width, canvas.height);

      if (resizedDetections) {
        // Increment steady counter only if face is in center
        const box = resizedDetections.detection.box;
        const isInCenter = isFaceInCenter(box, displaySize);
        setIsFaceCentered(isInCenter);

        if (isInCenter) {
          steadyCounterRef.current += 1;
        } else {
          steadyCounterRef.current = 0;
          setCountdownSeconds(null);
          if (autoCaptureTimerRef.current) {
            clearTimeout(autoCaptureTimerRef.current);
            autoCaptureTimerRef.current = null;
          }
        }

        // Auto-capture after face is steady for ~1 second (7 detections at 150ms interval)
        if (
          steadyCounterRef.current >= 7 &&
          !isCapturing &&
          !autoCaptureTimerRef.current
        ) {
          startAutoCaptureCountdown();
        }
      } else {
        setIsFaceCentered(false);
        steadyCounterRef.current = 0;
        setCountdownSeconds(null);

        // Cancel auto-capture if face is lost
        if (autoCaptureTimerRef.current) {
          clearTimeout(autoCaptureTimerRef.current);
          autoCaptureTimerRef.current = null;
        }
      }
    } catch (err) {
      // Silent catch - detection can fail occasionally
    }
  };

  const startAutoCaptureCountdown = () => {
    let timeLeft = 3; // 3 seconds countdown
    setCountdownSeconds(timeLeft);

    const countdown = setInterval(() => {
      timeLeft -= 1;
      setCountdownSeconds(timeLeft);

      if (timeLeft <= 0) {
        clearInterval(countdown);
        autoCaptureTimerRef.current = null;
        captureSelfie();
      }
    }, 1000);

    autoCaptureTimerRef.current = countdown as unknown as NodeJS.Timeout;
  };

  const captureSelfie = async () => {
    if (!videoRef.current || !canvasRef.current) return;

    setIsCapturing(true);

    try {
      const canvas = canvasRef.current;
      const ctx = canvas.getContext("2d");
      if (!ctx) return;

      canvas.width = videoRef.current.videoWidth;
      canvas.height = videoRef.current.videoHeight;

      ctx.drawImage(videoRef.current, 0, 0);
      const imageData = canvas.toDataURL("image/jpeg", 0.95);

      // Stop camera
      if (streamRef.current) {
        streamRef.current.getTracks().forEach((track) => track.stop());
      }
      if (detectionIntervalRef.current) {
        clearInterval(detectionIntervalRef.current);
      }

      onCapture(imageData);
      toast.success("Selfie captured successfully");
    } catch (err) {
      console.error("Capture error:", err);
      toast.error("Failed to capture selfie");
    } finally {
      setIsCapturing(false);
    }
  };

  const handleUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    try {
      const reader = new FileReader();
      reader.onload = (event) => {
        const imageData = event.target?.result as string;

        // Stop camera
        if (streamRef.current) {
          streamRef.current.getTracks().forEach((track) => track.stop());
        }
        if (detectionIntervalRef.current) {
          clearInterval(detectionIntervalRef.current);
        }

        onCapture(imageData);
        toast.success("Photo uploaded successfully");
      };
      reader.readAsDataURL(file);
    } catch (err) {
      console.error("Upload error:", err);
      toast.error("Failed to upload photo");
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
