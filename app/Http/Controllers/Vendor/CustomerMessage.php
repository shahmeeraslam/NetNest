<?php

namespace App\Http\Controllers\Vendor;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use App\Models\Message;
use App\Events\MessageSent;
use Illuminate\Support\Facades\Auth;
use Inertia\Inertia;
class CustomerMessage extends Controller
{
    public function index(){ $vendorId = Auth::id();

        $messages = Message::with('sender:id,name')
            ->where('receiver_id', $vendorId)
            ->orWhere('sender_id', $vendorId)
            ->orderBy('created_at', 'asc')
            ->get();

        return Inertia::render('Vendor/Messages', [
            'messages' => $messages,
            'vendorId' => $vendorId,
        ]);
    }
    public function send(Request $request)
    {
        $request->validate([
            'receiver_id' => 'required|exists:users,id',
            'message'     => 'required|string|max:1000',
        ]);

        $message = Message::create([
            'sender_id'   => Auth::id(),
            'receiver_id' => $request->receiver_id,
            'message'     => $request->message,
            'is_read'     => false,
        ]);

        // Fire broadcast for vendor
        broadcast(new MessageSent($message))->toOthers();

        return response()->json(['success' => true, 'message' => $message]);
    }

    // Vendor loads all messages with specific customer
    public function conversation($customerId)
    {
        $vendorId = Auth::id();

        $messages = Message::where(function ($q) use ($vendorId, $customerId) {
                $q->where('sender_id', $vendorId)->where('receiver_id', $customerId);
            })
            ->orWhere(function ($q) use ($vendorId, $customerId) {
                $q->where('sender_id', $customerId)->where('receiver_id', $vendorId);
            })
            ->orderBy('created_at')
            ->get();

        return response()->json($messages);
    }

    // Vendor's message threads
    public function threads()
    {
        $vendorId = Auth::id();

        $threads = Message::with('sender:id,name')
            ->where('receiver_id', $vendorId)
            ->latest()
            ->get()
            ->groupBy('sender_id');

        return response()->json($threads);
    }

}
