import { useEffect, useState } from "react";
import axios from "axios";
import echo from "@/echo";

export default function ChatPopup({
    vendorId,
    customerId,
    onClose,
}: {
    vendorId: number;
    customerId: number | any;
    onClose: () => void;
}) {
    const [messages, setMessages] = useState<any[]>([]);
    const [newMessage, setNewMessage] = useState("");

    useEffect(() => {
        // Load chat history
        axios.get(`/chat/messages/${vendorId}`).then((res) => setMessages(res.data));

        // Listen for new messages
        echo.private(`chat.${customerId}.${vendorId}`).listen("MessageSent", (e: any) => {
            setMessages((prev) => [...prev, e.message]);
        });

        return () => {
            echo.leave(`chat.${customerId}.${vendorId}`);
        };
    }, [vendorId, customerId]);

    const sendMessage = async () => {
        if (!newMessage.trim()) return;
        const res = await axios.post("/chat/send", {
            receiver_id: vendorId,
            message: newMessage,
        });
        setMessages((prev) => [...prev, res.data]);
        setNewMessage("");
    };

    return (
        <div className="fixed bottom-20 right-6 w-96 bg-white border rounded-xl shadow-2xl flex flex-col">
            {/* Header */}
            <div className="flex justify-between items-center p-3 border-b bg-blue-600 text-white rounded-t-xl">
                <h3 className="font-bold">Chat with Vendor</h3>
                <button onClick={onClose} className="text-white font-bold">×</button>
            </div>

            {/* Messages */}
            <div className="flex-1 overflow-y-auto p-3 h-80">
                {messages.map((msg, i) => (
                    <div
                        key={i}
                        className={`my-2 p-2 rounded-lg ${
                            msg.sender_id === customerId
                                ? "bg-blue-500 text-white ml-auto w-fit"
                                : "bg-gray-200 w-fit"
                        }`}
                    >
                        {msg.message}
                    </div>
                ))}
            </div>

            {/* Input */}
            <div className="flex p-2 border-t">
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
