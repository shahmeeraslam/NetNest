<?php

namespace App\Http\Controllers\Vendor;

use App\Models\VendorService;
use App\Models\User;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Illuminate\Support\Facades\Auth;
class DashboardController
{
  public function index()
  {
    $vendorid = Auth::id();
    $vendor = VendorService::get();
     $totalrevenue = VendorService::where('user_id',$vendorid)->sum('price');
    //  $user = User::count();

   

    // $usercount = User::where('role','vendor')->count();
    $usercount = VendorService::where('user_id', $vendorid)->count();
     

    return Inertia::render('Vendor/Dashboard' , [ 'totalrevenue' => $totalrevenue , 'user' => $usercount ]  );
  }
}
