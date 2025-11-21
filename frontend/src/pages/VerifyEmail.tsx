import React,{useState} from "react";
import { Card,CardHeader,CardTitle,CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useSearchParams } from "react-router-dom";
import { verifyEmail } from "@/api/auth";

export default function VerifyEmail(){
  const [params]=useSearchParams();
  const email=params.get("email")||"";
  const token=params.get("token")||"";
  const [msg,setMsg]=useState("");

  const submit=async()=>{const r=await verifyEmail({email,token});setMsg(r.message)};

  return(
    <div className="flex justify-center items-center min-h-screen p-4">
      <Card className="w-full max-w-md">
        <CardHeader><CardTitle className="text-center text-xl">Verify Email</CardTitle></CardHeader>
        <CardContent className="space-y-4">
          <p className="text-center text-sm">{email}</p>
          <Button className="w-full" onClick={submit}>Verify Email</Button>
          <p className="text-center text-green-600 text-sm">{msg}</p>
        </CardContent>
      </Card>
    </div>
  );
}
