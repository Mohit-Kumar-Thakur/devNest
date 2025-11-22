import React, { useState, useRef, useEffect } from 'react';
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "@/context/AuthContext";
import { Shield, UserPlus, ArrowLeft } from 'lucide-react';
import "../styles/auth-styles.css";

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

const AdminRegister = () => {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    adminSecret: ""
  });
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const { setAuth } = useAuth();
  const navigate = useNavigate();

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
    setError("");
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    try {
      const response = await fetch('http://localhost:5000/api/auth/register-admin', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      });

      const data = await response.json();

      if (response.ok) {
        setAuth(data.user, data.token);
        navigate('/admin-dashboard');
      } else {
        setError(data.message || 'Admin registration failed');
      }
    } catch (err: any) {
      setError('Network error. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <ShaderBackground color="#07eae6" />
      <div className="relative flex justify-center items-center min-h-screen p-4 z-10">
        <div className="w-full max-w-md">
          {/* Header */}
          <div className="text-center mb-8">
            <div className="mx-auto w-20 h-20 rounded-full flex items-center justify-center mb-6 bg-gradient-to-br from-[#07eae6]/20 to-[#05b8b5]/20 border border-[#07eae6]/30">
              <Shield className="w-10 h-10" style={{ color: '#07eae6' }} />
            </div>
            <h1 className="text-3xl font-bold text-transparent bg-gradient-to-r from-white to-[#07eae6] bg-clip-text mb-2">
              Admin Registration
            </h1>
            <p className="text-[rgba(255,255,255,0.7)]">Create an administrator account</p>
          </div>

          {/* Card */}
          <div className="auth-card">
            {/* Card Header */}
            <div className="auth-card-header">
              <h2 className="auth-card-title text-xl">Set Up Admin Account</h2>
            </div>

            {/* Card Content */}
            <div className="auth-card-content">
              {/* Error Message */}
              {error && (
                <div className="auth-error" role="alert">
                  {error}
                </div>
              )}

              {/* Form */}
              <form onSubmit={handleSubmit} className="space-y-4">
                {/* Full Name */}
                <div>
                  <label className="block text-sm font-semibold text-white mb-2">
                    Full Name
                  </label>
                  <input
                    type="text"
                    name="name"
                    required
                    placeholder="Enter your full name"
                    value={formData.name}
                    onChange={handleChange}
                    className="auth-input w-full"
                    aria-label="Full Name"
                  />
                </div>

                {/* Email */}
                <div>
                  <label className="block text-sm font-semibold text-white mb-2">
                    Email Address
                  </label>
                  <input
                    type="email"
                    name="email"
                    required
                    placeholder="Enter your email"
                    value={formData.email}
                    onChange={handleChange}
                    className="auth-input w-full"
                    aria-label="Email Address"
                  />
                </div>

                {/* Password */}
                <div>
                  <label className="block text-sm font-semibold text-white mb-2">
                    Password
                  </label>
                  <input
                    type="password"
                    name="password"
                    required
                    placeholder="Create a strong password"
                    value={formData.password}
                    onChange={handleChange}
                    className="auth-input w-full"
                    aria-label="Password"
                  />
                </div>

                {/* Admin Secret Key */}
                <div>
                  <label className="block text-sm font-semibold text-white mb-2">
                    Admin Secret Key
                  </label>
                  <input
                    type="password"
                    name="adminSecret"
                    required
                    placeholder="Enter admin secret key"
                    value={formData.adminSecret}
                    onChange={handleChange}
                    className="auth-input w-full"
                    aria-label="Admin Secret Key"
                  />
                  <p className="text-xs text-[rgba(255,255,255,0.5)] mt-2">
                    You need the admin secret key to create an admin account
                  </p>
                </div>

                {/* Submit Button */}
                <button
                  type="submit"
                  disabled={loading}
                  className="auth-submit-btn"
                  aria-label="Create admin account"
                >
                  {loading ? (
                    "Creating Admin Account..."
                  ) : (
                    <>
                      <UserPlus className="w-4 h-4 inline mr-2" />
                      Create Admin Account
                    </>
                  )}
                </button>
              </form>

              {/* Back Link */}
              <div className="mt-6 pt-6 border-t border-[rgba(7,234,230,0.15)]">
                <Link
                  to="/auth"
                  className="flex items-center justify-center gap-2 text-[#07eae6] hover:text-white transition-all duration-300 font-semibold text-sm py-2"
                  title="Return to user login"
                >
                  <ArrowLeft className="w-4 h-4" />
                  Back to User Login
                </Link>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default AdminRegister;