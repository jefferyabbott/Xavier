import React, { useEffect, useState } from 'react';
import SearchBar from './SearchBar';


function sortData(data) {
  let dataArray = [...data]
  return dataArray.sort((a,b) => {
      return a.toLowerCase() > b.toLowerCase() ? 1 : -1;
  });
}

export default function SimpleArrayTable({ data }) {

    const [searchedData, setSearchedData] = useState([]);

    // useEffect is needed to force loadig of new data
    useEffect(() => {
        if (data && data.length > 0) {
            setSearchedData(data);
        } else {
            setSearchedData([]);
        }
    }, [data]);

    function searchHandler(query) {
        setSearchedData(data.filter(item => item.toLowerCase().includes(query.toLowerCase())));
    }

  return (
    <div>
        <table className="table tableList">
            <thead>
                <tr>
                    <th><SearchBar searchHandler={searchHandler}/></th>
                </tr>
            </thead>
            <tbody>
                {sortData(searchedData).map((item, index) => { 
                    return (
                    <tr key={item + index}>
                        <td>{item}</td>
                    </tr>
                    )
                })}
            </tbody>
        </table>
    </div>
  )
}