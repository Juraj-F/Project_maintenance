import { useEffect, useMemo, useState } from "react";
import BOMTable from "@/components/BOMTable";
import StationAssemblies from "@/data/Assemblies";
import PartForm from "@/components/PartForm";
import CancelCaution from "@/components/CancelCaution";
import { useParams } from "react-router-dom";
import { useAuthStore } from "@/stores/authStore";
import { db } from "../db/draftsDB";

const DRAFT_PREFIX = "draft:";

export default function AdminDashboard() {
  const { adminUser } = useParams();
  const user= useAuthStore((s)=>s.user)
  const [hovered, setHovered] = useState(null);
  const [selectedPart, setSelectedPart] = useState(null);
  const [showCancelCaution, setShowCancelCaution] = useState(false);
  const [bomItems, setBomItems] = useState([])

  
  // tracks ALL sent drafts to live Db(reactive)
  const [sentIssuesToLiveDb, setSentIssuesToLiveDb] = useState(() => new Set());

  // tracks ALL sent drafts to offline Db(reactive)
  const [DataDexie, setDataDexie] = useState(() => new Set())
   
  // tracks ALL locally saved drafts (reactive)
  const [savedDrafts, setSavedDrafts] = useState(() => {
   const draftIds = new Set();
   Object.keys(localStorage).forEach((key) => {
     if (key.startsWith("draft:")){
      draftIds.add(key.slice("draft:".length));}
   });
  return draftIds
 })

  // decides which cancel popup to show
  const [cancelMode, setCancelMode] = useState(null);   // null | "confirm" | "no-data"
  
  // using zustand to load user
  const userAdmin=user?.user?.role
  const canExport=userAdmin==="admin"



// gathering all sent issues IDs from live DB
// if online db unreachable 
// gathering all sent issues IDs from offline DB
useEffect(() => {
  (async () => {
    try {
      const res = await fetch(`${API_URL}/api/issues/allforms`);
      const data = await res.json();

      if (!res.ok || data?.ok !== true || !Array.isArray(data?.issues)) {
        throw new Error(data.error || "failed to load data");
      } 
      const liveDbSent= new Set(data.issues.map((item) => 
        String(item.partid)
      ))
      setSentIssuesToLiveDb(liveDbSent);
    } catch (err) {
      console.error("error loading the issues", err);
        try{
      const drafts=(await db.drafts.toArray())
      const dexieSent = new Set( drafts.map(item => String(item.partId)
      ))
      setDataDexie(dexieSent)
      
      } catch (err){ 
      console.error("Dexie error:", err)
      // reset on error
      // setSentIssuesToLiveDb(new Set())
      // setDataDexie(new Set());   
      } 
    }
  })();
}, []);

  
// gathering BOMtable data
  useEffect(()=>{ 
    const loadDrafts = async () => {
      const drafts=await db.drafts.toArray()
    setBomItems(drafts)}
  loadDrafts(); 
},[adminUser]);


const assys = useMemo(()=>{ 

  const assemblyMap=Object.fromEntries(
  Object.values(StationAssemblies).flat().map((item)=> [item.id, item])
);
console.log("bomitems", bomItems)

return bomItems.map((item)=> {
  const assembly = assemblyMap[item.partId];

  console.log("assembly label", assembly.label)
   console.log("partId", item.partId)

  return{
    rowId: item.partId,
    partId: item.partId,
    name: assembly.label,
    qty: assembly?.qty || "0",
    criticality: item.criticality || "-",
    status: item.status || "-",
    submittedAt: item.submittedAt || null,
  }
})
},[bomItems])

console.log("data from bomItems" ,assys)

  // Row click handler
  const clicked = (itemid) => {
    setSelectedPart(itemid);
    setShowCancelCaution(false);
    setCancelMode(null);
  };

  const handleDelete = async (itemid) =>{
    const idData = await db.drafts.get(itemid)
    if(!idData) return console.log("No records for this ID");
    if(idData.status==="deleted") 
      return console.log("Status already set to deleted for this ID");
    await db.drafts.update(itemid, {
      status:"deleted",
      deletedAt: Date.now(),
      deletedBy:user.user.email
    })
    // state update
    setBomItems((prev)=>
    prev.map((item)=>
      item.partId===itemid ? {...item, status:"deleted"} : item
  
  ))
  }

    const handleRecall = async (itemid) =>{
    const idData = await db.drafts.get(itemid)
    if(!idData) return console.log("No records for this ID");
    if(idData.status!=="deleted") 
      return console.log("This ID was not deleted so it can't be recalled");
    await db.drafts.update(itemid, {
      status:"open",
      recalledAt: Date.now(),
      recalledBy:user.user.email
    })
    // state update
    setBomItems((prev)=>
    prev.map((item)=>
      item.partId===itemid ? {...item, status:"open"} : item
  
  ))
  }

// -----------------------------      START     -----------------------------
// ----------------------------- TO BE IMPLEMENTED -----------------------------

      const handleReopen = async (itemid) =>{
    const idData = await db.drafts.get(itemid)
    if(!idData) return console.log("No records for this ID");
    if(idData.status==="deleted" || idData==="open") 
      return console.log("Status already set to open or deleted for this ID");
    await db.drafts.update(itemid, {
      status:"open",
      deletedAt: Date.now(),
      deletedBy:user.user.email
    })
    // state update
    setBomItems((prev)=>
    prev.map((item)=>
      item.partId===itemid ? {...item, status:"open"} : item
  
  ))
  }

    const handleClose = async (itemid) =>{
    const idData = await db.drafts.get(itemid)
    if(!idData) return console.log("No records for this ID");
    if(idData.status==="close" || idData.status==="delete") 
      return console.log("Status already set to close or deleted for this ID");
    await db.drafts.update(itemid, {
      status:"close",
      deletedAt: Date.now(),
      deletedBy:user.user.email
    })
    // state update
    setBomItems((prev)=>
    prev.map((item)=>
      item.partId===itemid ? {...item, status:"close"} : item
  
  ))
  }

  // -----------------------------      END     -----------------------------
// ----------------------------- TO BE IMPLEMENTED -----------------------------


console.log("bomItems from admin page ASSYS",assys)

  // Cancel button pressed inside PartForm
  // Decide WHICH popup to show immediately
  // const handleCancel = () => {
  //   if (!selectedPart) return;

  //   const key = `${DRAFT_PREFIX}${String(selectedPart)}`;
  //   const hasDraftNow = localStorage.getItem(key) !== null;

  //   setCancelMode(hasDraftNow ? "confirm" : "no-data");
  //   setShowCancelCaution(true);
  // };


  // User CONFIRMS deletion
  // const handleCautionYes = async () => {
  //   if (selectedPart) {
  //     const id = String(selectedPart);
  //     const key = `${DRAFT_PREFIX}${id}`;

  //     if (localStorage.getItem(key)) {
  //       localStorage.removeItem(key);

  //       // Update Set so UI updates instantly
  //       setSavedDrafts((prev) => {
  //         const next = new Set(prev);
  //         next.delete(id);
  //         return next;
  //       });
  //     }
  //   }

  //   setSelectedPart(null);
  //   setShowCancelCaution(false);
  //   setCancelMode(null);
  // };

  // User closes popup
  // const handleCautionNo = () => {
  //   setShowCancelCaution(false);
  //   setCancelMode(null);
  // };

  return (
    <div className="flex flex-col min-w-0 gap-6 mt-9 mx-9 w-full h-full">
      {/* 3D model window and BOM table*/}
      <div className="flex w-full flex-col lg:flex-row gap-6">

        <div className="flex flex-1 h-full w-full">
          <BOMTable
            DataDexie={DataDexie}
            sentIssuesToLiveDb={sentIssuesToLiveDb}
            selectedId={selectedPart}
            hoveredId={hovered}
            onRowHover={setHovered}
            items={assys}
            partForm={clicked}
            savedDrafts={savedDrafts}
            isAdmin={adminUser}
            onDelete={handleDelete}
            onRecall={handleRecall}
          />
        </div>
      </div>

      {/*PART FORM*/}
      {selectedPart !== null && (
        <div className="relative max-w-180">
          <PartForm
            partId={selectedPart}
            onCancel={handleCancel}
            exportEnabled={canExport}
             onPendingSaved={(pid) => {
    setDataDexie(prev => {
      const next = new Set(prev);
      next.add(String(pid));
      return next;
    });
  }}
            onDraftSaved={(id) => {
              // ⭐ Update Set immediately when user presses SAVE
              setSavedDrafts((prev) => {
                const next = new Set(prev);
                next.add(String(id));
                return next;
              });
            }}
            onSentIssuesToLiveDb={(id) => {
              // ⭐ Update Set immediately when user presses SAVE
              setSentIssuesToLiveDb((prev) => {
                const next = new Set(prev);
                next.add(String(id));
                return next;})}}
          />

          {/*CANCEL OVERLAY*/}
          {showCancelCaution && (
            <div className="absolute inset-0 z-50 flex items-center justify-center">
              <div
                className="absolute inset-0 bg-black/50"
                onClick={handleCautionNo}
              />

              <div className="relative z-10">
                {cancelMode === "confirm" && (
                  <CancelCaution
                    onYes={handleCautionYes}
                    onNo={handleCautionNo}
                  />
                )}

                {cancelMode === "no-data" && (
                  <div className="bg-slate-800 text-white px-5 py-3 rounded-md shadow-lg">
                    No data to remove from storage
                  </div>
                )}
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
}