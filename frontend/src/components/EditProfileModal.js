import { useState } from "react";
import { Button, Form, Modal } from "react-bootstrap";
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css'; // Import DatePicker styles

function EditProfileModal({ show, handleClose, userProfile, handleSave }) {
    const [formData, setFormData] = useState({
        name: userProfile?.name || '',
        location: userProfile?.location || '',
        dateOfBirth: userProfile?.dateOfBirth ? new Date(userProfile?.dateOfBirth) : null,
    });

    // Handle input changes
    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData({ ...formData, [name]: value });
    };

    // Handle date change for date of birth
    const handleDateChange = (date) => {
        setFormData({ ...formData, dateOfBirth: date });
    };

    // Handle form submission
    const handleSubmit = (e) => {
        e.preventDefault();
        handleSave(formData); // Pass formData to save function in parent
    };

    return (
        <Modal show={show} onHide={handleClose} centered>
            <Modal.Header closeButton>
                <Modal.Title>Edit Profile</Modal.Title>
            </Modal.Header>

            <Modal.Body>
                <Form onSubmit={handleSubmit}>
                    <Form.Group controlId="formName" className="mb-3">
                        <Form.Label>Name</Form.Label>
                        <Form.Control
                            type="text"
                            name="name"
                            value={formData.name}
                            onChange={handleChange}
                            placeholder="Enter your name"
                        />
                    </Form.Group>

                    <Form.Group controlId="formLocation" className="mb-3">
                        <Form.Label>Location</Form.Label>
                        <Form.Control
                            type="text"
                            name="location"
                            value={formData.location}
                            onChange={handleChange}
                            placeholder="Enter your location"
                        />
                    </Form.Group>

                    <Form.Group controlId="formDateOfBirth" className="mb-3">
                        <Form.Label>Date of Birth</Form.Label>
                        <DatePicker
                            selected={formData.dateOfBirth}
                            onChange={handleDateChange} // Use handleDateChange instead of handleChange
                            dateFormat="dd/MM/yyyy"
                            className="form-control"
                            placeholderText="Select your date of birth"
                        />
                    </Form.Group>

                    <div className="d-flex justify-content-end">
                        <Button variant="secondary" onClick={handleClose} className="me-2">
                            Close
                        </Button>

                        <Button type="submit" variant="primary">
                            Edit
                        </Button>
                    </div>
                </Form>
            </Modal.Body>
        </Modal>
    );
}

export default EditProfileModal;
