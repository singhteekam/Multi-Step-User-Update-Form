// File: UserForm.jsx
import React, { useState, useEffect } from "react";
import axios from "axios";
import {
  Form,
  Button,
  Col,
  Row,
  Image,
  InputGroup,
  ProgressBar,
} from "react-bootstrap";
import { Modal } from "react-bootstrap";

import { FaEye, FaEyeSlash } from "react-icons/fa";
import FormPreviewModal from "./FormPreviewModal";

const UserForm = () => {
  const [formData, setFormData] = useState({
    profilePhoto: null,
    username: "",
    currentPassword: "",
    newPassword: "",
    profession: "",
    companyName: "",
    addressLine1: "",
    country: "",
    state: "",
    city: "",
    subscriptionPlan: "Basic",
    newsletter: true,
    dob: "",
    gender: "",
    customGender: "",
  });

  const [countries, setCountries] = useState([]);
  const [states, setStates] = useState([]);
  const [cities, setCities] = useState([]);
  const [previewUrl, setPreviewUrl] = useState(null);
  const [passwordStrength, setPasswordStrength] = useState(0);
  const [showPassword, setShowPassword] = useState({
    current: false,
    new: false,
  });
  const [usernameStatus, setUsernameStatus] = useState(null);
  const [showPreview, setShowPreview] = useState(false);
  const [reqPassword, setReqPassword] = useState(false);


  const [step, setStep] = useState(1);

  const totalSteps = 4;

  useEffect(() => {
    axios.get("/api/countries").then((res) => setCountries(res.data));
  }, []);

  useEffect(() => {
    if (formData.country) {
      axios
        .get(`/api/states?country=${formData.country}`)
        .then((res) => setStates(res.data));
    } else {
      setStates([]);
    }
  }, [formData.country]);

  useEffect(() => {
    if (formData.state) {
      axios
        .get(`/api/cities?country=${formData.country}&state=${formData.state}`)
        .then((res) => setCities(res.data));
    } else {
      setCities([]);
    }
  }, [formData.state]);

  const handleChange = (e) => {
    const { name, value, type, checked, files } = e.target;
    if (type === "file") {
      const file = files[0];
      setFormData({ ...formData, [name]: file });
      const reader = new FileReader();
      reader.onloadend = () => setPreviewUrl(reader.result);
      reader.readAsDataURL(file);
    } else {
      setFormData({
        ...formData,
        [name]: type === "checkbox" ? checked : value,
      });
    }
  };

  const togglePasswordVisibility = (type) => {
    setShowPassword((prev) => ({ ...prev, [type]: !prev[type] }));
  };

  const validateForm = () => {
    if (!formData.profilePhoto) {
      alert("Profile photo is required.");
      return false;
    }
    if (formData.profilePhoto) {
      const size = formData.profilePhoto.size / 1024 / 1024;
      const type = formData.profilePhoto.type;
      if (size > 2 || !["image/jpeg", "image/png"].includes(type)) {
        alert("Profile photo must be JPG/PNG and <= 2MB.");
        return false;
      }
    }
    if (!/^[a-zA-Z0-9]{4,20}$/.test(formData.username)) {
      alert("Username must be 4-20 chars, no spaces.");
      return false;
    }
    if (
      formData.newPassword &&
      !/^(?=.*[!@#$%^&*])(?=.*\d).{8,}$/.test(formData.newPassword)
    ) {
      alert("Password must be 8+ chars with a number & special char.");
      return false;
    }
    if(!formData.profession) {
      alert("Profession is required.");
      return false;
    }
    if (formData.profession === "Entrepreneur" && !formData.companyName) {
      alert("Company Name required for Entrepreneurs.");
      return false;
    }
    if (!formData.addressLine1) {
      alert("Address Line 1 is required.");
      return false;
    }
    if(!formData.country) {
      alert("Country is required.");
        return false;
    }
    if(!formData.state) {
        alert("State is required.");
        return false;
    }
    if(!formData.city) {
        alert("City is required.");
        return false;
    }
    if (usernameStatus !== "available") {
      alert("Username is not available.");
      return false;
    }

    return true;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (validateForm()) {
      console.log(formData);

      if(formData.newPassword && !formData.currentPassword) {
        setReqPassword(true);
        alert("Current password is required to set a new password.");
        return;
      }

      try {
        const response = await axios.post("/api/submit", formData, {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        });

        alert("Profile submitted successfully!");
        console.log("Server response:", response.data);
        setShowPreview(false);
        setFormData({
            profilePhoto: null,
            username: "",
            currentPassword: "",
            newPassword: "",
            profession: "",
            companyName: "",
            addressLine1: "",
            country: "",
            state: "",
            city: "",
            subscriptionPlan: "Basic",
            newsletter: true,
        });
        setPreviewUrl(null);
        setStep(1);
        setUsernameStatus(null);
      } catch (error) {
        console.error("Error submitting form:", error);
        alert("Failed to submit form.");
      }
    } else {
      console.log("Form validation failed.");
      alert("Form validation failed.");
    }
  };

  const nextStep = () => {
    if (step < totalSteps) setStep(step + 1);
  };

  const prevStep = () => {
    if (step > 1) setStep(step - 1);
  };

  const progressValue = Math.round(((step - 1) / totalSteps) * 100);

  return (
    <Form className="p-4 border rounded" onSubmit={handleSubmit}>
      <ProgressBar
        now={progressValue}
        label={`${progressValue}%`}
        className="mb-4"
      />

      {step === 1 && (
        <>
          <h4>Personal Info</h4>
          <Form.Group controlId="profilePhoto">
            <Form.Label>
              Profile Photo <span className="text-danger">*</span>
            </Form.Label>
            <Form.Control
              type="file"
              accept="image/jpeg, image/png"
              name="profilePhoto"
              onChange={handleChange}
            />
            {previewUrl && (
              <Image src={previewUrl} thumbnail className="mt-2" width={200} />
            )}
          </Form.Group>

          <Form.Group controlId="username">
            <Form.Label>
              Username <span className="text-danger">*</span>
            </Form.Label>
            <Form.Control
              type="text"
              name="username"
              value={formData.username}
              onChange={(e) => {
                handleChange(e);
                const username = e.target.value;
                if (username.length >= 4) {
                  setUsernameStatus("checking");
                  axios
                    .get(`/api/check-username?username=${username}`)
                    .then((res) => {
                      setUsernameStatus(
                        res.data.available ? "available" : "taken"
                      );
                    });
                } else {
                  setUsernameStatus(null);
                }
              }}
            />
            {usernameStatus === "checking" && (
              <Form.Text className="text-warning">
                Checking availability...
              </Form.Text>
            )}
            {usernameStatus === "available" && (
              <Form.Text className="text-success">
                Username is available!
              </Form.Text>
            )}
            {usernameStatus === "taken" && (
              <Form.Text className="text-danger">Username is taken.</Form.Text>
            )}
          </Form.Group>

          <Form.Group controlId="currentPassword">
            <Form.Label>
              Current Password
            </Form.Label>
            <InputGroup>
              <Form.Control
                type={showPassword.current ? "text" : "password"}
                name="currentPassword"
                value={formData.currentPassword}
                onChange={handleChange}
                required={reqPassword}
              />
              <Button
                variant="outline-secondary"
                onClick={() => togglePasswordVisibility("current")}
              >
                {showPassword.current ? <FaEyeSlash /> : <FaEye />}
              </Button>
            </InputGroup>
          </Form.Group>

          <Form.Group controlId="newPassword">
            <Form.Label>
              New Password
            </Form.Label>
            <InputGroup>
              <Form.Control
                type={showPassword.new ? "text" : "password"}
                name="newPassword"
                value={formData.newPassword}
                onChange={(e) => {
                  handleChange(e);
                  const val = e.target.value;
                  let strength = 0;
                  if (val.length >= 8) strength++;
                  if (/[!@#$%^&*]/.test(val)) strength++;
                  if (/\d/.test(val)) strength++;
                  setPasswordStrength(strength);
                }}
              />
              <Button
                variant="outline-secondary"
                onClick={() => togglePasswordVisibility("new")}
              >
                {showPassword.new ? <FaEyeSlash /> : <FaEye />}
              </Button>
            </InputGroup>
            <Form.Text>Password Strength:</Form.Text>
            <progress max="3" value={passwordStrength} className="w-100" />
          </Form.Group>
        </>
      )}

      {step === 2 && (
        <>
          <h4 className="mt-4">Professional Details</h4>
          <Form.Group controlId="profession">
            <Form.Label>
              Profession <span className="text-danger">*</span>
            </Form.Label>
            <Form.Select
              name="profession"
              value={formData.profession}
              onChange={handleChange}
              required
            >
              <option value="">Select Profession</option>
              <option value="Student">Student</option>
              <option value="Developer">Developer</option>
              <option value="Entrepreneur">Entrepreneur</option>
            </Form.Select>
          </Form.Group>

          {formData.profession === "Entrepreneur" && (
            <Form.Group controlId="companyName">
              <Form.Label>
                Company Name <span className="text-danger">*</span>
              </Form.Label>
              <Form.Control
                type="text"
                name="companyName"
                value={formData.companyName}
                onChange={handleChange}
              />
            </Form.Group>
          )}

          <Form.Group controlId="addressLine1">
            <Form.Label>
              Address Line 1 <span className="text-danger">*</span>
            </Form.Label>
            <Form.Control
              type="text"
              name="addressLine1"
              value={formData.addressLine1}
              onChange={handleChange}
            />
          </Form.Group>
        </>
      )}

      {step === 3 && (
        <>
          <h3>Preferences</h3>
          <Form.Group controlId="country">
            <Form.Label>Country</Form.Label>
            <Form.Select
              name="country"
              value={formData.country}
              required
              onChange={(e) => {
                handleChange(e);
                setFormData({
                  ...formData,
                  country: e.target.value,
                  addressLine1: "",
                  state: "",
                  city: "",
                });
              }}
            >
              <option value="">Select Country</option>
              {countries.map((c) => (
                <option key={c.code} value={c.code}>
                  {c.name}
                </option>
              ))}
            </Form.Select>
          </Form.Group>

          <Form.Group controlId="state">
            <Form.Label>State</Form.Label>
            <Form.Select
              name="state"
              value={formData.state}
              required
              onChange={(e) => {
                handleChange(e);
                setFormData({ ...formData, state: e.target.value, city: "" });
              }}
            >
              <option value="">Select State</option>
              {states.map((s) => (
                <option key={s.code} value={s.code}>
                  {s.name}
                </option>
              ))}
            </Form.Select>
          </Form.Group>

          <Form.Group controlId="city">
            <Form.Label>City</Form.Label>
            <Form.Select
              name="city"
              value={formData.city}
              required
              onChange={(e) => {
                handleChange(e);
                setFormData({ ...formData, city: e.target.value });
              }}
            >
              <option value="">Select City</option>
              {cities.map((c) => (
                <option key={c.code} value={c.code}>
                  {c.name}
                </option>
              ))}
            </Form.Select>
          </Form.Group>
        </>
      )}

      {step === 4 && (
        <>
          <Form.Group controlId="dob">
            <Form.Label>Date of Birth</Form.Label>
            <Form.Control
              type="date"
              name="dob"
              max={new Date().toISOString().split("T")[0]}
              onChange={handleChange}
            />
          </Form.Group>

          <Form.Group controlId="gender">
            <Form.Label>Gender</Form.Label>
            <Form.Select
              name="gender"
              value={formData.gender}
              onChange={handleChange}
            >
              <option value="">Select Gender</option>
              <option value="Male">Male</option>
              <option value="Female">Female</option>
              <option value="Other">Other</option>
            </Form.Select>
          </Form.Group>

          {formData.gender === "Other" && (
            <Form.Group controlId="customGender">
              <Form.Label>Custom Gender</Form.Label>
              <Form.Control
                type="text"
                name="customGender"
                onChange={handleChange}
              />
            </Form.Group>
          )}

          <Form.Group controlId="subscriptionPlan">
            <Form.Label>Subscription Plan</Form.Label>
            <div key="inline-radio" className="mb-3">
              {["Basic", "Pro", "Enterprise"].map((plan) => (
                <Form.Check
                  inline
                  type="radio"
                  name="subscriptionPlan"
                  label={plan}
                  value={plan}
                  checked={formData.subscriptionPlan === plan}
                  onChange={handleChange}
                  key={plan}
                />
              ))}
            </div>
          </Form.Group>

          <Form.Group controlId="newsletter">
            <Form.Check
              type="checkbox"
              name="newsletter"
              label="Subscribe to Newsletter"
              checked={formData.newsletter}
              onChange={handleChange}
            />
          </Form.Group>
        </>
      )}
      <div className="d-flex justify-content-between mt-4">
        {step > 1 && (
          <Button variant="secondary" onClick={prevStep}>
            Back
          </Button>
        )}
        {step < totalSteps && (
          <Button variant="primary" onClick={nextStep}>
            Next
          </Button>
        )}
        {step === totalSteps && (
          <Button onClick={()=>setShowPreview(true)} variant="success">
            Preview form
          </Button>
        //   <Button type="submit" variant="success">
        //     Submit
        //   </Button>
        )}
      </div>

      <FormPreviewModal formData={formData} showPreview={showPreview} setShowPreview={setShowPreview} previewUrl={previewUrl} confirmSubmit={handleSubmit} />
    </Form>
  );
};

export default UserForm;
