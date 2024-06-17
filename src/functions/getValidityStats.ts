import axios from "axios";

const getValidityStats = async () => {
  try {
    const response = await axios.get(
      import.meta.env.VITE_CHECK_RESULTS_API_URL + "/validity-stats",
      {
        headers: {
          "Content-Type": "application/json",
        },
      }
    );
    const { totalImages, fakeImages, realImages, unknownImages } =
      response.data;
    return { totalImages, fakeImages, realImages, unknownImages };
  } catch (error) {
    console.log(error);
  }
  return {};
};

export default getValidityStats;
