import { useState } from "react";
import { Button, Form, Modal } from "react-bootstrap";

function ReplyModal({show, handleClose, handleReply}) {
    const[replyText, setReplyText] = useState('');
    const[replyImage, setReplyImage] = useState(null);

    const handleSubmit = () => {
        console.log("Final reply text:", replyText);
        handleReply(replyText, replyImage);
        setReplyText('');
        setReplyImage(null);
        handleClose();
    };

    return (
        <Modal show = {show} onHide={handleClose} centered>
            <Modal.Header closeButton>
                <Modal.Title>Tweet your reply</Modal.Title>
            </Modal.Header>
            <Modal.Body>
                <Form.Group>
                    <Form.Control
                    as = "textarea"
                    rows = {3}
                    placeholder = "post your reply"
                    value= {replyText}
                    onChange = {(e) => {
                        setReplyText(e.target.value);
                        console.log(e.target.value);
                    }
                    }
                    />
                </Form.Group>

                <Form.Group>
                    <Form.Control
                    label = "Attach an image"
                    type="file"
                    accept = "image/*"
                    onChange = {(e) => setReplyImage(e.target.files[0])}
                    />
                </Form.Group>
            </Modal.Body>

            <Modal.Footer>
                <Button variant="secondary" onClick={handleClose}>
                    Close
                </Button>

                <Button variant="secondary" onClick={handleSubmit}>
                    Reply
                </Button>
            </Modal.Footer>
        </Modal>
    );
}

export default ReplyModal;