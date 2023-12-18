import React from "react";
import { useQuery } from "@apollo/client";
import { GET_USER_INFO } from "../queries/userQueries.js";
import Spinner from "./Spinner.jsx";

export default function MDMLogRow({ logData }) {
  
    const dateOptions = {
      year: 'numeric',
      month: 'numeric',
      day: 'numeric',
    };

    const requestDate = new Date(Number(logData.createdAt)).toLocaleDateString(undefined, dateOptions);
    const responseDate = new Date(Number(logData.updatedAt)).toLocaleDateString(undefined, dateOptions);
    const requestTime = new Date(Number(logData.createdAt)).toLocaleTimeString('en-US');
    const responseTime = new Date(Number(logData.updatedAt)).toLocaleTimeString('en-US');

    const { loading, error, data } = useQuery(GET_USER_INFO, {
        variables: { userId: logData.Requester },
    });
    
    if (loading) return <Spinner />;
    if (error) return <p>Data not found</p>;

    if (data) {
      

        return (
            <>
              {!loading && !error && (
                
                <tr key={logData.CommandUUID}>
                        <td>{`${requestDate} ${requestTime}`}</td>
                        <td>{logData.Response ? `${responseDate} ${responseTime}` : 'no response'}</td>
                        <td>{logData.RequestType}</td>
                        <td>{data.lookupUser.name}</td>
                        {/* <td>Approved by</td> */}
                        <td>{logData.Response}</td>
                </tr>
             )}
            </>
          );
    }
  
}

