import React, { useState } from 'react';
import { Modal, Button } from 'react-bootstrap';
import axios from 'axios';
import { toast } from 'react-toastify';
import '../assets/profilepicturemodal.css'; // Assuming you have a CSS file for custom styles

const ProfilePictureModal = ({ show, handleClose, userId, loggedInUser, setUserProfile }) => {
  const [selectedFile, setSelectedFile] = useState(null);
  const [previewSource, setPreviewSource] = useState('');

  // Handle file selection and preview generation
  const handleFileChange = (event) => {
    const file = event.target.files[0];
    setSelectedFile(file);

    const reader = new FileReader();
    reader.onloadend = () => {
      setPreviewSource(reader.result); // Set image preview
    };
    if (file) {
      reader.readAsDataURL(file);
    }
  };

  // Handle profile picture upload
  const handleUploadProfilePicture = async () => {
    if (!selectedFile) {
      toast.error('Please select a file first');
      return;
    }

    const formData = new FormData();
    formData.append('profilePic', selectedFile);

    try {
      const response = await axios.post(
        `http://localhost:3000/api/user/${userId}/uploadProfilePic`,
        formData,
        {
          headers: {
            Authorization: `Bearer ${loggedInUser.token}`,
          },
        }
      );

      setUserProfile((prevProfile) => ({
        ...prevProfile,
        profilePicture: response.data.profilePicture,
      }));

      toast.success('Profile picture uploaded successfully');
      handleClose(); // Close the modal after successful upload
    } catch (error) {
      console.error('Error uploading profile picture', error);
      toast.error('Failed to upload profile picture');
    }
  };

  return (
    <Modal show={show} onHide={handleClose} centered>
      <Modal.Header closeButton>
        <Modal.Title>Upload Profile Picture</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <input type="file" onChange={handleFileChange} accept="image/*" />
        {previewSource && (
          <div className="image-preview-container">
            <img src={previewSource} alt="Selected Profile Preview" className="image-preview" />
          </div>
        )}
      </Modal.Body>
      <Modal.Footer>
        <Button variant="secondary" onClick={handleClose}>
          Cancel
        </Button>
        <Button variant="primary" onClick={handleUploadProfilePicture}>
          Upload Picture
        </Button>
      </Modal.Footer>
    </Modal>
  );
};

export default ProfilePictureModal;
