import React from 'react';
import '../../assets/css/button.css';

const EditButton = ({ onEdit }) => {
  return (
    <a className="btn-tooltip" title="Edit">
      <button 
        onClick={onEdit} 
        className="btn btn-outline-primary btn-sm" 
      >
        <i className="icon-edit"></i>
      </button>
    </a>
  );
}

export default EditButton;
