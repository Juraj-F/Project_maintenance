
export default function Card({
  title = "Station",
  img="/missing.jpg",
  device=" ",
  className = "",
  clicked,
  showOpenButton=true,
  lockedReason
}) {
  return (
    <div
      className={[
        "w-120 h-100 rounded-3xl",
        "bg-white/90 text-slate-900",
        "border border-slate-200/80",
        "shadow-lg shadow-black/10",
        "backdrop-blur",
        "transition-all duration-100",
        "hover:-translate-y-4 hover:shadow-xl hover:shadow-black/15",
        "hover:ring-8 hover:ring-amber-400/60",
        className,
      ].join(" ")}
    >
      {/* header */}
      <div className="p-5 h-full flex flex-col  justify-center">
        {/* header row */}
        <div className="grid grid-cols-[1fr_auto_1fr] items-start">
          {/* left spacer */}
          <div />

          {/* middle text */}
          <div className="text-center">
            <div className="text-2xl font-extrabold tracking-wide text-slate-900">
              {title}
            </div>
            <div className="mt-1 text-lg text-slate-500">{device}</div>
          </div>

          {/* right pill */}
          {/* <div className="flex justify-end">
            <button className="rounded-full border border-amber-200 bg-amber-50 px-3 py-1 text-xl font-medium text-amber-800">
              {status}
            </button>
          </div> */}
        </div>
  
        
        <div className="flex flex-col items-center">
        {/* divider */}
        <div className="flex flex-1 max-h-px mt-4 h-px w-70 bg-slate-200/70 border-slate-900 border-2" />

        {/* body */}
        <div className="mt-4 flex flex-col gap-3 flex-1">

        {/* image */}
          <div className="flex-row self-center gap-3">
          <div className="h-50 w-70 flex justify-center rounded-2xl border border-slate-400 bg-white px-4 py-3">
           <img className="h-45 w-80"  src={img} alt="station image" />
          </div>
          </div>
    
        </div>
        </div>

        {/* Open station button */}
        {showOpenButton ? (
        <div className="grid grid-cols-1 mt-auto pt-4">
        <button onClick={clicked}  className="rounded-2xl border border-slate-200 hover:bg-amber-300  bg-white px-4 py-3">
            <div className="text-lg font-semibold">Open Station</div>
        </button>
        </div> 
        ):(
        <div className="grid grid-cols-1 mt-auto pt-4">
        <button disabled className="opacity-50 cursor-not-allowed hover:bg-white text-slate-400 border-slate-300">
            <div className="text-lg font-semibold">{lockedReason}</div>
        </button>
        </div>)}
      </div>
    </div>
  );
}
