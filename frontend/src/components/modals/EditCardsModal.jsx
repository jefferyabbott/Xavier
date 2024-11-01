import { memo, useCallback, useEffect, useReducer, lazy, Suspense, Component } from "react";
import PropTypes from 'prop-types';
import { Modal, Button } from "react-bootstrap";
import { FaPlusCircle, FaTrash } from "react-icons/fa";
import { updateComplianceCardPrefs } from "../../commands/updateComplianceCardPrefs.js";

// Lazy loaded components
const SearchForApps = lazy(() => import("../SearchForApps.jsx"));
const SearchForProfiles = lazy(() => import("../SearchForProfiles.jsx"));
const SearchForComplianceStatus = lazy(() => import("../SearchForComplianceStatus.jsx"));

// Error Boundary Component
class ErrorBoundary extends Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError(error) {
    return { hasError: true };
  }

  componentDidCatch(error, errorInfo) {
    console.error('Error caught by boundary:', error, errorInfo);
  }

  render() {
    if (this.state.hasError) {
      return (
        <div className="p-4 text-red-600">
          Something went wrong. Please try again.
        </div>
      );
    }
    return this.props.children;
  }
}

// Constants
const PLATFORM_DATA_MAP = {
  macos: {
    title: "Mac",
    osTitle: "macOS version"
  },
  ios: {
    title: "iPhone",
    osTitle: "iOS version"
  },
  ipados: {
    title: "iPad",
    osTitle: "iPadOS version"
  }
};

const CARD_TYPES = {
  boolean: "compliance status",
  profileInstalled: "profile installed",
  osVersion: "OS version",
  appVersion: "app version"
};

// Action types
const ACTIONS = {
  RESET_STATE: 'RESET_STATE',
  SET_SHOW: 'SET_SHOW',
  SET_CARDS: 'SET_CARDS',
  SET_ADD_CARD: 'SET_ADD_CARD',
  SET_PLATFORM: 'SET_PLATFORM',
  SET_CARD_TYPE: 'SET_CARD_TYPE',
  SET_CARD_DATA: 'SET_CARD_DATA',
  SET_OK_BUTTON: 'SET_OK_BUTTON',
  CLEAR_ADD_CARD: 'CLEAR_ADD_CARD',
  UPDATE_ORIGINAL_CARDS: 'UPDATE_ORIGINAL_CARDS'
};

// Reducer
const modalReducer = (state, action) => {
  switch (action.type) {
    case ACTIONS.RESET_STATE:
      return {
        ...state,
        show: false,
        cards: state.originalCardArray,
        showAddCard: false,
        addCardPlatform: "",
        addCardType: "",
        cardDataSelect: "",
        showOkButton: false
      };
    case ACTIONS.SET_SHOW:
      return { ...state, show: action.payload };
    case ACTIONS.SET_CARDS:
      return { ...state, cards: action.payload };
    case ACTIONS.UPDATE_ORIGINAL_CARDS:
      return {
        ...state,
        cards: action.payload,
        originalCardArray: action.payload
      };
    case ACTIONS.SET_ADD_CARD:
      return { ...state, showAddCard: action.payload };
    case ACTIONS.SET_PLATFORM:
      return { 
        ...state, 
        addCardPlatform: action.payload,
        addCardType: "",
        cardDataSelect: "",
        showOkButton: false
      };
    case ACTIONS.SET_CARD_TYPE:
      return { ...state, addCardType: action.payload };
    case ACTIONS.SET_CARD_DATA:
      return { ...state, cardDataSelect: action.payload };
    case ACTIONS.SET_OK_BUTTON:
      return { ...state, showOkButton: action.payload };
    case ACTIONS.CLEAR_ADD_CARD:
      return {
        ...state,
        showAddCard: false,
        addCardPlatform: "",
        addCardType: "",
        cardDataSelect: "",
        showOkButton: false
      };
    default:
      return state;
  }
};

// Memoized sub-components
const PlatformSelector = memo(function PlatformSelector({ onSelect }) {
  return (
    <div>
      Platform
      <div className='form-check'>
        <input
          className='form-check-input'
          type='radio'
          name='radioPlatform'
          id='flexRadioDefault1'
          onChange={() => onSelect("ipados")}
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
          onChange={() => onSelect("ios")}
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
          onChange={() => onSelect("macos")}
        />
        <label className='form-check-label' htmlFor='flexRadioDefault3'>
          Mac
        </label>
      </div>
    </div>
  );
});

