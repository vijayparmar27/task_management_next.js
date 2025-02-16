"use client";

import type React from "react";

import { useState } from "react";
import { Send } from "lucide-react";

export default function InviteForm() {
  const [email, setEmail] = useState("");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Here you would typically send the invitation
    console.log("Invite sent to:", email);
    setEmail("");
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div>
        <label htmlFor="email" className="block mb-2 text-sm font-medium">
          Email Address
        </label>
        <input
          type="email"
          id="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          className="w-full p-2 border border-gray-300 dark:border-gray-700 rounded-md bg-white dark:bg-gray-800"
          required
        />
      </div>
      <button
        type="submit"
        className="flex items-center justify-center w-full p-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors"
      >
        <Send className="w-4 h-4 mr-2" />
        Send Invitation
      </button>
    </form>
  );
}
