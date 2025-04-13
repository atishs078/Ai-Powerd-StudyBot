import React, { useState, useEffect } from "react";
import { useNavigate, Link } from "react-router-dom";
import axios from "axios";

const SignUp = () => {
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    confirmPassword: "",
  });

  const [error, setError] = useState("");

  useEffect(() => {
    if (localStorage.getItem("token")) {
      navigate("/chat");
    }
  }, [navigate]);

  const handleChange = (e) => {
    setFormData((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (formData.password !== formData.confirmPassword) {
      return setError("Passwords do not match");
    }

    try {
      const response = await axios.post("http://localhost:5000/api/user/register", {
        name: formData.name,
        email: formData.email,
        password: formData.password,
      });

      if (response.data.authToken) {
        localStorage.setItem("token", response.data.authToken);
        localStorage.setItem("userId", response.data.user);
        navigate("/chat");
      }
    } catch (err) {
      console.error(err);
      setError(err.response?.data?.error || "Registration failed");
    }
  };

  return (
    <div style={{ backgroundColor: '#fff', minHeight: '100vh', overflow: 'hidden', position: 'relative' }}>
      {/* Blue Header Section */}
      <div style={{ position: 'relative', background: 'rgb(82,113,255)', height: '500px', marginBottom: '350px' }}>
        {/* Cursive Text Header - Left Aligned */}
        <div style={{ position: 'absolute', top: '100px', left: '100px', textAlign: 'left', zIndex: 2, maxWidth: '600px' }}>
          <h2 style={{ color: '#fff', fontSize: '2rem', fontFamily: "bold", margin: '-30px 0 0 0', lineHeight: '1', fontWeight: '700', textShadow: '2px 2px 4px rgba(0,0,0,0.3)' }}>
            Welcome To StudyBuddy!!
          </h2>
          <p style={{ color: '#fff', fontSize: '1rem', fontFamily: "italic", marginLeft: '80px', fontWeight: '700', textShadow: '1px 1px 3px rgba(0,0,0,0.3)' }}>
            Let's Get Smarter Together
          </p>
        </div>

        {/* Wave SVG */}
        <svg viewBox="0 0 1440 320" preserveAspectRatio="none" style={{ position: 'absolute', bottom: 0, left: 0, width: '100%', height: '140px' }}>
          <path fill="#fff" d="M0,160 C180,260 360,60 540,160 C720,260 900,60 1080,160 C1260,260 1440,150 1550,70 L1480,320 L0,320 Z" />
        </svg>

        {/* Main Content Container */}
        <div style={{ position: 'absolute', bottom: '-300px', left: '40px', right: '40px', zIndex: 1, display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
          {/* Image Section */}
          <div style={{ height: '650px', width: '650px', overflow: 'hidden', marginTop: '100px', marginRight: '40px' }}>
            <img src="https://s3.us-east-2.amazonaws.com/assets.yourgpt.ai/content/uploads/2024/05/01101731/AI.png" alt="SignUp Visual" style={{ height: '100%', width: '100%' }} />
          </div>

          {/* SignUp Form */}
          <div style={{ background: '#fff', padding: '1rem', borderRadius: '30px', boxShadow: '0 15px 30px rgba(0,0,0,0.1)', textAlign: 'center', width: '557px', border: '1px solid rgba(0,0,0,0.05)' }}>
            <h1 style={{ color: '#333', marginBottom: '2rem', fontSize: '2rem', fontWeight: '600' }}>
              Create Account
            </h1>

            <form onSubmit={handleSubmit}>
              {error && <div style={{ color: 'red', marginBottom: '1rem' }}>{error}</div>}

              <div style={{ marginBottom: '1.5rem', textAlign: 'left' }}>
                <label style={{ display: 'block', marginBottom: '0.5rem', color: '#555', fontWeight: '500' }}>
                  Full Name
                </label>
                <input
                  type="text"
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  placeholder="Enter your full name"
                  style={{ width: '100%', padding: '1rem', border: '1px solid #e0e0e0', borderRadius: '12px', fontSize: '1rem' }}
                  required
                />
              </div>

              <div style={{ marginBottom: '1.5rem', textAlign: 'left' }}>
                <label style={{ display: 'block', marginBottom: '0.5rem', color: '#555', fontWeight: '500' }}>
                  Email Address
                </label>
                <input
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  placeholder="Enter your email"
                  style={{ width: '100%', padding: '1rem', border: '1px solid #e0e0e0', borderRadius: '12px', fontSize: '1rem' }}
                  required
                />
              </div>

              <div style={{ marginBottom: '1.5rem', textAlign: 'left' }}>
                <label style={{ display: 'block', marginBottom: '0.5rem', color: '#555', fontWeight: '500' }}>
                  Password
                </label>
                <input
                  type="password"
                  name="password"
                  value={formData.password}
                  onChange={handleChange}
                  placeholder="Create a password"
                  style={{ width: '100%', padding: '1rem', border: '1px solid #e0e0e0', borderRadius: '12px', fontSize: '1rem' }}
                  required
                />
              </div>

              <div style={{ marginBottom: '2rem', textAlign: 'left' }}>
                <label style={{ display: 'block', marginBottom: '0.5rem', color: '#555', fontWeight: '500' }}>
                  Confirm Password
                </label>
                <input
                  type="password"
                  name="confirmPassword"
                  value={formData.confirmPassword}
                  onChange={handleChange}
                  placeholder="Confirm your password"
                  style={{ width: '100%', padding: '1rem', border: '1px solid #e0e0e0', borderRadius: '12px', fontSize: '1rem' }}
                  required
                />
              </div>

              <button type="submit" style={{ width: '100%', padding: '1.2rem', backgroundColor: 'rgb(82,113,255)', color: 'white', border: 'none', borderRadius: '12px', fontSize: '1.1rem', fontWeight: '600', cursor: 'pointer', transition: 'all 0.3s', boxShadow: '0 4px 6px rgba(82,113,255,0.2)' }}>
                Sign Up
              </button>

              <div style={{ marginTop: '1.5rem', color: '#666', fontSize: '0.9rem' }}>
                By signing up, you agree to our <a href="#terms" style={{ color: 'rgb(82,113,255)', textDecoration: 'none' }}>Terms</a> and <a href="#privacy" style={{ color: 'rgb(82,113,255)', textDecoration: 'none' }}>Privacy Policy</a>
              </div>
            </form>

            <div style={{ marginTop: '2rem', color: '#666' }}>
              Already have an account?{' '}
              <Link to="/login" style={{ color: 'rgb(82,113,255)', textDecoration: 'none', fontWeight: '600' }}>
                Login
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SignUp;
