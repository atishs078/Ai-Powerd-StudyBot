import React from 'react'
import {Link, useNavigate} from 'react-router-dom'
const Start = () => {
    const navigate = useNavigate()
    const onHandelClick=()=>{
        navigate('/login')
    }
    return (
        <div style={{
            minHeight: '100vh',
            display: 'flex',
            flexDirection: 'column',
            backgroundColor: '#fff',
            fontFamily: "'Poppins', sans-serif"
        }}>
            {/* Blue Wave Section */}
            <div style={{
                position: 'relative',
                background: 'rgb(82,113,255)',
                height: '50vh',
                width: '100%',
                display: 'flex',
                flexDirection: 'column',
                justifyContent: 'center',
                alignItems: 'center'
            }}>
                {/* Wave SVG */}
                <svg
                    viewBox="0 0 1440 120"
                    preserveAspectRatio="none"
                    style={{
                        position: 'absolute',
                        bottom: 0,
                        left: 0,
                        width: '100%',
                        height: '120px'
                    }}
                >
                    <path
                        fill="#fff"
                        d="M0,60 C180,100 360,20 540,60 C720,100 900,20 1080,60 C1260,100 1440,40 1550,20 L1480,120 L0,120 Z"
                    />
                </svg>

                {/* Logo and Title */}
                <div style={{
                    textAlign: 'center',
                    zIndex: 2,
                    color: 'white',
                    marginTop: '-11cdrem',
                    marginBottom: '2rem'
                }}>
                    <h1 style={{
                        fontSize: '3.5rem',
                        fontFamily: "bold",
                        margin: 0,
                        marginBottom: '10rem',
                        fontWeight: '700',
                        textShadow: '2px 2px 4px rgba(0,0,0,0.3)'
                       
                    }}>
                        Hello I'm StudyBuddy!!
                    </h1>
                    
                </div>
            </div>

            {/* 📷 Image Section */}
            <div style={{
                display: 'flex',
                justifyContent: 'center',
                marginTop: '-15rem',
                zIndex: 1
            }}>
                <img
                    src="https://png.pngtree.com/png-vector/20220611/ourmid/pngtree-chatbot-icon-chat-bot-robot-png-image_4841963.png"
                    alt="StudyBuddy Preview"
                    style={{
                        maxWidth: '90%',
                        width: '250px',

                    }}
                />
            </div>

            {/* Content Section */}
            <div style={{
                flex: 1,
                display: 'flex',
                flexDirection: 'column',
                justifyContent: 'center',
                alignItems: 'center',
                padding: '2rem',
                textAlign: 'center'
            }}>
                <div style={{ maxWidth: '600px' }}>
                    <h2 style={{
                        fontFamily: "italic",
                        fontSize: '4rem',
                        fontWeight: '700', 
                        color: '#333',
                        marginBottom: '1.5rem'
                    }}>
                        Where Questions Meet Answers
                    </h2>


                    {/* Start Button */}
                    <div style={{ display: 'flex', justifyContent: 'center', marginTop: '2rem' }}>
                        <button style={{
                            padding: '1rem 2.5rem',
                            backgroundColor: 'rgb(82,113,255)',
                            color: 'white',
                            border: 'none',
                            borderRadius: '50px',
                            fontSize: '1.2rem',
                            fontWeight: '600',
                            cursor: 'pointer',
                            boxShadow: '0 4px 15px rgba(82,113,255,0.3)',
                            transition: 'all 0.3s ease'
                        }}
                        onClick={onHandelClick}
                            onMouseOver={(e) => {
                                e.currentTarget.style.transform = 'translateY(-3px)';
                                e.currentTarget.style.boxShadow = '0 6px 20px rgba(82,113,255,0.4)';
                            }}
                            onMouseOut={(e) => {
                                e.currentTarget.style.transform = 'translateY(0)';
                                e.currentTarget.style.boxShadow = '0 4px 15px rgba(82,113,255,0.3)';
                            }}>
                            Start Now
                        </button>
                    </div>

                </div>
            </div>



        </div>
    )
}

export default Start
