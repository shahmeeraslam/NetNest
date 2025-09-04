<?php

namespace App\Events;

use Illuminate\Broadcasting\Channel;
use Illuminate\Broadcasting\InteractsWithSockets;
use Illuminate\Broadcasting\PresenceChannel;
use Illuminate\Broadcasting\PrivateChannel;
use Illuminate\Contracts\Broadcasting\ShouldBroadcast;
use Illuminate\Foundation\Events\Dispatchable;
use Illuminate\Queue\SerializesModels;
use App\Models\Message;

class MessageSent implements ShouldBroadcast
{
    use Dispatchable, InteractsWithSockets, SerializesModels;
 
     public $message;
    
    public function __construct(Message $message)
    {
        $this->message = $message;
    }

    
   public function broadcastOn(): array
{
    $senderId = $this->message->sender_id;
    $receiverId = $this->message->receiver_id;

    // Both sender and receiver should listen to the same channel
    return [
        new PrivateChannel("chat.{$senderId}.{$receiverId}"),
        new PrivateChannel("chat.{$receiverId}.{$senderId}"),
    ];
}

public function broadcastWith()
{
    return [
        'id' => $this->message->id,
        'sender_id' => $this->message->sender_id,
        'receiver_id' => $this->message->receiver_id,
        'message' => $this->message->message,
        'created_at' => $this->message->created_at->toDateTimeString(),
    ];
}

}
