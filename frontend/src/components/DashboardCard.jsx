import React from "react";
import PieChart from "./PieChart";
import { FaLaptop, FaMobileAlt, FaTabletAlt } from "react-icons/fa";

const randomColor = function () {
  const r = Math.floor(Math.random() * 255);
  const g = Math.floor(Math.random() * 255);
  const b = Math.floor(Math.random() * 255);
  return "rgb(" + r + "," + g + "," + b + ")";
};

function createColorArray(size) {
  const colors = [];
  for (let i = 0; i < size; i++) {
    colors.push(randomColor());
  }
  return colors;
}

const trueFalseColors = ["green", "red"];

export default function DashboardCard({ title, data, type, platformType }) {
  let chartData;

  if (type === "boolean") {
    chartData = {
      labels: ["true", "false"],
      datasets: [
        {
          label: "compliant",
          data: [data.true, data.false],
          backgroundColor: trueFalseColors,
          hoverOffset: 1,
        },
      ],
    };
  } else {
    chartData = {
      labels: data.map((d) => d.version),
      datasets: [
        {
          label: "version",
          platformType,
          data: data.map((d) => d.count),
          backgroundColor: createColorArray(data.length),
          hoverOffset: 1,
        },
      ],
    };
  }

  let platform = "";
  switch (platformType) {
    case "macos":
      platform = <FaLaptop />;
      break;
    case "ios":
      platform = <FaMobileAlt />;
      break;
    case "ipados":
      platform = <FaTabletAlt />;
      break;
  }
  return (
    <>
      <div className='card dashboardCard'>
        <div className='card-body'>
          <PieChart title={title} data={chartData} />
          <div className='position-absolute bottom-0 end-0 platformMargins'>
            {platform}
          </div>
        </div>
      </div>
    </>
  );
}
