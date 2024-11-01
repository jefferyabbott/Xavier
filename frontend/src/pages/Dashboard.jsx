import { useEffect, useMemo, useCallback, useState, memo } from 'react';
import { useNavigate } from 'react-router-dom';
import { useQuery } from '@apollo/client';
import { GET_OPTIMIZED_COMPLIANCE_DATA } from '../queries/dashboardQueries.js';
import { FaEdit, FaSync } from 'react-icons/fa';
import Spinner from '../components/Spinner.jsx';
import DashboardCard from '../components/DashboardCard';
import EditCardsModal from '../components/modals/EditCardsModal.jsx';
import '../dashboard.css';
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

const ITEMS_PER_PAGE = 1000;

const WelcomeMessage = memo(() => (
    <div className="welcomeMessage d-flex justify-content-center align-items-center flex-column">
        <h2>Welcome to Xavier!</h2>
        <h4>Click the edit button (top right) to build your custom dashboard.</h4>
    </div>
));

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

const useDashboardData = (consoleUser) => {
    const { loading, error, data, fetchMore, networkStatus } = useQuery(GET_OPTIMIZED_COMPLIANCE_DATA, {
        variables: {
            consoleUser,
            first: ITEMS_PER_PAGE,
            after: null
        },
        skip: !consoleUser,
        fetchPolicy: 'cache-and-network',
        notifyOnNetworkStatusChange: true 
    });

    const isBackgroundRefresh = networkStatus === 6; 
    const isInitialLoad = loading && !isBackgroundRefresh;
  
    const transformedData = useMemo(() => {
        if (!data) return null;

        return {
            ...data,
            macs: data.macs?.edges?.map(edge => edge.node) || [],
            iphones: data.iphones?.edges?.map(edge => edge.node) || [],
            ipads: data.ipads?.edges?.map(edge => edge.node) || []
        };
    }, [data]);
  
    const loadMore = async (type) => {
        if (!data?.[type]?.pageInfo?.hasNextPage) return;
    
        await fetchMore({
            variables: {
                consoleUser,
                first: ITEMS_PER_PAGE,
                after: data[type].pageInfo.endCursor
            },
            updateQuery: (prev, { fetchMoreResult }) => {
                if (!fetchMoreResult) return prev;
        
                return {
                    ...prev,
                    [type]: {
                        ...fetchMoreResult[type],
                        edges: [
                            ...prev[type].edges,
                            ...fetchMoreResult[type].edges
                        ]
                    }
                };
            }
        });
    };

    return {
        loading: isInitialLoad,
        backgroundRefresh: isBackgroundRefresh,
        error,
        data: transformedData,
        cardArray: data?.compliancecardprefs?.complianceCardPrefs || [],
        loadMore,
        hasNextPage: {
            macs: data?.macs?.pageInfo?.hasNextPage,
            iphones: data?.iphones?.pageInfo?.hasNextPage,
            ipads: data?.ipads?.pageInfo?.hasNextPage
        }
    };
};

const Dashboard = () => {
    const consoleUser = useAuthCheck();
    const { 
        loading, 
        backgroundRefresh,
        error, 
        data, 
        cardArray, 
        loadMore, 
        hasNextPage 
    } = useDashboardData(consoleUser);
    const [isModalVisible, setIsModalVisible] = useState(false);
    const [cards, setCards] = useState(cardArray);

    useEffect(() => {
        setCards(cardArray);
    }, [cardArray]);

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
                onLoadMore={() => loadMore(platformDataKey)}
                hasMoreData={hasNextPage[platformDataKey]}
            />
        );
    }, [data, loadMore, hasNextPage]);

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
        updateCards: handleCardsUpdate,
        totalCounts: {
            macs: data.macs.totalCount,
            iphones: data.iphones.totalCount,
            ipads: data.ipads.totalCount
        },
        hasNextPage: hasNextPage,
        onLoadMore: loadMore
    };

    return (
        <>
            <div className="rightHeader d-flex align-items-center">
                {backgroundRefresh && (
                    <div className="me-3 text-muted d-flex align-items-center">
                        <FaSync className="spin me-2" />
                        <small>Updating...</small>
                    </div>
                )}
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
