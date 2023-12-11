import React, { useState } from "react";
import SearchBar from "./SearchBar";

function sortApps(Applications) {
  let appArray = [...Applications];
  return appArray.sort((a, b) => {
    return a.Name.toLowerCase() > b.Name.toLowerCase() ? 1 : -1;
  });
}

export default function ApplicationsTable({ Applications }) {
  const [searchedApps, setSearchedApps] = useState(Applications);

  function searchHandler(query) {
    setSearchedApps(
      Applications.filter((app) =>
        app.Name.toLowerCase().includes(query.toLowerCase())
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
            <th>Identifier</th>
            <th>Version</th>
          </tr>
        </thead>
        <tbody>
          {sortApps(searchedApps).map((app, index) => {
            return (
              <tr key={app.Name + index}>
                <td>{app.Name}</td>
                <td>{app.Identifier}</td>
                <td>{app.Version}</td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
}
