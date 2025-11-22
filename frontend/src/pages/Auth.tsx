import React, { useState, useRef, useEffect } from "react";
import { login, registerUser, googleLogin } from "@/api/auth";
import { useAuth } from "@/context/AuthContext";
import { GoogleLogin } from "@react-oauth/google";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { PasswordStrengthIndicator } from "@/components/ui/password-strength-indicator";
import { Shield } from "lucide-react";

const vertexShaderSource = `
  attribute vec4 a_position;
  void main() {
    gl_Position = a_position;
  }
`;

const fragmentShaderSource = `
precision mediump float;
uniform vec2 iResolution;
uniform float iTime;
uniform vec2 iMouse;
uniform vec3 u_color;

void mainImage(out vec4 fragColor, in vec2 fragCoord){
    vec2 uv = (1.0 * fragCoord - iResolution.xy) / min(iResolution.x, iResolution.y);
    float t = iTime * 0.5;

    vec2 mouse_uv = (4.0 * iMouse - iResolution.xy) / min(iResolution.x, iResolution.y);

    float mouseInfluence = 0.0;
    if (length(iMouse) > 0.0) {
        float dist_to_mouse = distance(uv, mouse_uv);
        mouseInfluence = smoothstep(0.8, 0.0, dist_to_mouse);
    }

    for(float i = 8.0; i < 20.0; i++) {
        uv.x += 0.6 / i * cos(i * 2.5 * uv.y + t);
        uv.y += 0.6 / i * cos(i * 1.5 * uv.x + t);
    }

    float wave = abs(sin(t - uv.y - uv.x + mouseInfluence * 8.0));
    float glow = smoothstep(0.9, 0.0, wave);

    vec3 color = glow * u_color;

    fragColor = vec4(color, 1.0);
}

void main() {
    mainImage(gl_FragColor, gl_FragCoord.xy);
}
`;

interface ShaderBackgroundProps {
  color?: string;
}

function ShaderBackground({ color = "#07eae6" }: ShaderBackgroundProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });
  const [isHovering, setIsHovering] = useState(false);

  const hexToRgb = (hex: string): [number, number, number] => {
    const r = parseInt(hex.substring(1, 3), 16) / 255;
    const g = parseInt(hex.substring(3, 5), 16) / 255;
    const b = parseInt(hex.substring(5, 7), 16) / 255;
    return [r, g, b];
  };

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const gl = canvas.getContext("webgl");
    if (!gl) {
      console.error("WebGL not supported");
      return;
    }

    const compileShader = (type: number, source: string): WebGLShader | null => {
      const shader = gl.createShader(type);
      if (!shader) return null;
      gl.shaderSource(shader, source);
      gl.compileShader(shader);
      if (!gl.getShaderParameter(shader, gl.COMPILE_STATUS)) {
        console.error("Shader compilation error:", gl.getShaderInfoLog(shader));
        gl.deleteShader(shader);
        return null;
      }
      return shader;
    };

    const vertexShader = compileShader(gl.VERTEX_SHADER, vertexShaderSource);
    const fragmentShader = compileShader(gl.FRAGMENT_SHADER, fragmentShaderSource);
    if (!vertexShader || !fragmentShader) return;

    const program = gl.createProgram();
    if (!program) return;
    gl.attachShader(program, vertexShader);
    gl.attachShader(program, fragmentShader);
    gl.linkProgram(program);

    if (!gl.getProgramParameter(program, gl.LINK_STATUS)) {
      console.error("Program linking error:", gl.getProgramInfoLog(program));
      return;
    }

    gl.useProgram(program);

    const positionBuffer = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, positionBuffer);
    gl.bufferData(
      gl.ARRAY_BUFFER,
      new Float32Array([-1, -1, 1, -1, -1, 1, -1, 1, 1, -1, 1, 1]),
      gl.STATIC_DRAW
    );

    const positionLocation = gl.getAttribLocation(program, "a_position");
    gl.enableVertexAttribArray(positionLocation);
    gl.vertexAttribPointer(positionLocation, 2, gl.FLOAT, false, 0, 0);

    const iResolutionLocation = gl.getUniformLocation(program, "iResolution");
    const iTimeLocation = gl.getUniformLocation(program, "iTime");
    const iMouseLocation = gl.getUniformLocation(program, "iMouse");
    const uColorLocation = gl.getUniformLocation(program, "u_color");

    let startTime = Date.now();

    const [r, g, b] = hexToRgb(color);
    gl.uniform3f(uColorLocation, r, g, b);

    const render = () => {
      const width = canvas.clientWidth;
      const height = canvas.clientHeight;
      canvas.width = width;
      canvas.height = height;
      gl.viewport(0, 0, width, height);

      const currentTime = (Date.now() - startTime) / 1000;

      gl.uniform2f(iResolutionLocation, width, height);
      gl.uniform1f(iTimeLocation, currentTime);
      gl.uniform2f(
        iMouseLocation,
        isHovering ? mousePosition.x : 0,
        isHovering ? height - mousePosition.y : 0
      );

      gl.drawArrays(gl.TRIANGLES, 0, 6);
      requestAnimationFrame(render);
    };

    const handleMouseMove = (event: MouseEvent) => {
      const rect = canvas.getBoundingClientRect();
      setMousePosition({
        x: event.clientX - rect.left,
        y: event.clientY - rect.top,
      });
    };

    const handleMouseEnter = () => setIsHovering(true);
    const handleMouseLeave = () => {
      setIsHovering(false);
      setMousePosition({ x: 0, y: 0 });
    };

    canvas.addEventListener("mousemove", handleMouseMove);
    canvas.addEventListener("mouseenter", handleMouseEnter);
    canvas.addEventListener("mouseleave", handleMouseLeave);

    render();

    return () => {
      canvas.removeEventListener("mousemove", handleMouseMove);
      canvas.removeEventListener("mouseenter", handleMouseEnter);
      canvas.removeEventListener("mouseleave", handleMouseLeave);
    };
  }, [isHovering, mousePosition, color]);

  return (
    <div className="fixed inset-0 w-full h-full overflow-hidden">
      <canvas
        ref={canvasRef}
        className="absolute inset-0 w-full h-full"
        style={{ display: "block" }}
      />
      <div className="absolute inset-0 backdrop-blur-sm"></div>
    </div>
  );
}

