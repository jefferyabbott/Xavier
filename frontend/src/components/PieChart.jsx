import React, { useMemo, useCallback } from 'react';
import { Pie } from 'react-chartjs-2';
import { Chart, ArcElement, Legend, Title, SubTitle } from 'chart.js';
import { useNavigate } from 'react-router-dom';

Chart.register(ArcElement, Legend, Title, SubTitle);

const ROUTE_MAPPING = {
  compliant: {
    'FileVault Encryption': (value) => `/filter/encryption/${value}`,
    'System Integrity Protection': (value) => `/filter/sip/${value}`,
    'MDM Profile Installed': (value) => `/filter/mdm/${value}`,
  },
  profileInstalled: {
    macos: (title, value) => `/filter/profile/${title}/${value}/macos`,
    ios: (title, value) => `/filter/profile/${title}/${value}/ios`,
    ipados: (title, value) => `/filter/profile/${title}/${value}/ipados`,
  },
  version: {
    'macOS version': (value) => `/filter/osversion/mac/${encodeURIComponent(value)}`,
    'iPadOS version': (value) => `/filter/osversion/iPad/${encodeURIComponent(value)}`,
    'iOS version': (value) => `/filter/osversion/iPhone/${encodeURIComponent(value)}`,
    default: (platformType, title, value) => 
      `/filter/appversion/${platformType}/${encodeURIComponent(title)}/${encodeURIComponent(value)}`,
  },
};

const PieChart = ({ title, data }) => {
  const navigate = useNavigate();

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

  const handleChartClick = useCallback((evt, elements) => {
    if (!evt.chart?.config?._config) return;
    if (!elements || elements.length === 0) return;
    
    const { datasets } = evt.chart.config._config.data;
    const chartType = datasets[0]?.label;
    const platformType = datasets[0]?.platformType;
    const chartLabel = evt.chart.config._config.options.plugins.title.text;
    const datasetIndex = elements[0]?.index ?? 0;
    const chartValue = data.labels[datasetIndex];
  
    if (!chartType || !chartLabel || !chartValue) {
      console.error('Missing required chart data:', { chartType, chartLabel, chartValue });
      return;
    }
  
    // Handle compliant type charts
    if (chartType === 'compliant') {

      const route = ROUTE_MAPPING.compliant[chartLabel];
      if (route) {
        let routeValue;
        if (chartValue === 'false' || chartValue === 'true') {
          routeValue = chartValue;
        } else {
          routeValue = (chartValue === 'Disabled' || chartValue === 'No') ? 'false' : 'true';
        }
        
        const finalRoute = route(routeValue);
        navigate(finalRoute);
        return;
      }
    }
  
    // Handle version type charts
    if (chartType === 'version') {      
      if (ROUTE_MAPPING.version[chartLabel]) {
        // Handle OS version routes
        const route = ROUTE_MAPPING.version[chartLabel](chartValue);
        navigate(route);
      } else {
        // Handle app version routes
        const route = ROUTE_MAPPING.version.default(platformType, chartLabel, chartValue);
        navigate(route);
      }
      return;
    }
  
    // Handle profile installed type charts
    if (chartType.startsWith('profileInstalledFor')) {
      const platform = chartType.replace('profileInstalledFor', '').toLowerCase();
      const route = ROUTE_MAPPING.profileInstalled[platform];
      if (route) {
        // For profile charts:
        // If chartValue is 'Not Installed' or 'false', we want routeValue 'false'
        // If chartValue is 'Installed' or 'true', we want routeValue 'true'
        const routeValue = (chartValue === 'Not Installed' || chartValue === 'false') ? 'false' : 'true';
        const finalRoute = route(chartLabel, routeValue);
        navigate(finalRoute);
        return;
      }
    }

    console.warn('No matching route handler found for chart click', {
      chartType,
      chartLabel,
      chartValue
    });
  }, [navigate, data.labels]);

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
