import React, { useState } from "react"
import OtpInput from 'react-otp-input';
import ReactLoading from "react-loading";
import Fade from "@mui/material/Fade";
import { api } from "../../api/client";
import { useAuth } from "../../auth/AuthContext";
import { useToast } from "../../components/Toast/ToastContext";
import './login.scss'

const PHONE_LENGTH = 10;
const OTP_LENGTH = 6;

function errorMessage(err, fallback) {
  return err.response?.data?.error || fallback;
}

const Login = ({ onLoggedIn }) => {
  const { login } = useAuth();
  const { showToast } = useToast();

  const [phone, setPhone] = useState("");
  const [otp, setOtp] = useState("");
  const [submitted, setSubmitted] = useState(false);
  const [phoneError, setPhoneError] = useState("");
  const [otpError, setOtpError] = useState("");
  const [requestingOtp, setRequestingOtp] = useState(false);
  const [verifying, setVerifying] = useState(false);

  const isValidPhone = /^\d{10}$/.test(phone);

  const handleRequestOtp = async (e) => {
    e.preventDefault();
    if (!isValidPhone) {
      setPhoneError(`Please enter a valid ${PHONE_LENGTH}-digit phone number`);
      return;
    }
    setPhoneError("");
    setRequestingOtp(true);
    try {
      await api.post("/login", { phone });
      setSubmitted(true);
    } catch (err) {
      if (err.response?.status === 404) {
        setPhoneError("Phone number does not exist. Please contact admin.");
      } else if (err.response?.status === 429) {
        showToast("Too many attempts. Please wait a few minutes and try again.", "warning");
      } else {
        showToast(errorMessage(err, "Something went wrong. Please try again."), "error");
      }
    } finally {
      setRequestingOtp(false);
    }
  };

  const handleOtpChange = (value) => {
    if (/^\d{0,6}$/.test(value)) {
      setOtp(value);
      setOtpError("");
    }
  };

  const handleVerify = async (e) => {
    e.preventDefault();
    if (otp.length !== OTP_LENGTH) {
      setOtpError(`Enter the ${OTP_LENGTH}-digit code we sent you`);
      return;
    }
    setVerifying(true);
    try {
      const { data } = await api.post("/auth", { phone, otp });
      login({ token: data.token, role: data.role, memberNo: data.memberNo, name: data.name });
      onLoggedIn?.(data.memberNo);
    } catch (err) {
      if (err.response?.status === 429) {
        showToast("Too many attempts. Please wait a few minutes and try again.", "warning");
      } else {
        setOtpError(errorMessage(err, "That code didn't work. Please try again."));
      }
    } finally {
      setVerifying(false);
    }
  };

  return (
    <div className="login-main">
      <div className="login-left">
        <img src="/assets/combinedLogo.png" alt="" />
      </div>
      <div className="login-right">
        <div className="login-right-container">
          <div className="login-logo">
            <img src="/assets/AnyonyamLogo.png" alt="" />
          </div>
          <div className="login-center">
            <h2>Hello!</h2>
            <p>{submitted ? "Enter the code we texted you" : "Please enter your details"}</p>

            {!submitted ? (
              <Fade in>
                <form onSubmit={handleRequestOtp}>
                  <input
                    type="tel"
                    inputMode="numeric"
                    placeholder="Enter your phone number"
                    value={phone}
                    onChange={(event) => setPhone(event.target.value.replace(/\D/g, "").slice(0, PHONE_LENGTH))}
                    name="phone"
                    aria-invalid={Boolean(phoneError)}
                    aria-describedby="phone-error"
                  />
                  <div className="login-center-buttons">
                    <button type="submit" disabled={requestingOtp}>
                      {requestingOtp ? <ReactLoading type="spin" color="#fff" height={20} width={20} /> : "Get OTP"}
                    </button>
                    <p id="phone-error" className="error-message" style={{ opacity: phoneError ? 1 : 0 }}>
                      {phoneError || "placeholder"}
                    </p>
                  </div>
                </form>
              </Fade>
            ) : (
              <Fade in>
                <form onSubmit={handleVerify}>
                  <OtpInput
                    value={otp}
                    onChange={handleOtpChange}
                    numInputs={OTP_LENGTH}
                    renderSeparator={<span style={{ width: "8px" }} />}
                    renderInput={(props) => <input {...props} className="otp-input" />}
                    shouldAutoFocus
                  />
                  <div className="login-center-buttons">
                    <button type="submit" disabled={verifying}>
                      {verifying ? <ReactLoading type="spin" color="#fff" height={20} width={20} /> : "Submit OTP"}
                    </button>
                    <button
                      type="button"
                      className="link-button"
                      onClick={() => {
                        setSubmitted(false);
                        setOtp("");
                        setOtpError("");
                      }}
                    >
                      Use a different number
                    </button>
                    <p className="error-message" style={{ opacity: otpError ? 1 : 0 }}>
                      {otpError || "placeholder"}
                    </p>
                  </div>
                </form>
              </Fade>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;
