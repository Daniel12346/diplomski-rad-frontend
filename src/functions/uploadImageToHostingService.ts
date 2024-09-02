import axios from "axios";

const uploadImageToHostingService = async (
  // file: File | null,
  dataUrl: string | null
) => {
  if (!dataUrl) {
    throw new Error("No image data provided to upload");
  }
  const body = new FormData();
  body.append("imagePath", dataUrl);
  // if (file) {
  //   body.append("image", file);
  // }

  try {
    const { data } = await axios({
      method: "POST",
      url: import.meta.env.VITE_IMAGE_UPLOAD_URL,
      data: body,
      headers: {
        "Content-Type": "multipart/form-data",
      },
    });
    console.log("data", data);
    return data.secure_url;
  } catch (error) {
    console.log("error", error);
    throw error;
  }
};

export default uploadImageToHostingService;
