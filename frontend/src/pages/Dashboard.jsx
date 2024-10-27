import { useEffect, useMemo, useCallback, useState, memo } from 'react';
import { useNavigate } from 'react-router-dom';
import { useQuery } from '@apollo/client';
import { GET_COMPLIANCE_DATA } from '../queries/dashboardQueries.js';
import { FaEdit } from 'react-icons/fa';
import Spinner from '../components/Spinner.jsx';
import DashboardCard from '../components/DashboardCard';
import EditCardsModal from '../components/modals/EditCardsModal.jsx';
import {
  generateBooleanComplianceData,
  generateOSVersionComplianceData,
  generateAppVersionComplianceData,
  generateProfileInstalledData
} from '../utilities/complianceDataGenerators';

const PLATFORM_DATA_MAP = {
  macos: 'macs',
  ios: 'iphones',
  ipados: 'ipads'
};

const CARD_TYPE_GENERATORS = {
  boolean: generateBooleanComplianceData,
  profileInstalled: generateProfileInstalledData,
  osVersion: generateOSVersionComplianceData,
  appVersion: generateAppVersionComplianceData
};

const WelcomeMessage = memo(() => (
  <div className="welcomeMessage d-flex justify-content-center align-items-center flex-column">
    <h2>Welcome to Xavier!</h2>
    <h4>Click the edit button (top right) to build your custom dashboard.</h4>
  </div>
));

// Custom hook for auth state
const useAuthCheck = () => {
  const navigate = useNavigate();
  
  const consoleUser = useMemo(() => {
    try {
      const tokenStr = localStorage.getItem('user');
      return tokenStr ? JSON.parse(tokenStr)._id : null;
    } catch (error) {
      console.error('Error parsing user token:', error);
      return null;
    }
  }, []);

  useEffect(() => {
    if (!consoleUser) {
      navigate('/login');
    }
  }, [consoleUser, navigate]);

  return consoleUser;
};

// Custom hook for dashboard data
const useDashboardData = (consoleUser) => {
  const { loading, error, data } = useQuery(GET_COMPLIANCE_DATA, {
    variables: { consoleUser },
    skip: !consoleUser,
    fetchPolicy: 'cache-and-network'
  });

  const cardArray = useMemo(() => 
    data?.compliancecardprefs?.complianceCardPrefs || [], 
    [data]
  );

  return { loading, error, data, cardArray };
};

const Dashboard = () => {
  const consoleUser = useAuthCheck();
  const { loading, error, data, cardArray } = useDashboardData(consoleUser);
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [cards, setCards] = useState(cardArray);

  useEffect(() => {
    setCards(cardArray);
  }, [cardArray]);

  // Memoized card rendering function
  const renderDashboardCard = useCallback((card, index) => {
    const platformDataKey = PLATFORM_DATA_MAP[card.platform];
    const platformData = data?.[platformDataKey];
    
    if (!platformData) return null;
    
    const generator = CARD_TYPE_GENERATORS[card.type];
    if (!generator) return null;
    
    const cardData = card.type === 'osVersion'
      ? generator(platformData)
      : generator(platformData, card.arg);

    return (
      <DashboardCard
        key={`compliancecard${index}`}
        title={card.title}
        data={cardData}
        type={card.type}
        platformType={card.platform}
      />
    );
  }, [data]);

  // Modal handlers
  const handleModalClose = useCallback(() => setIsModalVisible(false), []);
  
  const handleCardsUpdate = useCallback((newCards) => {
    setCards(newCards);
    setIsModalVisible(false);
  }, []);

  if (loading) return <Spinner />;
  if (error) {
    console.error('Dashboard error:', error);
    return (
      <div className="alert alert-danger m-3">
        Error loading dashboard data. Please try refreshing the page.
      </div>
    );
  }
  if (!data) return null;

  const modalProps = {
    visible: isModalVisible,
    cardArray: cards,
    macData: data.macs,
    iPhoneData: data.iphones,
    iPadData: data.ipads,
    installedMacApps: data.installedMacApplications,
    installediPhoneApps: data.installediPhoneApplications,
    installediPadApps: data.installediPadApplications,
    installedMacProfiles: data.installedMacProfiles,
    installediPhoneProfiles: data.installediPhoneProfiles,
    installediPadProfiles: data.installediPadProfiles,
    stopEditingCards: handleModalClose,
    updateCards: handleCardsUpdate
  };

  return (
    <>
      <div className="rightHeader">
        <button
          type="button"
          className="btn btn-dark"
          onClick={() => setIsModalVisible(true)}
          aria-label="Edit Dashboard"
        >
          <FaEdit />
        </button>
      </div>
      
      <main className="d-flex flex-row justify-content-evenly flex-wrap">
        {cards.length === 0 ? (
          <WelcomeMessage />
        ) : (
          cards.map(renderDashboardCard)
        )}
        
        <EditCardsModal {...modalProps} />
      </main>
    </>
  );
};

export default memo(Dashboard);
