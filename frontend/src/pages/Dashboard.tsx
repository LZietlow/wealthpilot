import { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { BarChart, Bar, XAxis, YAxis, Tooltip } from "recharts";



export default function Dashboard() {

    const[accounts, setAccounts] = useState([]);
    const[name, setName] = useState('');
    const[balance, setBalance] = useState('');
    const[error, setErrorMessage] = useState('');
    const[transactions, setTransactions] = useState([]);
    const[transAccountId, setTransAccountId] = useState('');
    const[transAmount, setTransAmount] = useState('');
    const[transDescription, setTransDescription] = useState('');
    const[categories, setCategories] = useState([]);
    const[transCategoryId, setTransCategoryId] =useState('');
    const navigate = useNavigate();


    async function fetchTransactions() {
        const token = localStorage.getItem('token');
        const response = await axios.get('http://localhost:3000/transactions', { headers: { Authorization: `Bearer ${token}`}});
        setTransactions(response.data.transactions || []);
        
    }

    async function fetchCategories() {
        const response = await axios.get('http://localhost:3000/categories');
        setCategories(response.data.categories)
    }


    async function fetchAccounts() {
            const token = localStorage.getItem('token');
            const response = await axios.get('http://localhost:3000/accounts', { headers: { Authorization: `Bearer ${token}`}});
            setAccounts(response.data.accounts);
        }

    useEffect(() => {
        fetchAccounts();
        fetchTransactions();
        fetchCategories();
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

    async function handleCreateTransaction(e:React.FormEvent<HTMLFormElement>) {
        e.preventDefault();
        try {
            const token = localStorage.getItem('token');
            const amount_float = parseFloat(transAmount);
            await axios.post('http://localhost:3000/transactions', {account_id: transAccountId, amount: amount_float, description: transDescription, category_id: transCategoryId},  {headers: {Authorization: `Bearer ${token}`}})
            fetchTransactions();
            setTransAccountId('');
            setTransCategoryId('');
            setTransAmount('');
            setTransDescription('');
        } catch (error) {
            setErrorMessage('Could not make transaction')
            console.log(error);
        }
        
    }

    async function handleLogout() {
        localStorage.removeItem('token');
        navigate('/login');

    }

    function aggregateByCategory(transactions) {
        const totals = {};
        console.log(transactions);
        transactions.forEach(transaction => {
            const category = transaction.category_name || 'No category';
            if(!(category in totals)) {
                totals[category] = 0;
            }
            totals[category] += parseFloat(transaction.amount);
        });

        console.log(totals);

        const arr = Object.entries(totals).map(([category, total]) => {
            return {category, total};
        });
        console.log(arr);
        return arr;
    }

    const totalByCategory = aggregateByCategory(transactions);

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
                    {account.id} {account.name} {account.balance}
                </li>
            ))}
        </ul>

        <form onSubmit={handleCreateTransaction}>
            <input name="account_id" value={transAccountId} onChange={(e) => setTransAccountId(e.target.value)}></input>
            <input name="amount" value={transAmount} onChange={(e) => setTransAmount(e.target.value)}></input>
            <input name="description" value={transDescription} onChange={(e) => setTransDescription(e.target.value)}></input>
            <select value={transCategoryId} onChange={(e) => setTransCategoryId(e.target.value)}>
                <option value={""}>-- Kategorie wählen --</option>
                {categories.map(category => (
                    <option key={category.id} value={category.id}>{category.name}</option>
                ))}
            </select>
            <button type="submit">Do Transaction</button>
        </form>

        <ul>
            {transactions.map(transaction => (
                <li key={transaction.id}>
                    {transaction.id} {transaction.category_name}
                </li>
            ))}
        </ul>

        <button type="button" onClick={handleLogout}>Logout</button>

        <BarChart width={600} height={300} data={totalByCategory}>
            <XAxis dataKey='category'></XAxis>
            <YAxis></YAxis>
            <Tooltip></Tooltip>
            <Bar dataKey='total' fill="#8884d8"></Bar>
        </BarChart>
        



        </div>
    )


}