import React from "react";
import { FaCheck, FaMinus } from "react-icons/fa";

export default function CheckMinusSymbols({ status }) {
  return status ? <FaCheck className='green' /> : <FaMinus />;
}