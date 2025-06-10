"use client";

import { useState } from "react";

export default function LoginVerifyFlow() {
  const [email, setEmail] = useState("");
  const [otp, setOtp] = useState("");
  const [sessionId, setSessionId] = useState("");
  const [step, setStep] = useState(1); // step 1 = email, step 2 = otp
  const [message, setMessage] = useState("");

  async function handleSendEmail() {
    const res = await fetch(
      `${process.env.NEXT_PUBLIC_ARKPRTS_API_URL}/api/login/email`,
      {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email }),
      }
    );
    const data = await res.json();
    if (data.message) {
      setMessage(data.message);
      setStep(2); // ไป Step 2
    } else {
      setMessage(data.error || "Unknown error");
    }
  }

  async function handleVerify() {
    const res = await fetch(
      `${process.env.NEXT_PUBLIC_ARKPRTS_API_URL}/api/login/verify`,
      {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, otp }),
      }
    );
    const data = await res.json();

    if (data.session_id) {
      setSessionId(data.session_id);
      setMessage("Login Success! Session ID acquired.");
      localStorage.setItem("prts_session_id", data.session_id);
    } else {
      setMessage(data.error || "Unknown error");
    }
  }

  return (
    <div className="p-4 border mb-4">
      <h2 className="text-lg mb-2">PRTS Connect</h2>

      {step === 1 && (
        <>
          <p className="mb-2">Step 1: Enter Email to Receive OTP</p>
          <input
            type="email"
            placeholder="Email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="border p-2 mb-2 block w-full"
          />
          <button
            onClick={handleSendEmail}
            className="bg-blue-500 text-white px-4 py-2 rounded"
          >
            Send Verification Code
          </button>
        </>
      )}

      {step === 2 && (
        <>
          <p className="mb-2">Step 2: Enter OTP</p>
          <input
            type="text"
            placeholder="OTP Code"
            value={otp}
            onChange={(e) => setOtp(e.target.value)}
            className="border p-2 mb-2 block w-full"
          />
          <button
            onClick={handleVerify}
            className="bg-green-500 text-white px-4 py-2 rounded"
          >
            Verify and Get Session ID
          </button>
        </>
      )}

      {message && <p className="mt-2">{message}</p>}

      {sessionId && (
        <div className="mt-2 p-2 border">
          <p>
            <b>Session ID:</b> {sessionId}
          </p>
        </div>
      )}
    </div>
  );
}
