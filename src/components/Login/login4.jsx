
import { useNavigate } from "react-router-dom"
import React, { useState, useEffect } from "react"
import OtpInput from 'react-otp-input';
import ReactLoading from "react-loading";
import './login.scss'



const Login = ({ onLogin, loggedInUser, setLoggedInUser }) => {

    // const baseURL = process.env.REACT_APP_BASE_URL
    const baseURL = "https://anyonyam.onrender.com"
    // const baseURL = "http://localhost:8800"


    const [loading, setLoading] = useState(true)
    const [phone, setPhone] = useState("");
    const [otp, setOtp] = useState("");
    const [submitted, setSubmitted] = useState(false);
    const [otpError, setOtpError] = useState(false);
    const [phoneError, setPhoneError] = useState(false);



    const history = useNavigate();



    const handleSubmit = (e) => {
        console.log("Hellooo")
        e.preventDefault();
        setLoading(true)
        if (phone.trim() === '' || phone.length !== 10) {
            window.alert("Please enter a valid 10-digit phone number");
            return;
        }

        const dataToSubmit = { "phone": phone }

        console.log(dataToSubmit)

        fetch(`${baseURL}/login`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            credentials: 'include',
            body: JSON.stringify(dataToSubmit),
        })
            // .then((res) => res.json())
            .then((data) => {
                // Handle the response from the backend if needed
                console.log(data);


                if (data.status === 404) {
                    console.log(data.status);
                    setPhoneError(true)
                    setLoading(false)
                }

                if (data.status === 200) {
                    setPhoneError(false)
                    setSubmitted(true)
                    setLoading(false)
                }

                if (data.status === 502) {
                    window.alert("An unknown error Occured. Please try again after some time")
                }

                if (data.status === 521) {
                    window.alert("An unknown error Occured. Please try again after some time")
                    window.location.reload()
                }


            })
            .catch((error) => {
                // Handle error scenario
                window.alert("Server is facing some issues, Please Wait")
                console.error('Error:', error);
                setLoading(false)
            });
    };
    
    const handleOtpChange = (event) => {
        const { value } = event.target;
        if (/^\d{0,4}$/.test(value)) {
          setOtp(value);
        }
      };

    const handleVerify = (e) => {
        e.preventDefault();
        setLoading(true)

        const dataToSubmit = { "otp": otp, "phone": phone }


        fetch(`${baseURL}/auth`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            credentials: 'include',
            body: JSON.stringify(dataToSubmit),
        })
            .then((res) => res.json())
            .then((data) => {
                // Handle the response from the backend if needed
                console.log(data);

                if (data.success) {
                    // Redirect to the "/Profile" page
                    setLoggedInUser(data);
                    onLogin();
                    setOtpError(false)
                    setLoading(false)


                }

                if (data.status !== 200) {
                    setOtpError(true)
                    // setSubmitted(true)
                    setLoading(false)

                }


            })
            .catch((error) => {
                // Handle error scenarios
                window.alert("Server is facing some issues, Please Wait")
                console.error('Error:', error);
                // setOtpError(true)
                setLoading(false)

            });



    };

    useEffect(() => {
        if (loggedInUser) {
            localStorage.setItem("memberNo", loggedInUser.memberNo);
            history(`/Profile/${loggedInUser.memberNo}`);
        }
    }, [loggedInUser, history]);

    useEffect(() => {
        setTimeout(() => setLoading(false), 1000)
    }, [])

    if (loading) {
        return (
            <div className="App-loading">
                <div className="overlay"></div>
                <div className="loading-content">
                    <ReactLoading type="bars" color="black" height={30} width={30} />
                </div>
            </div>
        );
    }


    return (
        <div className="login-main">
            <div className="login-left">
                <img src="assets/combinedLogo.png" alt="" />
            </div>
            <div className="login-right">
                <div className="login-right-container">
                    <div className="login-logo">
                        <img src="assets/AnyonyamLogo.png" alt="" />
                    </div>
                    <div className="login-center">
                        <h2>Hello!</h2>
                        <p>Please enter your details</p>
                        {!submitted ? (
                            <form onSubmit={handleSubmit}>
                                <input type="tel" placeholder="Enter your Phone number" value={phone} onChange={(event) => setPhone(event.target.value)} name="phone" />
                                <div className="login-center-buttons">
                                    <button type="button" onClick={handleSubmit}>Get OTP</button>
                                    <p className="error-message" style={{ opacity: phoneError ? '100%' : '0%' }}>
                                        Phone Number Does Not exist. Please contact admin
                                    </p>
                                </div>
                            </form>
                        ) : (
                            <form onSubmit={handleVerify}>
                                <input
                                    type="text"
                                    placeholder="Enter OTP"
                                    value={otp}
                                    onChange={handleOtpChange}
                                    maxLength="4"
                                    name="otp"
                                />
                                <div className="login-center-buttons">
                                    <button type="button" onClick={handleVerify}>Sumbit OTP</button>
                                    <p className="error-message" style={{ opacity: phoneError ? '100%' : '0%' }}>
                                        Phone Number Does Not exist. Please contact admin
                                    </p>
                                </div>
                            </form>
                        )}

                    </div>
                </div>
            </div>
        </div>
    );
};

export default Login;
