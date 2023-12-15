import React from "react";

export default function ConfigProfileRow({ profile }) {

  return (
    <tr>
      <td>{profile.PayloadDisplayName}</td>
      <td>{profile.PayloadDescription}</td>
      <td>{profile.PayloadOrganization}</td>
    </tr>
  );
}
