import { useMemo } from "react";
import { FaApple, FaChrome, FaWindows } from "react-icons/fa";
import { useNavigate } from "react-router-dom";
import timeSince from "../utilities/timeSince.js";

const OS_ICONS = {
  apple: FaApple,
  chrome: FaChrome,
  windows: FaWindows,
};

export default function AllDeviceRow({ device }) {
  const navigate = useNavigate();

  const {
    lastCheckin,
    deviceType,
    linkAddress,
    osVersion,
    name
  } = useMemo(() => {
    const lastCheckin = timeSince(device.updatedAt);

    // Determine OS type and icon
    const deviceType = (() => {
      const IconComponent = OS_ICONS[device.type?.toLowerCase()] || FaApple;
      return <IconComponent className="text-gray-700" />;
    })();

    const linkAddress = `/${device.type}/${device.SerialNumber}`;
    
    const osVersion = device.QueryResponses?.OSVersion || device.OSVersion;
    const name = device.QueryResponses?.DeviceName;

    return {
      lastCheckin,
      deviceType,
      linkAddress,
      osVersion,
      name
    };
  }, [device]);

  const handleClick = () => {
    navigate(linkAddress);
  };

  return (
    <tr 
      className="cursor-pointer hover:bg-gray-50 transition-colors"
      onClick={handleClick}
      role="button"
      tabIndex={0}
      onKeyDown={(e) => {
        if (e.key === "Enter" || e.key === " ") {
          e.preventDefault();
          handleClick();
        }
      }}
    >
      <td className="py-2">{deviceType}</td>
      <td className="py-2">{device.SerialNumber}</td>
      <td className="py-2">{name}</td>
      <td className="py-2">{device.ProductName}</td>
      <td className="py-2">{osVersion}</td>
      <td className="py-2">{lastCheckin}</td>
    </tr>
  );
}
