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
    formattedLastCheckin,
    deviceType,
    linkAddress,
    osVersion,
    name
  } = useMemo(() => {
    const lastCheckin = timeSince(new Date(Number(device.updatedAt)));
    const formattedLastCheckin = lastCheckin === "0 second" ? "just now" : lastCheckin;

    // Determine OS type and icon
    const deviceType = (() => {
      const IconComponent = OS_ICONS[device.type?.toLowerCase()] || FaApple;
      return <IconComponent className="text-gray-700" />;
    })();

    const linkAddress = `/${device.type}/${device.SerialNumber}`;
    
    const osVersion = device.QueryResponses?.OSVersion || device.OSVersion;
    const name = device.QueryResponses?.DeviceName;

    return {
      formattedLastCheckin,
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
      <td className="py-2 px-4">{deviceType}</td>
      <td className="py-2 px-4">{device.SerialNumber}</td>
      <td className="py-2 px-4">{name}</td>
      <td className="py-2 px-4">{device.ProductName}</td>
      <td className="py-2 px-4">{osVersion}</td>
      <td className="py-2 px-4">{formattedLastCheckin}</td>
    </tr>
  );
}
