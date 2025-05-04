import React from "react";
import { Modal, Button, Image } from "react-bootstrap";

const FormPreviewModal = ({formData, showPreview, setShowPreview, previewUrl, confirmSubmit}) => {
  return (
    <div>
      <Modal show={showPreview} onHide={() => setShowPreview(false)} centered>
        <Modal.Header closeButton>
          <Modal.Title>Confirm Submission</Modal.Title>
        </Modal.Header>
        <Modal.Body>
        {previewUrl && <Image src={previewUrl} thumbnail width={100} />}
          <p>
            <strong>Username:</strong> {formData.username}
          </p>
          <p>
            <strong>Profession:</strong> {formData.profession}
          </p>
          {formData.profession === "Entrepreneur" && (
            <p>
              <strong>Company Name:</strong> {formData.companyName}
            </p>
          )}
          <p>
            <strong>Address:</strong> {formData.addressLine1}, {formData.city},{" "}
            {formData.state}, {formData.country}
          </p>
          <p>
            <strong>Country:</strong> {formData.country}
          </p>
          <p>
            <strong>State:</strong> {formData.state}
          </p>
          <p>
            <strong>City:</strong> {formData.city}
          </p>
          <p>
            <strong>Gender:</strong>{" "}
            {formData.gender === "Other"
              ? formData.customGender
              : formData.gender}
          </p>
          <p>
            <strong>Plan:</strong> {formData.subscriptionPlan}
          </p>
          <p>
            <strong>Newsletter:</strong> {formData.newsletter ? "Yes" : "No"}
          </p>
          
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={() => setShowPreview(false)}>
            Cancel
          </Button>
          <Button variant="success" type="submit" onClick={confirmSubmit}>
            Confirm & Submit
          </Button>
        </Modal.Footer>
      </Modal>
    </div>
  );
};

export default FormPreviewModal;
