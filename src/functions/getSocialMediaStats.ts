import axios from "axios";

const getSocialMediaStats = async () => {
  try {
    const response = await axios.get(
      import.meta.env.VITE_CHECK_RESULTS_API_URL + "/social-media-stats",
      {
        headers: {
          "Content-Type": "application/json",
        },
      }
    );
    console.log(response);
    const socialMediaStats = response.data;
    return { socialMediaStats };
  } catch (error) {
    console.log(error);
  }
  return {};
};

export default getSocialMediaStats;
