import React from "react";

export default function SearchBar({ searchHandler, keyHandler }) {
  return (
    <div className='input-group'>
      <div className='form-outline'>
        <input
          type='search'
          id='searchForm'
          className='form-control'
          autoComplete='off'
          autoCorrect='off'
          autoCapitalize='off'
          spellCheck='false'
          placeholder='search'
          onKeyDown={keyHandler}
          onChange={(e) => {
            searchHandler(e.target.value);
          }}
        />
      </div>
    </div>
  );
}
