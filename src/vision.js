const TASKS_URL = 'https://cdn.jsdelivr.net/npm/@mediapipe/tasks-vision@0.10.22/+esm';
const WASM_URL = 'https://cdn.jsdelivr.net/npm/@mediapipe/tasks-vision@0.10.22/wasm';
const GESTURE_MODEL = 'https://storage.googleapis.com/mediapipe-models/gesture_recognizer/gesture_recognizer/float16/1/gesture_recognizer.task';
const FACE_MODEL = 'https://storage.googleapis.com/mediapipe-models/face_landmarker/face_landmarker/float16/1/face_landmarker.task';
let gestureRecognizer, faceLandmarker, lastVideoTime = -1;

export async function loadVision() {
  const { FilesetResolver, GestureRecognizer, FaceLandmarker } = await import(TASKS_URL);
  const fileset = await FilesetResolver.forVisionTasks(WASM_URL);
  gestureRecognizer = await GestureRecognizer.createFromOptions(fileset, {
    baseOptions: { modelAssetPath: GESTURE_MODEL, delegate: 'GPU' }, runningMode: 'VIDEO', numHands: 1,
    minHandDetectionConfidence: 0.55, minTrackingConfidence: 0.5, minHandPresenceConfidence: 0.5
  });
  faceLandmarker = await FaceLandmarker.createFromOptions(fileset, {
    baseOptions: { modelAssetPath: FACE_MODEL, delegate: 'GPU' }, runningMode: 'VIDEO', numFaces: 1,
    minFaceDetectionConfidence: 0.5, minFacePresenceConfidence: 0.5, minTrackingConfidence: 0.5
  });
}

export function detect(video, nowMs) {
  if (!gestureRecognizer || !faceLandmarker || video.readyState < 2) return { gestureLabel:null, gestureScore:0, handLandmarks:null, faceLandmarks:null };
  if (video.currentTime === lastVideoTime) return { gestureLabel:null, gestureScore:0, handLandmarks:null, faceLandmarks:null, stale:true };
  lastVideoTime = video.currentTime;
  const handResult = gestureRecognizer.recognizeForVideo(video, nowMs);
  const faceResult = faceLandmarker.detectForVideo(video, nowMs);
  const top = handResult.gestures?.[0]?.[0];
  return { gestureLabel:top?.categoryName ?? null, gestureScore:top?.score ?? 0, handLandmarks:handResult.landmarks?.[0] ?? null, faceLandmarks:faceResult.faceLandmarks?.[0] ?? null };
}
