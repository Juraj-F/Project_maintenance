export default function CancelCaution({onYes, onNo}){
    return( <div 
    className="relative flex items-center flex-col text-center rounded-2xl w-80 h-50 bg-blue-950/50 text-amber-50">
      <div className="absolute top-3">
      <div className=" flex items-center w-70 h-20 rounded-2xl bg-blue-950">Canceling the form will erase all data from the form. Press YES or NO</div>
      </div>

      <div className="absolute bottom-6 flex gap-2">
      <button onClick={onYes} className="hover:bg-blue-900 w-20 h-9 my-2 rounded-2xl bg-blue-950">YES</button>
      
      <button onClick={onNo} className="hover:bg-blue-900 w-20 my-2 h-9 rounded-2xl bg-blue-950">NO</button>
      </div>
      
      </div>)}