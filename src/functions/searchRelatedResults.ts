import axios from "axios";

const searchRelatedResults = async (imageSrc: string | null) => {
  if (imageSrc) {
    try {
      const response = await axios.post(
        import.meta.env.VITE_SEARCH_RELATED_RESULTS_API_URL,
        { imageSrc },
        {
          headers: {
            "Content-Type": "application/json",
          },
        }
      );
      return response.data;
    } catch (error) {
      console.log(error);
    }
  }
  return {};
};

export default searchRelatedResults;
