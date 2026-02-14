import React, { useState } from "react";
import { Email } from "../types";

interface Props {
  email: Email | null;
}

function cleanEmailBody(body: string | undefined) {

  if (!body) return "";

  return body
    .replace(/<style[\s\S]*?<\/style>/gi, "")
    .replace(/<script[\s\S]*?<\/script>/gi, "")
    .replace(/<[^>]+>/g, "")
    .replace(/https?:\/\/\S+/g, "")
    .replace(/\n\s*\n/g, "\n\n")
    .replace(/[ \t]+/g, " ")
    .trim();

}

const EmailDetail: React.FC<Props> = ({ email }) => {

  const [reply, setReply] = useState("");
  const [loading, setLoading] = useState(false);

  // EMPTY STATE FIX
  if (!email) {
    return (

      <div className="flex items-center justify-center h-full bg-slate-50">

        <div className="bg-white border border-slate-200 rounded-2xl shadow-sm p-10 text-center max-w-md">

          <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">

            <svg
              className="w-8 h-8 text-blue-600"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"
              />
            </svg>

          </div>

          <h2 className="text-lg font-semibold">
            No email selected
          </h2>

          <p className="text-sm text-slate-500 mt-2">
            Connect Gmail and select an email to view details.
          </p>

        </div>

      </div>

    );
  }

  const handleGenerateReply = async () => {

    setLoading(true);

    try {

      const res = await fetch(
        "http://localhost:3000/generate-reply",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            subject: email.subject,
            sender: email.sender,
            body: email.body,
          }),
        }
      );

      const data = await res.json();

      setReply(data.reply || "");

    } catch {

      alert("Reply generation failed");

    }

    setLoading(false);

  };

  const handleSendReply = async () => {

    try {

      await fetch(
        "http://localhost:3000/send-reply",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            to: email.sender,
            subject: "Re: " + email.subject,
            body: reply,
          }),
        }
      );

      alert("Reply sent successfully");

    } catch {

      alert("Send failed");

    }

  };

  return (

    <div className="h-full flex flex-col p-6 bg-slate-50">

      {/* HEADER */}

      <div className="bg-white border border-slate-200 rounded-xl p-5 mb-4">

        <h1 className="text-xl font-semibold">
          {email.subject}
        </h1>

        <p className="text-sm text-slate-500 mt-1">
          From: {email.sender}
        </p>

      </div>

      {/* CLEAN BODY */}

      <div className="bg-white border border-slate-200 rounded-xl p-5 mb-4 overflow-y-auto max-h-[400px]">

        <div className="text-sm whitespace-pre-wrap leading-relaxed text-slate-700">

          {cleanEmailBody(email.body)}

        </div>

      </div>

      {/* REPLY */}

      <div className="bg-white border border-slate-200 rounded-xl p-5">

        <textarea
          value={reply}
          onChange={(e) => setReply(e.target.value)}
          placeholder="Reply will appear here..."
          className="w-full border border-slate-300 rounded-lg p-3 mb-4 h-32 resize-none focus:outline-none focus:ring-2 focus:ring-blue-500"
        />

        <div className="flex gap-3">

          <button
            onClick={handleGenerateReply}
            className="bg-purple-600 text-white px-4 py-2 rounded-lg hover:bg-purple-700"
          >
            {loading ? "Generating..." : "Generate Reply"}
          </button>

          <button
            onClick={handleSendReply}
            className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700"
          >
            Send Reply
          </button>

        </div>

      </div>

    </div>

  );

};

export default EmailDetail;




