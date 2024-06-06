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

            const chartType = evt.chart.config._config.data.datasets[0].label;
            const chartLabel = evt.chart.config._config.options.plugins.title.text;

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

            // show compliance boolean results
            if (chartType === 'compliant') {
              if (chartLabel === 'FileVault Encryption') {
                navigate(`/macos/encryptionStatus/${chartValue}`)
              } else if (chartLabel === 'System Integrity Protection') {
                navigate(`/macos/sipStatus/${chartValue}`);
              } else if (chartLabel === 'MDM Profile Installed') {
                navigate(`/macos/mdmEnrolled/${chartValue}`);
              }
            }

            // show installed profiles
            if (chartType === 'profileInstalledFormacos') {
              navigate(`/installedProfile/macos/${chartLabel}/${chartValue}`);
            } else if (chartType === 'profileInstalledForios') {
              navigate(`/installedProfile/ios/${chartLabel}/${chartValue}`);
            } else if (chartType === 'profileInstalledForipados') {
              navigate(`/installedProfile/ipados/${chartLabel}/${chartValue}`);
            }

            // show verison types
            if (chartType === 'version') {
              if (chartLabel === 'macOS version') {
                navigate(`/devicesByOSVersion/mac/${chartValue}`);
              } else if (chartLabel === 'iPadOS version') {
                navigate(`/devicesByOSVersion/iPad/${chartValue}`);
              } else if (chartLabel === 'iOS version') {
                navigate(`/devicesByOSVersion/iPhone/${chartValue}`);
              } else {
                navigate(`/devicesWithAppVersion/${evt.chart.config._config.data.datasets[0].platformType}/${chartLabel}/${chartValue}`);
              }
            }       
  
        },
          maintainAspectRatio: true,
        }}
      />
    </div>
  );
}