export default function Auth() {
    const { setAuth } = useAuth();
    const location = useLocation();
    const navigate = useNavigate();

    const redirect = location.search.replace("?redirect=", "") || "/dashboard";
    const [isLogin, setIsLogin] = useState(true);
    const [form, setForm] = useState({ name: "", email: "", password: "" });
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");
    const [passwordStrength, setPasswordStrength] = useState<"empty" | "weak" | "medium" | "strong" | "very-strong">("empty");

    const submit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        setError("");

        try {
            if (!isLogin && passwordStrength === "weak") {
                setError("Password is too weak. Please use a stronger password.");
                setLoading(false);
                return;
            }

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
        <>
            <ShaderBackground color="#07eae6" />
            <div className="relative flex justify-center items-center min-h-screen p-4 z-10">
                <Card className="w-full max-w-md shadow-2xl border-0 bg-slate-900/80 backdrop-blur-xl text-white">
                    <CardHeader>
                        <CardTitle className="text-center text-2xl text-white">
                            {isLogin ? "Login" : "Register"}
                        </CardTitle>
                    </CardHeader>

                    <CardContent className="space-y-4">
                        {error && (
                            <div className="bg-red-500/20 border border-red-500 text-red-200 px-4 py-3 rounded text-sm">
                                {error}
                            </div>
                        )}

                        <div className="space-y-4">
                            {!isLogin && (
                                <Input
                                    placeholder="Name"
                                    value={form.name}
                                    onChange={e => setForm({ ...form, name: e.target.value })}
                                    required
                                    className="bg-black/50 border-slate-700 text-white placeholder:text-slate-400"
                                />
                            )}

                            <Input
                                placeholder="Email"
                                type="email"
                                value={form.email}
                                onChange={e => setForm({ ...form, email: e.target.value })}
                                required
                                className="bg-black/50 border-slate-700 text-white placeholder:text-slate-400"
                            />

                            {!isLogin ? (
                                <PasswordStrengthIndicator
                                    value={form.password}
                                    onChange={(value) => setForm({ ...form, password: value })}
                                    onStrengthChange={setPasswordStrength}
                                    label="Password"
                                    placeholder="Enter a strong password"
                                    showScore={true}
                                    showScoreNumber={true}
                                    showVisibilityToggle={true}
                                />
                            ) : (
                                <Input
                                    placeholder="Password"
                                    type="password"
                                    value={form.password}
                                    onChange={e => setForm({ ...form, password: e.target.value })}
                                    required
                                    className="bg-black/50 border-slate-700 text-white placeholder:text-slate-400"
                                />
                            )}

                            <Button
                                onClick={submit}
                                className="w-full bg-cyan-500 hover:bg-cyan-600 text-black font-semibold"
                                disabled={loading || (!isLogin && passwordStrength === "weak")}
                            >
                                {loading ? "Please wait..." : (isLogin ? "Login" : "Register")}
                            </Button>
                        </div>

                        <div className="relative my-4">
                            <div className="absolute inset-0 flex items-center">
                                <div className="w-full border-t border-slate-700" />
                            </div>
                            <div className="relative flex justify-center text-sm">
                                <span className="px-2 bg-slate-900 text-slate-400">Or continue with</span>
                            </div>
                        </div>

                        <GoogleLogin
                            onSuccess={handleGoogleSuccess}
                            onError={() => setError("Google Login Failed")}
                        />

                        <div className="text-sm text-center">
                            <button
                                className="text-cyan-400 hover:text-cyan-300"
                                onClick={() => setIsLogin(!isLogin)}
                                type="button"
                            >
                                {isLogin ? "Create account" : "Already have an account?"}
                            </button>
                        </div>

                        <div className="text-center">
                            <Link to="/send-otp" className="text-blue-400 text-sm hover:text-blue-300">
                                Forgot Password?
                            </Link>
                        </div>

                        <div className="text-center pt-4 border-t border-slate-700">
                            <p className="text-sm text-slate-400 mb-2">Are you an administrator?</p>
                            <Button 
                                variant="outline" 
                                size="sm" 
                                asChild
                                className="border-blue-500 text-blue-400 hover:bg-blue-500 hover:text-white"
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
        </>
    );
}