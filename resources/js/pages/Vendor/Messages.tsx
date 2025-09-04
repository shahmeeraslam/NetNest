import { useEffect, useState } from 'react';
import { usePage } from '@inertiajs/react';

export default function Messages() {
    const { messages: initialMessages, vendorId } = usePage().props;
    const [messages, setMessages] = useState(initialMessages);

    useEffect(() => {
        if (!window.Echo) return;

        window.Echo.private(`chat.${vendorId}`)
            .listen('.MessageSent', (e:any) => {
                setMessages((prev) => [...prev, e.message]);
            });
    }, [vendorId]);

    return (
        <div className="p-6">
            <h1 className="text-xl font-bold mb-4">Messages</h1>
            <div className="space-y-2">
                {messages.map((msg) => (
                    <div key={msg.id} className={`p-3 rounded ${msg.sender_id === vendorId ? 'bg-blue-100' : 'bg-gray-100'}`}>
                        <strong>{msg.sender?.name}:</strong> {msg.message}
                    </div>
                ))}
            </div>
        </div>
    );
}
