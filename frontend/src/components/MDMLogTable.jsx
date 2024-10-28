import React, { useMemo } from 'react';
import { useQuery } from '@apollo/client';
import { GET_COMMAND_LOG } from '../queries/commandLogQuery';
import MDMLogRow from './MDMLogRow';
import Spinner from './Spinner';

const MDMLogTable = ({ DeviceUDID }) => {
  const { loading, error, data } = useQuery(GET_COMMAND_LOG, {
    variables: { DeviceUDID },
  });

  const reversedCommands = useMemo(() => {
    return data?.commandlogs ? [...data.commandlogs].reverse() : [];
  }, [data?.commandlogs]);

  if (loading) return <Spinner />;
  if (error) return <p>Data not found</p>;

  return (
    <div>
      <table className="table tableList">
        <thead>
          <tr>
            <th>Initiated</th>
            <th>Request</th>
            <th>Requested by</th>
            <th>Response</th>
          </tr>
        </thead>
        <tbody>
          {reversedCommands.map((command) => (
            <MDMLogRow 
              key={command.CommandUUID} 
              logData={command} 
            />
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default React.memo(MDMLogTable);
