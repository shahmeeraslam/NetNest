<?php

namespace App\Http\Controllers\Admin;
use App\Models\User;
use App\Models\VendorService;
use Illuminate\Http\Request;
use Inertia\Inertia;
class DashboardController
{
    public function index(){
        $totalUser = User::count();
        $user =  ['totalUser' => $totalUser];
         
    return Inertia::render('Admin/Dashboard', compact('user') );
   }
}
