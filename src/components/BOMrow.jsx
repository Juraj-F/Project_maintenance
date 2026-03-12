
export default function BOMrow({
  itemNo = "1",
  itemName = "Bracket",
  itemQty = "4",
  className = "",
  isHovered,
  mouseOut,
  mouseOver,
  partCall,
  draftSaved,
  issuesSentToLiveDb,
  issuesSentToDexieDb,
  isAdmin,
  itemStatus,
  itemDate,
  deleteClicked,
  recallClicked
}) {


  // console.log("itemsToUse", itemsToUse)

    const adminLogged = isAdmin === "admin";
    const isStatusOpen = itemStatus === "open";
    const isStatusDeleted = itemStatus === "deleted";
    const recall = isStatusDeleted ? "Recall" : "Delete";
    const switching = isStatusDeleted ? recallClicked : deleteClicked;
    // const switchingDate= isStatusDeleted ? 

    const status = issuesSentToLiveDb
  ? "sent"
  : issuesSentToDexieDb
  ? "pending"
  : draftSaved
  ? "draft"
  : "none";
  

  return (
    <>
     {adminLogged? 
      ( <div
      onMouseEnter={mouseOver}
      onMouseLeave={mouseOut}
      onClick={partCall}
      className={`${isHovered ? "bg-yellow-500/20" : ""}  font-semibold border-b pb-2 mb-2 ${className}`}
    >
      <div id="adminItemNo" className="">{itemNo}</div>
      <div id="adminItemName" className="text-left">{String(itemName)}</div>
      <div className="flex justify-center">
      <div id="adminItemStatus" className={`${isStatusOpen ? "bg-yellow-500/10" : "bg-blue-900 "} rounded-xl w-20`}>{itemStatus}</div>
      </div>
      <div id="adminItemDate">{itemDate}</div>
      <div>
      <button id="adminItemDelete" className={ `rounded-xl w-20 bg-blue-500` } 
      onClick={(e)=>{
        e.stopPropagation();
        switching?.()}}>{recall}</button>
      </div>
    </div>
      ) 
      
      : 
      
      (<div
      onMouseEnter={mouseOver}
      onMouseLeave={mouseOut}
      onClick={partCall}
      className={`${isHovered ? "bg-yellow-500/20" : ""}  font-semibold border-b pb-2 mb-2 ${className}`}
    >
     
      <div id="itemnumber" >{itemNo}</div>
      <div id="itemname" className="text-left" >{itemName}</div>
      <div id="itemquantity">{itemQty}</div>

      {/* dot signals draft has been saved */}
      <div className="flex justify-center items-center">
        {status === "draft" && <div className="bg-blue-400 w-3 h-3 rounded-full" />}
      </div>

      {/* dot signals draft has been sent to Dexie and is in pending */}
      <div className="flex justify-center items-center">
        {status === "pending" && <div className="bg-purple-400 w-3 h-3 rounded-full" />}
      </div>

      {/* dot signals draft has been sent */}
      <div className="flex justify-center items-center">
        {status === "sent" && <div className="bg-amber-400 w-3 h-3 rounded-full" />}
      </div>
    </div>
)}
    
</>

  );
}
