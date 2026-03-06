import { useState } from "react";
import { useNavigate } from "react-router-dom";

export default function Register() {
  const navigate = useNavigate();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");


// Connection to the db server
  async function register(email, password) {
    const res = await fetch("/api/register", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email, password }),
    });

    const data = await res.json().catch(() => ({}));
    if (!res.ok) throw new Error(data.error || `Register failed, HTTP ${res.status}`);

    return true;
  }

  // Submit handler
  async function handleSubmit(e) {
    e.preventDefault();
    setError("");
    setIsLoading(true);

    try {
      await register(email, password);
      navigate("/login");         // ✅ go to login page after register
    } catch (err) {
      setError(err.message || "Register failed");
    } finally {
      setIsLoading(false);
    }
  }

  return (
    <div className="flex w-full min-h-screen flex-col items-center justify-center px-4">
      <div className="flex w-full max-w-sm flex-col items-center rounded-xl shadow-2xl shadow-black/90 p-8">
        <h1 className="text-center text-3xl font-extrabold text-amber-50">
          Register
        </h1>

        {error && (
          <div className="mt-4 w-full rounded-lg bg-red-500/20 text-red-200 px-4 py-2">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="w-full space-y-4 mt-6">
          <div>
            <label htmlFor="email" className="text-amber-50">Email</label>
            <input
              id="email"
              type="email"
              className="bg-amber-50 w-full h-9 rounded-xl text-black px-4"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              autoComplete="email"
              required
            />
          </div>

          <div>
            <label htmlFor="password" className="text-amber-50">Password</label>
            <input
              id="password"
              type="password"
              className="bg-amber-50 w-full h-9 rounded-xl text-black px-4"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              autoComplete="new-password"
              required
            />
          </div>

          <button
            type="submit"
            disabled={isLoading}
            className="mt-4 w-full h-10 rounded-xl bg-amber-950 text-amber-50 disabled:opacity-60"
          >
            {isLoading ? "Registering..." : "Register"}
          </button>
        </form>
      </div>
    </div>
  );
}
