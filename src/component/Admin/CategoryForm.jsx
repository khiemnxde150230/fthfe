import React, { useState } from "react";
import { addCategoryService } from "../../services/CategoryService";

const CategoryForm = ({ onCategoryAdded }) => {
  const [name, setName] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await addCategoryService({ name });
      setName("");
      onCategoryAdded();
    } catch (error) {
      console.error("Failed to add category", error);
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <input
        type="text"
        value={name}
        onChange={(e) => setName(e.target.value)}
        placeholder="Category name"
      />
      <button type="submit">Add Category</button>
    </form>
  );
};

export default CategoryForm;
