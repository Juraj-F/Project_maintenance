import { useMemo, useState } from "react";
import Card from "@/components/Card";
import { useNavigate } from "react-router-dom";
import Stations from "@/data/Stations";
import { useAuthStore } from "../stores/authStore";

export default function Arrow() {
  const [hoveredId, setHoveredId] = useState(null);
  const navigate = useNavigate();

  // user data from AuthContext
  const user = useAuthStore((s) => s.user)
  const userAccess = user?.access?.stationIds;  
  const userRole = user?.user?.role

  const accessList=useMemo(()=>{
    if(!userAccess) return [];
    return Array.isArray(userAccess) ? userAccess : [userAccess];
  },[userAccess])

  const getStationAccess = (item) => {
  const notReady = item.notReady === "Yes";
  const hasAccess = accessList.includes(item.id);
  const isAdmin = userRole === "admin";

  const canOpen = !notReady && (hasAccess || isAdmin);

  const lockedReason = notReady
    ? "Station not ready"
    : !canOpen
    ? "You have no rights"
    : null;

  return { canOpen, lockedReason, notReady, hasAccess, isAdmin };
};

  const shaftLength = 2500;
  const head = 40;
  const total = shaftLength + head;

  return (
    <div className="flex items-center w-full min-h-full">
      <div className="hidden lg:flex h-full w-full items-center justify-center overflow-hidden">
      <svg
        className="text-slate-700 bg-slate-950 h-full w-full"
        viewBox={`0 -100 ${total} 900`}
        xmlns="http://www.w3.org/2000/svg"
        preserveAspectRatio="xMidYMid meet"
      >
        <defs>
          <linearGradient
            id="shaftGradient"
            gradientUnits="userSpaceOnUse"
            x1="0%"
            y1="0%"
            x2={total}
            y2="0%"
          >
            <stop offset="0%" stopColor="#020618" />
            <stop offset="100%" stopColor="currentColor" />
          </linearGradient>

          <filter id="arrowShadow" x="-20%" y="-20%" width="140%" height="140%">
            <feDropShadow
              dx="0"
              dy="8"
              stdDeviation="10"
              floodColor="gray"
              floodOpacity="0.35"
            />
          </filter>
        </defs>

        <g filter="url(#arrowShadow)" fill="url(#shaftGradient)">
          {/* Arrow shaft */}
          <rect x="0" y="250" width={shaftLength - 150} height="300" />

          {/* Arrow head */}
          <path
            d={`M${shaftLength - 180} 170 L${shaftLength + head} 400 L${
              shaftLength - 180
            } 630 Z`}
          />
        </g>

        {/* Card located inside svg shown on desktop mode*/}
        {Stations.map((item) => {
          const { canOpen, lockedReason } = getStationAccess(item);
          return(
          <foreignObject key={item.id} x={item.x} y={item.y} width="550" height="500">
            <div
              xmlns="http://www.w3.org/1999/xhtml"
              style={{ pointerEvents: "auto", paddingLeft: "40px", paddingTop: "30px" }}
              onPointerLeave={() => setHoveredId(null)}
              onPointerEnter={() => setHoveredId(item.id)}
            >
              <div className={hoveredId === item.id ? "relative z-50" : "relative z-0"}>
              <Card
                title={item.title}
                device={item.device}
                img={item.img}
                clicked={() => navigate(`/${item.id}`)}
                canOpen={canOpen}
                showOpenButton={canOpen}
                lockedReason={lockedReason}
              />
              </div>
            </div>
          </foreignObject> )}
        )}
      </svg>
      </div>

        {/* Cards shown on non desktop mode */}
      <div className="lg:hidden flex flex-col h-full w-full">
        {Stations.map((item) => {
          const { canOpen, lockedReason } = getStationAccess(item);
          return(
              <div 
              key={item.id}
              className="flex justify-center"
              onPointerLeave={() => setHoveredId(null)}
              onPointerEnter={() => setHoveredId(item.id)}
              style={{ pointerEvents: "auto", transform: "scale(0.7)"}}
            >
              <Card
                title={item.title}
                device={item.device}
                img={item.img}
                clicked={() => navigate(`/${item.id}`)}
                canOpen={canOpen}
                showOpenButton={canOpen}
                lockedReason={lockedReason}
              />
            </div>)
        })}
      </div>
    </div>
  );
}