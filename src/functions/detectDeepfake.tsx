import axios from "axios";

const detectDeepfake = async (dataUrl: any) => {
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
      console.log("deepfake detection response", data);
      return data;
    } catch (error) {
      throw error;
    }
  }
  return {};
};

export default detectDeepfake;
