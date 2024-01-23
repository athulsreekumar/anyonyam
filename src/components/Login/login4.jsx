import "./login.scss"
import { useNavigate } from "react-router-dom"
import React, { useState, useEffect } from "react"
// import axios from 'axios';
import OtpInput from 'react-otp-input';
// import Profile from "../../profilecomponent/Profile/profile2.jsx";
import ReactLoading from "react-loading";


export default function Login({ onLogin, loggedInUser, setLoggedInUser }) {


    const [loading, setLoading] = useState(true)
    const [phone, setPhone] = useState("");
    const [otp, setOtp] = useState("");
    const [submitted, setSubmitted] = useState(false);
    const [otpError, setOtpError] = useState(false);
    const [phoneError, setPhoneError] = useState(false);



    const history = useNavigate();



    const handleSubmit = (e) => {
        e.preventDefault();
        setLoading(true)
        if (phone.trim() === '' || phone.length !== 10) {
            window.alert("Please enter a valid 10-digit phone number");
            return;
        }

        const dataToSubmit = { "phone": phone }

        console.log(dataToSubmit)

        fetch('/login', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
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

    const handleVerify = (e) => {
        e.preventDefault();
        setLoading(true)

        const dataToSubmit = { "otp": otp, "phone": phone }


        fetch('/auth', {
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
                    <ReactLoading type="bars" color="white" height={30} width={30} />
                </div>
            </div>
        );
    }

    return (

        <div className="login">
            <div className={`container ${submitted ? 'submitted' : ''}`}>

                {!submitted ? (
                    <div className="form-class">
                        <div className="avatar">
                            <img src="assets/AnyonyamLogo.png" alt="img" />
                        </div>
                        <p>Login</p>
                        <form onSubmit={handleSubmit}>
                            <p>Enter Phone Number</p>
                            <input type="tel" value={phone} onChange={(event) => setPhone(event.target.value)} name="phone" />

                            <button>Get OTP</button>

                            <p className="error-message" style={{ opacity: phoneError ? '100%' : '0%' }}>
                                Phone Number Does Not exist. Please contact admin
                            </p>
                        </form>
                    </div>
                ) : (
                    <div className="form-class">
                        <div className="avatar">
                            <img src="assets/AnyonyamLogo.png" alt="img" />
                        </div>
                        <p>Login</p>
                        <form onSubmit={handleVerify}>
                            <p>Enter OTP</p>

                            <OtpInput className="otpinput"
                                containerStyle={{ justifyContent: 'center' }}
                                value={otp}
                                onChange={setOtp}
                                numInputs={4}
                                renderSeparator={<span>&nbsp;&nbsp;</span>}
                                renderInput={(props) => <input {...props} />}
                            />

                            <button>Verify OTP</button>

                            <p className="error-message" style={{ opacity: otpError ? '100%' : '0%' }}>
                                Incorrect OTP. Please try again.
                            </p>
                        </form>
                    </div>
                )}
            </div>
        </div>
    );
}