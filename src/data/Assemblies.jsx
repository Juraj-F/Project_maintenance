import { Conv_L } from "@/three/Conv_L";
import { Conv_R } from "@/three/Conv_RE";
import { Conv_static } from "@/three/Conv_static";
import { ConvCarrier_R } from "@/three/ConvCarrier_RE";
import { ConvCarrier } from "@/three/ConvCarrier";
import { EnChain } from "@/three/EnChain";
import { LoadStFrame } from "@/three/LoadStFrame";
import { PilotV } from "@/three/PilotV";
import { VTerminal } from "@/three/VTerminal";
import { Carrier_Vertical } from "@/three/Carrier_Vertical";
import {ApplicatorHead} from "@/three/ApplicatorHead"
import {PortalConstruction} from "@/three/PortalConstruction"
import {ApplicatorHeating} from "@/three/ApplicatorHeating"
import {Portal} from "@/three/Portal"
import {ProductNest} from "@/three/ProductNest"
import {ConnectorHub} from "@/three/ConnectorHub"
import {ServoXaxis} from "@/three/ServoXaxis"
import {ServoYaxis} from "@/three/ServoYaxis"
import {ServoZaxis} from "@/three/ServoZaxis"
import {SealingDosageControl} from "@/three/SealingDosageControl"


const Assemblies_ST10 = [
 
  { id: "IAM-1001", Model:LoadStFrame, qty:"1"},
  { id: "IAM-1002", Model:ConvCarrier, qty:"1"},
  { id: "IAM-1003", Model:Conv_L, qty:"1"},
  { id: "IAM-1004", Model:Conv_R, qty:"1"},
  { id: "IAM-1005", Model:Conv_static, qty:"1"},
  { id: "IAM-1006", Model:ConvCarrier_R, qty:"1"},
  { id: "IAM-1007", Model:EnChain, qty:"1"},
  { id: "IAM-1008", Model:PilotV, qty:"1"},
  { id: "IAM-1009", Model:VTerminal, qty:"1"},
  { id: "IAM-1010", Model:Carrier_Vertical, qty:"1"}

]

const Assemblies_ST20 = [
 
  { id: "IAM-2001", Model:ApplicatorHead, qty:"1"},
  { id: "IAM-2002", Model:PortalConstruction, qty:"1"},
  { id: "IAM-2003", Model:ApplicatorHeating, qty:"1"},
  { id: "IAM-2004", Model:Portal, qty:"1"},
  { id: "IAM-2005", Model:ProductNest, qty:"1"},
  { id: "IAM-2006", Model:SealingDosageControl, qty:"1"},
  { id: "IAM-2007", Model:ServoXaxis, qty:"1"},
  { id: "IAM-2008", Model:ServoYaxis, qty:"1"},
  { id: "IAM-2009", Model:ServoZaxis, qty:"1"},
  { id: "IAM-2010", Model:ConnectorHub, qty:"1"}

]

const StationAssemblies = {
  "ST-10": Assemblies_ST10,
  "ST-20": Assemblies_ST20,
};


export default StationAssemblies
