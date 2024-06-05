const uploadImageToHostingService = async (imageUrl: string | File) => {
  if (imageUrl) {
    const formData = new FormData();
    formData.append("source", imageUrl);
    formData.append("key", import.meta.env.VITE_IMAGE_HOSTING_API_KEY);
    try {
      const response = await fetch(import.meta.env.VITE_IMAGE_HOSTING_API_URL, {
        method: "POST",
        body: formData,
      });
      const { success, image } = await response.json();
      if (image && success.code === 200) {
        return image.url;
      } else {
        throw new Error("Failed to upload image to hosting service");
      }
    } catch (error) {
      throw error;
    }
  }
};

export default uploadImageToHostingService;
