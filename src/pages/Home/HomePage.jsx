import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { ArrowRight, ChevronDown, Shield, Clock, Star, TrendingUp, Zap } from "lucide-react";
import { useQuery } from "@tanstack/react-query";
import api from "../../utils/axios";
import FacilityCard from "../../components/Cards/FacilityCard";
import LoadingSpinner from "../../components/UI/LoadingSpinner";

const fadeUp = {
  hidden:  { opacity:0, y:30 },
  visible: (i=0) => ({ opacity:1, y:0, transition:{ delay:i*.1, duration:.5, ease:"easeOut" } }),
};
const SPORTS = [
  {label:"Football",emoji:"⚽",color:"#4ade80"},{label:"Cricket",emoji:"🏏",color:"#60a5fa"},
  {label:"Basketball",emoji:"🏀",color:"#fb923c"},{label:"Badminton",emoji:"🏸",color:"#e879f9"},
  {label:"Tennis",emoji:"🎾",color:"#facc15"},{label:"Swimming",emoji:"🏊",color:"#38bdf8"},
];
const STATS = [
  {v:"500+",l:"Facilities",icon:<Zap size={22}/>},{v:"12K+",l:"Bookings Made",icon:<TrendingUp size={22}/>},
  {v:"4.9★",l:"Avg Rating",icon:<Star size={22}/>},{v:"24/7",l:"Available",icon:<Clock size={22}/>},
];
const TESTIMONIALS = [
  {name:"Arif Hossain",role:"Football Coach",avatar:"https://i.pravatar.cc/80?img=11",text:"SportNest made booking our training ground effortless. The real-time slot availability is a game-changer.",stars:5},
  {name:"Priya Sharma",role:"Badminton Player",avatar:"https://i.pravatar.cc/80?img=47",text:"I book my court every weekend through SportNest. Fast, reliable, and the facilities are always top-notch.",stars:5},
  {name:"Tanvir Ahmed",role:"Cricket Club Manager",avatar:"https://i.pravatar.cc/80?img=33",text:"Managing our club bookings is so smooth now. The facility management dashboard is incredibly intuitive.",stars:5},
];

