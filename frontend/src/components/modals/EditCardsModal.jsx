import { useState, useEffect, React } from "react";
import { Modal, Button } from "react-bootstrap";
import { FaPlusCircle, FaTrash } from "react-icons/fa";
import SearchForApps from "../SearchForApps.jsx";
import SearchForComplianceStatus from "../SearchForComplianceStatus.jsx";
import { updateComplianceCardPrefs } from "../../commands/updateComplianceCardPrefs.js";

function EditCardsModal({
  visible,
  cardArray,
  macData,
  iPhoneData,
  iPadData,
  installedMacApps,
  installediPhoneApps,
  installediPadApps,
  stopEditingCards,
  updateCards,
}) {
  const [show, setShow] = useState(false);
  const [cards, setCards] = useState(cardArray);
  const [showAddCard, setShowAddCard] = useState(false);
  const [addCardPlatform, setAddCardPlatform] = useState("");
  const [addCardType, setAddCardType] = useState("");
  const [cardDataSelect, setCardDataSelect] = useState("");
  const [showOkButton, setShowOkButton] = useState(false);

  const handleClose = () => {
    setShow(false);
    setShowAddCard(false);
    setShowOkButton(false);
    setAddCardPlatform("");
    setAddCardType("");
    setCardDataSelect("");
    stopEditingCards();
  };

  const saveCardArray = () => {
    updateComplianceCardPrefs(cards);
    updateCards(cards);
    stopEditingCards();
  };

  useEffect(() => {
    setShow(visible);

    if (addCardPlatform && addCardType) {
      // type OS version
      if (addCardType === "osVersion") {
        setShowOkButton(true);
        const cardExists = cards.filter(
          (card) =>
            card.type === addCardType && card.platform === addCardPlatform
        );
        if (cardExists.length > 0) {
          setCardDataSelect("This card is already on your dashboard.");
        } else {
          let title = "";
          switch (addCardPlatform) {
            case "macos":
              title = "macOS version";
              break;
            case "ios":
              title = "iOS version";
              break;
            case "ipados":
              title = "iPadOS version";
              break;
            default:
              break;
          }
          setCards([
            ...cards,
            {
              type: addCardType,
              title,
              platform: addCardPlatform,
            },
          ]);
          setCardDataSelect(`${title} has been added.`);
        }
      }

      // type app version
      if (addCardType === "appVersion") {
        const currentApps = cards.filter((card) => (card.platform === addCardPlatform && card.type === "appVersion")).map((item) => item.title);
        let platformData;
        let installedApps;
        switch (addCardPlatform) {
          case "macos":
            platformData = macData;
            installedApps = installedMacApps;
            break;
          case "ios":
            platformData = iPhoneData;
            installedApps = installediPhoneApps;
            break;
          case "ipados":
            platformData = iPadData;
            installedApps = installediPadApps;
            break;
          default:
            break;
        }
        setCardDataSelect(
          <SearchForApps
            data={platformData}
            installedApps={installedApps}
            platform={addCardPlatform}
            currentCardApps={currentApps}
            addCards={addCardsExt}
            clearAddCard={clearAddCard}
          />
        );
        setAddCardPlatform("");
        setAddCardType("");
        setShowAddCard(false);
      }

      // type boolean (compliance status)
      if (addCardType === "boolean") {
        const currentBooleans = cards.filter((card) => (card.platform === addCardPlatform && card.type === "boolean")).map((item) => item.title);
        setCardDataSelect(
          <SearchForComplianceStatus
            platform={addCardPlatform}
            currentCardBooleans={currentBooleans}
            addCards={addCardsExt}
            clearAddCard={clearAddCard}
          />
        );
        setAddCardPlatform("");
        setAddCardType("");
        setShowAddCard(false);
      }
    }
  }, [visible, addCardPlatform, addCardType, cards, iPadData, iPhoneData, macData]);

  function cardType(type) {
    switch (type) {
      case "boolean":
        return "compliance status";
      case "osVersion":
        return "OS version";
      case "appVersion":
        return "app version";
      default:
        return null;
    }
  }

  function platformType(platform) {
    switch (platform) {
      case "macos":
        return "Mac";
      case "ios":
        return "iPhone";
      case "ipados":
        return "iPad";
      default:
        return null;
    }
  }

  function addCard() {
    setShowAddCard(true);
  }

  function removeCard(title) {
    setCards(cards.filter((card) => card.title !== title));
  }

  function addCardsExt(newCards) {
    setCards((cards) => [...cards, ...newCards]);
  }

  function clearAddCard() {
    setShowOkButton(false);
    setAddCardPlatform("");
    setAddCardType("");
    setCardDataSelect("");
    setShowAddCard(false);
  }

  return (
    <>
      <Modal show={show} onHide={handleClose}>
        <Modal.Header closeButton>
          <Modal.Title>Edit Dashboard Cards</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <table className='table'>
            <thead>
              <tr>
                <th>type</th>
                <th>title</th>
                <th>platform</th>
              </tr>
            </thead>
            <tbody>
              {cards.map((card, index) => {
                return (
                  <tr key={card.title + index}>
                    <td>{cardType(card.type)}</td>
                    <td>{card.title}</td>
                    <td>{platformType(card.platform)}</td>
                    <td onClick={() => removeCard(card.title)}>
                      <FaTrash />
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
          <div onClick={addCard}>
            <FaPlusCircle />
          </div>
          {showAddCard ? (
            <div>
              Platform
              <div className='form-check'>
                <input
                  className='form-check-input'
                  type='radio'
                  name='radioPlatform'
                  id='flexRadioDefault1'
                  onChange={() => setAddCardPlatform("ipados")}
                />
                <label className='form-check-label' htmlFor='flexRadioDefault1'>
                  iPad
                </label>
              </div>
              <div className='form-check'>
                <input
                  className='form-check-input'
                  type='radio'
                  name='radioPlatform'
                  id='flexRadioDefault2'
                  onChange={() => setAddCardPlatform("ios")}
                />
                <label className='form-check-label' htmlFor='flexRadioDefault2'>
                  iPhone
                </label>
              </div>
              <div className='form-check'>
                <input
                  className='form-check-input'
                  type='radio'
                  name='radioPlatform'
                  id='flexRadioDefault3'
                  onChange={() => setAddCardPlatform("macos")}
                />
                <label className='form-check-label' htmlFor='flexRadioDefault3'>
                  Mac
                </label>
              </div>
            </div>
          ) : null}

          {addCardPlatform ? (
            <div>
              Card Type
              <div className='form-check'>
                <input
                  className='form-check-input'
                  type='radio'
                  name='radioType'
                  id='flexRadioDefault1-type'
                  onChange={() => setAddCardType("boolean")}
                />
                <label
                  className='form-check-label'
                  htmlFor='flexRadioDefault1-type'
                >
                  compliance status
                </label>
              </div>
              <div className='form-check'>
                <input
                  className='form-check-input'
                  type='radio'
                  name='radioType'
                  id='flexRadioDefault2-type'
                  onChange={() => setAddCardType("osVersion")}
                />
                <label
                  className='form-check-label'
                  htmlFor='flexRadioDefault2-type'
                >
                  OS version
                </label>
              </div>
              <div className='form-check'>
                <input
                  className='form-check-input'
                  type='radio'
                  name='radioType'
                  id='flexRadioDefault3-type'
                  onChange={() => setAddCardType("appVersion")}
                />
                <label
                  className='form-check-label'
                  htmlFor='flexRadioDefault3-type'
                >
                  app version
                </label>
              </div>
            </div>
          ) : null}

          <div>{cardDataSelect}</div>
          {showOkButton ? <Button onClick={clearAddCard}>OK</Button> : null}
        </Modal.Body>
        <Modal.Footer>
          <Button variant='secondary' onClick={handleClose}>
            Cancel
          </Button>
          <Button
            variant='primary'
            className='btn btn-success'
            onClick={saveCardArray}
          >
            Save
          </Button>
        </Modal.Footer>
      </Modal>
    </>
  );
}

export default EditCardsModal;
