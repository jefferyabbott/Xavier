import { useState, React } from "react";
import { Button } from "react-bootstrap";
import { MacComplianceStatusBooleans } from "../constants/MacComplianceStatusBooleans";
import { iPadComplianceStatusBooleans } from "../constants/iPadComplianceStatusBooleans";
import { iPhoneComplianceStatusBooleans } from "../constants/iPhoneComplianceStatusBooleans";

function SearchForComplianceStatus({
  platform,
  currentCardBooleans,
  addCards,
  clearAddCard,
}) {
  const [selectedBooleans, setSelectedBooleans] = useState([]);

  function selectBoolean(boolean) {
    if (selectedBooleans.includes(boolean)) {
      setSelectedBooleans(
        selectedBooleans.filter(
          (item) => JSON.stringify(item) !== JSON.stringify(boolean)
        )
      );
    } else {
      setSelectedBooleans([...selectedBooleans, boolean]);
    }
  }

  function updateCards() {
    addCards(selectedBooleans);
    clearAddCard();
  }

  let platformBooleans;
  switch (platform) {
    case "macos":
      platformBooleans = MacComplianceStatusBooleans.filter(
        (card) => !currentCardBooleans.includes(card.title)
      );
      break;
    case "ios":
      platformBooleans = iPhoneComplianceStatusBooleans.filter(
        (card) => !currentCardBooleans.includes(card.title)
      );
      break;
    case "ipados":
      platformBooleans = iPadComplianceStatusBooleans.filter(
        (card) => !currentCardBooleans.includes(card.title)
      );
      break;
  }

  return (
    <div>
      <table className='table tableList'>
        <tbody>
          {platformBooleans.map((pBoolean, index) => {
            return (
              <tr key={pBoolean + index}>
                <td>
                  <div className='form-check'>
                    <input
                      className='form-check-input'
                      type='checkbox'
                      value=''
                      onChange={() => selectBoolean(pBoolean)}
                    />
                    <label className='form-check-label'>{pBoolean.title}</label>
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

export default SearchForComplianceStatus;
