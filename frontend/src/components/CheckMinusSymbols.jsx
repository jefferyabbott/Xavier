import React from "react";
import { FaCheck, FaMinus } from "react-icons/fa";

export default function CheckMinusSymbols({ status }) {
  if (status) {
    return <FaCheck className='green' />;
  } else {
    return <FaMinus />;
  }
}