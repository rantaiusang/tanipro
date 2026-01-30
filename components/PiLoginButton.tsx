"use client";

import { useEffect } from "react";

export default function PiLoginButton() {
  useEffect(() => {
    if (window.Pi) {
      window.Pi.init({ version: "2.0" });
    }
  }, []);

  const loginPi = async () => {
    if (!window.Pi) {
      alert("Buka lewat Pi Browser");
      return;
    }

    const auth = await window.Pi.authenticate(
      ["username"],
      () => alert("Login dibatalkan")
    );

    alert("Login Pi berhasil: " + auth.username);
  };

  return (
    <button
      onClick={loginPi}
      className="mt-6 rounded bg-green-600 px-6 py-3 text-white"
    >
      Login dengan Pi Network
    </button>
  );
}
