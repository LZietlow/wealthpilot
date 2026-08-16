import { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer } from "recharts";



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
    const[forecast, setForecast] = useState<number | null>(null);
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

    async function fetchForecast() {
        const token = localStorage.getItem('token');
        const response = await axios.get('http://localhost:3000/transactions/monthly-summary', { headers: { Authorization: `Bearer ${token}`}});
        setForecast(response.data.forecast);
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
        fetchForecast();
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

    async function handleDescriptionBlur(e: React.FocusEvent<HTMLInputElement>) {
        const token = localStorage.getItem('token');
        const response = await axios.post('http://localhost:3000/transactions/suggest-category', { description: transDescription }, {headers: {Authorization: `Bearer ${token}`}});
        const category_id = response.data.category_id;
        setTransCategoryId(category_id || '');
    }

    const totalByCategory = aggregateByCategory(transactions);

    return(
        <div className="bg-zinc-900 min-h-screen p-8 text-zinc-100">
            <header className="flex justify-between items-center mb-8">
                <h2 className="text-2xl font-bold">Dashboard</h2>
                <button type="button" onClick={handleLogout} className="rounded-lg bg-zinc-800 px-4 py-2.5 text-sm font-semibold text-white transition hover:bg-zinc-700 outline-none focus-visible:ring-2 focus-visible:ring-zinc-700">Logout</button>
            </header>

            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
                <div className="bg-zinc-800 rounded-xl p-6">
                    <form onSubmit={handleCreateAccount} className="flex flex-col gap-4">
                    <input name="name" value={name} onChange={(e)=> setName(e.target.value)}
                    className="w-full rounded-lg bg-zinc-700 border border-zinc-800 px-4 py-2.5 text-zinc-100 placeholder-zinc-500 outline-none transition focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500"
                    placeholder="Account name"></input>
                    <input name="balance" value={balance} onChange={(e)=> setBalance(e.target.value)}
                    className="w-full rounded-lg bg-zinc-700 border border-zinc-800 px-4 py-2.5 text-zinc-100 placeholder-zinc-500 outline-none transition focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500"
                    placeholder="Account balance"></input>
                    <button type="submit"
                    className="w-full rounded-lg bg-indigo-600 px-4 py-2.5 text-sm font-semibold text-white transition hover:bg-indigo-500 outline-none focus-visible:ring-2 focus-visible:ring-indigo-500"
                    >Create new Account</button>
                    {error && <p>{error}</p>}
                </form>
                <ul className="divide-y divide-zinc-700">
                    {accounts.map(account => (
                    <li key={account.id} className="py-2 flex justify-between">
                        
                        <span>{account.name} </span>
                        <span>{account.balance} </span>
                    </li>
                    ))}
                </ul>
                </div>

                <div className="bg-zinc-800 rounded-xl p-6">
                    <ResponsiveContainer width="100%" height={300}>
                        <BarChart data={totalByCategory}>
                        <XAxis dataKey='category'></XAxis>
                        <YAxis></YAxis>
                        <Tooltip></Tooltip>
                        <Bar dataKey='total' fill="#8884d8"></Bar>
                        </BarChart>
                    </ResponsiveContainer>
                    <div>
                        {forecast !== null && (<p className="text-zinc-400">Forecast for next month: {forecast.toFixed(2)}</p>)}
                    </div>
                </div>
                
            </div>

            <div className="bg-zinc-800 rounded-xl p-6 mb-6">
                <form onSubmit={handleCreateTransaction} className="flex flex-col gap-4">
                    <input name="account_id" value={transAccountId} onChange={(e) => setTransAccountId(e.target.value)}
                    className="w-full rounded-lg bg-zinc-700 border border-zinc-800 px-4 py-2.5 text-zinc-100 placeholder-zinc-500 outline-none transition focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500"
                    placeholder="To Account"></input>
                    <input name="amount" value={transAmount} onChange={(e) => setTransAmount(e.target.value)}
                    className="w-full rounded-lg bg-zinc-700 border border-zinc-800 px-4 py-2.5 text-zinc-100 placeholder-zinc-500 outline-none transition focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500"
                    placeholder="Transfer amount"></input>
                    <input name="description" value={transDescription} onChange={(e) => setTransDescription(e.target.value)}
                    className="w-full rounded-lg bg-zinc-700 border border-zinc-800 px-4 py-2.5 text-zinc-100 placeholder-zinc-500 outline-none transition focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500"
                    placeholder="description"
                    onBlur={handleDescriptionBlur}></input>
                    <select value={transCategoryId} onChange={(e) => setTransCategoryId(e.target.value)}
                        className="w-full rounded-lg bg-zinc-700 border border-zinc-800 px-4 py-2.5 text-zinc-100 placeholder-zinc-500 outline-none transition focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500">
                        <option value={""}>-- Kategorie wählen --</option>
                        {categories.map(category => (
                            <option key={category.id} value={category.id}>{category.name}</option>
                        ))}
                    </select>
                <button type="submit"
                className="w-full rounded-lg bg-indigo-600 px-4 py-2.5 text-sm font-semibold text-white transition hover:bg-indigo-500 outline-none focus-visible:ring-2 focus-visible:ring-indigo-500"
                >Do Transaction</button>
                </form>
            </div>

            <div className="bg-zinc-800 rounded-xl p-6">
                <ul className="divide-y divide-zinc-700">
                    {transactions.map(transaction => (
                        <li key={transaction.id} className="py-2 flex justify-between">
                            <div>
                                <span className="text-zinc-400 text-sm">{transaction.category_name}</span>
                                <span className="ml-2">{transaction.description}</span>
                            </div>
                            <div>
                                <span>{transaction.amount}</span>
                            </div>
                        </li>
                    ))}
                </ul>
            </div>
     
        </div>
    )


}