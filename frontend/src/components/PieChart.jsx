import React, { useMemo, useCallback } from 'react';
import { Pie } from 'react-chartjs-2';
import { Chart, ArcElement, Legend, Title, SubTitle } from 'chart.js';
import { useNavigate } from 'react-router-dom';

// Register Chart.js components once outside the component
Chart.register(ArcElement, Legend, Title, SubTitle);

// Navigation route mapping
const ROUTE_MAPPING = {
  compliant: {
    'FileVault Encryption': (value) => `/macos/encryptionStatus/${value}`,
    'System Integrity Protection': (value) => `/macos/sipStatus/${value}`,
    'MDM Profile Installed': (value) => `/macos/mdmEnrolled/${value}`,
  },
  profileInstalled: {
    macos: (title, value) => `/installedProfile/macos/${title}/${value}`,
    ios: (title, value) => `/installedProfile/ios/${title}/${value}`,
    ipados: (title, value) => `/installedProfile/ipados/${title}/${value}`,
  },
  version: {
    'macOS version': (value) => `/devicesByOSVersion/mac/${value}`,
    'iPadOS version': (value) => `/devicesByOSVersion/iPad/${value}`,
    'iOS version': (value) => `/devicesByOSVersion/iPhone/${value}`,
    default: (platformType, title, value) => 
      `/devicesWithAppVersion/${platformType}/${title}/${value}`,
  },
};

const PieChart = ({ title, data }) => {
  const navigate = useNavigate();

  // Memoize chart options
  const chartOptions = useMemo(() => ({
    interaction: {
      includeInvisible: true,
    },
    plugins: {
      title: {
        display: true,
        text: title,
      },
      legend: {
        display: true,
        position: 'right',
        labels: {
          usePointStyle: true,
        },
      },
    },
    maintainAspectRatio: true,
  }), [title]);

  // Handle chart click with useCallback
  const handleChartClick = useCallback((evt, elements) => {
    if (!evt.chart?.config?._config) return;

    const { datasets } = evt.chart.config._config.data;
    const chartType = datasets[0]?.label;
    const platformType = datasets[0]?.platformType;
    const chartLabel = evt.chart.config._config.options.plugins.title.text;
    
    const datasetIndex = elements[0]?.index ?? 0;
    const chartValue = data.labels[datasetIndex];

    if (!chartType || !chartLabel || !chartValue) return;

    // Handle compliant type
    if (chartType === 'compliant') {
      const route = ROUTE_MAPPING.compliant[chartLabel];
      if (route) {
        navigate(route(chartValue));
        return;
      }
    }

    // Handle profile installed type
    if (chartType.startsWith('profileInstalledFor')) {
      const platform = chartType.replace('profileInstalledFor', '');
      const route = ROUTE_MAPPING.profileInstalled[platform];
      if (route) {
        navigate(route(chartLabel, chartValue));
        return;
      }
    }

    // Handle version type
    if (chartType === 'version') {
      const route = ROUTE_MAPPING.version[chartLabel] || 
        ((value) => ROUTE_MAPPING.version.default(platformType, chartLabel, value));
      navigate(route(chartValue));
    }
  }, [navigate, data.labels]);

  // Error boundary for data validation
  if (!data || !data.datasets || !data.labels) {
    console.error('Invalid data provided to PieChart');
    return <div className="chart-error">Invalid chart data</div>;
  }

  return (
    <div className="chart chartDimens">
      <Pie
        data={data}
        width="100%"
        height="100%"
        options={{
          ...chartOptions,
          onClick: handleChartClick,
        }}
      />
    </div>
  );
};

export default React.memo(PieChart);
