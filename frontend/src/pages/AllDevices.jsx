import { useEffect, React } from "react";
import { useNavigate } from "react-router-dom";
import { useSelector } from "react-redux";
import AllDeviceTable from "../components/AllDeviceTable";
import { useQuery } from "@apollo/client";
import { GET_ALL_DEVICES } from "../queries/allDevicesQuery";
import Spinner from "../components/Spinner";

export default function AllDevices() {
  const navigate = useNavigate();
  const { user } = useSelector((state) => state.auth);
  const ITEMS_PER_PAGE = 100;

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

  const loadMore = (type) => {
    const endCursor = data[type].pageInfo.endCursor;
    
    fetchMore({
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
            ]
          }
        };
      }
    });
  };

  const combinedData = [];

  if (loading) return <Spinner />;
  if (error) return <p>Something went wrong!</p>;
  
  if (data) {
    data.macs.edges.forEach(({ node }) => {
      const newObject = Object.assign({}, node, { type: "mac" });
      combinedData.push(newObject);
    });

    data.iphones.edges.forEach(({ node }) => {
      const newObject = Object.assign({}, node, { type: "iphone" });
      combinedData.push(newObject);
    });

    data.ipads.edges.forEach(({ node }) => {
      const newObject = Object.assign({}, node, { type: "ipad" });
      combinedData.push(newObject);
    });
  }

  if (!loading && !error) {
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
        />
      </>
    );
  }
}
