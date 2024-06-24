import { Chart as ChartJS, ArcElement, Tooltip, Legend } from "chart.js";
import { Pie } from "react-chartjs-2";
import { useRecoilState } from "recoil";
import { validityStatsState } from "../recoil/state";
import { useEffect } from "react";
import getValidityStats from "../functions/getValidityStats";
import { useColorMode } from "@chakra-ui/react";

ChartJS.register(ArcElement, Tooltip, Legend);

const ValidityChart = () => {
  const [validityStats, setValidityStats] = useRecoilState(validityStatsState);
  const { colorMode } = useColorMode();

  const fetchStats = () => {
    getValidityStats()
      .then((response) => {
        setValidityStats({
          totalImages: response.totalImages,
          fakeImages: response.fakeImages,
          realImages: response.realImages,
          unknownImages: response.unknownImages,
        });
      })
      .catch((error) => {
        console.log(error);
      });
  };
  useEffect(() => {
    fetchStats();
  }, []);
  if (!validityStats) {
    return <div>No validity stats</div>;
  }
  const data = {
    labels: ["Fake", "Real", "Unknown"],
    datasets: [
      {
        label: "Validity Stats",
        data: [
          validityStats.fakeImages,
          validityStats.realImages,
          validityStats.unknownImages,
        ],
        backgroundColor: [
          "rgba(255, 99, 132, 0.7)",
          "rgba(54, 162, 235, 0.7)",
          "rgba(255, 206, 86, 0.7)",
        ],
        borderColor: [
          "rgba(255, 99, 132, 1)",
          "rgba(54, 162, 235, 1)",
          "rgba(255, 206, 86, 1)",
        ],
        borderWidth: 1,
      },
    ],
  };

  return (
    <Pie
      data={data}
      options={{
        plugins: {
          legend: {
            labels: {
              color: colorMode === "light" ? "black" : "white",
            },
          },
        },
      }}
    />
  );
};

export default ValidityChart;
