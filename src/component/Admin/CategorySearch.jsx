import React, { useState } from "react";

const CategorySearch = ({ onSearch }) => {
  const [term, setTerm] = useState("");

  const handleSearch = (e) => {
    e.preventDefault();
    onSearch(term);
  };

  return (
    <form onSubmit={handleSearch}>
      <input
        type="text"
        value={term}
        onChange={(e) => setTerm(e.target.value)}
        placeholder="Search categories"
      />
      <button type="submit">Search</button>
    </form>
  );
};

export default CategorySearch;
