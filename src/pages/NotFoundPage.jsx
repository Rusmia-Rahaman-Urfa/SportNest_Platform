import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { Home, ArrowLeft } from "lucide-react";

// Custom 404 page — Friendly error message + Back Home button
const NotFoundPage = () => (
  <div className="notfound-page">
    <div className="auth-bg"><div className="orb orb1"/><div className="orb orb2"/></div>
    <motion.div className="notfound-content" initial={{opacity:0,y:40}} animate={{opacity:1,y:0}} transition={{duration:.5}}>
      <div className="notfound-num">404</div>
      <div className="notfound-emoji">🏟️</div>
      <h1 className="notfound-title">Out of Bounds!</h1>
      <p className="notfound-desc">Looks like you kicked the ball out of the stadium. The page you&apos;re looking for doesn&apos;t exist or has been moved.</p>
      <div className="notfound-btns">
        <Link to="/" className="btn-primary"><Home size={17}/>Back to Home</Link>
        <button className="btn-ghost" onClick={()=>window.history.back()}><ArrowLeft size={17}/>Go Back</button>
      </div>
    </motion.div>
  </div>
);
export default NotFoundPage;
