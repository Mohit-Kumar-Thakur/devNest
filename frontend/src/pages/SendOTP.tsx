import React,{useState} from "react";
import { Card,CardHeader,CardTitle,CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { sendOTP } from "@/api/auth";
import { Link } from "react-router-dom";

export default function SendOTP(){
  const [email,setEmail]=useState("");
  const submit=async()=>{const r=await sendOTP(email);alert(r.message)};

  return(
    <div className="flex justify-center items-center min-h-screen p-4">
      <Card className="w-full max-w-md">
        <CardHeader><CardTitle className="text-center text-xl">Reset Password</CardTitle></CardHeader>
        <CardContent className="space-y-4">
          <Input placeholder="Email" onChange={e=>setEmail(e.target.value)}/>
          <Button className="w-full" onClick={submit}>Send OTP</Button>
          <div className="text-center text-sm"><Link to="/auth" className="text-blue-600">Back to Login</Link></div>
        </CardContent>
      </Card>
    </div>
  );
}
