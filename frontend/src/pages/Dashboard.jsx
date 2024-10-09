import { useEffect, useState, useMemo } from "react";
import { useNavigate } from "react-router-dom";
import { useQuery } from "@apollo/client";
import { GET_COMPLIANCE_DATA } from "../queries/dashboardQueries.js";
import { FaEdit } from "react-icons/fa";

import Spinner from "../components/Spinner.jsx";
import DashboardCard from "../components/DashboardCard";
import EditCardsModal from "../components/modals/EditCardsModal.jsx";
import {
  generateBooleanComplianceData,
  generateOSVersionComplianceData,
  generateAppVersionComplianceData,
  generateProfileInstalledData
} from "../utilities/complianceDataGenerators";

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

const WelcomeMessage = () => (
  <div className="welcomeMessage d-flex justify-content-center align-items-center flex-column">
    <h2>Welcome to Xavier!</h2>
    <h4>Click the edit button (top right) to build your custom dashboard.</h4>
  </div>
);

export default function Dashboard() {
  const navigate = useNavigate();
  const [cardArray, setCardArray] = useState([]);
  const [isModalVisible, setIsModalVisible] = useState(false);

  const consoleUser = useMemo(() => {
    const tokenStr = localStorage.getItem("user");
    return tokenStr ? JSON.parse(tokenStr)._id : null;
  }, []);

  useEffect(() => {
    if (!consoleUser) {
      navigate("/login");
    }
  }, [consoleUser, navigate]);

  const { loading, error, data } = useQuery(GET_COMPLIANCE_DATA, {
    variables: { consoleUser },
    skip: !consoleUser
  });

  useEffect(() => {
    if (data?.compliancecardprefs) {
      setCardArray(data.compliancecardprefs.complianceCardPrefs);
    }
  }, [data]);

  const renderDashboardCard = (card, index) => {
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
  };

  if (loading) return <Spinner />;
  if (error) return <p>Something went wrong</p>;
  if (!data) return null;

  return (
    <>
      <div className="rightHeader">
        <div>
          <button 
            type="button" 
            className="btn btn-dark" 
            onClick={() => setIsModalVisible(true)}
          >
            <FaEdit />
          </button>
        </div>
      </div>

      <main className="d-flex flex-row justify-content-evenly flex-wrap">
        {cardArray.length === 0 ? (
          <WelcomeMessage />
        ) : (
          cardArray.map(renderDashboardCard)
        )}

        <EditCardsModal
          visible={isModalVisible}
          cardArray={cardArray}
          macData={data.macs}
          iPhoneData={data.iphones}
          iPadData={data.ipads}
          installedMacApps={data.installedMacApplications}
          installediPhoneApps={data.installediPhoneApplications}
          installediPadApps={data.installediPadApplications}
          installedMacProfiles={data.installedMacProfiles}
          installediPhoneProfiles={data.installediPhoneProfiles}
          installediPadProfiles={data.installediPadProfiles}
          stopEditingCards={() => setIsModalVisible(false)}
          updateCards={(newCards) => {
            setCardArray(newCards);
            setIsModalVisible(false);
          }}
        />
      </main>
    </>
  );
}
