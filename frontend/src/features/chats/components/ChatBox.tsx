import React, { useState } from 'react';

// TODO: Add automatic scroll-to-bottom on new incoming messages
// REVIEW: Display presence indicator dot (green = online, gray = offline) beside participant name

interface ChatBoxProps {
  conversationId: string;
  participantName: string;
  isOnline: boolean;
}

export const ChatBox: React.FC<ChatBoxProps> = ({ conversationId, participantName, isOnline }) => {
  const [input, setInput] = useState('');

  const handleSend = () => {
    if (!input.trim()) return;
    alert(`Sending message to ${conversationId}: ${input}`);
    setInput('');
  };

  return (
    <div className="border rounded-lg p-4 bg-slate-900 text-white max-w-md space-y-4">
      <div className="flex items-center justify-between border-b pb-2 border-slate-700">
        <h3 className="font-semibold">{participantName}</h3>
        <span className={`inline-block w-3 h-3 rounded-full ${isOnline ? 'bg-emerald-500' : 'bg-slate-500'}`} />
      </div>
      <div className="h-48 overflow-y-auto space-y-2 text-sm">
        <div className="bg-slate-800 p-2 rounded max-w-xs">Hello! Is the walk schedule flexible?</div>
      </div>
      <div className="flex gap-2">
        <input
          type="text"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder="Type a message..."
          className="flex-1 bg-slate-800 border border-slate-700 px-3 py-1.5 rounded text-sm focus:outline-none focus:border-amber-400"
        />
        <button
          onClick={handleSend}
          className="bg-amber-500 hover:bg-amber-600 text-slate-950 font-bold px-3 py-1.5 rounded text-sm"
        >
          Send
        </button>
      </div>
    </div>
  );
};
