import { useState } from 'react';
import axios from 'axios';  // Import axios for making HTTP requests
import './App.css';

const App = () => {
  // Define state variables for form fields
  const [formData, setFormData] = useState({
    username: "",
    email: "",
    fullName: "",
    password: "",
    avatar: "",
    coverImage: "",
  });

  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);

  // Handle form input changes
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  // Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const response = await axios.post(
        "http://localhost:3000/api/v1/users/register",  // Your backend API endpoint
        formData
      );
      console.log(response.data);  // Handle the response from the backend
      alert("Registration successful!");
    } catch (err) {
      setError(err.response?.data?.message || "Registration failed!");
    } finally {
      setLoading(false);
    }
  };

  // Function to open Cloudinary upload widget for avatar image
  const handleAvatarUpload = () => {
    window.cloudinary.openUploadWidget(
      {
        cloudName: 'your-cloud-name',  // Replace with your Cloudinary cloud name
        uploadPreset: 'your-upload-preset',  // Replace with your Cloudinary upload preset
        sources: ['local', 'url', 'camera'],
        clientAllowedFormats: ['image/*'],
        showPoweredBy: false,
        multiple: false
      },
      (error, result) => {
        if (error) {
          console.log(error);
        } else {
          // Set the avatar URL in the form state after successful upload
          const avatarUrl = result[0].secure_url;
          setFormData((prev) => ({ ...prev, avatar: avatarUrl }));
        }
      }
    );
  };

  // Function to open Cloudinary upload widget for cover image
  const handleCoverImageUpload = () => {
    window.cloudinary.openUploadWidget(
      {
        cloudName: 'your-cloud-name',  // Replace with your Cloudinary cloud name
        uploadPreset: 'your-upload-preset',  // Replace with your Cloudinary upload preset
        sources: ['local', 'url', 'camera'],
        clientAllowedFormats: ['image/*'],
        showPoweredBy: false,
        multiple: false
      },
      (error, result) => {
        if (error) {
          console.log(error);
        } else {
          // Set the cover image URL in the form state after successful upload
          const coverImageUrl = result[0].secure_url;
          setFormData((prev) => ({ ...prev, coverImage: coverImageUrl }));
        }
      }
    );
  };

  return (
    <div className="register-form">
      <h2>Register</h2>
      {error && <p className="error">{error}</p>}
      <form onSubmit={handleSubmit}>
        <div>
          <label htmlFor="username">Username</label>
          <input
            type="text"
            id="username"
            name="username"
            value={formData.username}
            onChange={handleChange}
            required
          />
        </div>
        <div>
          <label htmlFor="email">Email</label>
          <input
            type="email"
            id="email"
            name="email"
            value={formData.email}
            onChange={handleChange}
            required
          />
        </div>
        <div>
          <label htmlFor="fullName">Full Name</label>
          <input
            type="text"
            id="fullName"
            name="fullName"
            value={formData.fullName}
            onChange={handleChange}
            required
          />
        </div>
        <div>
          <label htmlFor="password">Password</label>
          <input
            type="password"
            id="password"
            name="password"
            value={formData.password}
            onChange={handleChange}
            required
          />
        </div>
        <div>
          <label htmlFor="avatar">Avatar (Cloudinary URL)</label>
          <input
            type="text"
            id="avatar"
            name="avatar"
            value={formData.avatar}
            onChange={handleChange}
            required
            placeholder="Avatar URL will appear here"
            readOnly
          />
          <button type="button" onClick={handleAvatarUpload}>Upload Avatar</button>
        </div>
        <div>
          <label htmlFor="coverImage">Cover Image (optional, Cloudinary URL)</label>
          <input
            type="text"
            id="coverImage"
            name="coverImage"
            value={formData.coverImage}
            onChange={handleChange}
            placeholder="Cover image URL will appear here"
            readOnly
          />
          <button type="button" onClick={handleCoverImageUpload}>Upload Cover Image</button>
        </div>
        <div>
          <button type="submit" disabled={loading}>
            {loading ? "Registering..." : "Register"}
          </button>
        </div>
      </form>
    </div>
  );
};

export default App;
