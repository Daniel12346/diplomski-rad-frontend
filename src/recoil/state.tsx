import { atom } from "recoil";

export const imageState = atom<File | null>({
  key: "imageState",
  default: null,
});
export const imageSrcState = atom<string | null>({
  key: "imageSrcState",
  default: null,
});

export const recognizedFacesState = atom<string[] | null>({
  key: "recognizedFacesState",
  default: null,
});
export const boundingBoxOverlaySrcState = atom<string | null>({
  key: "boundingBoxOverlaySrcState",
  default: null,
});
export const processingStatusState = atom<"IDLE" | "LOADING" | "COMPLETED">({
  key: "processingStatusState",
  default: "IDLE",
});
export const deepfakePredictionResultState = atom<{
  isDeepfake: boolean;
  confidence: number;
} | null>({
  key: "deepfakePredictionResultState",
  default: null,
});
