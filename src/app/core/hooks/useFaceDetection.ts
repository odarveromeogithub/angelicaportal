import { useRef, useState, useEffect, useCallback } from "react";
import * as faceapi from "face-api.js";
import { isFaceInCenter } from "../lib/faceValidation";

interface UseFaceDetectionOptions {
  onAutoCapture?: () => void;
  detectionInterval?: number;
  steadyThreshold?: number;
}

export function useFaceDetection(
  videoRef: React.RefObject<HTMLVideoElement | null>,
  canvasRef: React.RefObject<HTMLCanvasElement | null>,
  options: UseFaceDetectionOptions = {},
) {
  const {
    onAutoCapture,
    detectionInterval = 150,
    steadyThreshold = 7,
  } = options;

  const detectionIntervalRef = useRef<NodeJS.Timeout | null>(null);
  const steadyCounterRef = useRef(0);
  const autoCaptureTimerRef = useRef<NodeJS.Timeout | null>(null);

  const [isFaceCentered, setIsFaceCentered] = useState(false);
  const [isCapturing, setIsCapturing] = useState(false);
  const [countdownSeconds, setCountdownSeconds] = useState<number | null>(null);

  const startAutoCaptureCountdown = useCallback(() => {
    let timeLeft = 3;
    setCountdownSeconds(timeLeft);
    setIsCapturing(true);

    const countdown = setInterval(() => {
      timeLeft -= 1;
      setCountdownSeconds(timeLeft);

      if (timeLeft === 0) {
        clearInterval(countdown);
        setCountdownSeconds(null);
        onAutoCapture?.();
        steadyCounterRef.current = 0;
        setIsCapturing(false);
      }
    }, 1000);

    autoCaptureTimerRef.current = countdown as unknown as NodeJS.Timeout;
  }, [onAutoCapture]);

  const detectFace = useCallback(async () => {
    if (!videoRef.current || !canvasRef.current) return;

    try {
      const detections = await faceapi
        .detectSingleFace(
          videoRef.current,
          new faceapi.TinyFaceDetectorOptions({
            inputSize: 416,
            scoreThreshold: 0.4,
          }),
        )
        .withFaceLandmarks();

      const canvas = canvasRef.current;
      const displaySize = {
        width: videoRef.current.videoWidth || videoRef.current.width,
        height: videoRef.current.videoHeight || videoRef.current.height,
      };

      if (!canvas.width) canvas.width = displaySize.width;
      if (!canvas.height) canvas.height = displaySize.height;

      faceapi.matchDimensions(canvas, displaySize);
      const resizedDetections = faceapi.resizeResults(detections, displaySize);

      const ctx = canvas.getContext("2d");
      if (!ctx) return;

      ctx.clearRect(0, 0, canvas.width, canvas.height);

      if (resizedDetections) {
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

        if (
          steadyCounterRef.current >= steadyThreshold &&
          !isCapturing &&
          !autoCaptureTimerRef.current
        ) {
          startAutoCaptureCountdown();
        }
      } else {
        setIsFaceCentered(false);
        steadyCounterRef.current = 0;
        setCountdownSeconds(null);

        if (autoCaptureTimerRef.current) {
          clearTimeout(autoCaptureTimerRef.current);
          autoCaptureTimerRef.current = null;
        }
      }
    } catch (err) {
      // Silent catch - detection can fail occasionally
    }
  }, [
    videoRef,
    canvasRef,
    isCapturing,
    steadyThreshold,
    startAutoCaptureCountdown,
  ]);

  const startDetection = useCallback(() => {
    if (detectionIntervalRef.current) {
      clearInterval(detectionIntervalRef.current);
    }
    detectionIntervalRef.current = setInterval(detectFace, detectionInterval);
  }, [detectFace, detectionInterval]);

  const stopDetection = useCallback(() => {
    if (detectionIntervalRef.current) {
      clearInterval(detectionIntervalRef.current);
      detectionIntervalRef.current = null;
    }
    if (autoCaptureTimerRef.current) {
      clearTimeout(autoCaptureTimerRef.current);
      autoCaptureTimerRef.current = null;
    }
    steadyCounterRef.current = 0;
    setCountdownSeconds(null);
    setIsCapturing(false);
  }, []);

  useEffect(() => {
    return () => {
      stopDetection();
    };
  }, [stopDetection]);

  return {
    isFaceCentered,
    isCapturing,
    countdownSeconds,
    startDetection,
    stopDetection,
  };
}
