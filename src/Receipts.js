import React, { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useLocation } from 'react-router-dom';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import { IconButton } from '@mui/material';
import FormControlLabel from '@mui/material/FormControlLabel';
import { styled } from '@mui/material/styles';
import ToggleButton from '@mui/material/ToggleButton';
import ToggleButtonGroup from '@mui/material/ToggleButtonGroup';
import Switch, { SwitchProps } from '@mui/material/Switch';
import USDSwitch from './USDSwitch';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import dayjs from 'dayjs';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';

import DexieDB from './DexieDB';


function Receipts() {

    
    const location = useLocation();
    const navigate = useNavigate()
    const state = location.state;
    const [data, setData] = useState({});
    const [edit, setEdit] = useState(false)
    const [selected, setSelected] = useState({receipts:[], expenses:[]})

    const [newReceiptName, setNewReceiptName] = useState("")
    const [newExpenseName, setNewExpenseName] = useState("")

    const [newCatagory, setNewCatagory] = useState("Food")
    const [newPrice, setNewPrice] = useState(0.0)
    const [newCurrency, setNewCurrency] = useState("MXN")
    const [newReceiptDate, setNewReceiptDate] = useState(dayjs())
    const updateNewReceiptDate = (date) => setNewReceiptDate(date)
    const updateNewReceiptName = (e)=> setNewReceiptName(e.target.value)
    const updateNewExpenseName = (e) => setNewExpenseName(e.target.value)
    const updateCatagory = (e)=> setNewCatagory(e.target.value)
    const updateNewPrice = (e)=> setNewPrice(e.target.value)
    const updateNewCurrency = (_, currency)=> {
        if (currency != null)
            setNewCurrency(currency);
    }
    const [displayUSDCurrency, setDisplayUSDCurrency] = useState(state.month.showUSD)

    const updateDisplayUSDCurrency = async (e) => {
        e.preventDefault()
        const db = new DexieDB()
        setDisplayUSDCurrency(e.target.checked)
        await db.updateMonthCurrency(state.month.id, e.target.checked)
    }


    

  useEffect(() => {
    if (state.month)
        fetchData();
  }, [state]);

  function toggleReceipt(receipt) {
    if (selected.receipts.indexOf(receipt.id) != -1) {
        setSelected(s=>{
            return {receipts:s.receipts.filter(id=>id!=receipt.id), expenses:s.expenses}
        })
    } else {
        setSelected(s=>{
            return {receipts:[...s.receipts, receipt.id], expenses:s.expenses}
        })
    }
  }

  function toggleExpense(expense) {
    if (selected.expenses.indexOf(expense.id) != -1) {
        setSelected(s=>{
            return {receipts:s.receipts, expenses:s.expenses.filter(id=>id!=expense.id)}
        })
    } else {
        setSelected(s=>{
            return {receipts:s.receipts, expenses:[...s.expenses, expense.id]}
        })
    }
  }


  const fetchData = async () => {
    const db = new DexieDB();
    const receipts = await db.getReceiptsAndExpenses(state.month.id);
    // console.log(receipts)
    setData(receipts);
  }

  const addReceipt = async (e) => {
    e.preventDefault()
    const db = new DexieDB();
    let date = newReceiptDate?.$d ? newReceiptDate.$d : dayjs().$d
    await db.addReceipt(state.month.id, newReceiptName, date);
    setNewReceiptDate(dayjs())
    setNewReceiptName("")

    fetchData();
  }

  const addExpense = async (e) => {
    e.preventDefault()
    const db = new DexieDB();
    await db.addExpense(state.month.id, newExpenseName, parseFloat(newPrice), newCurrency);
    setNewPrice(0)
    setNewCurrency(state.month.showUSD?"USD":"MXN")
    fetchData();
  }
  
const deleteReceiptsAndExpenses = async () => {
    const db = new DexieDB();
    await db.deleteReceiptsAndExpenses(selected, state.month.id);
    setSelected({receipts:[], expenses:[]});
    setEdit(false)
    fetchData();
  }
  

  function receiptComponent(receipt) {
    return (
        <tr key={receipt.id} onClick={()=>!edit ? navigate("/transactions", {state:{month:state.month, receipt}}):null} className='shadow-sm w-full bg-slate-50 outline-dashed outline-2 outline-slate-200 rounded-sm hover:bg-slate-100 hover:cursor-pointer'>
            <td>
                {edit && <input onChange={()=>toggleReceipt(receipt)} className='mr-2' type="checkbox"/>} {receipt.name}
            </td>
            <td>{dayjs(receipt.date).format("MM/DD/YYYY")}</td>
            <td>${displayUSDCurrency?((receipt.USD + receipt.MXN/receipt.conversionRate).toFixed(2)):(receipt.USD*receipt.conversionRate+receipt.MXN).toFixed(2)} {displayUSDCurrency?"USD":"MXN"}</td>
        </tr>
    )
  }

  function expenseComponent(expense) {
    return (
        <tr key={expense.id} className='shadow-sm w-full bg-slate-50 rounded-sm outline-dashed outline-2 outline-slate-200'>
            <td>
            {edit && <input onChange={()=>toggleExpense(expense)} className='mr-2' type="checkbox"/>} {expense.name}
            </td>
            <td>${expense.total}</td>
        </tr>
    )
  }

  const toggleEdit = () => {
    setEdit(edit=>!edit)
    setSelected({receipts:[], expenses:[]});
  }

  
  return (
    <div className=" w-full px-20 py-8">
        <div className='flex items-center mb-8'>
            <IconButton onClick={()=>navigate(-1)}>
                <ArrowBackIcon/>
            </IconButton>
            <p className='text-4xl font-bold ml-4'>{dayjs(state.month?.name).format("MMM")}</p>
        </div>
        <div className='flex'>
            {!edit && <button disabled={data.receipts?.length<1 && data.expenses?.length<1} className='disabled:opacity-50 p-2 px-4 rounded-lg mx-4 text-white bg-slate-500 ' onClick={toggleEdit}>Edit</button>}
            {edit && (
                <div>
                    <button className='p-2 rounded-lg mx-4 text-white bg-slate-500 ' onClick={toggleEdit}>Cancel</button>
                    <button className='p-2 rounded-lg mx-4 text-white bg-red-500 ' onClick={deleteReceiptsAndExpenses}>Delete</button>
                </div>
            )}
            <USDSwitch current={displayUSDCurrency} handleSwitch={updateDisplayUSDCurrency}/>
            {/* <FormControlLabel
                control={<MaterialUISwitch  checked={displayUSDCurrency} onChange={updateDisplayUSDCurrency} />}
                label="Currency Display"
            /> */}
        </div>
        
        <div className='flex'>      
            <form className='w-full mr-2 mt-2 ' onSubmit={addReceipt}> 
                <p className='font-bold  text-2xl'>Receipts</p>
                <hr></hr>
                <table className='w-full text-left'>
                    <tbody>
                        <tr className='bg-slate-50'>
                            <td>
                            <input required type="text" value={newReceiptName} placeholder='Receipt Name' onChange={updateNewReceiptName} className='w-40 h-8 rounded-lg border-2 p-4 focus:outline-0 border-slate-200'></input>
                            </td>
                            <td>
                            <LocalizationProvider dateAdapter={AdapterDayjs}>
                                <DatePicker  slotProps={{ textField: { size: 'small',  className:"w-44" } }} value={newReceiptDate} onChange={updateNewReceiptDate}/>
                            </LocalizationProvider>
                            </td>
                            <td></td>
                        </tr>


                        {data.receipts?.sort((a,b)=>dayjs(a.date).isAfter(dayjs(b.date))).map(receipt => receiptComponent(receipt))}
                    </tbody>
                </table>
                <input type="submit" hidden/>
            </form>

            <form className='w-full ml-2 mt-2 ' onSubmit={addExpense}>
                <p className='font-bold  text-2xl'>Expenses</p>
                <hr></hr>
                <table className='w-full text-left'>
                    <tbody>
                        <tr className='bg-slate-50'>
                            <td>
                                <input required type="text" value={newExpenseName} placeholder='Expense Name' onChange={updateNewExpenseName} className='w-40 h-8 rounded-lg border-2 p-4 focus:outline-0 border-slate-200'></input>
                            </td>
                            <td className='flex items-center'>

                                <input min={0} required type="number" step="any" className='w-24 h-8 rounded-lg border-2 p-4 focus:outline-0 border-slate-200' value={newPrice} onChange={updateNewPrice}></input>
                                <ToggleButtonGroup
                                    color="primary"
                                    value={newCurrency}
                                    exclusive
                                    size='small'
                                    onChange={updateNewCurrency}
                                    aria-label="Platform"
                                    className='items-center justify-center ml-4'
                                >
                                    <ToggleButton value="USD">USD</ToggleButton>
                                    <ToggleButton value="MXN">MXN</ToggleButton>

                                </ToggleButtonGroup>
                            </td>

                        </tr>
                        {data.expenses?.map(receipt => expenseComponent(receipt)).reverse()}
                    </tbody>
                </table>
                <input type="submit" hidden/>
            </form>

        </div>
    </div>
  );
  
}

export default Receipts;
