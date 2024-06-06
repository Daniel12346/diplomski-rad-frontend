import axios from "axios";

const recognizeFace = async (imageSrc: string | null) => {
  if (imageSrc) {
    try {
      // const formData = new FormData();
      // formData.append("imageSrc", imageSrc);
      const response = await axios.post(
        import.meta.env.VITE_FACE_RECOGNITION_API_URL,
        { imageSrc },
        {
          headers: {
            "Content-Type": "application/json",
          },
        }
      );
      //boundingBoxOverlaySrc is the url of an image with just the face bounding boxes drawn on it
      const { matchResults, boundingBoxOverlaySrc } = response.data;
      const recognizedFaces = matchResults?.length
        ? matchResults.map((e: any) => e._label)
        : null;
      return { recognizedFaces, matchResults, boundingBoxOverlaySrc };
    } catch (error) {
      console.log(error);
    }
  }
  return {};
};

export default recognizeFace;
