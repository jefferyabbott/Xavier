import React from "react";
import { useQuery } from "@apollo/client";
import { GET_COMMAND_LOG } from "../queries/commandLogQuery";
import MDMLogRow from "./MDMLogRow.jsx";
import Spinner from "./Spinner.jsx";

export default function MDMLogTable({ DeviceUDID }) {
  const { loading, error, data } = useQuery(GET_COMMAND_LOG, {
    variables: { DeviceUDID },
  });

  if (loading) return <Spinner />;
  if (error) return <p>Data not found</p>;

  return (
    <>
      {!loading && !error && (
        <div>
          <table className='table tableList'>
            <thead>
              <tr>
                <th>Initiated</th>
                <th>Request</th>
                <th>Requested by</th>
                {/* <th>Approved by</th> */}
                <th>Response</th>
              </tr>
            </thead>
            <tbody>
              {data.commandlogs.toReversed().map((command) => (
                <MDMLogRow logData={command} />
              ))}
            </tbody>
          </table>
        </div>
      )}
    </>
  );
}
