import { useState, useEffect, useRef } from "react";
import { Link, NavLink, useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { Menu, X, ChevronDown, LogOut, Calendar, Plus, Settings, Sun, Moon } from "lucide-react";
import { useSession, signOut } from "../../lib/auth-client";
import { useTheme } from "../../context/ThemeContext";
import toast from "react-hot-toast";

const Navbar = () => {
  const { data: session }      = useSession();
  const user                   = session?.user;
  const { theme, toggleTheme } = useTheme();
  const navigate               = useNavigate();
  const [mobileOpen, setMobileOpen] = useState(false);
  const [dropOpen,   setDropOpen]   = useState(false);
  const [scrolled,   setScrolled]   = useState(false);
  const dropRef = useRef(null);

  useEffect(() => {
    const fn = () => setScrolled(window.scrollY > 20);
    window.addEventListener("scroll", fn);
    return () => window.removeEventListener("scroll", fn);
  }, []);

  useEffect(() => {
    const fn = (e) => { if (dropRef.current && !dropRef.current.contains(e.target)) setDropOpen(false); };
    document.addEventListener("mousedown", fn);
    return () => document.removeEventListener("mousedown", fn);
  }, []);

  const handleLogout = async () => {
    await signOut();
    toast.success("See you on the field! 👋");
    navigate("/");
    setDropOpen(false);
    setMobileOpen(false);
  };

  const publicLinks  = [
    { to:"/",           label:"Home",          end:true },
    { to:"/facilities", label:"All Facilities"          },
  ];
  const privateLinks = [
    { to:"/my-bookings",       label:"My Bookings",       icon:<Calendar size={15}/> },
    { to:"/add-facility",      label:"Add Facility",      icon:<Plus size={15}/> },
    { to:"/manage-facilities", label:"Manage Facilities", icon:<Settings size={15}/> },
  ];

  return (
    <nav className={`navbar${scrolled ? " scrolled" : ""}`}>
      <div className="nav-inner">
        {/* Logo */}
        <Link to="/" className="nav-logo">⚡ Sport<span>Nest</span></Link>

        {/* Desktop links */}
        <div className="nav-links">
          {publicLinks.map(l => (
            <NavLink key={l.to} to={l.to} end={l.end}
              className={({ isActive }) => `nav-link${isActive ? " active" : ""}`}>{l.label}</NavLink>
          ))}
          {user && privateLinks.map(l => (
            <NavLink key={l.to} to={l.to}
              className={({ isActive }) => `nav-link${isActive ? " active" : ""}`}>{l.label}</NavLink>
          ))}
        </div>

        <div className="nav-actions">
          {/* Theme toggle */}
          <button className="icon-btn" onClick={toggleTheme} aria-label="Toggle theme">
            {theme === "dark" ? <Sun size={17}/> : <Moon size={17}/>}
          </button>

          {/* Auth */}
          {user ? (
            <div className="avatar-wrap" ref={dropRef}>
              <button className="avatar-btn" onClick={() => setDropOpen(o => !o)}>
                <img
                  src={user.image || `https://ui-avatars.com/api/?name=${encodeURIComponent(user.name)}&background=E8FF00&color=0a0a0a&bold=true`}
                  alt={user.name} className="avatar-img"
                />
                <span className="avatar-name">{user.name?.split(" ")[0]}</span>
                <ChevronDown size={13} className={dropOpen ? "chevron open" : "chevron"}/>
              </button>

              <AnimatePresence>
                {dropOpen && (
                  <motion.div className="dropdown"
                    initial={{opacity:0,y:-8,scale:.95}} animate={{opacity:1,y:0,scale:1}}
                    exit={{opacity:0,y:-8,scale:.95}} transition={{duration:.15}}>
                    <div className="drop-header">
                      <p className="drop-name">{user.name}</p>
                      <p className="drop-email">{user.email}</p>
                    </div>
                    <hr className="drop-divider"/>
                    {privateLinks.map(l => (
                      <Link key={l.to} to={l.to} className="drop-item" onClick={() => setDropOpen(false)}>
                        {l.icon}{l.label}
                      </Link>
                    ))}
                    <hr className="drop-divider"/>
                    <button className="drop-item danger" onClick={handleLogout}>
                      <LogOut size={15}/>Logout
                    </button>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          ) : (
            <Link to="/login" className="btn-login">Login</Link>
          )}

          {/* Mobile toggle */}
          <button className="icon-btn mobile-toggle" onClick={() => setMobileOpen(o => !o)}>
            {mobileOpen ? <X size={21}/> : <Menu size={21}/>}
          </button>
        </div>
      </div>

      {/* Mobile menu */}
      <AnimatePresence>
        {mobileOpen && (
          <motion.div className="mobile-menu"
            initial={{opacity:0,height:0}} animate={{opacity:1,height:"auto"}}
            exit={{opacity:0,height:0}} transition={{duration:.25}}>
            {publicLinks.map(l => (
              <NavLink key={l.to} to={l.to} end={l.end}
                className={({ isActive }) => `mobile-link${isActive ? " active" : ""}`}
                onClick={() => setMobileOpen(false)}>{l.label}</NavLink>
            ))}
            {user && privateLinks.map(l => (
              <NavLink key={l.to} to={l.to}
                className={({ isActive }) => `mobile-link${isActive ? " active" : ""}`}
                onClick={() => setMobileOpen(false)}>{l.icon}{l.label}</NavLink>
            ))}
            {user
              ? <button className="mobile-link danger" onClick={handleLogout}><LogOut size={15}/>Logout</button>
              : <Link to="/login" className="mobile-link" onClick={() => setMobileOpen(false)}>Login</Link>
            }
          </motion.div>
        )}
      </AnimatePresence>
    </nav>
  );
};
export default Navbar;