const CardTypeSelector = memo(function CardTypeSelector({ onSelect }) {
  return (
    <div>
      Card Type
      <div className='form-check'>
        <input
          className='form-check-input'
          type='radio'
          name='radioType'
          id='flexRadioDefault1-type'
          onChange={() => onSelect("boolean")}
        />
        <label className='form-check-label' htmlFor='flexRadioDefault1-type'>
          compliance status
        </label>
      </div>
      <div className='form-check'>
        <input
          className='form-check-input'
          type='radio'
          name='radioType'
          id='flexRadioDefault2-type'
          onChange={() => onSelect("osVersion")}
        />
        <label className='form-check-label' htmlFor='flexRadioDefault2-type'>
          OS version
        </label>
      </div>
      <div className='form-check'>
        <input
          className='form-check-input'
          type='radio'
          name='radioType'
          id='flexRadioDefault3-type'
          onChange={() => onSelect("appVersion")}
        />
        <label className='form-check-label' htmlFor='flexRadioDefault3-type'>
          app version
        </label>
      </div>
      <div className='form-check'>
        <input
          className='form-check-input'
          type='radio'
          name='radioType'
          id='flexRadioDefault4-type'
          onChange={() => onSelect("profileInstalled")}
        />
        <label className='form-check-label' htmlFor='flexRadioDefault4-type'>
          profile installed
        </label>
      </div>
    </div>
  );
});

const CardsTable = memo(function CardsTable({ cards, onRemove }) {
  return (
    <table className='table'>
      <thead>
        <tr>
          <th>type</th>
          <th>title</th>
          <th>platform</th>
          <th></th>
        </tr>
      </thead>
      <tbody>
        {cards?.map((card, index) => (
          <tr key={`${card.title}-${index}`}>
            <td>{CARD_TYPES[card.type]}</td>
            <td>{card.title}</td>
            <td>{PLATFORM_DATA_MAP[card.platform]?.title}</td>
            <td>
              <FaTrash
                className="cursor-pointer"
                onClick={() => onRemove(card.title)}
                aria-label="Remove card"
              />
            </td>
          </tr>
        ))}
      </tbody>
    </table>
  );
});

// Sub-component PropTypes
PlatformSelector.propTypes = {
  onSelect: PropTypes.func.isRequired
};

CardTypeSelector.propTypes = {
  onSelect: PropTypes.func.isRequired
};

CardsTable.propTypes = {
  cards: PropTypes.array.isRequired,
  onRemove: PropTypes.func.isRequired
};

