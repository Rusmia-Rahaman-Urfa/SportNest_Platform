import { useState, useEffect } from "react";
import { useSearchParams } from "react-router-dom";
import { motion } from "framer-motion";
import { Search, SlidersHorizontal, X } from "lucide-react";
import { useQuery } from "@tanstack/react-query";
import api from "../../utils/axios";
import FacilityCard from "../../components/Cards/FacilityCard";
import LoadingSpinner from "../../components/UI/LoadingSpinner";

const TYPES = ["All","Football","Cricket","Basketball","Badminton","Tennis","Swimming","Volleyball","Table Tennis","Boxing","Gym"];

const AllFacilitiesPage = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const [search,     setSearch]     = useState(searchParams.get("search") || "");
  const [type,       setType]       = useState(searchParams.get("type")   || "All");
  const [page,       setPage]       = useState(1);
  const [debSearch,  setDebSearch]  = useState(search);

  // Debounce search that triggers $regex on server
  useEffect(() => {
    const t = setTimeout(() => setDebSearch(search), 400);
    return () => clearTimeout(t);
  }, [search]);

  useEffect(() => {
    setPage(1);
    const p = {};
    if (debSearch)     p.search = debSearch;
    if (type !== "All") p.type  = type;
    setSearchParams(p);
  }, [debSearch, type]);

  const { data, isLoading, isFetching } = useQuery({
    queryKey: ["facilities", debSearch, type, page],
    queryFn:  () => api.get("/facilities", {
      params: { search: debSearch||undefined, type: type!=="All"?type:undefined, page, limit:9 },
    }).then(r => r.data),
    keepPreviousData: true,
  });

  const clear = () => { setSearch(""); setType("All"); };

  return (
    <div className="page-wrap">
      <div className="page-header">
        <div>
          <motion.h1 className="page-title" initial={{opacity:0,y:20}} animate={{opacity:1,y:0}}>All Facilities</motion.h1>
          <p className="page-sub">{data?.total ?? "—"} venues available across Bangladesh</p>
        </div>
      </div>
      <div className="page-body">
        {/* Search & Filter Bar */}
        <div className="filter-bar">
          <div className="search-box">
            <Search size={15} className="search-ico"/>
            <input className="search-inp" placeholder="Search by name or location…"
              value={search} onChange={e => setSearch(e.target.value)}/>
            {search && <button className="search-clear" onClick={()=>setSearch("")}><X size={13}/></button>}
          </div>
          <div className="filter-label"><SlidersHorizontal size={14}/><span>Filter:</span></div>
          <div className="type-chips">
            {TYPES.map(t => (
              <button key={t} className={`chip${type===t?" active":""}`} onClick={()=>setType(t)}>{t}</button>
            ))}
          </div>
          {(search || type !== "All") && (
            <button className="clear-btn" onClick={clear}><X size={13}/>Clear</button>
          )}
        </div>

        {isLoading ? <LoadingSpinner full={false}/> : !data?.facilities?.length ? (
          <div className="empty-state">
            <div className="empty-icon">🏟️</div>
            <h3>No facilities found</h3>
            <p>Try adjusting your search or filter.</p>
            <button className="btn-outline" onClick={clear}>Clear Filters</button>
          </div>
        ) : (
          <>
            <div className={`facilities-grid${isFetching?" fading":""}`}>
              {data.facilities.map((f,i) => (
                <motion.div key={f._id} initial={{opacity:0,y:20}} animate={{opacity:1,y:0}} transition={{delay:i*.05}}>
                  <FacilityCard facility={f}/>
                </motion.div>
              ))}
            </div>
            {data.totalPages > 1 && (
              <div className="pagination">
                <button className="page-btn" disabled={page===1} onClick={()=>setPage(p=>p-1)}>← Prev</button>
                {Array.from({length:data.totalPages},(_,i)=>i+1).map(p=>(
                  <button key={p} className={`page-btn${p===page?" active":""}`} onClick={()=>setPage(p)}>{p}</button>
                ))}
                <button className="page-btn" disabled={page===data.totalPages} onClick={()=>setPage(p=>p+1)}>Next →</button>
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
};
export default AllFacilitiesPage;
