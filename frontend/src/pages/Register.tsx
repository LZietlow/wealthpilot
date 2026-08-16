import { useState } from "react"
import axios from "axios";
import { useNavigate } from "react-router-dom";

export default function Register() {
    const navigate = useNavigate();
    const[email, setEmail] = useState('');
    const[password, setPassword] = useState('');
    const[errorMessage, setErrorMessage] = useState('');


    async function handleRegister(e:React.FormEvent<HTMLFormElement>) {
        e.preventDefault();
        try {
            await axios.post('http://localhost:3000/auth/register', { email, password })
            navigate('/login');
        } catch (error) {
            setErrorMessage("Email already in use")
            console.log(error)
        }
        
    }

    return (
        <div className="flex items-center justify-center h-screen bg-zinc-900">
            <form onSubmit={handleRegister} className="bg-zinc-800 p-6 rounded-xl border border-zinc-800/80 shadow-md flex flex-col gap-5">
            <input name="email" value={email} onChange={(e) => setEmail(e.target.value)}
            className="w-full rounded-lg bg-zinc-700 border border-zinc-800 px-4 py-2.5 text-zinc-100 placeholder-zinc-500 outline-none transition focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500"
            placeholder="E-mail" type="email"
            ></input>
            <input name="password" value={password} onChange={(e) => setPassword(e.target.value)}
            className="w-full rounded-lg bg-zinc-700 border border-zinc-800 px-4 py-2.5 text-zinc-100 placeholder-zinc-500 outline-none transition focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500"
            placeholder="Password" type="password"
            ></input>
            <button type="submit"
            className="w-full rounded-lg bg-indigo-600 px-4 py-2.5 text-sm font-semibold text-white transition hover:bg-indigo-500 outline-none focus-visible:ring-2 focus-visible:ring-indigo-500"
            >Register</button>
            {errorMessage && 
            <div className="bg-red-500/10 border border-red-500/20 text-red-400 text-sm p-3 rounded-lg text-center mt-2 animate-fade-in">
                {errorMessage}
                </div>}
        </form>
        </div>
        
    )
}