function EditCardsModal({
  visible,
  cardArray,
  macData,
  iPhoneData,
  iPadData,
  installedMacApps,
  installediPhoneApps,
  installediPadApps,
  installedMacProfiles,
  installediPhoneProfiles,
  installediPadProfiles,
  stopEditingCards,
  updateCards
}) {
  const initialState = {
    show: false,
    cards: [],
    originalCardArray: [],
    showAddCard: false,
    addCardPlatform: "",
    addCardType: "",
    cardDataSelect: "",
    showOkButton: false
  };

  const [state, dispatch] = useReducer(modalReducer, initialState);

  // Memoized callbacks
  const handleClose = useCallback(() => {
    dispatch({ type: ACTIONS.RESET_STATE });
    stopEditingCards();
  }, [stopEditingCards]);

  const saveCardArray = useCallback(() => {
    updateComplianceCardPrefs(state.cards);
    updateCards(state.cards);
    stopEditingCards();
  }, [state.cards, updateCards, stopEditingCards]);

  const removeCard = useCallback((title) => {
    dispatch({
      type: ACTIONS.SET_CARDS,
      payload: state.cards.filter(card => card.title !== title)
    });
  }, [state.cards]);

  const addCard = useCallback(() => {
    dispatch({ type: ACTIONS.SET_ADD_CARD, payload: true });
  }, []);

  const clearAddCard = useCallback(() => {
    dispatch({ type: ACTIONS.CLEAR_ADD_CARD });
  }, []);

  const addCardsExt = useCallback((newCards) => {
    dispatch({
      type: ACTIONS.SET_CARDS,
      payload: [...state.cards, ...newCards]
    });
    dispatch({ type: ACTIONS.CLEAR_ADD_CARD });
  }, [state.cards]);

  // Effects
  useEffect(() => {
    if (cardArray?.length >= 0) {
      dispatch({ type: ACTIONS.UPDATE_ORIGINAL_CARDS, payload: cardArray });
    }
  }, [cardArray]);

  useEffect(() => {
    dispatch({ type: ACTIONS.SET_SHOW, payload: visible });
  }, [visible]);

  useEffect(() => {
    if (!state.addCardPlatform || !state.addCardType) return;

    const handleOsVersionCard = () => {
      const cardExists = state.cards.some(
        card => card.type === state.addCardType && card.platform === state.addCardPlatform
      );

      if (cardExists) {
        dispatch({
          type: ACTIONS.SET_CARD_DATA,
          payload: "This card is already on your dashboard."
        });
      } else {
        dispatch({
          type: ACTIONS.SET_CARDS,
          payload: [...state.cards, {
            type: state.addCardType,
            title: PLATFORM_DATA_MAP[state.addCardPlatform].osTitle,
            platform: state.addCardPlatform,
          }]
        });
      }
      dispatch({ type: ACTIONS.SET_OK_BUTTON, payload: true });
    };

    if (state.addCardType === 'osVersion') {
      handleOsVersionCard();
      return;
    }

    // Handle other card types
    const platformConfig = {
      macos: { 
        data: macData, 
        apps: installedMacApps, 
        profiles: installedMacProfiles 
      },
      ios: { 
        data: iPhoneData, 
        apps: installediPhoneApps, 
        profiles: installediPhoneProfiles 
      },
      ipados: { 
        data: iPadData, 
        apps: installediPadApps, 
        profiles: installediPadProfiles 
      }
    }[state.addCardPlatform];

    const currentItems = state.cards
      .filter(card => card.platform === state.addCardPlatform && card.type === state.addCardType)
      .map(item => item.title);

      switch (state.addCardType) {
        case 'appVersion':
          dispatch({
            type: ACTIONS.SET_CARD_DATA,
            payload: (
              <ErrorBoundary>
                <Suspense fallback={<div>Loading...</div>}>
                  <SearchForApps
                    data={platformConfig.data}
                    installedApps={platformConfig.apps}
                    platform={state.addCardPlatform}
                    currentCardApps={currentItems}
                    addCards={addCardsExt}
                    clearAddCard={clearAddCard}
                  />
                </Suspense>
              </ErrorBoundary>
            )
          });
          break;
        case 'profileInstalled':
          dispatch({
            type: ACTIONS.SET_CARD_DATA,
            payload: (
              <ErrorBoundary>
                <Suspense fallback={<div>Loading...</div>}>
                  <SearchForProfiles
                    data={platformConfig.data}
                    installedProfiles={platformConfig.profiles.filter(p => p !== 'Enrollment Profile')}
                    platform={state.addCardPlatform}
                    currentCardProfiles={currentItems}
                    addCards={addCardsExt}
                    clearAddCard={clearAddCard}
                  />
                </Suspense>
              </ErrorBoundary>
            )
          });
          break;
        case 'boolean':
          dispatch({
            type: ACTIONS.SET_CARD_DATA,
            payload: (
              <ErrorBoundary>
                <Suspense fallback={<div>Loading...</div>}>
                  <SearchForComplianceStatus
                    platform={state.addCardPlatform}
                    currentCardBooleans={currentItems}
                    addCards={addCardsExt}
                    clearAddCard={clearAddCard}
                  />
                </Suspense>
              </ErrorBoundary>
            )
          });
          break;
        default:
          console.warn(`Unexpected card type: ${state.addCardType}`);
          dispatch({
            type: ACTIONS.SET_CARD_DATA,
            payload: (
              <div className="alert alert-warning">
                Invalid card type selected. Please try again or contact support if the issue persists.
              </div>
            )
          });
          break;
      }
  }, [
    state.addCardPlatform, 
    state.addCardType, 
    state.cards, 
    macData, 
    iPhoneData, 
    iPadData,
    installedMacApps, 
    installediPhoneApps, 
    installediPadApps,
    installedMacProfiles, 
    installediPhoneProfiles, 
    installediPadProfiles,
    addCardsExt, 
    clearAddCard
  ]);

  return (
<Modal show={state.show} onHide={handleClose}>
      <Modal.Header closeButton>
        <Modal.Title>Edit Dashboard Cards</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <ErrorBoundary>
          <CardsTable cards={state.cards} onRemove={removeCard} />
          <div className="cursor-pointer my-3" onClick={addCard}>
            <FaPlusCircle size={24} />
          </div>
          
          {state.showAddCard && !state.cardDataSelect && (
            <PlatformSelector
              onSelect={(platform) => dispatch({
                type: ACTIONS.SET_PLATFORM,
                payload: platform
              })}
            />
          )}

          {state.addCardPlatform && !state.cardDataSelect && (
            <CardTypeSelector
              onSelect={(cardType) => dispatch({
                type: ACTIONS.SET_CARD_TYPE,
                payload: cardType
              })}
            />
          )}

          <div>{state.cardDataSelect}</div>
          {state.showOkButton && (
            <Button onClick={clearAddCard}>OK</Button>
          )}
        </ErrorBoundary>
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
  );
}

EditCardsModal.propTypes = {
  visible: PropTypes.bool.isRequired,
  cardArray: PropTypes.arrayOf(PropTypes.shape({
    type: PropTypes.string.isRequired,
    title: PropTypes.string.isRequired,
    platform: PropTypes.string.isRequired,
  })).isRequired,
  macData: PropTypes.array,
  iPhoneData: PropTypes.array,
  iPadData: PropTypes.array,
  installedMacApps: PropTypes.array,
  installediPhoneApps: PropTypes.array,
  installediPadApps: PropTypes.array,
  installedMacProfiles: PropTypes.array,
  installediPhoneProfiles: PropTypes.array,
  installediPadProfiles: PropTypes.array,
  stopEditingCards: PropTypes.func.isRequired,
  updateCards: PropTypes.func.isRequired
};

EditCardsModal.defaultProps = {
  macData: [],
  iPhoneData: [],
  iPadData: [],
  installedMacApps: [],
  installediPhoneApps: [],
  installediPadApps: [],
  installedMacProfiles: [],
  installediPhoneProfiles: [],
  installediPadProfiles: []
};

export default memo(EditCardsModal);
