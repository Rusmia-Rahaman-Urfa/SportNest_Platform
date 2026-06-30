import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Calendar, Clock, Zap, AlertTriangle, X } from "lucide-react";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import toast from "react-hot-toast";
import api from "../../utils/axios";
import LoadingSpinner from "../../components/UI/LoadingSpinner";

const STATUS_STYLE = {
  pending:   { bg:"#FFF7ED", color:"#C2410C", dot:"#F97316" },
  confirmed: { bg:"#F0FDF4", color:"#15803D", dot:"#22C55E" },
  cancelled: { bg:"#FEF2F2", color:"#B91C1C", dot:"#EF4444" },
};

const CancelModal = ({ booking, onConfirm, onCancel, loading }) => (
  <div className="modal-overlay" onClick={onCancel}>
    <motion.div className="modal-box" initial={{scale:.8,opacity:0}} animate={{scale:1,opacity:1}} exit={{scale:.8,opacity:0}}
      onClick={e=>e.stopPropagation()}>
      <div className="modal-icon warn"><AlertTriangle size={26}/></div>
      <h3 className="modal-title">Cancel Booking?</h3>
      <p className="modal-desc">Cancel your booking for <strong>{booking.facility_name}</strong> on <strong>{booking.booking_date}</strong>? This cannot be undone.</p>
      <div className="modal-actions">
        <button className="btn-modal-cancel" onClick={onCancel}>Keep It</button>
        <button className="btn-modal-delete" onClick={onConfirm} disabled={loading}>{loading?"Cancelling…":"Yes, Cancel"}</button>
      </div>
    </motion.div>
  </div>
);

const MyBookingsPage = () => {
  const qc = useQueryClient();
  const [cancelTarget, setCancelTarget] = useState(null);
  const [cancelling,   setCancelling]   = useState(false);
  const [filter, setFilter] = useState("all");

  // Show logged-in user bookings
  const { data, isLoading } = useQuery({
    queryKey: ["my-bookings"],
    queryFn:  () => api.get("/bookings/my-bookings").then(r=>r.data.bookings),
  });

  const handleCancel = async () => {
    setCancelling(true);
    try {
      await api.patch(`/bookings/${cancelTarget._id}/cancel`);
      toast.success("Booking cancelled.");
      qc.invalidateQueries(["my-bookings"]);
      setCancelTarget(null);
    } catch (err) { toast.error(err.response?.data?.message||"Failed."); }
    finally { setCancelling(false); }
  };

  const filtered = filter==="all" ? data : data?.filter(b=>b.status===filter);
  const count = (s) => s==="all" ? data?.length||0 : data?.filter(b=>b.status===s).length||0;

  return (
    <div className="page-wrap">
      <div className="page-header">
        <div>
          <motion.h1 className="page-title" initial={{opacity:0,y:20}} animate={{opacity:1,y:0}}>My Bookings</motion.h1>
          <p className="page-sub">{data?.length||0} total · {count("pending")} pending</p>
        </div>
      </div>
      <div className="page-body">
        <div className="booking-filters">
          {["all","pending","confirmed","cancelled"].map(f=>(
            <button key={f} className={`bfilter-btn${filter===f?" active":""}`} onClick={()=>setFilter(f)}>
              {f.charAt(0).toUpperCase()+f.slice(1)}<span className="bfilter-count">{count(f)}</span>
            </button>
          ))}
        </div>

        {isLoading ? <LoadingSpinner full={false}/> : !filtered?.length ? (
          <div className="empty-state">
            <div className="empty-icon">📅</div>
            <h3>No bookings found</h3>
            <p>{filter==="all"?"You haven't booked any facilities yet.":"No "+filter+" bookings."}</p>
          </div>
        ) : (
          <div className="bookings-list">
            {filtered.map((b,i)=>{
              const s = STATUS_STYLE[b.status]||STATUS_STYLE.pending;
              return (
                <motion.div key={b._id} className="booking-card" initial={{opacity:0,x:-20}} animate={{opacity:1,x:0}} transition={{delay:i*.06}}>
                  <div className="bcard-img-wrap">
                    <img src={b.facility_image||"https://images.unsplash.com/photo-1431324155629-1a6deb1dec8d?w=300&q=80"}
                      alt={b.facility_name} className="bcard-img"
                      onError={e=>{e.target.src="https://images.unsplash.com/photo-1431324155629-1a6deb1dec8d?w=300&q=80";}}/>
                  </div>
                  <div className="bcard-body">
                    <div className="bcard-top">
                      {/* Display Facility Name, Booking Date, Time Slot, Price, Status */}
                      <h3 className="bcard-title">{b.facility_name}</h3>
                      <span className="status-badge" style={{background:s.bg,color:s.color}}>
                        <span className="status-dot" style={{background:s.dot}}/>
                        {b.status.charAt(0).toUpperCase()+b.status.slice(1)}
                      </span>
                    </div>
                    <div className="bcard-details">
                      <span><Calendar size={12}/>{b.booking_date}</span>
                      <span><Clock size={12}/>{b.time_slot}</span>
                      <span><Zap size={12}/>{b.hours}h session</span>
                    </div>
                    <div className="bcard-footer">
                      <span className="bcard-total">৳{b.total_price}</span>
                      {/* Action — Cancel Booking */}
                      {b.status!=="cancelled" && (
                        <button className="btn-cancel" onClick={()=>setCancelTarget(b)}><X size={12}/>Cancel</button>
                      )}
                    </div>
                  </div>
                </motion.div>
              );
            })}
          </div>
        )}
      </div>

      <AnimatePresence>
        {cancelTarget && <CancelModal booking={cancelTarget} onConfirm={handleCancel} onCancel={()=>setCancelTarget(null)} loading={cancelling}/>}
      </AnimatePresence>
    </div>
  );
};
export default MyBookingsPage;
