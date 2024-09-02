import axios from "axios";

const uploadImageToHostingService = async (
  // file: File | null,
  dataUrl: string | null
) => {
  const body = new FormData();
  // if (file) {
  //   body.append("image", file);
  // }
  if (dataUrl) {
    body.append("imagePath", dataUrl);
  }
  try {
    const { data } = await axios({
      method: "POST",
      url: import.meta.env.VITE_IMAGE_UPLOAD_URL,
      data: body,
      headers: {
        "Content-Type": "multipart/form-data",
      },
    });
    return data.imageUrl;
  } catch (error) {
    throw error;
  }
};

export default uploadImageToHostingService;
