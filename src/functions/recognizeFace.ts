const recognizeFace = async (image: File | null) => {
  console.log("image", image);

  if (image) {
    try {
      const formData = new FormData();
      formData.append("image", image);
      const response = await fetch(
        `${import.meta.env.VITE_FACE_RECOGNITION_URL}`,
        {
          method: "POST",
          body: formData,
        }
      );
      const data = await response.json();
      //boundingBoxOverlaySrc is the url of an image with just the face bounding boxes drawn on it
      const { matchResults, boundingBoxOverlaySrc } = data;
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
