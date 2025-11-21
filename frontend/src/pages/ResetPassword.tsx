import React,{useState} from "react";
import { Card,CardHeader,CardTitle,CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { resetPassword } from "@/api/auth";
import { Link } from "react-router-dom";

export default function ResetPassword(){
  const [data,setData]=useState({email:"",otp:"",newPassword:""});
  const submit=async()=>{const r=await resetPassword(data);alert(r.message)};

  return(
    <div className="flex justify-center items-center min-h-screen p-4">
      <Card className="w-full max-w-md">
        <CardHeader><CardTitle className="text-center text-xl">Enter OTP</CardTitle></CardHeader>
        <CardContent className="space-y-4">
          <Input placeholder="Email" onChange={e=>setData({...data,email:e.target.value})}/>
          <Input placeholder="OTP" onChange={e=>setData({...data,otp:e.target.value})}/>
          <Input placeholder="New Password" type="password" onChange={e=>setData({...data,newPassword:e.target.value})}/>
          <Button className="w-full" onClick={submit}>Reset Password</Button>
          <div className="text-center text-sm"><Link to="/auth" className="text-blue-600">Back to Login</Link></div>
        </CardContent>
      </Card>
    </div>
  );
}
