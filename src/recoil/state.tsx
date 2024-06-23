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
  result: "FAKE" | "REAL" | "UNKNOWN";
  confidence: number;
} | null>({
  key: "deepfakePredictionResultState",
  default: null,
});

interface SearchResult {
  title: string;
  favicon: string;
  redirect_link: string;
}
export const searchResultsState = atom<SearchResult[] | null>({
  key: "searchResultsState",
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

type ValidityStats = {
  totalImages: number;
  fakeImages: number;
  realImages: number;
  unknownImages: number;
};
export const validityStatsState = atom<ValidityStats | null>({
  key: "validityStatsState",
  default: null,
});

type SocialMediaStat = {
  _id: string;
  count: number;
};

export const socialMediaStatsState = atom<SocialMediaStat[] | null>({
  key: "socialMediaStatsState",
  default: null,
});
