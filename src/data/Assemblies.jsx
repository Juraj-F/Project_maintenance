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
 
  { id: "IAM-1001", label: "Load Station Frame", Model:LoadStFrame, qty:"1"},
  { id: "IAM-1002", label: "Conveyor Carrier", Model:ConvCarrier, qty:"1"},
  { id: "IAM-1003", label: "Conveyor Module Left", Model:Conv_L, qty:"1"},
  { id: "IAM-1004", label: "Conveyor Module Right",Model:Conv_R, qty:"1"},
  { id: "IAM-1005", label: "Conveyor Static", Model:Conv_static, qty:"1"},
  { id: "IAM-1006", label: "Conveyor Carrier Right", Model:ConvCarrier_R, qty:"1"},
  { id: "IAM-1007", label: "Energo Chain", Model:EnChain, qty:"1"},
  { id: "IAM-1008", label: "Pilot Valve", Model:PilotV, qty:"1"},
  { id: "IAM-1009", label: "Valve Terminal", Model:VTerminal, qty:"1"},
  { id: "IAM-1010", label: "Carrier Vertical", Model:Carrier_Vertical, qty:"1"}

]

const Assemblies_ST20 = [
 
  { id: "IAM-2001", label: "Applicatior Head", Model:ApplicatorHead, qty:"1"},
  { id: "IAM-2002", label: "Portal Construction", Model:PortalConstruction, qty:"1"},
  { id: "IAM-2003", label: "Applicator Heating", Model:ApplicatorHeating, qty:"1"},
  { id: "IAM-2004", label: "Portal Mechanism", Model:Portal, qty:"1"},
  { id: "IAM-2005", label: "Product Nest", Model:ProductNest, qty:"1"},
  { id: "IAM-2006", label: "Sealing Dosage Control", Model:SealingDosageControl, qty:"1"},
  { id: "IAM-2007", label: "Servo Motor X-axis", Model:ServoXaxis, qty:"1"},
  { id: "IAM-2008", label: "Servo Motor Y-axis", Model:ServoYaxis, qty:"1"},
  { id: "IAM-2009", label: "Servo Motor Z-axis", Model:ServoZaxis, qty:"1"},
  { id: "IAM-2010", label: "Connector Hub", Model:ConnectorHub, qty:"1"}

]

const StationAssemblies = {
  "ST-10": Assemblies_ST10,
  "ST-20": Assemblies_ST20,
};


export default StationAssemblies
