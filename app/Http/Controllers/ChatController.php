<?php

namespace App\Http\Controllers;


use Illuminate\Http\Request;
use App\Models\Message;
use App\Events\MessageSent;
use Illuminate\Support\Facades\Auth;
use Inertia\Inertia;

class ChatController extends Controller
{

    // public function index()
    // {
    //     return Inertia::render('Public/Chat');
    // }

public function openFromSubscription($subscriptionId)
{
    $receiverId = Message::pluck('receiver_id')->get();
    $subscription = \App\Models\CustomerSubscription::with('vendorService.vendor')->findOrFail($subscriptionId);
    if (Auth::user()->isCustomer()) {
    $isSubscribed = \App\Models\CustomerSubscription::where('user_id', Auth::id())
        ->whereHas('vendorService', fn($q) => $q->where('user_id', $receiverId))
        ->exists();

    abort_if(!$isSubscribed, 403, 'Unauthorized chat access');
}
    
    return Inertia::render('Public/Chat', [
        'userId' => Auth::id(),
        'receiverId' => $subscription->vendorService->vendor->id, // vendor user_id
    ]);
}


    public function sendMessage(Request $req)
    {
        $req->validate([
            'receiver_id' => 'required|exists:users,id',
            'message' => 'required|string',
        ]);

        $message = Message::create([
            'sender_id' => Auth::user()->id,
            'receiver_id' => $req->receiver_id,
            'message' => $req->message,
        ]);

        broadcast(new MessageSent($message))->toothers();

        return response()->json($message);
    }

    public function getMessage($userId)
    {
        $messages = message::where(function ($q) use ($userId) {
            $q->where('sender_id', Auth::id())
                ->where('receiver_id', 1);
        })
            ->orwhere(function ($q) use ($userId) {
                $q->where('sender_id', $userId)
                    ->where('receiver_id',1);
            })
            ->orderBy('created_at', 'asc')
            ->get();


        Message::where('sender_id', $userId)
            ->where('receiver_id', Auth::id())
            ->where('is_read', false)
            ->update(['is_read' => true]);

        return  response($messages);
    }
}
