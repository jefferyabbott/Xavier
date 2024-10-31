import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useSelector } from "react-redux";
import { useQuery } from "@apollo/client";
import { GET_ALL_DEVICES } from "../queries/allDevicesQuery";
import AllDeviceTable from "../components/AllDeviceTable";
import Spinner from "../components/Spinner";

const AllDevices = () => {
  const navigate = useNavigate();
  const { user } = useSelector((state) => state.auth);
  const ITEMS_PER_PAGE = 100;
  
  // Track loading state for each device type
  const [loadingMore, setLoadingMore] = useState({
    macs: false,
    iphones: false,
    ipads: false
  });

  useEffect(() => {
    if (!user) {
      navigate("/login");
    }
  }, [user, navigate]);

  const { loading, error, data, fetchMore } = useQuery(GET_ALL_DEVICES, {
    variables: {
      first: ITEMS_PER_PAGE,
      after: null
    }
  });

  const loadMore = async (type) => {
    if (loadingMore[type] || !data?.[type]?.pageInfo?.hasNextPage) return;

    setLoadingMore(prev => ({ ...prev, [type]: true }));
    const endCursor = data[type].pageInfo.endCursor;
    
    try {
      await fetchMore({
        variables: {
          first: ITEMS_PER_PAGE,
          after: endCursor
        },
        updateQuery: (prevResult, { fetchMoreResult }) => {
          if (!fetchMoreResult) return prevResult;

          return {
            ...prevResult,
            [type]: {
              ...fetchMoreResult[type],
              edges: [
                ...prevResult[type].edges,
                ...fetchMoreResult[type].edges
              ],
              pageInfo: fetchMoreResult[type].pageInfo,
              totalCount: fetchMoreResult[type].totalCount
            }
          };
        }
      });
    } catch (err) {
      console.error(`Error loading more ${type}:`, err);
    } finally {
      setLoadingMore(prev => ({ ...prev, [type]: false }));
    }
  };

  const combinedData = [];

  if (loading) return <Spinner />;
  if (error) return <p>Error loading devices: {error.message}</p>;
  
  if (data) {
    // Combine all device types into a single array
    data.macs.edges.forEach(({ node }) => {
      combinedData.push({ ...node, type: "mac" });
    });

    data.iphones.edges.forEach(({ node }) => {
      combinedData.push({ ...node, type: "iphone" });
    });

    data.ipads.edges.forEach(({ node }) => {
      combinedData.push({ ...node, type: "ipad" });
    });
  }

  return (
    <>
      <AllDeviceTable 
        deviceData={combinedData}
        totalCount={{
          macs: data.macs.totalCount,
          iphones: data.iphones.totalCount,
          ipads: data.ipads.totalCount
        }}
        hasNextPage={{
          macs: data.macs.pageInfo.hasNextPage,
          iphones: data.iphones.pageInfo.hasNextPage,
          ipads: data.ipads.pageInfo.hasNextPage
        }}
        onLoadMore={loadMore}
        loadingMore={loadingMore}
      />
    </>
  );
};

export default AllDevices;
