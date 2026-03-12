import { useEffect, useMemo, useState } from "react";
import BOMTable from "@/components/BOMTable";
import StationData from "@/three/StationData";
import StationAssemblies from "@/data/Assemblies";
import PartForm from "@/components/PartForm";
import CancelCaution from "@/components/CancelCaution";
import { useParams } from "react-router-dom";
import { useAuthStore } from "@/stores/authStore";
import { db } from "../db/draftsDB";

const DRAFT_PREFIX = "draft:";

export default function StationPage() {
  const { id } = useParams();
  const user= useAuthStore((s)=>s.user)
  const [hovered, setHovered] = useState(null);
  const [selectedPart, setSelectedPart] = useState(null);
  const [showCancelCaution, setShowCancelCaution] = useState(false);
  
  // tracks ALL sent drafts to live Db(reactive)
  const [sentIssuesToLiveDb, setSentIssuesToLiveDb] = useState(() => new Set());

  // tracks ALL sent drafts to offline Db(reactive)
  const [sentIssuesToDexie, setSentIssuesToDexie] = useState(() => new Set())
   
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



// gathering all sent issues from live DB
// if online db unreachable 
// gathering all sent issues from offline DB
useEffect(() => {
  (async () => {
    try {
      const res = await fetch(`${API_URL}/api/issues/forms?stationId=${id}`);
      const data = await res.json();

      if (!res.ok || data?.ok !== true || !Array.isArray(data?.issues)) {
        throw new Error(data.error || "failed to load data");
      } 


      const liveDbSent= new Set(data.issues.map((item) => String(item.partid)))
      setSentIssuesToLiveDb(liveDbSent);
    } catch (err) {
      console.error("error loading the issues", err);
        try{
      const drafts=(await db.drafts.toArray())

      const dexieSent = new Set( drafts.map(item => {
        const statusOpen=item.status
        if(statusOpen!=="open") return;
        return String(item.partId);
      }))

      setSentIssuesToDexie(dexieSent)

      } catch (err){ 
      console.error("Dexie error:", err)
      // reset on error
      setSentIssuesToLiveDb(new Set())
      setSentIssuesToDexie(new Set());
      } 
    }
  })();
}, [id]);
  
// gathering BOMtable data
  const Assemblies = StationAssemblies[id] ?? [];
  const BOMitems = useMemo(
    () => Assemblies.map(({ id, Model, qty }) => ({
        id,
        Model,
        qty,
      })),
    [id]
  );

  // Row click handler
  const clicked = (itemid) => {
    setSelectedPart(itemid);
    setShowCancelCaution(false);
    setCancelMode(null);
  };

  // Cancel button pressed inside PartForm
  // Decide WHICH popup to show immediately
  const handleCancel = () => {
    if (!selectedPart) return;

    const key = `${DRAFT_PREFIX}${String(selectedPart)}`;
    const hasDraftNow = localStorage.getItem(key) !== null;

    setCancelMode(hasDraftNow ? "confirm" : "no-data");
    setShowCancelCaution(true);
  };


  // User CONFIRMS deletion
  const handleCautionYes = async () => {
    if (selectedPart) {
      const id = String(selectedPart);
      const key = `${DRAFT_PREFIX}${id}`;

      if (localStorage.getItem(key)) {
        localStorage.removeItem(key);

        // Update Set so UI updates instantly
        setSavedDrafts((prev) => {
          const next = new Set(prev);
          next.delete(id);
          return next;
        });
      }
    }

    setSelectedPart(null);
    setShowCancelCaution(false);
    setCancelMode(null);
  };

  // User closes popup
  const handleCautionNo = () => {
    setShowCancelCaution(false);
    setCancelMode(null);
  };

  return (
    <div className="flex flex-col min-w-0 gap-6 mt-9 mx-9 w-full h-full">
      {/* 3D model window and BOM table*/}
      <div className="flex w-full flex-col lg:flex-row gap-6">
        <div className="flex flex-1 w-full min-h-120 min-w-0">
          <StationData
            selectedId={selectedPart}
            setSelectedId={setSelectedPart}
            items={BOMitems}
            partForm={clicked}
            setHoverId={setHovered}
          />
        </div>

        <div className="flex flex-1 h-full w-full">
          <BOMTable
            sentIssuesToDexie={sentIssuesToDexie}
            sentIssuesToLiveDb={sentIssuesToLiveDb}
            selectedId={selectedPart}
            hoveredId={hovered}
            onRowHover={setHovered}
            items={BOMitems}
            partForm={clicked}
            savedDrafts={savedDrafts}
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
    setSentIssuesToDexie(prev => {
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