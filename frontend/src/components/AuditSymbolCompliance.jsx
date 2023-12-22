import React from "react";
import { FaCheck, FaBan } from "react-icons/fa";

export default function AuditSymbolCompliance({ status }) {
  if (status) {
    return <FaCheck className='green' />;
  } else {
    return <FaBan className='red' />;
  }
}
