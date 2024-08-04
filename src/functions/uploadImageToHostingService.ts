import axios from "axios";

const uploadImageToHostingService = async (imageUrl: string) => {
  console.log("imageUrl", imageUrl);
  if (imageUrl) {
    // if (typeof imageUrl === "string") {
    //   return imageUrl;
    // }

    const regex = /^data:image\/(png|jpeg|jpg);base64,/;
    let shortenedBase64Url = imageUrl.replace(regex, "");
    console.log("shortenedBase64Url", shortenedBase64Url);
    const body = new FormData();
    body.append("image", shortenedBase64Url);
    // body.append("expiration", "300");

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