const HomePage = () => {
  const { data: featured, isLoading } = useQuery({
    queryKey: ["featured"],
    queryFn:  () => api.get("/facilities/featured").then(r => r.data.facilities),
  });
  return (
    <div className="home">
      {/* ── HERO — Banner Section ── */}
      <section className="hero">
        <div className="hero-bg"><div className="orb orb1"/><div className="orb orb2"/><div className="grid-overlay"/></div>
        <div className="hero-content">
          <motion.div className="hero-eyebrow" initial={{opacity:0,y:-20}} animate={{opacity:1,y:0}}>
            <span className="eyebrow-dot"/> Bangladesh&apos;s #1 Sports Booking Platform
          </motion.div>
          <motion.h1 className="hero-title" initial={{opacity:0,y:30}} animate={{opacity:1,y:0}} transition={{delay:.1}}>
            FIND YOUR<span className="accent"> ARENA.</span><br/>OWN THE GAME.
          </motion.h1>
          <motion.p className="hero-sub" initial={{opacity:0,y:20}} animate={{opacity:1,y:0}} transition={{delay:.2}}>
            Book premium football turfs, badminton courts, cricket grounds, swimming lanes and more — instantly.
          </motion.p>
          <motion.div className="hero-btns" initial={{opacity:0,y:20}} animate={{opacity:1,y:0}} transition={{delay:.3}}>
            {/* Explore Facilities button */}
            <Link to="/facilities" className="btn-primary">Explore Facilities <ArrowRight size={17}/></Link>
            <Link to="/add-facility" className="btn-ghost">List Your Venue</Link>
          </motion.div>
          <motion.div className="sport-pills" initial={{opacity:0}} animate={{opacity:1}} transition={{delay:.5}}>
            {SPORTS.map(s=>(
              <Link key={s.label} to={`/facilities?type=${s.label}`} className="sport-pill" style={{"--pc":s.color}}>
                {s.emoji} {s.label}
              </Link>
            ))}
          </motion.div>
        </div>
        <motion.div className="hero-scroll" animate={{y:[0,10,0]}} transition={{repeat:Infinity,duration:1.8}}>
          <ChevronDown size={24}/>
        </motion.div>
      </section>

      {/* ── STATS (Extra static section 1) ── */}
      <section className="stats-section">
        <div className="stats-grid">
          {STATS.map((s,i)=>(
            <motion.div key={s.l} className="stat-card"
              initial={{opacity:0,scale:.8}} whileInView={{opacity:1,scale:1}} viewport={{once:true}} transition={{delay:i*.1}}>
              <div className="stat-icon">{s.icon}</div>
              <div className="stat-val">{s.v}</div>
              <div className="stat-lbl">{s.l}</div>
            </motion.div>
          ))}
        </div>
      </section>

      {/* ── FEATURED FACILITIES — Dynamic Section ── */}
      <section className="section">
        <div className="container">
          <motion.div className="sec-header" variants={fadeUp} initial="hidden" whileInView="visible" viewport={{once:true}}>
            <span className="sec-eyebrow">Top Picks</span>
            <h2 className="sec-title">Featured Facilities</h2>
            <p className="sec-desc">Hand-picked premium venues loved by thousands of athletes across Bangladesh.</p>
          </motion.div>
          {isLoading ? <LoadingSpinner full={false}/> : (
            <div className="facilities-grid">
              {(featured||[]).map((f,i)=>(
                <motion.div key={f._id} custom={i} variants={fadeUp} initial="hidden" whileInView="visible" viewport={{once:true}}>
                  <FacilityCard facility={f}/>
                </motion.div>
              ))}
            </div>
          )}
          <div className="sec-cta">
            <Link to="/facilities" className="btn-outline">View All Facilities <ArrowRight size={15}/></Link>
          </div>
        </div>
      </section>

      {/* ── HOW IT WORKS (Extra static section 2) ── */}
      <section className="section bg-alt">
        <div className="container">
          <motion.div className="sec-header" variants={fadeUp} initial="hidden" whileInView="visible" viewport={{once:true}}>
            <span className="sec-eyebrow">Simple Process</span>
            <h2 className="sec-title">Book in 3 Steps</h2>
          </motion.div>
          <div className="steps-grid">
            {[
              {n:"01",icon:"🔍",t:"Find Your Sport",   d:"Browse hundreds of venues filtered by sport, location, and availability."},
              {n:"02",icon:"📅",t:"Pick Your Slot",    d:"Choose a date and time slot — no phone calls needed."},
              {n:"03",icon:"🏆",t:"Play & Win",        d:"Show up, play your best game, and manage everything from your dashboard."},
            ].map((s,i)=>(
              <motion.div key={s.n} className="step-card" custom={i} variants={fadeUp} initial="hidden" whileInView="visible" viewport={{once:true}}>
                <div className="step-num">{s.n}</div>
                <div className="step-emoji">{s.icon}</div>
                <h3 className="step-title">{s.t}</h3>
                <p className="step-desc">{s.d}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* ── TESTIMONIALS (Extra static section 3) ── */}
      <section className="section">
        <div className="container">
          <motion.div className="sec-header" variants={fadeUp} initial="hidden" whileInView="visible" viewport={{once:true}}>
            <span className="sec-eyebrow">Real Athletes</span>
            <h2 className="sec-title">What Players Say</h2>
          </motion.div>
          <div className="testimonials-grid">
            {TESTIMONIALS.map((t,i)=>(
              <motion.div key={t.name} className="testimonial-card" custom={i} variants={fadeUp} initial="hidden" whileInView="visible" viewport={{once:true}}>
                <div className="t-stars">{"★".repeat(t.stars)}</div>
                <p className="t-text">&ldquo;{t.text}&rdquo;</p>
                <div className="t-author">
                  <img src={t.avatar} alt={t.name} className="t-avatar"/>
                  <div><p className="t-name">{t.name}</p><p className="t-role">{t.role}</p></div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* ── CTA BANNER ── */}
      <section className="cta-section">
        <div className="cta-inner">
          <Shield size={48} className="cta-icon"/>
          <h2 className="cta-title">Own a Sports Facility?</h2>
          <p className="cta-desc">List your venue on SportNest and reach thousands of athletes. Start earning more today.</p>
          <Link to="/add-facility" className="btn-primary">List Your Facility <ArrowRight size={17}/></Link>
        </div>
      </section>
    </div>
  );
};
export default HomePage;
