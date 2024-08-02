import axios from "axios";

//TODO: type
const getResultHistory = async () => {
  try {
    const response = await axios.get(
      import.meta.env.VITE_CHECK_RESULTS_API_URL + "/result-history",
      {
        headers: {
          "Content-Type": "application/x-www-form-urlencoded",
        },
      }
    );
    const { data } = response;
    return { data };
  } catch (error) {
    console.log(error);
    return {};
  }
};

export default getResultHistory;
