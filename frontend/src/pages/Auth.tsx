import React, { useState } from "react";
import { login, registerUser, googleLogin } from "@/api/auth";
import { useAuth } from "@/context/AuthContext";
import { GoogleLogin } from "@react-oauth/google";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Shield } from "lucide-react";

export default function Auth() {
    const { setAuth } = useAuth();
    const location = useLocation();
    const navigate = useNavigate();

    const redirect = location.search.replace("?redirect=", "") || "/dashboard";
    const [isLogin, setIsLogin] = useState(true);
    const [form, setForm] = useState({ name: "", email: "", password: "" });
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");

    const submit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        setError("");

        try {
            let res;
            if (isLogin) {
                res = await login({ email: form.email, password: form.password });
            } else {
                if (!form.name) {
                    setError("Name is required");
                    setLoading(false);
                    return;
                }
                res = await registerUser(form);
            }

            if (res.token && res.user) {
                setAuth(res.user, res.token);
                navigate(redirect, { replace: true });
            } else {
                setError(res.message || "Authentication failed");
            }
        } catch (err: any) {
            console.error("Auth error:", err);
            setError(err.response?.data?.message || "Something went wrong");
        } finally {
            setLoading(false);
        }
    };

    const handleGoogleSuccess = async (credentialResponse: any) => {
        try {
            const data = await googleLogin(credentialResponse.credential);
            if (data.token && data.user) {
                setAuth(data.user, data.token);
                navigate(redirect, { replace: true });
            }
        } catch (error) {
            console.error("Google login failed:", error);
            setError("Google login failed");
        }
    };

    return (
        <div className="flex justify-center items-center min-h-screen p-4">
            <Card className="w-full max-w-md shadow-xl border">
                <CardHeader>
                    <CardTitle className="text-center text-2xl">
                        {isLogin ? "Login" : "Register"}
                    </CardTitle>
                </CardHeader>

                <CardContent className="space-y-4">
                    {error && (
                        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded text-sm">
                            {error}
                        </div>
                    )}

                    <form onSubmit={submit} className="space-y-4">
                        {!isLogin && (
                            <Input
                                placeholder="Name"
                                value={form.name}
                                onChange={e => setForm({ ...form, name: e.target.value })}
                                required
                            />
                        )}

                        <Input
                            placeholder="Email"
                            type="email"
                            value={form.email}
                            onChange={e => setForm({ ...form, email: e.target.value })}
                            required
                        />

                        <Input
                            placeholder="Password"
                            type="password"
                            value={form.password}
                            onChange={e => setForm({ ...form, password: e.target.value })}
                            required
                        />

                        <Button
                            type="submit"
                            className="w-full"
                            disabled={loading}
                        >
                            {loading ? "Please wait..." : (isLogin ? "Login" : "Register")}
                        </Button>
                    </form>

                    <div className="relative my-4">
                        <div className="absolute inset-0 flex items-center">
                            <div className="w-full border-t border-gray-300" />
                        </div>
                        <div className="relative flex justify-center text-sm">
                            <span className="px-2 bg-white text-gray-500">Or continue with</span>
                        </div>
                    </div>

                    <GoogleLogin
                        onSuccess={handleGoogleSuccess}
                        onError={() => setError("Google Login Failed")}
                    />

                    <div className="text-sm text-center">
                        <button
                            className="text-blue-600 hover:text-blue-800"
                            onClick={() => setIsLogin(!isLogin)}
                            type="button"
                        >
                            {isLogin ? "Create account" : "Already have an account?"}
                        </button>
                    </div>

                    <div className="text-center">
                        <Link to="/send-otp" className="text-blue-600 text-sm hover:text-blue-800">
                            Forgot Password?
                        </Link>
                    </div>

                    {/* Admin Registration Button */}
                    <div className="text-center pt-4 border-t border-gray-200">
                        <p className="text-sm text-gray-600 mb-2">Are you an administrator?</p>
                        <Button 
                            variant="outline" 
                            size="sm" 
                            asChild
                            className="border-blue-600 text-blue-600 hover:bg-blue-600 hover:text-white"
                        >
                            <Link to="/admin-register">
                                <Shield className="w-4 h-4 mr-2" />
                                Admin Registration
                            </Link>
                        </Button>
                    </div>
                </CardContent>
            </Card>
        </div>
    );
}