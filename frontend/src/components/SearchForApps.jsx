import { useState, React } from "react";
import SearchBar from "./SearchBar";
import { Button } from "react-bootstrap";

function sortApps(Applications) {
  let appArray = [...Applications];
  return appArray.sort((a, b) => {
    return a.toLowerCase() > b.toLowerCase() ? 1 : -1;
  });
}

function SearchForApps({
  platform,
  installedApps,
  currentCardApps,
  addCards,
  clearAddCard,
}) {


  const Applications = installedApps.filter((installedApp) => !currentCardApps.includes(installedApp));
  

  const [searchedApps, setSearchedApps] = useState(Applications);
  const [selectedApps, setSelectedApps] = useState([]);

  function selectApp(app) {
    if (selectedApps.includes(app)) {
      setSelectedApps(selectedApps.filter((item) => item !== app));
    } else {
      setSelectedApps([...selectedApps, app]);
    }
  }

  function searchHandler(query) {
    setSearchedApps(
      Applications.filter((app) =>
        app.toLowerCase().includes(query.toLowerCase())
      )
    );
  }

  function updateCards() {
    if (selectedApps.length > 0) {
      // create app cards
      const newAppCards = [];
      selectedApps.forEach((app) => {
        newAppCards.push({
          type: "appVersion",
          title: app,
          arg: app,
          platform,
        });
      });
      // send new app cards back to EditCardsModal
      addCards(newAppCards);
    }

    // clear + app
    clearAddCard();
  }

  return (
    <div>
      <table className='table tableList'>
        <thead>
          <tr>
            <th className="stickyTop">
              <SearchBar searchHandler={searchHandler} />
            </th>
          </tr>
        </thead>
        <tbody className="scrollableTBody">
          {sortApps(searchedApps).map((app, index) => {
            return (
              <tr key={app + index}>
                <td>
                  <div className='form-check'>
                    <input
                      className='form-check-input'
                      type='checkbox'
                      value=''
                      onChange={() => selectApp(app)}
                    />
                    <label className='form-check-label'>{app}</label>
                  </div>
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>
      <Button onClick={updateCards}>OK</Button>
    </div>
  );
}

export default SearchForApps;
