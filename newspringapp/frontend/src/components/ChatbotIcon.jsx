import React, { useState } from 'react';

const faqs = [
  {
    question: 'What is this portal about?',
    answer: 'This portal connects alumni and students to share updates, jobs, and events.'
  },
  {
    question: 'How do I register as a student?',
    answer: 'Go to the Student Register page and fill in your details to create an account.'
  },
  {
    question: 'How can alumni post updates?',
    answer: 'Alumni can login and use the Alumni Post section to share updates or job postings.'
  },
  {
    question: 'Who can access the admin dashboard?',
    answer: 'Only registered admins with proper credentials can access the admin dashboard.'
  }
];

export default function ChatbotFAQ() {
  const [input, setInput] = useState('');
  const [chatHistory, setChatHistory] = useState([]);

  // Simple keyword matching function
  const findAnswer = (text) => {
    const lowerText = text.toLowerCase();
    for (const faq of faqs) {
      if (faq.question.toLowerCase().includes(lowerText) || lowerText.includes(faq.question.toLowerCase().split(' ')[0])) {
        return faq.answer;
      }
    }
    return "Sorry, I don't understand that. Please try asking something else.";
  };

  const handleSend = () => {
    if (!input.trim()) return;

    const userMessage = { from: 'user', text: input };
    const botMessage = { from: 'bot', text: findAnswer(input) };

    setChatHistory([...chatHistory, userMessage, botMessage]);
    setInput('');
  };

  return (
    <div style={{ border: '1px solid #ccc', width: 350, padding: 15, borderRadius: 8, backgroundColor: '#f9f9f9' }}>
      <h3>Portal Chatbot</h3>
      <div style={{ height: 200, overflowY: 'auto', marginBottom: 10, backgroundColor: 'white', padding: 10, borderRadius: 4, border: '1px solid #ddd' }}>
        {chatHistory.length === 0 && <p style={{ color: '#888' }}>Ask me about this portal...</p>}
        {chatHistory.map((msg, idx) => (
          <div key={idx} style={{ textAlign: msg.from === 'user' ? 'right' : 'left', margin: '5px 0' }}>
            <span style={{
              display: 'inline-block',
              padding: '6px 12px',
              borderRadius: 15,
              backgroundColor: msg.from === 'user' ? '#007bff' : '#e5e5ea',
              color: msg.from === 'user' ? 'white' : 'black',
              maxWidth: '80%',
              wordWrap: 'break-word'
            }}>
              {msg.text}
            </span>
          </div>
        ))}
      </div>
      <div style={{ display: 'flex' }}>
        <input
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={(e) => e.key === 'Enter' && handleSend()}
          placeholder="Type your question..."
          style={{ flexGrow: 1, padding: 8, borderRadius: 4, border: '1px solid #ccc' }}
        />
        <button onClick={handleSend} style={{ marginLeft: 8, padding: '8px 16px', borderRadius: 4, backgroundColor: '#007bff', color: 'white', border: 'none' }}>
          Send
        </button>
      </div>
    </div>
  );
}
