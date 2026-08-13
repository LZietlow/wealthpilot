import { useEffect, useState } from "react";
import axios from "axios";



export default function Dashboard() {

    const[accounts, setAccounts] = useState([]);
    const[name, setName] = useState('');
    const[balance, setBalance] = useState('');
    const[error, setErrorMessage] = useState('');

    async function fetchAccounts() {
            const token = localStorage.getItem('token');
            const response = await axios.get('http://localhost:3000/accounts', { headers: { Authorization: `Bearer ${token}`}});
            setAccounts(response.data.accounts);
        }

    useEffect(() => {
        fetchAccounts();
    }, []);

    async function handleCreateAccount(e: React.FormEvent<HTMLFormElement>) {
        e.preventDefault()
        try {
            const token = localStorage.getItem('token');
            const balance_float = parseFloat(balance);
            await axios.post('http://localhost:3000/accounts', {name, balance: balance_float}, {headers: {Authorization: `Bearer ${token}`}});
            fetchAccounts();
            setName('');
            setBalance('');
        } catch (error) {
            setErrorMessage('Could not create new account')
            console.log(error);
        }
    }

    return(
        <div>
        <form onSubmit={handleCreateAccount}>
            <input name="name" value={name} onChange={(e)=> setName(e.target.value)}></input>
            <input name="balance" value={balance} onChange={(e)=> setBalance(e.target.value)}></input>
            <button type="submit">Create new Account</button>
            {error && <p>{error}</p>}
        </form>

        <ul>
            {accounts.map(account => (
                <li key={account.id}>
                    {account.id}
                </li>
            ))}
        </ul>
        </div>
    )


}