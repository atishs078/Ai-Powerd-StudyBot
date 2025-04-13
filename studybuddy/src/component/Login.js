import React, { useState, useEffect } from 'react'
import { useNavigate, Link } from 'react-router-dom'

const Login = () => {
    const navigate = useNavigate()
    const [formData, setFormData] = useState({
        email: '',
        password: ''
    })
    const [error, setError] = useState('')

    const handleChange = (e) => {
        setFormData({
            ...formData,
            [e.target.id]: e.target.value
        })
    }
    useEffect(() => {
        if(!localStorage.getItem('token')) {
            navigate('/login')
        }else{
            navigate('/chat')
        }
    }, []);
    const handleSubmit = async (e) => {
        e.preventDefault()
        setError('')
        
        try {
            const response = await fetch('http://localhost:5000/api/user/login', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(formData)
            })

            const data = await response.json()

            if (!response.ok) {
                throw new Error(data.error || 'Login failed')
            }

            // Save the token to localStorage
            localStorage.setItem('token', data.authtoken)
            localStorage.setItem('userId', data.user)
            console.log(data.user)
            // Redirect to dashboard or home page
            navigate('/chat') // Change this to your desired redirect path

        } catch (err) {
            setError(err.message)
            console.error('Login error:', err)
        }
    }

    return (
        <div style={{ 
            backgroundColor: '#fff', 
            minHeight: '100vh', 
            overflow: 'hidden', 
            position: 'relative' 
        }}>
            {/* Blue Header Section */}
            <div style={{ 
                position: 'relative', 
                background: 'rgb(82,113,255)', 
                height: '400px',
                marginBottom: '350px'
            }}>
                {/* Cursive Text Header - Right Aligned */}
                <div style={{
                    position: 'absolute',
                    top: '80px',
                    right: '250px',
                    textAlign: 'right',
                    zIndex: 2
                }}>
                    <h2 style={{
                        color: '#fff',
                        fontSize: '4rem',
                        fontFamily: "bold",
                        margin: 0,
                        lineHeight: '1',
                        fontWeight: '700'
                    }}>
                        StudyBuddy!!
                    </h2>
                    <p style={{
                        color: '#fff',
                        fontSize: '1.9rem',
                        fontFamily: "italic",
                        margin: '10px 0 0 0',
                        fontStyle: 'italic'
                    }}>
                        Making Smart Look Effortless
                    </p>
                </div>

                {/* Wave SVG */}
                <svg 
                    viewBox="0 0 1440 320" 
                    preserveAspectRatio="none"
                    style={{ 
                        position: 'absolute', 
                        bottom: 0, 
                        left: 0, 
                        width: '100%', 
                        height: '140px' 
                    }}
                >
                    <path 
                        fill="#fff" 
                        d="M0,160 C180,260 360,60 540,160 C720,260 900,60 1080,160 C1260,260 1440,150 1550,70 L1480,320 L0,320 Z" 
                    />
                </svg>

                {/* Main Content Container */}
                <div style={{
                    position: 'absolute',
                    top: '150px',
                    left: '40px',
                    right: '40px',
                    zIndex: 1,
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'flex-start',
                }}>
                    {/* Login Form */}
                    <div style={{
                        background: '#fff',
                        padding: '2.5rem 3rem',
                        borderRadius: '30px',
                        boxShadow: '0 15px 30px rgba(0,0,0,0.1)',
                        textAlign: 'center',
                        height: '550px',
                        width: '530px',
                        border: '1px solid rgba(0,0,0,0.05)',
                    }}>
                        <h1 style={{ 
                            color: '#333', 
                            marginBottom: '2rem', 
                            fontSize: '1.8rem' 
                        }}>
                            Login
                        </h1>

                        {error && (
                            <div style={{ 
                                color: 'red', 
                                marginBottom: '1rem',
                                textAlign: 'center'
                            }}>
                                {error}
                            </div>
                        )}

                        <form onSubmit={handleSubmit}>
                            <div style={{ marginBottom: '1.5rem', textAlign: 'left' }}>
                                <label
                                    htmlFor="email"
                                    style={{
                                        display: 'block',
                                        marginBottom: '0.5rem',
                                        color: '#555',
                                        fontWeight: '500',
                                    }}
                                >
                                    Email Address
                                </label>
                                <input
                                    type="email"
                                    id="email"
                                    placeholder="Enter your email"
                                    value={formData.email}
                                    onChange={handleChange}
                                    style={{
                                        width: '100%',
                                        padding: '0.9rem 1.2rem',
                                        border: '1px solid #e0e0e0',
                                        borderRadius: '12px',
                                        fontSize: '1rem',
                                        boxSizing: 'border-box',
                                        transition: 'all 0.3s',
                                    }}
                                    required
                                />
                            </div>

                            <div style={{ marginBottom: '2rem', textAlign: 'left' }}>
                                <label
                                    htmlFor="password"
                                    style={{
                                        display: 'block',
                                        marginBottom: '0.5rem',
                                        color: '#555',
                                        fontWeight: '500',
                                    }}
                                >
                                    Password
                                </label>
                                <input
                                    type="password"
                                    id="password"
                                    placeholder="Enter your password"
                                    value={formData.password}
                                    onChange={handleChange}
                                    style={{
                                        width: '100%',
                                        padding: '0.9rem 1.2rem',
                                        border: '1px solid #e0e0e0',
                                        borderRadius: '12px',
                                        fontSize: '1rem',
                                        boxSizing: 'border-box',
                                        transition: 'all 0.3s',
                                    }}
                                    required
                                />
                            </div>

                            <button
                                type="submit"
                                style={{
                                    width: '100%',
                                    padding: '1rem',
                                    backgroundColor: 'rgb(82,113,255)',
                                    color: 'white',
                                    border: 'none',
                                    borderRadius: '12px',
                                    fontSize: '1rem',
                                    fontWeight: '600',
                                    cursor: 'pointer',
                                    transition: 'all 0.3s',
                                    boxShadow: '0 4px 6px rgba(82,113,255,0.2)',
                                }}
                                onMouseOver={(e) => {
                                    e.target.style.backgroundColor = 'rgb(70,100,240)';
                                    e.target.style.boxShadow = '0 6px 12px rgba(82,113,255,0.3)';
                                }}
                                onMouseOut={(e) => {
                                    e.target.style.backgroundColor = 'rgb(82,113,255)';
                                    e.target.style.boxShadow = '0 4px 6px rgba(82,113,255,0.2)';
                                }}
                            >
                                Login
                            </button>

                            <div style={{ marginTop: '1.5rem', color: '#666' }}>
                                <Link
                                    to="#forgot-password"
                                    style={{
                                        color: 'rgb(82,113,255)',
                                        textDecoration: 'none',
                                        fontSize: '0.9rem',
                                        fontWeight: '500',
                                    }}
                                >
                                    Forgot password?
                                </Link>
                            </div>
                        </form>

                        <div style={{ marginTop: '2rem', color: '#666' }}>
                            Don't have an account?{' '}
                            <Link
                                to='/signup'
                                style={{
                                    color: 'rgb(82,113,255)',
                                    textDecoration: 'none',
                                    fontWeight: '600',
                                }}
                            >
                                Sign up
                            </Link>
                        </div>
                    </div>

                    {/* Image Section */}
                    <div style={{
                        height: '500px',
                        width: '700px',
                        overflow: 'hidden',
                        marginTop: '50px',
                        marginLeft: '40px',
                    }}>
                        <img
                            src="https://lampinstitute.in/wp-content/uploads/2024/08/Generative-AI-Training-in-Hyderabad-Course-Overview.png"
                            alt="Login Visual"
                            style={{
                                height: '100%',
                                width: '100%',
                                objectFit: 'cover',
                            }}
                        />
                    </div>
                </div>
            </div>

            {/* Responsive Styling */}
            <style>{`
                @media (max-width: 1400px) {
                    .login-container > div:last-child {
                        width: 600px !important;
                    }
                    .cursive-text h2 {
                        font-size: 2.5rem !important;
                    }
                    .cursive-text p {
                        font-size: 1.5rem !important;
                    }
                }

                @media (max-width: 1200px) {
                    .login-container > div:last-child {
                        width: 500px !important;
                        height: 450px !important;
                    }
                    .cursive-text {
                        right: 30px !important;
                    }
                    .cursive-text h2 {
                        font-size: 2.2rem !important;
                    }
                    .cursive-text p {
                        font-size: 1.3rem !important;
                    }
                }

                @media (max-width: 1024px) {
                    .login-container > div:last-child,
                    .cursive-text {
                        display: none !important;
                    }
                    .login-container {
                        justify-content: center !important;
                    }
                }

                @media (max-width: 768px) {
                    .login-container {
                        left: 20px !important;
                        right: 20px !important;
                        top: 80px !important;
                    }
                    .login-container > div:first-child {
                        width: 100% !important;
                        padding: 2rem !important;
                        height: auto !important;
                    }
                }
            `}</style>
        </div>
    )
}

export default Login