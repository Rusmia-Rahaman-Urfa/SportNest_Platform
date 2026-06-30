import { useState } from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import { motion } from "framer-motion";
import { Eye, EyeOff, Zap } from "lucide-react";
import toast from "react-hot-toast";
import { signIn } from "../../lib/auth-client";

const GoogleIcon = () => (
  <svg width="18" height="18" viewBox="0 0 48 48">
    <path fill="#EA4335" d="M24 9.5c3.54 0 6.71 1.22 9.21 3.6l6.85-6.85C35.9 2.38 30.47 0 24 0 14.62 0 6.51 5.38 2.56 13.22l7.98 6.19C12.43 13.72 17.74 9.5 24 9.5z"/>
    <path fill="#4285F4" d="M46.98 24.55c0-1.57-.15-3.09-.38-4.55H24v9.02h12.94c-.58 2.96-2.26 5.48-4.78 7.18l7.73 6c4.51-4.18 7.09-10.36 7.09-17.65z"/>
    <path fill="#FBBC05" d="M10.53 28.59c-.48-1.45-.76-2.99-.76-4.59s.27-3.14.76-4.59l-7.98-6.19C.92 16.46 0 20.12 0 24c0 3.88.92 7.54 2.56 10.78l7.97-6.19z"/>
    <path fill="#34A853" d="M24 48c6.48 0 11.93-2.13 15.89-5.81l-7.73-6c-2.15 1.45-4.92 2.3-8.16 2.3-6.26 0-11.57-4.22-13.47-9.91l-7.98 6.19C6.51 42.62 14.62 48 24 48z"/>
  </svg>
);

const LoginPage = () => {
  const navigate  = useNavigate();
  const location  = useLocation();
  const from      = location.state?.from || "/";
  const [form,    setForm]    = useState({ email:"", password:"" });
  const [showPw,  setShowPw]  = useState(false);
  const [loading, setLoading] = useState(false);
  const [gLoad,   setGLoad]   = useState(false);

  // Better Auth — email/password sign in
  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const { error } = await signIn.email({
        email:    form.email,
        password: form.password,
      });
      if (error) throw new Error(error.message);
      toast.success("Welcome back! 🏆");
      navigate(from, { replace: true });
    } catch (err) {
      toast.error(err.message || "Login failed. Check your credentials.");
    } finally {
      setLoading(false);
    }
  };

  // Better Auth — Google OAuth sign in
  const handleGoogle = async () => {
    setGLoad(true);
    try {
      await signIn.social({
        provider:    "google",
        callbackURL: from === "/" ? "/" : from,
      });
      // Better Auth redirects automatically after Google OAuth
    } catch (err) {
      toast.error("Google sign-in failed.");
      setGLoad(false);
    }
  };

  return (
    <div className="auth-page">
      <div className="auth-bg"><div className="orb orb1"/><div className="orb orb2"/></div>
      <motion.div className="auth-card" initial={{opacity:0,y:30,scale:.97}} animate={{opacity:1,y:0,scale:1}} transition={{duration:.4}}>
        <div className="auth-header">
          <Link to="/" className="auth-logo">⚡ Sport<span>Nest</span></Link>
          <h1 className="auth-title">Welcome back</h1>
          <p className="auth-sub">Sign in to book your next game</p>
        </div>

        {/* Google Login */}
        <button className="btn-google" onClick={handleGoogle} disabled={gLoad}>
          <GoogleIcon/>{gLoad ? "Redirecting…" : "Continue with Google"}
        </button>

        <div className="auth-divider"><span>or sign in with email</span></div>

        <form onSubmit={handleSubmit} className="auth-form">
          <div className="form-group">
            <label className="form-label">Email</label>
            <input className="form-input" type="email" placeholder="you@example.com"
              value={form.email} onChange={e => setForm(f=>({...f,email:e.target.value}))} required autoComplete="email"/>
          </div>
          <div className="form-group">
            <label className="form-label">Password</label>
            <div className="pw-wrap">
              <input className="form-input" type={showPw?"text":"password"} placeholder="Your password"
                value={form.password} onChange={e => setForm(f=>({...f,password:e.target.value}))} required autoComplete="current-password"/>
              <button type="button" className="pw-toggle" onClick={() => setShowPw(s=>!s)}>
                {showPw ? <EyeOff size={15}/> : <Eye size={15}/>}
              </button>
            </div>
          </div>
          <button type="submit" className="btn-auth-submit" disabled={loading}>
            {loading ? "Signing in…" : <><Zap size={15}/>Sign In</>}
          </button>
        </form>

        {/* Register link */}
        <p className="auth-switch">New to SportNest? <Link to="/register" className="auth-link">Create an account</Link></p>
      </motion.div>
    </div>
  );
};
export default LoginPage;
