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
  result: "fake" | "real" | "unknown";
  confidence: number;
} | null>({
  key: "deepfakePredictionResultState",
  default: null,
});

export const shouldRecognizeFaceState = atom<boolean>({
  key: "shouldRecognizeFaceState",
  default: true,
});

export const shouldCheckDeepfakeState = atom<boolean>({
  key: "shouldCheckDeepfakeState",
  default: true,
});

export const shouldSearchRelatedResultsState = atom<boolean>({
  key: "shouldSearchRelatedResultsState",
  default: true,
});
