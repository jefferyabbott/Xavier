import React, { useState } from "react";
import AuditSymbolCompliance from "./AuditSymbolCompliance.jsx";
import SearchBar from "./SearchBar";

function sortCertificates(Certificates) {
  let appArray = [...Certificates];
  return appArray.sort((a, b) => {
    return a.CommonName.toLowerCase() > b.CommonName.toLowerCase() ? 1 : -1;
  });
}

export default function CertificateListTable({ Certificates }) {
  const [searchedCerts, setSearchedCerts] = useState(Certificates);

  function searchHandler(query) {
    setSearchedCerts(
      Certificates.filter((cert) =>
        cert.CommonName.toLowerCase().includes(query.toLowerCase())
      )
    );
  }

  return (
    <div>
      <table className='table tableList'>
        <thead>
          <tr>
            <th>
              <SearchBar searchHandler={searchHandler} />
            </th>
            <th>Identity Certificate</th>
          </tr>
        </thead>
        <tbody>
          {sortCertificates(searchedCerts).map((cert, index) => {
            return (
              <tr key={cert.CommonName + index}>
                <td>{cert.CommonName}</td>
                <td>{<AuditSymbolCompliance status={cert.IsIdentity} />}</td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
}
