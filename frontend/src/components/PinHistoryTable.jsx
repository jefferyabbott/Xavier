import React from 'react';

export default function PinHistoryTable({ data, hideShowPinHistoryTable }) {

  return (
    <div>
        <table className="table tableList" onClick={hideShowPinHistoryTable}>
            <thead>
                <tr>
                    <th>PIN history</th>
                </tr>
            </thead>
            <tbody>
                {data.reverse().map((item, index) => { 
                    return (
                    <tr key={item.pin + index}>
                        <td>{item.pin}</td>
                    </tr>
                    )
                })}
            </tbody>
        </table>
    </div>
  )
}