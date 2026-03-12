import { useNavigate } from "react-router-dom";
import { useState } from "react";
import { useAuthStore } from "../stores/authStore";

export default function Login() {
  const navigate = useNavigate()
  const [email, setEmail]=useState("")
  const [password, setPassword]=useState("")
  const [isLoading, setIsLoading]=useState(false)
  const [error, setError]=useState("")
  const loginToStore = useAuthStore((s) => s.login)

  async function loginData({email, password}) {
  const res = await fetch(`${API_URL}/api/login`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ email, password }),
  });
  
  const data = await res.json();
  if (!res.ok) throw new Error(data.error || `Login failed (HTTP ${res.status})`);

  return {user: data.user, access: data.user_access};
}

async function handleLogin(e){
  e.preventDefault();
  setError("")
  setIsLoading(true)

  if(!email.includes("@")){
    setError("Email must contain `@` ")
    return
  }

  try{
    const user=await loginData({email,password});

    loginToStore(user)
    navigate("/");

  } catch(err){
    setError(err.message)
    console.log(err.message || "Login failed")
  } finally{
    setIsLoading(false)
  }

}

  return (
    <div className="flex w-full min-h-screen flex-col items-center justify-center px-4">
      <div className="flex w-full max-w-sm flex-col items-center rounded-xl shadow-2xl shadow-black/90 p-8">
   
          <h1 className="text-center text-3xl font-extrabold text-amber-50">
            Login
          </h1>
                {error && (
          <div className="mt-4 w-full rounded-lg bg-red-500/20 text-red-200 px-4 py-2">
            {error}
          </div>)}

        <i className="fas fa-key fa-4x mb-8 text-amber-50"></i>

        <form onSubmit={handleLogin} className="w-full space-y-4">
          <div>
            <label htmlFor="email" className="text-amber-50">Email</label>
            <input
              id="email"
              type="email"
              value={email}
              onChange={(e)=>setEmail(e.target.value)}
              className="bg-amber-50 w-full h-9 rounded-xl text-black px-4"
              name="username"
              required
            />
          </div>

          <div>
            <label htmlFor="password" className="text-amber-50">Password</label>
            <input
              id="password"
              type="password"
              value={password}
              onChange={(e)=>setPassword(e.target.value)}
              className="bg-amber-50 w-full h-9 rounded-xl text-black px-4"
              name="password"
              required
            />
          </div>

          <button
          formNoValidate
            disabled={isLoading}
            type="submit"
            className="mt-4 w-full h-10 rounded-xl bg-amber-950 text-amber-50"
          >
            Login
          </button>
        </form>
      </div>
    </div>
  ); 
}
