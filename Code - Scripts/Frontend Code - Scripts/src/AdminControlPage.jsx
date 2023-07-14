/* eslint-disable no-unused-vars */
import "./Admin.css";
import Button from "react-bootstrap/Button";
import axiosInstance from "./axios";
import FormLabel from "react-bootstrap/esm/FormLabel";
import addButton from "./assets/add-icon.png";
import removeButton from "./assets/remove.png";
import updateButton from "./assets/update-icon.png";
import searchButton from "./assets/search-icon.png";
import backArrow from "./assets/arrow-round-back.svg";
import React, { useState, useEffect } from "react";
import { SongForm } from "./SongForm";
import { useNavigate } from 'react-router-dom';
import Form from "react-bootstrap/Form";
import InputGroup from "react-bootstrap/InputGroup";

function AdminControlPage() {
  const navigate = useNavigate();
  const isAuthenticated = !!localStorage.getItem('token');
  useEffect(() => {
    if (!isAuthenticated) {
      navigate('/admin');
    }
  }, [isAuthenticated, navigate]);
  const [isadminButtonsVisible, setAdminButtonsVisible] = useState(true);
  const [isAddNewSongFormVisible, setAddNewSongFormVisible] = useState(false);
  const [isRemoveSongFormVisible, setRemoveSongFormVisible] = useState(false);
  const [isUpdateSongFormVisible, setUpdateSongFormVisible] = useState(false);
  const [isSearchSongFormVisible, setSearchSongFormVisible] = useState(false);

  const [type, setType] = useState("");

  const handleCancel = () => {
    setAdminButtonsVisible(true);
    setAddNewSongFormVisible(false);
    setRemoveSongFormVisible(false);
    setUpdateSongFormVisible(false);
  };

  const handleFormVisible = (e) => {
    setAdminButtonsVisible(false);
    if (e === "add") {
      setAddNewSongFormVisible(true);
    } else if (e === "remove") {
      setRemoveSongFormVisible(true);
    } else if (e === "update") {
      setUpdateSongFormVisible(true);
    } else if (e === "search") {
      setSearchSongFormVisible(true);
    }
    setType(e);
  };

  const handleLogout = () => {
    // Remove the token from local storage
    localStorage.removeItem('token');

    // Redirect to the home page
    navigate('/admin');
  };


  useEffect(() => {
    console.log(
      "type is set to:",
      type,
      "isAddNewSongFormVisible is set to:",
      isAddNewSongFormVisible,
      "isRemoveSongFormVisible is set to:",
      isRemoveSongFormVisible,
      "isUpdateSongFormVisible is set to:",
      isUpdateSongFormVisible
    );
  }, [
    type,
    isAddNewSongFormVisible,
    isRemoveSongFormVisible,
    isUpdateSongFormVisible,
  ]);

  return (
    <div>

      
      
      {isadminButtonsVisible && (
        <div className="pageContainer">
          <Button onClick={() => handleFormVisible("add")}>
            Add New Song to Database{" "}
            <img
              className="whiteButton"
              src={addButton}
              alt="add button"
              width="20"
              height="20"
            />
          </Button>
          <br />
          <Button onClick={() => handleFormVisible("remove")}>
            Remove Song From Database{" "}
            <img
              className="whiteButton"
              src={removeButton}
              alt="remove button"
              width="20"
              height="20"
            />
          </Button>
          <br />
          <Button onClick={() => handleFormVisible("update")}>
            Update Song in Database{" "}
            <img
              className="whiteButton"
              src={updateButton}
              alt="update button"
              width="20"
              height="20"
            />
          </Button>
          <br />
          {isAuthenticated && (
        <button onClick={handleLogout}>Logout</button>
          )}
        </div>
      )}

      {(isAddNewSongFormVisible ||
        isRemoveSongFormVisible ||
        isUpdateSongFormVisible ||
        isSearchSongFormVisible) && (
        <SongForm onCancelClick={handleCancel} type={type} />
      )}
    </div>
  );
}

export default AdminControlPage;
