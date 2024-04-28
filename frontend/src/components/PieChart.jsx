import React from "react";
import { Pie } from "react-chartjs-2";
import { Chart, ArcElement, Legend, Title, SubTitle } from "chart.js";
import { useNavigate } from "react-router-dom";
Chart.register(ArcElement, Legend, Title, SubTitle);

export default function PieChart({ title, data }) {
  const navigate = useNavigate();
  return (
    <div className='chart chartDimens'>
      <Pie
        data={data}
        width={"100%"}
        height={"100%"}
        options={{
          interaction: {
            includeInvisible: true
          },
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

          // Event handler for a click on a chart element
          onClick: function (evt, elements) {


              // chart type (boolean, app, compliance, config profile, etc)
            const chartType = evt.chart.config._config.data.datasets[0].label;
            console.log(`CHART TYPE: ${chartType}`);
   // chart label (DONE)
            const chartLabel = evt.chart.config._config.options.plugins.title.text;
            console.log(`CHART LABEL: ${chartLabel}`);
    // slice value

    let clickedElement = '';
    let datasetIndex = 0;

              if (elements[0]) {
                clickedElement = elements[0];
                datasetIndex = clickedElement.index;
              } else {
                clickedElement = elements;
                datasetIndex = 0;
              }
            
            const chartValue = data.labels[datasetIndex];
            
            console.log(`chart value: ${chartValue}`);

            // show boolean results
            if (chartType === 'compliant') {
              if (chartLabel === 'FileVault Encryption') {
                navigate(`/macos/encryptionStatus/${chartValue}`)
              } else if (chartLabel === 'System Integrity Protection') {
                navigate(`/macos/sipStatus/${chartValue}`);
              }
            // /macos/encryptionStatus/:FDE_Enabled
              // /dashboardCardDetail/bool?key=${chartLabel},value=${chartValue}
            }

            //    /dashboardCardDetail/macOSVersion/:version
            //    /dashboardCardDetail/iOSVersion/:version
            //    /dashboardCardDetail/iPadOSVersion/:version

          
  
        },
          maintainAspectRatio: true,
        }}
      />
    </div>
  );
}
