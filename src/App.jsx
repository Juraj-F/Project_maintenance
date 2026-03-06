import Footer from "@/components/Footer"
import Navbar from "@/components/Navbar"
import { Routes, Route } from "react-router-dom"
import AssemblyLine from "@/pages/Assembly_line"
import StationPage from "@/pages/StationPage"
import Login from "@/pages/Login"
import Register from "@/pages/Register"

function App() {
  return(
      <div className="h-screen w-full flex flex-col bg-slate-950 text-white">

      <header
      className=""><Navbar />
      </header>

      <main className="flex flex-1 w-full overflow-y-auto bg-slate-950 bg-[url('/carbon.png')]">
        <Routes>
        <Route path="/" element={<AssemblyLine/>}/>
        <Route path="/:id" element={<StationPage/>}/>
        <Route path="/login" element={<Login/>}/>
        <Route path="/register" element={<Register />}/>
        </Routes>
        </main>

           <footer className="shrink-0">
        <Footer/></footer>

      </div>
  )
}

export default App
