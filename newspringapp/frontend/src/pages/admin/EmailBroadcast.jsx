import React, { useState } from "react";
import axios from "axios";

const EmailBroadcast = () => {
  const [subject, setSubject] = useState("");
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);
  const [feedback, setFeedback] = useState("");

  const handleSendEmail = async (e) => {
    e.preventDefault();
    setLoading(true);
    setFeedback("");

    try {
      const response = await axios.post("/api/admin/broadcast", {
        subject,
        message,
      });

      if (response.status === 200) {
        setFeedback("Emails sent successfully!");
        setSubject("");
        setMessage("");
      } else {
        setFeedback("Something went wrong. Please try again.");
      }
    } catch (error) {
      console.error(error);
      setFeedback("Failed to send emails. Please check your connection.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-3xl mx-auto bg-white p-8 rounded-xl shadow-lg border border-gray-200">
      <h2 className="text-3xl font-bold mb-6 text-[#930911]">Broadcast Email</h2>

      <form onSubmit={handleSendEmail} className="space-y-5">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Subject
          </label>
          <input
            type="text"
            value={subject}
            onChange={(e) => setSubject(e.target.value)}
            required
            className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-[#930911] outline-none"
            placeholder="Enter subject"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Message
          </label>
          <textarea
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            rows="6"
            required
            className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-[#930911] outline-none"
            placeholder="Type your announcement here..."
          ></textarea>
        </div>

        <button
          type="submit"
          disabled={loading}
          className="w-full bg-[#930911] text-white py-3 rounded-md font-semibold hover:bg-[#BA3D47] transition duration-300"
        >
          {loading ? "Sending..." : "Send Email"}
        </button>

        {feedback && (
          <p className={`mt-4 text-sm ${feedback.includes("successfully") ? "text-green-600" : "text-red-600"}`}>
            {feedback}
          </p>
        )}
      </form>
    </div>
  );
};

export default EmailBroadcast;
