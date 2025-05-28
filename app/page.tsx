'use client'
import { useState } from 'react';

export default function Home() {
  const [messages, setMessages] = useState<any[]>([]);
  const [input, setInput] = useState('');

  const handleSend = () => {
    if (!input.trim()) return;
    setMessages([...messages, { from: 'user', text: input }]);
    setInput('');
    // Dummy bot response
    setTimeout(() => {
      setMessages(m => [...m, { from: 'bot', text: 'Bot απάντηση: ' + input }]);
    }, 700);
  };

  return (
    <div className="flex flex-col items-center min-h-screen p-8 bg-gray-50">
      <div className="w-full max-w-md flex-1 overflow-y-auto border rounded-lg bg-white shadow p-4" style={{minHeight:300}}>
        {messages.map((m, i) => (
          <div key={i} className={m.from === 'user' ? "text-right mb-2" : "text-left mb-2"}>
            <span className={m.from === 'user' ? "bg-blue-100 px-3 py-1 rounded-lg inline-block" : "bg-gray-200 px-3 py-1 rounded-lg inline-block"}>
              {m.text}
            </span>
          </div>
        ))}
      </div>
      <div className="w-full max-w-md flex gap-2 mt-4">
        <input
          className="flex-1 border rounded px-3 py-2"
          value={input}
          onChange={e => setInput(e.target.value)}
          onKeyDown={e => e.key === 'Enter' && handleSend()}
          placeholder="Γράψε μήνυμα..."
        />
        <button className="bg-black text-white px-4 rounded" onClick={handleSend}>
          Send
        </button>
      </div>
    </div>
  );
}
