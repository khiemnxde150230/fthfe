import React, { useState, useEffect } from 'react';
import {
  getCategoriesService,
  searchCategoriesService,
  addCategoryService,
  updateCategoryService,
  deleteCategoryService,
} from '../../services/CategoryService';

const Category = () => {
  const [categories, setCategories] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [newCategory, setNewCategory] = useState('');
  const [editCategoryId, setEditCategoryId] = useState(null);
  const [editCategoryName, setEditCategoryName] = useState('');

  useEffect(() => {
    fetchCategories();
  }, []);

  const fetchCategories = async () => {
    try {
      const response = await getCategoriesService();
      setCategories(response.data);
    } catch (error) {
      console.error('Error fetching categories:', error);
    }
  };

  const handleSearch = async () => {
    try {
      const response = await searchCategoriesService(searchTerm);
      setCategories(response.data);
    } catch (error) {
      console.error('Error searching categories:', error);
    }
  };

  const handleAddCategory = async () => {
    try {
      await addCategoryService({ name: newCategory });
      setNewCategory('');
      fetchCategories();
    } catch (error) {
      console.error('Error adding category:', error);
    }
  };

  const handleUpdateCategory = async () => {
    try {
      await updateCategoryService(editCategoryId, { name: editCategoryName });
      setEditCategoryId(null);
      setEditCategoryName('');
      fetchCategories();
    } catch (error) {
      console.error('Error updating category:', error);
    }
  };

  const handleDeleteCategory = async (id) => {
    try {
      await deleteCategoryService(id);
      fetchCategories();
    } catch (error) {
      console.error('Error deleting category:', error);
    }
  };

  return (
    <div className="app-body">
      <div className="container">
        <div className="row mb-3">
          <div className="col-12 col-xl-6">
            <h4>Category Management</h4>
            <div className="mb-3">
              <input
                type="text"
                className="form-control"
                placeholder="Search categories"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
              <button className="btn btn-primary mt-2" onClick={handleSearch}>
                Search
              </button>
            </div>
            <div className="mb-3">
              <input
                type="text"
                className="form-control"
                placeholder="New category"
                value={newCategory}
                onChange={(e) => setNewCategory(e.target.value)}
              />
              <button
                className="btn btn-success mt-2"
                onClick={handleAddCategory}
              >
                Add Category
              </button>
            </div>
          </div>
        </div>

        <div className="row">
          <div className="col-12">
            <div className="card">
              <div className="card-body">
                <div className="table-responsive">
                  <table className="table table-bordered table-striped align-middle m-0">
                    <thead>
                      <tr>
                        <th>ID</th>
                        <th>Name</th>
                        <th>Actions</th>
                      </tr>
                    </thead>
                    <tbody>
                      {categories.map((category) => (
                        <tr key={category.id}>
                          <td>{category.id}</td>
                          <td>
                            {editCategoryId === category.id ? (
                              <input
                                type="text"
                                className="form-control"
                                value={editCategoryName}
                                onChange={(e) =>
                                  setEditCategoryName(e.target.value)
                                }
                              />
                            ) : (
                              category.name
                            )}
                          </td>
                          <td>
                            {editCategoryId === category.id ? (
                              <button
                                className="btn btn-success btn-sm"
                                onClick={handleUpdateCategory}
                              >
                                Save
                              </button>
                            ) : (
                              <>
                                <button
                                  className="btn btn-outline-primary btn-sm"
                                  onClick={() => {
                                    setEditCategoryId(category.id);
                                    setEditCategoryName(category.name);
                                  }}
                                >
                                  Edit
                                </button>
                                <button
                                  className="btn btn-outline-danger btn-sm"
                                  onClick={() =>
                                    handleDeleteCategory(category.id)
                                  }
                                >
                                  Delete
                                </button>
                              </>
                            )}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Category;
