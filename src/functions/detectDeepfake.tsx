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
  dataUrl: String
): Promise<PredictionResponse | undefined> => {
  console.log(
    import.meta.env.VITE_DEEPFAKE_DETECTION_API_URL,
    import.meta.env.VITE_DEEPFAKE_DETECTION_API_KEY
  );
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
      console.log(data);
      return data;
    } catch (error) {
      throw error;
    }
  }
};

export default detectDeepfake;
