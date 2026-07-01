import { useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { MapPin, Users, Clock, Star, ChevronLeft, Zap, Calendar } from "lucide-react";
import { useQuery } from "@tanstack/react-query";
import toast from "react-hot-toast";
import api from "../../utils/axios";
import { useSession } from "../../lib/auth-client";
import LoadingSpinner from "../../components/UI/LoadingSpinner";

const ALL_SLOTS = [
  "06:00 AM - 07:00 AM","07:00 AM - 08:00 AM","08:00 AM - 09:00 AM","09:00 AM - 10:00 AM",
  "10:00 AM - 11:00 AM","11:00 AM - 12:00 PM","12:00 PM - 01:00 PM","02:00 PM - 03:00 PM",
  "03:00 PM - 04:00 PM","04:00 PM - 05:00 PM","05:00 PM - 06:00 PM","06:00 PM - 07:00 PM",
  "07:00 PM - 08:00 PM","08:00 PM - 09:00 PM",
];

const FacilityDetailPage = () => {
  const { id }                 = useParams();
  const navigate               = useNavigate();
  const { data: session }      = useSession();
  const user                   = session?.user;
  const [bookingDate,setBookingDate] = useState("");
  const [slot,  setSlot]   = useState("");
  const [hours, setHours]  = useState(1);
  const [saving,setSaving] = useState(false);
  const today = new Date().toISOString().split("T")[0];

  const { data: facility, isLoading } = useQuery({
    queryKey: ["facility", id],
    queryFn:  () => api.get(`/facilities/${id}`).then(r => r.data.facility),
  });

  const { data: slotsData } = useQuery({
    queryKey: ["slots", id, bookingDate],
    queryFn:  () => api.get(`/bookings/slots/${id}`, { params:{ date:bookingDate } }).then(r => r.data.bookedSlots),
    enabled:  !!bookingDate,
  });
  const bookedSlots = slotsData || [];
  const totalPrice  = facility ? facility.price_per_hour * hours : 0;

  const handleBook = async (e) => {
    e.preventDefault();
    if (!bookingDate || !slot) { toast.error("Please select a date and time slot."); return; }
    setSaving(true);
    try {
      await api.post("/bookings", { facility_id:id, booking_date:bookingDate, time_slot:slot, hours });
      toast.success("🎉 Booking confirmed! See you on the field.");
      navigate("/my-bookings");
    } catch (err) {
      toast.error(err.response?.data?.message || "Booking failed. Please try again.");
    } finally { setSaving(false); }
  };

  if (isLoading) return <LoadingSpinner/>;
  if (!facility) return <div className="page-wrap"><div className="empty-state"><h3>Facility not found</h3></div></div>;

  return (
    <div className="page-wrap">
      <div className="page-body detail-body">
        <button className="back-btn" onClick={()=>navigate(-1)}><ChevronLeft size={17}/>Back to Facilities</button>

        <div className="detail-layout">
          {/* Left — Facility Info */}
          <motion.div className="detail-info" initial={{opacity:0,x:-20}} animate={{opacity:1,x:0}}>
            <div className="detail-img-wrap">
              <img src={facility.image} alt={facility.name} className="detail-img"
                onError={e=>{e.target.src="https://images.unsplash.com/photo-1431324155629-1a6deb1dec8d?w=800&q=80";}}/>
              <span className="detail-type-badge">{facility.facility_type}</span>
            </div>
            <div className="detail-content">
              <div className="detail-title-row">
                <h1 className="detail-title">{facility.name}</h1>
                <span className="detail-rating"><Star size={15} fill="currentColor"/>{facility.rating?.toFixed(1)||"4.5"}</span>
              </div>
              <div className="detail-meta">
                <span><MapPin size={15}/>{facility.location}</span>
                <span><Users size={15}/>Up to {facility.capacity} players</span>
                <span><Clock size={15}/>{facility.available_slots?.join(", ")||"Multiple slots"}</span>
              </div>
              <div className="detail-price">
                <span className="dp-val">৳{facility.price_per_hour}</span>
                <span className="dp-unit">per hour</span>
              </div>
              <h3 className="detail-sec-title">About This Facility</h3>
              <p className="detail-desc">{facility.description}</p>
              {facility.amenities?.length > 0 && (
                <>
                  <h3 className="detail-sec-title">Amenities</h3>
                  <div className="amenities-list">
                    {facility.amenities.map(a=><span key={a} className="amenity-tag">✓ {a}</span>)}
                  </div>
                </>
              )}
              <p className="owner-line">Managed by <strong>{facility.owner_email}</strong></p>
            </div>
          </motion.div>

          {/* Right — Booking Form */}
          <motion.div className="booking-panel" initial={{opacity:0,x:20}} animate={{opacity:1,x:0}} transition={{delay:.1}}>
            <div className="booking-card">
              <div className="booking-head"><Calendar size={19}/><h2>Book This Facility</h2></div>
              <form onSubmit={handleBook} className="booking-form">
                {/* Facility Name (auto-filled) */}
                <div className="form-group">
                  <label className="form-label">Facility</label>
                  <input className="form-input" value={facility.name} readOnly/>
                </div>
                {/* Booking Date */}
                <div className="form-group">
                  <label className="form-label">Booking Date *</label>
                  <input className="form-input" type="date" min={today}
                    value={bookingDate} onChange={e=>{setBookingDate(e.target.value);setSlot("");}} required/>
                </div>
                {/* Time Slot */}
                <div className="form-group">
                  <label className="form-label">Time Slot *</label>
                  <div className="slots-grid">
                    {ALL_SLOTS.map(s=>{
                      const taken = bookedSlots.includes(s);
                      return (
                        <button key={s} type="button"
                          className={`slot-btn${slot===s?" selected":""}${taken?" taken":""}`}
                          onClick={()=>!taken&&setSlot(s)} disabled={taken}>
                          {s.split(" - ")[0]}
                          {taken && <span className="taken-tag">Taken</span>}
                        </button>
                      );
                    })}
                  </div>
                </div>
                {/* Hours */}
                <div className="form-group">
                  <label className="form-label">Duration (Hours)</label>
                  <div className="hours-ctrl">
                    <button type="button" className="hrs-btn" onClick={()=>setHours(h=>Math.max(1,h-1))}>−</button>
                    <span className="hrs-val">{hours}h</span>
                    <button type="button" className="hrs-btn" onClick={()=>setHours(h=>Math.min(8,h+1))}>+</button>
                  </div>
                </div>
                {/* Total Price */}
                <div className="booking-summary">
                  <span>৳{facility.price_per_hour} × {hours}h</span>
                  <span className="summary-total">৳{totalPrice}</span>
                </div>
                <div className="form-group">
                  <label className="form-label">Your Email</label>
                  <input className="form-input" value={user?.email||""} readOnly/>
                </div>
                <button type="submit" className="btn-book-submit" disabled={saving||!slot||!bookingDate}>
                  {saving?"Confirming…":<><Zap size={15}/>Confirm Booking — ৳{totalPrice}</>}
                </button>
              </form>
            </div>
          </motion.div>
        </div>
      </div>
    </div>
  );
};
export default FacilityDetailPage;
