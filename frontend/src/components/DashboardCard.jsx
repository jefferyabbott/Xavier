import React, { useMemo, memo } from 'react';
import PieChart from './PieChart';
import { FaLaptop, FaMobileAlt, FaTabletAlt } from 'react-icons/fa';

// Move constants outside component
const TRUE_FALSE_COLORS = ['green', 'red'];

const PLATFORM_ICONS = {
  macos: FaLaptop,
  ios: FaMobileAlt,
  ipados: FaTabletAlt
};

// Separate color generation utilities
const generateRandomColor = () => {
  const r = Math.floor(Math.random() * 255);
  const g = Math.floor(Math.random() * 255);
  const b = Math.floor(Math.random() * 255);
  return `rgb(${r},${g},${b})`;
};

const createColorArray = (size) => {
  return Array.from({ length: size }, generateRandomColor);
};

const PlatformIcon = memo(({ platformType }) => {
  const IconComponent = PLATFORM_ICONS[platformType];
  return IconComponent ? <IconComponent /> : null;
});

const DashboardCard = ({ title, data, type, platformType }) => {
  // Memoize chart data calculation
  const chartData = useMemo(() => {
    if (type === 'boolean' || type === 'profileInstalled') {
      return {
        labels: ['true', 'false'],
        datasets: [{
          label: type === 'profileInstalled' ? `profileInstalledFor${platformType}` : 'compliant',
          data: [data.true, data.false],
          backgroundColor: TRUE_FALSE_COLORS,
          hoverOffset: 1,
        }],
      };
    }
    
    // Handle version data
    return {
      labels: data.map((d) => d.version),
      datasets: [{
        label: 'version',
        platformType,
        data: data.map((d) => d.count),
        backgroundColor: createColorArray(data.length),
        hoverOffset: 1,
      }],
    };
  }, [data, type, platformType]);

  return (
    <div className="card dashboardCard">
      <div className="card-body">
        <PieChart title={title} data={chartData} />
        <div className="position-absolute bottom-0 end-0 platformMargins">
          <PlatformIcon platformType={platformType} />
        </div>
      </div>
    </div>
  );
};

export default memo(DashboardCard);
