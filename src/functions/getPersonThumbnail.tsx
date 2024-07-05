import axios from "axios";

const getPersonThumbnail = async (name: string) => {
  try {
    const response = await axios.get(
      import.meta.env.VITE_CHECK_RESULTS_API_URL + "/person-thumbnail",
      {
        params: {
          name,
        },
        headers: {
          "Content-Type": "application/x-www-form-urlencoded",
        },
      }
    );
    const thumbnail = response.data;
    return { thumbnail };
  } catch (error) {
    console.log(error);
  }
  return {};
};

export default getPersonThumbnail;
