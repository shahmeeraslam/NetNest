import { usePage } from '@inertiajs/react';

export default function VendorMessages() {
  const { messages } = usePage().props as any;

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-4">Messages from Customers</h1>
      <div className="space-y-4">
        {messages.map((msg: any) => (
          <div key={msg.id} className="border rounded-lg p-4 shadow-sm">
            <p className="font-semibold text-lg">{msg.customer.name}</p>
            <p className="text-gray-600">{msg.customer.email}</p>
            <p className="mt-2">{msg.message}</p>
            <span className="text-xs text-gray-500">
              {new Date(msg.created_at).toLocaleString()}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
}
