import BOMrow from "./BOMrow";

export default function BOMTable({items, selectedId, savedDrafts, sentIssuesToLiveDb, sentIssuesToDexie, hoveredId, onRowHover, partForm, className=""}){

    return(
      <div className="overflow-hidden w-full">
      <div className={`bg-slate-700/90 rounded-xl pt-5 px-8 h-full w-full ${className} border-2`}>
      {/* Header */}
      <div className="grid grid-cols-6 font-semibold border-b pb-2 mb-2 w-full text-center">
        <div>Part No</div>
        <div className="text-left">Name</div>
        <div>Qty</div>
        <div>Saved</div>
        <div>Pending</div>
        <div>Sent</div>
      </div>
      
      {/* Items */}
      
      {items.map((item)=>{
        return(<BOMrow
        className={`${selectedId===item.id ? "bg-yellow-500/20" : ""} grid grid-cols-6 font-semibold border-b pb-2 mb-2 w-full text-center`}
        key={item.id}
        itemNo={item.id}
        itemName={item.Model.name.toString()}
        itemQty={item.qty}
        isHovered={hoveredId===item.id}
        mouseOver={()=>onRowHover?.(item.id)}
        mouseOut={()=>onRowHover?.(null)}
        partCall={()=>partForm?.(item.id)}
        draftSaved={savedDrafts.has(String(item.id))}
        issuesSentToLiveDb={sentIssuesToLiveDb.has(String(item.id))}
        issuesSentToDexieDb={sentIssuesToDexie.has(String(item.id))}
        />)})
        }
        </div>
        </div>
    )
}