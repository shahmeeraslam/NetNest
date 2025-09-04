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
public function index($receiverId = null)
{
    return Inertia::render('Public/Chat', [
        'userId' => Auth::id(),
        'receiverId' => $receiverId,
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
                ->where('receiver_id', $userId);
        })
            ->orwhere(function ($q) use ($userId) {
                $q->where('sender_id', $userId)
                    ->where('receiver_id', Auth::id());
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
