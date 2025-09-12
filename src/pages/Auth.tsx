import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Separator } from '@/components/ui/separator';
import { Eye, EyeOff, Mail, Lock, User, ArrowLeft, BookOpen } from 'lucide-react';
import { Link } from 'react-router-dom';
import logoImage from '@/assets/logo.png';

const Auth = () => {
  const [isSignUp, setIsSignUp] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [userRole, setUserRole] = useState<'student' | 'teacher'>('student');
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    confirmPassword: '',
    teacherId: '',
    department: ''
  });

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData(prev => ({
      ...prev,
      [e.target.name]: e.target.value
    }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // TODO: Implement Supabase authentication here
    console.log('Form submitted:', { ...formData, role: userRole });
    alert(`${userRole === 'teacher' ? 'Teacher' : 'Student'} authentication functionality requires Supabase integration. Please connect to Supabase first!`);
  };

  const handleGoogleSignIn = () => {
    // TODO: Implement Supabase Google OAuth here
    console.log('Google sign-in clicked for:', userRole);
    alert(`Google Sign-In for ${userRole === 'teacher' ? 'teachers' : 'students'} requires Supabase integration with Google OAuth provider!`);
  };

  return (
    <div className="min-h-screen bg-background flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        {/* Header */}
        <div className="text-center mb-8">
          <Link to="/" className="inline-flex items-center text-muted-foreground hover:text-foreground transition-smooth mb-6">
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back to Home
          </Link>
          
          <div className="flex items-center justify-center space-x-3 mb-6">
            <div className="w-12 h-12 rounded-full overflow-hidden">
              <img 
                src={logoImage} 
                alt="devNest Logo" 
                className="w-full h-full object-cover"
              />
            </div>
            <h1 className="text-2xl font-bold">
              <span className="text-logo-gray">dev</span>
              <span className="text-primary">Ne</span>
              <span className="text-logo-orange">st</span>
            </h1>
          </div>
          
          <h2 className="text-xl text-muted-foreground">
            {isSignUp ? 'Join the Community' : 'Welcome Back'}
          </h2>
        </div>

        {/* Role Selection */}
        <div className="mb-8 animate-fade-in">
          <h3 className="text-lg font-semibold mb-4 text-center">I am a...</h3>
          <div className="grid grid-cols-2 gap-4">
            <Card 
              className={`cursor-pointer transition-all ${
                userRole === 'student' 
                  ? 'border-primary bg-primary/5 shadow-md' 
                  : 'border-border hover:border-primary/50 hover:bg-secondary/50'
              }`}
              onClick={() => setUserRole('student')}
            >
              <CardContent className="p-6 text-center">
                <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-primary/10 flex items-center justify-center">
                  <User className="w-8 h-8 text-primary" />
                </div>
                <h4 className="font-semibold mb-2">Student</h4>
                <p className="text-sm text-muted-foreground">
                  Access course updates, join discussions, and participate anonymously
                </p>
                {userRole === 'student' && (
                  <div className="mt-3">
                    <div className="w-6 h-6 mx-auto rounded-full border-2 border-primary bg-primary flex items-center justify-center">
                      <User className="w-4 h-4 text-primary-foreground" />
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>

            <Card 
              className={`cursor-pointer transition-all ${
                userRole === 'teacher' 
                  ? 'border-primary bg-primary/5 shadow-md' 
                  : 'border-border hover:border-primary/50 hover:bg-secondary/50'
              }`}
              onClick={() => setUserRole('teacher')}
            >
              <CardContent className="p-6 text-center">
                <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-accent/10 flex items-center justify-center">
                  <BookOpen className="w-8 h-8 text-accent" />
                </div>
                <h4 className="font-semibold mb-2">Teacher</h4>
                <p className="text-sm text-muted-foreground">
                  Post updates, manage courses, and engage with students
                </p>
                {userRole === 'teacher' && (
                  <div className="mt-3">
                    <div className="w-6 h-6 mx-auto rounded-full border-2 border-primary bg-primary flex items-center justify-center">
                      <BookOpen className="w-4 h-4 text-primary-foreground" />
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>
          </div>
        </div>

        {/* Form Card */}
        <Card className="shadow-hover">
          <CardHeader>
            <CardTitle className="text-center">
              {isSignUp ? 'Create Account' : 'Sign In'} as {userRole === 'teacher' ? 'Teacher' : 'Student'}
            </CardTitle>
          </CardHeader>
          
          <CardContent>
            {/* Google Sign-In Button */}
            <div className="mb-6">
              <Button
                type="button"
                variant="outline"
                className="w-full h-12 border-border hover:bg-secondary/50 transition-smooth"
                onClick={handleGoogleSignIn}
              >
                <div className="flex items-center justify-center space-x-3">
                  <svg className="w-5 h-5" viewBox="0 0 24 24">
                    <path
                      fill="#4285f4"
                      d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                    />
                    <path
                      fill="#34a853"
                      d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                    />
                    <path
                      fill="#fbbc05"
                      d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
                    />
                    <path
                      fill="#ea4335"
                      d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
                    />
                  </svg>
                  <span className="font-medium">Continue with Google as {userRole === 'teacher' ? 'Teacher' : 'Student'}</span>
                </div>
              </Button>
            </div>

            {/* Divider */}
            <div className="relative mb-6">
              <Separator />
              <div className="absolute inset-0 flex items-center justify-center">
                <span className="bg-card px-3 text-sm text-muted-foreground">
                  or {isSignUp ? 'create account' : 'sign in'} with email
                </span>
              </div>
            </div>

            <form onSubmit={handleSubmit} className="space-y-4">
              {/* Name field for sign-up */}
              {isSignUp && (
                <div className="space-y-2">
                  <Label htmlFor="name">{userRole === 'teacher' ? 'Full Name' : 'Display Name (Optional)'}</Label>
                  <div className="relative">
                    <User className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                    <Input
                      id="name"
                      name="name"
                      type="text"
                      placeholder={userRole === 'teacher' ? 'Enter your full name' : 'Enter display name (can be anonymous)'}
                      value={formData.name}
                      onChange={handleInputChange}
                      className="pl-10"
                      required={userRole === 'teacher'}
                    />
                  </div>
                  {userRole === 'student' && (
                    <p className="text-xs text-muted-foreground">
                      Students can remain anonymous - display name is optional
                    </p>
                  )}
                </div>
              )}

              {/* Teacher-specific fields */}
              {isSignUp && userRole === 'teacher' && (
                <>
                  <div className="space-y-2">
                    <Label htmlFor="teacherId">Teacher ID</Label>
                    <div className="relative">
                      <User className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                      <Input
                        id="teacherId"
                        name="teacherId"
                        type="text"
                        placeholder="Enter your teacher ID"
                        value={formData.teacherId}
                        onChange={handleInputChange}
                        className="pl-10"
                        required
                      />
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="department">Department</Label>
                    <div className="relative">
                      <BookOpen className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                      <select
                        id="department"
                        name="department"
                        value={formData.department}
                        onChange={(e) => setFormData(prev => ({ ...prev, department: e.target.value }))}
                        className="w-full pl-10 pr-3 py-2 border border-border rounded-md bg-card text-card-foreground"
                        required
                      >
                        <option value="">Select Department</option>
                        <option value="computer-science">Computer Science</option>
                        <option value="mathematics">Mathematics</option>
                        <option value="physics">Physics</option>
                        <option value="chemistry">Chemistry</option>
                        <option value="english">English</option>
                        <option value="other">Other</option>
                      </select>
                    </div>
                  </div>
                </>
              )}

              {/* Email field */}
              <div className="space-y-2">
                <Label htmlFor="email">Email</Label>
                <div className="relative">
                  <Mail className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                  <Input
                    id="email"
                    name="email"
                    type="email"
                    placeholder={userRole === 'teacher' ? 'Enter your official email' : 'Enter your email'}
                    value={formData.email}
                    onChange={handleInputChange}
                    className="pl-10"
                    required
                  />
                </div>
                {userRole === 'teacher' && (
                  <p className="text-xs text-muted-foreground">
                    Please use your official university email address
                  </p>
                )}
              </div>

              {/* Password field */}
              <div className="space-y-2">
                <Label htmlFor="password">Password</Label>
                <div className="relative">
                  <Lock className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                  <Input
                    id="password"
                    name="password"
                    type={showPassword ? 'text' : 'password'}
                    placeholder="Enter your password"
                    value={formData.password}
                    onChange={handleInputChange}
                    className="pl-10 pr-10"
                    required
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-3 text-muted-foreground hover:text-foreground"
                  >
                    {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                  </button>
                </div>
              </div>

              {/* Confirm Password for sign-up */}
              {isSignUp && (
                <div className="space-y-2">
                  <Label htmlFor="confirmPassword">Confirm Password</Label>
                  <div className="relative">
                    <Lock className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                    <Input
                      id="confirmPassword"
                      name="confirmPassword"
                      type="password"
                      placeholder="Confirm your password"
                      value={formData.confirmPassword}
                      onChange={handleInputChange}
                      className="pl-10"
                      required
                    />
                  </div>
                </div>
              )}

              {/* Submit Button */}
              <Button 
                type="submit" 
                className="w-full gradient-primary text-primary-foreground shadow-soft"
                size="lg"
              >
                {isSignUp ? `Create ${userRole === 'teacher' ? 'Teacher' : 'Student'} Account` : 'Sign In'}
              </Button>

              {/* Forgot Password */}
              {!isSignUp && (
                <div className="text-center">
                  <button
                    type="button"
                    className="text-sm text-primary hover:text-primary-glow transition-smooth"
                    onClick={() => alert('Forgot password functionality requires Supabase integration!')}
                  >
                    Forgot your password?
                  </button>
                </div>
              )}
            </form>

            {/* Toggle between sign-in and sign-up */}
            <div className="mt-6 text-center border-t border-border pt-6">
              <p className="text-sm text-muted-foreground">
                {isSignUp ? 'Already have an account?' : "Don't have an account?"}
              </p>
              <button
                onClick={() => setIsSignUp(!isSignUp)}
                className="text-sm font-medium text-primary hover:text-primary-glow transition-smooth"
              >
                {isSignUp ? 'Sign In' : 'Sign Up'}
              </button>
            </div>
          </CardContent>
        </Card>

        {/* Note about Supabase */}
        <div className="mt-6 p-4 bg-card/50 rounded-lg border border-border">
          <p className="text-xs text-muted-foreground text-center">
            <strong>Note:</strong> Role-based authentication and verification requires Supabase integration. 
            Teachers will need institutional verification, while students can participate anonymously.
          </p>
        </div>
      </div>
    </div>
  );
};

export default Auth;