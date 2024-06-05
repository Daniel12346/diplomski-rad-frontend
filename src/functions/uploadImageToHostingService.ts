import axios from "axios";

const uploadImageToHostingService = async (imageUrl: string | File) => {
  if (imageUrl) {
    const body = new FormData();
    body.append("image", imageUrl);
    body.append("expiration", "300");

    try {
      const { data } = await axios.post(
        import.meta.env.VITE_IMAGE_HOSTING_API_URL +
          `?key=${import.meta.env.VITE_IMAGE_HOSTING_API_KEY}`,
        body,
        {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        }
      );
      return data.data.url;
    } catch (error) {
      throw error;
    }
  }
};

export default uploadImageToHostingService;
