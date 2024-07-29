import axios from "axios";

interface SaveCheckResultDataProps {
  imageUrl: string;
  //TODO: specify possible values for socialMediaName
  socialMediaName: string;
  recognizedFace: string;
  result: "FAKE" | "REAL" | "UNKNOWN";
  confidence: number | undefined;
}
const saveCheckResultData = async ({
  imageUrl,
  socialMediaName,
  recognizedFace,
  result,
  confidence,
}: SaveCheckResultDataProps) => {
  if (imageUrl && socialMediaName && recognizedFace && result) {
    try {
      const response = await axios.post(
        import.meta.env.VITE_CHECK_RESULTS_API_URL + "/save-result-data",
        { imageUrl, socialMediaName, recognizedFace, result, confidence },
        {
          headers: {
            "Content-Type": "application/json",
          },
        }
      );
      const { message } = response.data;
      message && console.log(message);
    } catch (error) {
      console.log(error);
    }
  }
};

export default saveCheckResultData;
