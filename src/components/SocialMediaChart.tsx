import { Chart as ChartJS, ArcElement, Tooltip, Legend } from "chart.js";
import { Pie } from "react-chartjs-2";
import { useRecoilState } from "recoil";
import { socialMediaStatsState } from "../recoil/state";
import { useEffect } from "react";
import getSocialMediaStats from "../functions/getSocialMediaStats";

ChartJS.register(ArcElement, Tooltip, Legend);

// export const data = {
//   labels: ["Red", "Blue", "Yellow", "Green", "Purple", "Orange"],

//   datasets: [
//     {
//       label: "# of Votes",
//       data: [12, 19, 3, 5, 2, 3],
//       backgroundColor: [
//         "rgba(255, 99, 132, 0.7)",
//         "rgba(54, 162, 235, 0.7)",
//         "rgba(255, 206, 86, 0.7)",
//         "rgba(75, 192, 192, 0.7)",
//         "rgba(153, 102, 255, 0.7)",
//         "rgba(255, 159, 64, 0.7)",
//       ],
//       borderColor: [
//         "rgba(255, 99, 132, 1)",
//         "rgba(54, 162, 235, 1)",
//         "rgba(255, 206, 86, 1)",
//         "rgba(75, 192, 192, 1)",
//         "rgba(153, 102, 255, 1)",
//         "rgba(255, 159, 64, 1)",
//       ],
//       borderWidth: 1,
//     },
//   ],
// };

const SocialMediaChart = () => {
  const [socialMediaStats, SetSocialMediaStats] = useRecoilState(
    socialMediaStatsState
  );
  const fetchStats = () => {
    getSocialMediaStats()
      .then((response) => {
        console.log(response);
        SetSocialMediaStats(response.socialMediaStats);
      })
      .catch((error) => {
        console.log(error);
      });
  };
  useEffect(() => {
    fetchStats();
  }, []);
  if (!socialMediaStats) {
    return <div>No social media stats</div>;
  }
  const data = {
    labels: socialMediaStats.map((stat) => stat._id),
    datasets: [
      {
        label: "Social Media Stats",
        data: socialMediaStats.map((stat) => stat.count),
        backgroundColor: [
          "rgba(255, 99, 132, 0.7)",
          "rgba(54, 162, 235, 0.7)",
          "rgba(255, 206, 86, 0.7)",
          "rgba(75, 192, 192, 0.7)",
          "rgba(153, 102, 255, 0.7)",
          "rgba(255, 159, 64, 0.7)",
        ],
        borderColor: [
          "rgba(255, 99, 132, 1)",
          "rgba(54, 162, 235, 1)",
          "rgba(255, 206, 86, 1)",
          "rgba(75, 192, 192, 1)",
          "rgba(153, 102, 255, 1)",
          "rgba(255, 159, 64, 1)",
        ],
        borderWidth: 1,
      },
    ],
  };

  return <Pie data={data} />;
};

export default SocialMediaChart;
