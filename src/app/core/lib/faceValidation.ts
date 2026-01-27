import * as faceapi from "face-api.js";

export interface FaceValidationResult {
  valid: boolean;
  error?: string;
}

export interface FaceValidationOptions {
  minFaceSize?: number;
  maxFaceSize?: number;
  targetRadius?: number;
  scoreThreshold?: number;
}

/**
 * Check if a face bounding box is within center circle bounds
 */
export function isFaceInCenter(
  box: { x: number; y: number; width: number; height: number },
  displaySize: { width: number; height: number },
  options?: FaceValidationOptions,
): boolean {
  const centerX = displaySize.width / 2;
  const centerY = displaySize.height / 2;
  const targetRadius =
    options?.targetRadius ||
    Math.min(displaySize.width, displaySize.height) * 0.25;

  const faceCenter = {
    x: box.x + box.width / 2,
    y: box.y + box.height / 2,
  };

  const distance = Math.sqrt(
    Math.pow(faceCenter.x - centerX, 2) + Math.pow(faceCenter.y - centerY, 2),
  );

  const minFaceSize =
    options?.minFaceSize ||
    Math.min(displaySize.width, displaySize.height) * 0.15;
  const maxFaceSize =
    options?.maxFaceSize ||
    Math.min(displaySize.width, displaySize.height) * 0.6;

  return (
    distance < targetRadius &&
    box.width >= minFaceSize &&
    box.width <= maxFaceSize &&
    box.height >= minFaceSize &&
    box.height <= maxFaceSize
  );
}

/**
 * Validate face in an image with center positioning check
 */
export async function validateFaceInImage(
  imageData: string,
  options?: FaceValidationOptions,
): Promise<FaceValidationResult> {
  try {
    const img = document.createElement("img");
    img.src = imageData;

    await new Promise<void>((resolve, reject) => {
      img.onload = () => resolve();
      img.onerror = () => reject(new Error("Failed to load image"));
    });

    const detections = await faceapi
      .detectSingleFace(
        img,
        new faceapi.TinyFaceDetectorOptions({
          inputSize: 416,
          scoreThreshold: options?.scoreThreshold || 0.4,
        }),
      )
      .withFaceLandmarks();

    if (!detections) {
      return {
        valid: false,
        error:
          "❌ No face detected in the uploaded photo. Please upload a clear photo of your face.",
      };
    }

    const faceBox = detections.detection.box;
    const displaySize = { width: img.width, height: img.height };
    const minSize =
      options?.minFaceSize ||
      Math.min(displaySize.width, displaySize.height) * 0.15;
    const maxSize =
      options?.maxFaceSize ||
      Math.min(displaySize.width, displaySize.height) * 0.6;

    if (faceBox.width < minSize || faceBox.height < minSize) {
      return {
        valid: false,
        error: "❌ Face is too small or unclear. Please upload a closer photo.",
      };
    }

    if (faceBox.width > maxSize || faceBox.height > maxSize) {
      return {
        valid: false,
        error: "❌ Face is too close to camera. Please take a step back.",
      };
    }

    if (!isFaceInCenter(faceBox, displaySize, options)) {
      return {
        valid: false,
        error:
          "❌ Face is not centered. Please position your face in the center of the frame.",
      };
    }

    return { valid: true };
  } catch (err) {
    console.error("Face validation error:", err);
    return {
      valid: false,
      error: "❌ Failed to validate face. Please try again.",
    };
  }
}

/**
 * Load face-api.js models from CDN
 */
export async function loadFaceApiModels(): Promise<void> {
  const MODEL_URL = "https://cdn.jsdelivr.net/npm/@vladmandic/face-api/model/";

  await Promise.all([
    faceapi.nets.tinyFaceDetector.loadFromUri(MODEL_URL),
    faceapi.nets.faceLandmark68Net.loadFromUri(MODEL_URL),
    faceapi.nets.faceExpressionNet.loadFromUri(MODEL_URL),
  ]);
}
