import React, { useEffect, useState } from "react";
import echo from "../../echo";
import axios from "axios";

export default function Chat({ userId, receiverId }: { userId: number; receiverId: number }) {
  const [messages, setMessages] = useState<any[]>([]);
  const [newMessage, setNewMessage] = useState("");

  useEffect(() => {
    // Load previous messages
    axios.get(`/chat/messages/${receiverId}`).then((res) => {
      setMessages(res.data);
    });

    // Listen for real-time messages
    echo.private(`chat.${userId}.${receiverId}`).listen("MessageSent", (e: any) => {
      setMessages((prev) => [...prev, e.message]);
    });

    // Cleanup on unmount
    return () => {
      echo.leave(`chat.${userId}.${receiverId}`);
    };
  }, [userId, receiverId]);

  const sendMessage = async () => {
    if (!newMessage.trim()) return;

    const res = await axios.post("/chat/send", {
      receiver_id: receiverId,
      message: newMessage,
    });

    setMessages((prev) => [...prev, res.data]);
    setNewMessage("");
  };

  return (
    <div className="p-4 max-w-lg mx-auto">
      <h2 className="text-xl font-bold mb-4">Chat with Vendor</h2>

      <div className="border rounded-lg p-3 h-80 overflow-y-auto">
        {messages.map((msg, i) => (
          <div
            key={i}
            className={`my-2 p-2 rounded-lg ${
              msg.sender_id === userId ? "bg-blue-500 text-white ml-auto w-fit" : "bg-gray-200 w-fit"
            }`}
          >
            {msg.message}
          </div>
        ))}
      </div>

      <div className="flex mt-3">
        <input
          type="text"
          className="flex-1 border rounded-lg p-2"
          value={newMessage}
          onChange={(e) => setNewMessage(e.target.value)}
          placeholder="Type a message..."
        />
        <button
          onClick={sendMessage}
          className="ml-2 bg-blue-600 text-white px-4 rounded-lg"
        >
          Send
        </button>
      </div>
    </div>
  );
}
