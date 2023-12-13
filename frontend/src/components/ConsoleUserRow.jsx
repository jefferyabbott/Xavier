import React from "react";
// import timeSince from '../utilities/TimeSince';

export default function ConsoleUserRow({ consoleUser }) {

  return (
    <tr>
      <td>{consoleUser.name}</td>
      <td>{consoleUser.email}</td>
      <td>{consoleUser.userType === 'consoleAdministrator' ? 'administrator' : 'auditor'}</td>
    </tr>
  );
}
