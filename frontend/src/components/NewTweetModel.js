import React, { useState } from 'react';
import { Modal, Button, Form } from 'react-bootstrap';

function NewTweetModel({ show, handleClose, handleTweet }) {
  const [tweetContent, setTweetContent] = useState('');
  const[tweetImage, setTweetImage] = useState(null);
  const[imagePreview, setImagePreview] = useState(null);

  const handleSubmit = () => {
    handleTweet(tweetContent, tweetImage);
    setTweetContent('');
    setTweetImage(null);
    setImagePreview(null);
    handleClose();
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if(file) {
        setTweetImage(file);
        setImagePreview(URL.createObjectURL(file));
    }
  };

  return (
    <Modal show={show} onHide={handleClose} centered>
      <Modal.Header closeButton>
        <Modal.Title>New Tweet</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <Form>
          <Form.Group controlId="tweetContent">
            <Form.Control
              as="textarea"
              rows={3}
              placeholder="Write your tweet"
              value={tweetContent}
              onChange={(e) => setTweetContent(e.target.value)}
            />
          </Form.Group>

          <Form.Group controlId='tweetImage' className='mt-3'>
            <Form.Label>Upload an image</Form.Label>
            <Form.Control type='file' onChange={handleImageChange}/>
          </Form.Group>

          {imagePreview && (
            <div className='image-preview mt-3'>
                <img src={imagePreview} alt='preview' style={{maxWidth : '100%', maxHeight : '200px'}}/>
            </div>
          )}

        </Form>
      </Modal.Body>
      <Modal.Footer>
        <Button variant="secondary" onClick={handleClose}>
          Close
        </Button>
        <Button variant="primary" onClick={handleSubmit}>
          Tweet
        </Button>
      </Modal.Footer>
    </Modal>
  );
}

export default NewTweetModel;
