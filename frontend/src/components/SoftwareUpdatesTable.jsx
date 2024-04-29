import React, { useState } from "react";
import SearchBar from "./SearchBar";
import CheckMinusSymbols from "./CheckMinusSymbols";

function sortUpdates(Updates) {
  let updateArray = [...Updates];
  return updateArray.sort((a, b) => {
    return a.HumanReadableName.toLowerCase() > b.HumanReadableName.toLowerCase() ? 1 : -1;
  });
}

export default function SoftwareUpdatesTable({ Updates }) {
  const [searchedUpdates, setSearchedUpdates] = useState(Updates);

  function searchHandler(query) {
    setSearchedUpdates(
      Updates.filter((update) =>
        update.HumnaReadableName.toLowerCase().includes(query.toLowerCase())
      )
    );
  }

  return (
    <div>
      <table className='table tableList'>
        <thead>
          <tr>
            <th>
              <SearchBar searchHandler={searchHandler} />
            </th>
            <th>Critical</th>
            <th>Firmware</th>
            <th>Security</th>
            <th>Restart Required</th>
          </tr>
        </thead>
        <tbody>
          {sortUpdates(searchedUpdates).map((update, index) => {
            return (
              <tr key={update.ProductKey + index}>
                <td>{update.HumanReadableName}</td>
                <td>{<CheckMinusSymbols status={update.IsCritical}/>}</td>
                <td>{<CheckMinusSymbols status={update.IsFirmwareUpdate}/>}</td>
                <td>{<CheckMinusSymbols status={update.IsSecurityResponse}/>}</td>
                <td>{<CheckMinusSymbols status={update.RestartRequired}/>}</td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
}
