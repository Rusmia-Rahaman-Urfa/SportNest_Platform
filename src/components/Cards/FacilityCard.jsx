import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { MapPin, Users, Star, Zap, Clock } from "lucide-react";
import { useSession } from "../../lib/auth-client";

const EMOJI = {
  Football:"⚽", Cricket:"🏏", Basketball:"🏀", Badminton:"🏸",
  Tennis:"🎾", Swimming:"🏊", Volleyball:"🏐", "Table Tennis":"🏓",
  Boxing:"🥊", Gym:"💪",
};

const FacilityCard = ({ facility }) => {
  const { data: session } = useSession();
  const navigate = useNavigate();

  const handleBook = () => {
    if (!session) navigate("/login", { state: { from: `/facility/${facility._id}` } });
    else          navigate(`/facility/${facility._id}`);
  };

  return (
    <motion.div className="facility-card" whileHover={{ y:-6 }} transition={{ duration:.25 }}>
      <div className="card-img-wrap">
        <img src={facility.image} alt={facility.name} className="card-img" loading="lazy"
          onError={e => { e.target.src = "https://images.unsplash.com/photo-1431324155629-1a6deb1dec8d?w=600&q=80"; }}/>
        <span className="card-type-badge">{EMOJI[facility.facility_type]||"🏟️"} {facility.facility_type}</span>
        <span className="card-rating"><Star size={11} fill="currentColor"/> {facility.rating?.toFixed(1)||"4.5"}</span>
      </div>
      <div className="card-body">
        <h3 className="card-title">{facility.name}</h3>
        <div className="card-meta">
          <span><MapPin size={12}/>{facility.location}</span>
          <span><Users size={12}/>{facility.capacity} players</span>
        </div>
        {facility.available_slots?.length > 0 && (
          <div className="card-slots">
            <Clock size={11}/>
            <span>{facility.available_slots.slice(0,2).join(" · ")}{facility.available_slots.length > 2 ? " …" : ""}</span>
          </div>
        )}
        <div className="card-footer">
          <div className="card-price">
            <span className="price-val">৳{facility.price_per_hour}</span>
            <span className="price-unit">/hr</span>
          </div>
          <button className="btn-book" onClick={handleBook}><Zap size={13}/>Book Now</button>
        </div>
      </div>
    </motion.div>
  );
};
export default FacilityCard;
