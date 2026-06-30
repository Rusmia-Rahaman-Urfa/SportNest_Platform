const LoadingSpinner = ({ full = true }) => {
  if (!full) return (
    <div style={{ display:"flex", justifyContent:"center", padding:"60px 0" }}>
      <div className="spin-ring" />
    </div>
  );
  return (
    <div className="loading-full">
      <div className="loading-brand">⚡ SportNest</div>
      <div className="spin-ring large" />
      <p className="loading-text">Loading your arena…</p>
    </div>
  );
};
export default LoadingSpinner;
