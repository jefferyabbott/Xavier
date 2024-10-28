import React, { useMemo } from 'react';
import { useQuery } from '@apollo/client';
import { GET_USER_INFO } from '../queries/userQueries.js';
import Spinner from './Spinner';
import AuditSymbolCompliance from './AuditSymbolCompliance';

const formatDate = (timestamp) => {
  const date = new Date(Number(timestamp));
  return {
    date: date.toLocaleDateString(undefined, {
      year: 'numeric',
      month: 'numeric',
      day: 'numeric',
    }),
    time: date.toLocaleTimeString('en-US'),
  };
};

const MDMLogRow = ({ logData }) => {
  const { loading, error, data } = useQuery(GET_USER_INFO, {
    variables: { userId: logData.Requester },
  });

  const dates = useMemo(() => ({
    request: formatDate(logData.createdAt),
    response: formatDate(logData.updatedAt),
  }), [logData.createdAt, logData.updatedAt]);

  if (loading) return <tr><td colSpan="4"><Spinner /></td></tr>;
  if (error) return <tr><td colSpan="4">Data not found</td></tr>;

  return (
    <tr className={logData.Response ? '' : 'table-danger'}>
      <td>{`${dates.request.date} ${dates.request.time}`}</td>
      <td>{logData.RequestType}</td>
      <td>{data?.lookupUser?.name}</td>
      <td>
        {logData.Response ? (
          <>
            <AuditSymbolCompliance status={logData.Response === 'Acknowledged'} />
            {` ${dates.response.date} ${dates.response.time}`}
          </>
        ) : (
          'no response'
        )}
      </td>
    </tr>
  );
};

export default React.memo(MDMLogRow, (prevProps, nextProps) => {
  return prevProps.logData.CommandUUID === nextProps.logData.CommandUUID;
});
