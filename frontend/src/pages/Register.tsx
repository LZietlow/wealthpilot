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
        <form onSubmit={handleRegister}>
            <input name="email" value={email} onChange={(e) => setEmail(e.target.value)}></input>
            <input name="password" value={password} onChange={(e) => setPassword(e.target.value)}></input>
            <button type="submit">Register</button>
            {errorMessage && <p>{errorMessage}</p>}
        </form>
    )
}