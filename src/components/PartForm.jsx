import { useEffect, useState } from "react";
import { db } from "../db/draftsDB";
import { useAuthStore } from "../stores/authStore";
import { useParams } from "react-router-dom";
import { API_URL } from "../lib/api";


export default function PartForm({ partId, onCancel, onDraftSaved, onSentIssues, exportEnabled, onPendingSaved }) {
  const user= useAuthStore((s)=>s.user)
  const emptyForm = { email: user?.user?.email, criticality: "", description: "" };
  const [form, setForm] = useState(emptyForm);
  const [dataFromDb, setDataFromDb] = useState(false);
  const storageKey = partId ? `draft:${String(partId)}` : null;
  const {id}=useParams()
  const [hasLocalDraft, setHasLocalDraft] = useState(false);

  const isFormIncomplete =
    !form.criticality || !form.description?.trim();

  const isSubmitDisabled = dataFromDb || !hasLocalDraft || isFormIncomplete


useEffect(() => {
  setForm((prev) => ({
    ...prev,
    email: prev.email || user?.user?.email || "",
  }));
}, [user]);

useEffect(() => {
  if (!storageKey) return;
  setHasLocalDraft(!!localStorage.getItem(storageKey));
}, [storageKey]);


useEffect(() => {
  if (!partId) return;

    // Checking the localStorage for data after PartForm is 
    // activated by selecting the partId if successful draft 
    // was just saved into a localStorage, not sent

  const load = async () => {
    //  localStorage draft
    const raw = localStorage.getItem(storageKey);
    
    if (raw) {

      try {
        const parsed = JSON.parse(raw);
        setForm({
          email: parsed.email ?? "",
          criticality: parsed.criticality ?? "",
          description: parsed.description ?? "",
        });
        setDataFromDb(false);
        return;
      } catch (e) {
        localStorage.removeItem(storageKey);

      }
    }

    //  try online issues
    try {
      const res = await fetch(`${API_URL}/api/issues/forms?stationId=${id}`);
      const data = await res.json();
      if (!res.ok || !data.ok) throw new Error();

      const issue = data.issues.find((x) => String(x.partid) === String(partId));
      if (issue) {
        setForm({
          email: issue.email ?? "",
          criticality: issue.criticality ?? "",
          description: issue.description ?? "",
        });
        setDataFromDb(true);
        return;
      }
    } catch {
      // ignore and fallback to Dexie
    }

    //  Dexie fallback
    const dexieData = await db.drafts.get(String(partId));
    if (dexieData) {
      setForm(dexieData);
      setDataFromDb(true);
    } else {
      setForm(emptyForm);
      setDataFromDb(false);
    }
  };

  load();
}, [partId, id]);


  //handler for draft creation or edit 
  function handleChange(e) {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  }

  // saving draft into localStorage
  function saveFormData(e) {
    e.preventDefault();
    e.stopPropagation();
    if (!partId) return;

    const payload = {
      partId: String(partId),
      ...form,
      savedAt: Date.now(),
    };

    localStorage.setItem(storageKey, JSON.stringify(payload));
    setHasLocalDraft(true)
    onDraftSaved?.(partId);
    console.log("Draft saved to localStorage", payload);
  }

  // user submit the issue 
  // fetch API issues to send data body
  async function submitIssue(e) {
    e.preventDefault();
    e.stopPropagation();
    if (!partId) return;
    if (!user) throw new Error("Not logged in");

try {
  // sending the data to the online database 
    const res = await fetch(`${API_URL}/api/issues`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        stationId: id,
        partId,
        email: user?.user?.email?? user?.state?.user?.user?.email,
        criticality: form.criticality,
        description: form.description,
        userid: user?.user?.id?? user?.state?.user?.user?.id,
      }),
    });

    const data = await res.json().catch(() => ({}));
    if (!res.ok || data.ok===false) {
      throw new Error(data.error || `Submit failed (HTTP ${res.status})`)
    }
    onSentIssues?.(partId)
    localStorage.removeItem(storageKey);
    setHasLocalDraft(false)
    setDataFromDb(true)
    console.log("Submitted to server");
    return data.issue ?? data;

  } catch {

    // if response is not OK the draft is sent to the offline 
    // dexie database through catch
    await db.drafts.put({
      partId: String(partId),
      ...form,
      submittedAt: Date.now(),
      submittedBy: user.user.email,
      status: "open"
    });
    onPendingSaved?.(partId)
    setHasLocalDraft(false)
    localStorage.removeItem(storageKey)
    console.log("Submitted to Dexie");
    setDataFromDb(true)
    return null;
  }}

  // export button handler
  async function draftExport(e) {
    e.preventDefault();
    e.stopPropagation();
    const drafts = await db.drafts.toArray();
        if(drafts.length===0)
      {console.log("no draft to export")
        return false
      }

try{
    const res = await fetch(`${API_URL}/api/drafts/export`, {
      method: "POST",
      headers: { "Content-Type": "application/json", "x-role": user?.user?.role || "" },
      body: JSON.stringify({ drafts }),
    });
    
    const data = await res.json().catch(() => ({}));

    if (!res.ok || data.ok === false) {
      throw new Error(data.error || `Export failed (HTTP ${res.status})`);
    }
    return true;
  
  } catch (err) {
    console.error("Export failed:", err);
    return false;
  }
  }

  
  return (
    <div className="bg-slate-900 text-amber-50 h-118 rounded-md overflow-hidden flex flex-col">
      <div className="rounded-t-2xl pt-5 px-8 w-full overflow-auto">
        <div className="flex justify-center font-semibold gap-3 border-b pb-2 mb-2">
          <div className="text-center">Assembly: </div>
          <div>{partId}</div>
        </div>
      </div>

      <div className="flex-1 pt-5 px-8 overflow-auto w-full">
        <form className="flex flex-col gap-2">
          <label className="flex">Fill in your email address</label>
          <textarea
            name="email"
            disabled
            value={form.email}
            onChange={handleChange}
            className="bg-slate-700/50 text-slate-400 border-2 w-full h-7"
            placeholder="write something"
          />

          <label className="flex">Choose criticality</label>
          <select
            name="criticality"
            value={form.criticality}
            disabled={dataFromDb}
            onChange={handleChange}
            className={`${dataFromDb ? "bg-slate-700/50 text-slate-400" : "bg-white"} border-2 w-full h-8 text-black px-2 rounded`}
          >
            <option value="">-- Select criticality --</option>
            <option value="low">Low</option>
            <option value="medium">Medium</option>
            <option value="high">High</option>
          </select>

          <label className="flex">Describe the problem</label>
          <textarea
            name="description"
            value={form.description}
            disabled={dataFromDb}
            onChange={handleChange}
            className={`${dataFromDb ? "bg-slate-700/50 text-slate-400" : "bg-white"} text-start text-cyan-900 border-2 w-full h-40`}
            placeholder="write something"
          />
        </form>
      </div>

      <div className="flex pt-5 pb-5 px-8 justify-between">
        <button 
        disabled={dataFromDb} 
        type="button" 
        className={`${dataFromDb ? "bg-slate-700/50 text-slate-400" : "text-amber-400 bg-slate-700 hover:bg-amber-800/80"} w-30 h-10 font-bold rounded-md`} 
        onClick={onCancel}>
          CANCEL
        </button>

        <button 
        disabled={dataFromDb} 
        type="button" 
        className={`${dataFromDb ? "bg-slate-700/50 text-slate-400" : "text-amber-400 bg-slate-700 hover:bg-amber-800/80"} w-30 h-10 font-bold rounded-md`} 
        onClick={saveFormData}>
          SAVE
        </button>

        <button 
        disabled={isSubmitDisabled} 
        type="button" 
        className={`${isSubmitDisabled? "bg-slate-700/50 text-slate-400" : "text-amber-400 bg-slate-700 hover:bg-amber-800/80"} w-30 h-10 font-bold rounded-md`} 
        onClick={submitIssue}>
          SUBMIT
        </button>

        <button
        disabled={!exportEnabled}
        type="button" 
        className={`${!exportEnabled? "bg-slate-700/50 text-slate-400":"text-amber-400 bg-slate-700 hover:bg-amber-800/80" } w-30  h-10 font-bold rounded-md`} 
        onClick={draftExport}>
          EXPORT
        </button>
      </div>
    </div>
  );
}