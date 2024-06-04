import axios from "axios";

interface PredictionResponse {
  time: number;
  image: Image;
  predictions: Prediction[] | [];
}

interface Image {
  width: number;
  height: number;
}

interface Prediction {
  x: number;
  y: number;
  width: number;
  height: number;
  confidence: number;
  class: "fake" | "real";
  class_id: 0 | 1;
  detection_id: string;
}

const detectDeepfake = async (
  dataUrl: string
): Promise<PredictionResponse | undefined> => {
  if (dataUrl) {
    try {
      const response = await axios({
        method: "POST",
        url: import.meta.env.VITE_DEEPFAKE_DETECTION_API_URL,
        params: {
          api_key: import.meta.env.VITE_DEEPFAKE_DETECTION_API_KEY,
        },
        data: dataUrl,
        headers: {
          "Content-Type": "application/x-www-form-urlencoded",
        },
      });
      const { data } = response;
      return data;
    } catch (error) {
      throw error;
    }
  }
};

export default detectDeepfake;
