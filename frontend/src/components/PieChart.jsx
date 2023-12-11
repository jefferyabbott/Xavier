import React from "react";
import { Pie } from "react-chartjs-2";
import { Chart, ArcElement, Legend, Title, SubTitle } from "chart.js";
Chart.register(ArcElement, Legend, Title, SubTitle);

export default function PieChart({ title, data }) {
  return (
    <div className='chart chartDimens'>
      <Pie
        data={data}
        width={"100%"}
        height={"100%"}
        options={{
          plugins: {
            title: {
              display: true,
              text: title,
            },
            // subtitle: {
            //   display: true,
            //   text: subtitle,
            //   position: "bottom",
            // },
            legend: {
              labels: {
                usePointStyle: true,
              },
              display: true,
              position: "right",
            },
          },
          onClick: function (evt) {
            // const itemIndex = getElementAtEvent(evt)[0]._index;

            const chartId = evt.chart.canvas.id; // this returns null in react app

            // const idx = item[0].index;
            // const labelName = evt.chart.config.data.labels[idx];
            console.group();

            console.log(evt);
            // console.log(`chartId: ${chartId}`);
            // console.log(`idx: ${idx}`);
            // console.log(`labelName: ${labelName}`);
            console.groupEnd();
          },
          maintainAspectRatio: true,
        }}
      />
    </div>
  );
}
