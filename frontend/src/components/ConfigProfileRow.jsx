import React from "react";
import { FaApple } from "react-icons/fa";
import { useNavigate } from "react-router-dom";
// import timeSince from '../utilities/TimeSince';

export default function ConfigProfileRow({ profile }) {

  return (
    <tr>
      <td>{profile.PayloadDisplayName}</td>
      <td>{profile.PayloadDescription}</td>
      <td>{profile.PayloadOrganization}</td>
    </tr>
  );
}
