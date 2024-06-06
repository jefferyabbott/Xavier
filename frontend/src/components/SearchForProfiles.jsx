import { useState, React } from "react";
import SearchBar from "./SearchBar";
import { Button } from "react-bootstrap";

function sortProfiles(Profiles) {
  let profileArray = [...Profiles];
  return profileArray.sort((a, b) => {
    return a.toLowerCase() > b.toLowerCase() ? 1 : -1;
  });
}

function SearchForProfiles({
  platform,
  installedProfiles,
  currentCardProfiles,
  addCards,
  clearAddCard,
}) {
  const Profiles = installedProfiles.filter(
    (installedProfile) => !currentCardProfiles.includes(installedProfile)
  );

  const [searchedProfiles, setSearchedProfiles] = useState(Profiles);
  const [selectedProfiles, setSelectedProfiles] = useState([]);

  function selectProfile(profile) {
    if (selectedProfiles.includes(profile)) {
      setSelectedProfiles(selectedProfiles.filter((item) => item !== profile));
    } else {
      setSelectedProfiles([...selectedProfiles, profile]);
    }
  }

  function searchHandler(query) {
    setSearchedProfiles(
      Profiles.filter((profile) =>
        profile.toLowerCase().includes(query.toLowerCase())
      )
    );
  }

  function updateCards() {
    if (selectedProfiles.length > 0) {
      // create profile cards
      const newProfileCards = [];
      selectedProfiles.forEach((profile) => {
        newProfileCards.push({
          type: "profileInstalled",
          title: profile,
          arg: profile,
          platform,
        });
      });
      // send new profile cards back to EditCardsModal
      addCards(newProfileCards);
    }

    // clear + profile
    clearAddCard();
  }

  return (
    <div>
      <table className='table tableList'>
        <thead>
          <tr>
            <th className='stickyTop'>
              <SearchBar searchHandler={searchHandler} />
            </th>
          </tr>
        </thead>
        <tbody className='scrollableTBody'>
          {sortProfiles(searchedProfiles).map((profile, index) => {
            return (
              <tr key={profile + index}>
                <td>
                  <div className='form-check'>
                    <input
                      className='form-check-input'
                      type='checkbox'
                      value=''
                      onChange={() => selectProfile(profile)}
                    />
                    <label className='form-check-label'>{profile}</label>
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

export default SearchForProfiles;
