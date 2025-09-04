<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Message extends Model
{
    protected $table = 'messages';
    protected $fillable = [
        'sender_id',
        'receiver_id',
        'message',
        'is_read',
    ];

    public function sender()
    {
        return $this->belongsTo(user::class,'sender_id');
    }
    public function receiver()
    {
        return $this->belongsTo(user::class,'receiver_id');
    }

}
