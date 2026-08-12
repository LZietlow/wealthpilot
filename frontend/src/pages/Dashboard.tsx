import { useEffect, useState } from "react";
import axios from "axios";



export default function Dashboard() {

    const[accounts, setAccounts] = useState([]);

    useEffect(() => {
        async function fetchAccounts() {
            const token = localStorage.getItem('token');
            const response = await axios.get('http://localhost:3000/accounts', { headers: { Authorization: `Bearer ${token}`}});
            setAccounts(response.data.accounts);
        }
        fetchAccounts()
       
    }, []);

    return(
        <ul>
            {accounts.map(account => (
                <li key={account.id}>
                    {account.id}
                </li>
            ))}
        </ul>
    )


}