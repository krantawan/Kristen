"use client";

import { useState } from "react";

interface Operator {
  char_id: string;
  level: number;
  phase: number;
  skill: number;
}

interface Profile {
  level: number;
  sanity?: {
    current_ap: number;
    max_ap: number;
  };
  operators: Operator[];
}

export default function ProfileViewer() {
  const [profile, setProfile] = useState<Profile | null>(null);
  const [message, setMessage] = useState("");

  async function handleFetchProfile() {
    const sessionId = localStorage.getItem("prts_session_id");
    console.log("sessionId = ", sessionId);

    if (!sessionId) {
      setMessage("No session_id found. Please verify first.");
      return;
    }

    const res = await fetch(
      `${process.env.NEXT_PUBLIC_ARKPRTS_API_URL}/api/profile`,
      {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ session_id: sessionId }),
      }
    );
    const data = await res.json();

    if (data.level) {
      setProfile(data);
      setMessage("");
    } else {
      setProfile(null);
      setMessage(data.error || "Failed to fetch profile");
    }
  }

  return (
    <div className="p-4 border mb-4">
      <h2 className="text-lg mb-2">Step 3: Fetch Profile</h2>
      <button
        onClick={handleFetchProfile}
        className="bg-purple-500 text-white px-4 py-2 rounded mb-2"
      >
        Fetch Profile
      </button>
      {message && <p className="mt-2">{message}</p>}
      {profile && (
        <div className="mt-2 p-2 border">
          <p>
            <b>Level:</b> {profile.level}
          </p>
          {profile.sanity && (
            <p>
              <b>Sanity:</b> {profile.sanity.current_ap}/{profile.sanity.max_ap}
            </p>
          )}
          <h3 className="mt-2 text-md font-bold">Operators:</h3>
          <ul className="list-disc ml-4">
            {profile.operators.map((op: Operator) => (
              <li key={op.char_id}>
                {op.char_id} → Level {op.level}, Phase {op.phase}, Skill{" "}
                {op.skill}
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
}
