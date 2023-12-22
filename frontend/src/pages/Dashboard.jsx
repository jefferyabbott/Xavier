import { useEffect, useState, useMemo, React } from "react";
import { useNavigate } from "react-router-dom";
import { useQuery } from "@apollo/client";
import { GET_COMPLIANCE_DATA } from "../queries/dashboardQueries.js";
import Spinner from "../components/Spinner.jsx";
import DashboardCard from "../components/DashboardCard";
import generateBooleanComplianceData from "../utilities/generateBooleanComplianceData.js";
import generateOSVersionComplianceData from "../utilities/generateOSVersionComplianceData.js";
import generateAppVersionComplianceData from "../utilities/generateAppVersionComplianceData.js";
import { FaEdit } from "react-icons/fa";
import EditCardsModal from "../components/modals/EditCardsModal.jsx";

export default function Dashboard() {
  const navigate = useNavigate();

  let consoleUser;
  const tokenStr = localStorage.getItem("user");
  if (tokenStr) {
    consoleUser = JSON.parse(tokenStr)._id;
  }

  useEffect(() => {
    if (!consoleUser) {
      navigate("/login");
    }
  }, [consoleUser, navigate]);

  const { loading, error, data } = useQuery(GET_COMPLIANCE_DATA, {
    variables: { consoleUser },
  });

  const [cardArray, setCardArray] = useState([]);
  const [isModalVisible, setIsModalVisible] = useState(false);

  useMemo(() => {
    if (data && data.compliancecardprefs) {
      setCardArray(data.compliancecardprefs.complianceCardPrefs);
    }
  }, [data]);

  // TODO-
  // move cards

  function stopEditingCards() {
    setIsModalVisible(false);
  }

  function editCards() {
    setIsModalVisible(true);
  }

  function updateCards(newCards) {
    setCardArray(newCards);
    setIsModalVisible(false);
  }

  if (loading) return <Spinner />;
  if (error) return <p>Something went wrong</p>;

  if (data && !loading && !error) {
    return (
      <>
        <div className='rightHeader'>
          <div>
            <button type='button' className='btn btn-dark' onClick={editCards}>
              <FaEdit />
            </button>
          </div>
        </div>

        <main className='d-flex flex-row justify-content-evenly flex-wrap'>
          {cardArray.length === 0 ? (
            <div className='welcomeMessage d-flex justify-content-center align-items-center flex-column'>
              <h2>Welcome to Xavier!</h2>
              <h4>
                Click the edit button (top right) to build your custom
                dashboard.
              </h4>
            </div>
          ) : (
            cardArray.map((card, index) => {
              let platformData;
              switch (card.platform) {
                case "macos":
                  platformData = data.macs;
                  break;
                case "ios":
                  platformData = data.iphones;
                  break;
                case "ipados":
                  platformData = data.ipads;
                  break;
                default:
                  break;
              }
              if (card.type === "boolean") {
                return (
                  <DashboardCard
                    title={card.title}
                    data={generateBooleanComplianceData(platformData, card.arg)}
                    type={card.type}
                    platformType={card.platform}
                    key={`compliancecard${index}`}
                  />
                );
              } else if (card.type === "osVersion") {
                return (
                  <DashboardCard
                    title={card.title}
                    data={generateOSVersionComplianceData(platformData)}
                    type={card.type}
                    platformType={card.platform}
                    key={`compliancecard${index}`}
                  />
                );
              } else if (card.type === "appVersion") {
                return (
                  <DashboardCard
                    title={card.title}
                    data={generateAppVersionComplianceData(
                      platformData,
                      card.arg
                    )}
                    type={card.type}
                    platformType={card.platform}
                    key={`compliancecard${index}`}
                  />
                );
              } else {
                return null;
              }
            })
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
            stopEditingCards={stopEditingCards}
            updateCards={updateCards}
          />
        </main>
      </>
    );
  }
}
