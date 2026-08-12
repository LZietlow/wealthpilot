import axios from "axios";
import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";


export default function Login() {
    const navigate = useNavigate();
    async function handleLogin(e: React.FormEvent<HTMLFormElement>) {
        e.preventDefault();
        try {
            const response = await axios.post('http://localhost:3000/auth/login', { email, password });
            const token = response.data.token
            localStorage.setItem('token', token);
            navigate('/dashboard');
        } catch (error) {
            setErrorMessage("Email or Password incorrect")
            console.log(error)
        }

    }


    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [errorMessage, setErrorMessage] = useState('');
    return(
       
        
        <form onSubmit={handleLogin}>
            <input name="email" value={email} onChange={(e) => setEmail(e.target.value)}></input>
            <input name="password" value={password} onChange={(e) => setPassword(e.target.value)}></input>
            <button type="submit">Login</button>
            {errorMessage && <p>{errorMessage}</p>}

            <Link to="/register">Sign Up</Link>
        </form>

        
    );
}