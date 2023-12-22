import React from "react";
import { FaApple } from "react-icons/fa";
// import { FaApple, FaChrome, FaWindows } from 'react-icons/fa';
import { useNavigate } from "react-router-dom";
import timeSince from "../utilities/timeSince.js";

export default function AllDeviceRow({ device }) {
  const navigate = useNavigate();

  let type;
  let linkAddress = `/${device.type}/`;
  let osVersion;

  let name;
  const lastCheckin = timeSince(new Date(Number(device.updatedAt)));

  linkAddress += device.SerialNumber;
  osVersion = device.QueryResponses.OSVersion
    ? device.QueryResponses.OSVersion
    : device.OSVersion;
  name = device.QueryResponses.DeviceName;
  type = <FaApple />;

  function showDevice(url) {
    navigate(url);
  }

  return (
    <tr className='cursor' onClick={() => showDevice(linkAddress)}>
      <td>{type}</td>
      <td>{device.SerialNumber}</td>
      <td>{name}</td>
      <td>{device.ProductName}</td>
      <td>{osVersion}</td>

      <td>{lastCheckin === "0 second" ? "just now" : lastCheckin}</td>
    </tr>
  );
}
