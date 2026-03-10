
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
  itemDate
}) {


    const adminLogged=isAdmin==="admin"
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
     
      <div id="adminItemNo">{itemNo}</div>
      <div id="adminItemName" className="text-left">{itemNo}</div>
      <div id="adminItemStatus">{itemStatus}</div>
      <div id="adminItemDate">{itemDate}</div>
      <div id="adminItemDelete">Delete</div>

      {/* dot signals draft has been saved */}
      {/* <div className="flex justify-center items-center">
        {status === "draft" && <div className="bg-blue-400 w-3 h-3 rounded-full" />}
      </div> */}

      {/* dot signals draft has been sent to Dexie and is in pending */}
      {/* <div className="flex justify-center items-center">
        {status === "pending" && <div className="bg-purple-400 w-3 h-3 rounded-full" />}
      </div> */}

      {/* dot signals draft has been sent */}
      {/* <div className="flex justify-center items-center">
        {status === "sent" && <div className="bg-amber-400 w-3 h-3 rounded-full" />}
      </div> */}
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
