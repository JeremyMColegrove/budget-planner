import React, { useEffect, useState, useRef } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { styled } from '@mui/material/styles';
import FormControlLabel from '@mui/material/FormControlLabel';
import Switch from '@mui/material/Switch';
import ToggleButton from '@mui/material/ToggleButton';
import ToggleButtonGroup from '@mui/material/ToggleButtonGroup';
import Box from '@mui/material/Box';
import InputLabel from '@mui/material/InputLabel';
import MenuItem from '@mui/material/MenuItem';
import FormControl from '@mui/material/FormControl';
import Select, { SelectChangeEvent } from '@mui/material/Select';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import { IconButton } from '@mui/material';


import DexieDB from './DexieDB';
import dayjs from 'dayjs';

function Transactions() {
    const [transactions, setTransactions] = useState([]);
    const location = useLocation();
    const navigate = useNavigate();
    const transactionNameRef = useRef(null);
    const state = location.state;
    const [edit, setEdit] = useState(false)
    const [selected, setSelected] = useState([])
    const [adding, setAdding] = useState(false)
    const [newTransactionType, setNewTransactionType] = useState("Purchase")
    const [newName, setNewName] = useState("")  
    const [newCategory, setNewCatagory] = useState("Food")
    const [newPrice, setNewPrice] = useState(0.0)
    const [newCurrency, setNewCurrency] = useState("MXN")
    const [conversionRate, setConversionRate] = useState(0)
    const updateConversionRate = (e) => setConversionRate(e.target.value)
    const updateNewTransactionType = (e) => setNewTransactionType(e.target.value)
    const updateNewName = (e)=> setNewName(e.target.value)
    const updateCategory = (e)=> setNewCatagory(e.target.value)
    const updateNewPrice = (e)=> setNewPrice(e.target.value)
    const updateNewCurrency = (_, currency)=> {
        if (currency != null)
            setNewCurrency(currency);
    }


  useEffect(() => {
    if (state.receipt)
        fetchData();
  }, [state]);

  const fetchData = async () => {
    const db = new DexieDB();
    const transactions = await db.getTransactions(state.receipt.id);
    setConversionRate(state.receipt.conversionRate)
    setTransactions(transactions);
  }

  const addTransaction = async (e) => {
    e.preventDefault()
    const db = new DexieDB();
    await db.addTransaction(state.receipt.id, newName, parseFloat(newPrice), newCurrency, newCategory);

    setNewName("")
    setNewCatagory("Food")
    setNewPrice(0.0)
    fetchData();

    // put focus back to name box
    // window.focus()
    transactionNameRef.current.focus()
  }

  function toggleTransaction(transaction) {
    if (selected.indexOf(transaction.id) != -1) {
        setSelected(s=>s.filter(item=>item!=transaction.id))
    } else {
        setSelected(s=>[...s, transaction.id])
    }
  }
  
  

  async function deleteTransactions() {
    const db = new DexieDB();
    await db.deleteTransactions(selected, state.month.id, state.receipt.id);
    setSelected([]);
    setEdit(false)
    fetchData();
  }

  const toggleEdit = () => {
    setEdit(edit=>!edit)
    setSelected([]);
  }

  const saveConversionRate = async (e) => {
    e.preventDefault()
    if (conversionRate != state.receipt.conversionRate) {
        const db = new DexieDB()
        await db.updateConversionRate(state.receipt.id, conversionRate)
    }
  }


  const purchaseComponent = () => {
    return (
        <tr className='bg-slate-50'>
            <td>
                <input ref={transactionNameRef} required type="text" value={newName} placeholder='Item Name' onChange={updateNewName} className='w-72 h-8 rounded-lg border-2 p-4 focus:outline-0 border-slate-200'></input>
            </td>
            <td>
                <FormControl required size='small' className='w-48'>
                    <InputLabel id="demo-simple-select-label">Category</InputLabel>
                    <Select
                    labelId="demo-simple-select-label"
                    id="demo-simple-select"
                    value={newCategory}
                    label="Category"
                    onChange={updateCategory}
                    >
                    <MenuItem value={"Food"}>Food</MenuItem>
                    <MenuItem value={"Transportation"}>Transportation</MenuItem>
                    <MenuItem value={"Personal Care"}>Personal Care</MenuItem>
                    <MenuItem value={"Entertainment"}>Entertainment</MenuItem>
                    <MenuItem value={"Clothing"}>Clothing</MenuItem>
                    <MenuItem value={"Miscellaneous"}>Miscellaneous</MenuItem>
                    <MenuItem value={"Tax"}>Tax</MenuItem>
                    <MenuItem value={"Discount"}>Discount</MenuItem>
                    </Select>
                </FormControl>
            </td>
            <td className='flex items-center'>
                <input required type="number" step="any" className='w-24 h-8 rounded-lg border-2 p-4 focus:outline-0 border-slate-200' value={newPrice} onChange={updateNewPrice}></input>
                <ToggleButtonGroup
                    color="primary"
                    value={newCurrency}
                    exclusive
                    size='small'
                    onChange={updateNewCurrency}
                    aria-label="Platform"
                    className='items-center justify-center p-2'
                >
                    <ToggleButton value="USD">USD</ToggleButton>
                    <ToggleButton value="MXN">MXN</ToggleButton>

                </ToggleButtonGroup>
                <button type="submit" className='hidden'></button>
            </td>          
        </tr>
    )}
    function transactionComponent(transaction) {
        return (
            <tr className={`shadow-sm w-full bg-slate-50 rounded-sm outline-dashed outline-2 outline-slate-200`} key={transaction.id}>
                <td>{edit && <input onChange={()=>toggleTransaction(transaction)} className='mr-2' type="checkbox"/>} {transaction.name}</td>
                <td>{transaction.catagory}</td>
                <td className='flex items-center justify-between'><p>${transaction.price}</p><p className='text-blue-300'>{transaction.transactionCurrency}</p></td>
            </tr>
        )
      }

  return (
    <div className=" w-full px-20 py-8">
        <div className='flex items-center mb-8 justify-between'>
            <div className="flex">
                <IconButton onClick={()=>navigate(-1)}>
                    <ArrowBackIcon/>
                </IconButton>
                <p className='text-4xl font-bold ml-4'>{state.receipt.name} - {dayjs(state.receipt.date.$d).format("MM/DD/YYYY")}</p>
            </div>
            <div className="flex">
                <form onBlur={saveConversionRate} onSubmit={saveConversionRate} className="flex items-center">
                    <p className='mr-4 font-bold'>MXN→USD</p><input step="any" type="number" min={0} value={conversionRate} onChange={updateConversionRate} className='w-28 h-8 rounded-lg border-2 p-4 focus:outline-0 border-slate-200'></input>
                </form>
            </div>
        </div>
            
        
        <div className='flex items-center'>
            <p className='font-bold  text-2xl'>Transactions</p>
            {!edit && <button disabled={transactions.length<1} className='disabled:opacity-50 p-2 px-4 rounded-lg mx-4 text-white bg-slate-500 ' onClick={toggleEdit}>Edit</button>}
            {edit && (
                <div>
                <button className='p-2 rounded-lg mx-4 text-white bg-red-500 ' onClick={deleteTransactions}>Delete</button>
                <button className='p-2 rounded-lg mx-4 text-white bg-slate-500 ' onClick={toggleEdit}>Cancel</button>
                </div>
            )}
        </div>

        
        
        <form onSubmit={addTransaction}>
            <table className='w-full'>
                <thead>

                    <tr className='text-left'>
                        <th>Name</th>
                        <th>Category</th>
                        <th>Amount</th>
                    </tr>
                </thead>
                <tbody>
                    {purchaseComponent()}
                    {transactions.map(t => transactionComponent(t)).reverse()}
                </tbody>
            </table>
        </form>
    </div>
  );
  
}

export default Transactions;
