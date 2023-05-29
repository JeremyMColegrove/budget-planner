import React, { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useLocation } from 'react-router-dom';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import { IconButton } from '@mui/material';
import FormControlLabel from '@mui/material/FormControlLabel';
import { styled } from '@mui/material/styles';

import Switch, { SwitchProps } from '@mui/material/Switch';
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
    const [newReceiptDate, setNewReceiptDate] = useState(null)
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
    

    useEffect(()=>{
        console.log(displayUSDCurrency)
    }, [displayUSDCurrency])

    const MaterialUISwitch = styled(Switch)(({ theme }) => ({
        width: 62,
        height: 34,
        padding: 7,
        '& .MuiSwitch-switchBase': {
          margin: 1,
          padding: 0,
          transform: 'translateX(6px)',
          '&.Mui-checked': {
            color: '#fff',
            transform: 'translateX(22px)',
            '& .MuiSwitch-thumb:before': {
              backgroundImage: `url('data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" width="21.876" height="8.448" viewBox="0 0 21.876 8.448"><path fill="${encodeURIComponent(
                '#fff',
              )}" d="M 0 0.108 L 1.008 0.108 L 1.008 5.22 A 3.885 3.885 0 0 0 1.034 5.68 Q 1.079 6.061 1.206 6.342 A 2.046 2.046 0 0 0 1.427 6.723 A 1.598 1.598 0 0 0 1.728 7.032 Q 2.052 7.284 2.466 7.38 Q 2.88 7.476 3.312 7.476 Q 3.744 7.476 4.152 7.38 Q 4.56 7.284 4.884 7.032 A 1.606 1.606 0 0 0 5.26 6.609 A 2.085 2.085 0 0 0 5.4 6.342 A 2.04 2.04 0 0 0 5.524 5.946 Q 5.592 5.626 5.592 5.22 L 5.592 0.108 L 6.6 0.108 L 6.6 5.472 A 2.932 2.932 0 0 1 6.434 6.465 A 2.78 2.78 0 0 1 6.366 6.636 Q 6.132 7.176 5.7 7.578 A 2.994 2.994 0 0 1 4.915 8.1 A 3.584 3.584 0 0 1 4.656 8.208 A 3.626 3.626 0 0 1 3.753 8.414 A 4.481 4.481 0 0 1 3.3 8.436 A 5.274 5.274 0 0 1 2.354 8.357 Q 1.431 8.188 0.852 7.662 A 2.519 2.519 0 0 1 0.088 6.313 A 3.823 3.823 0 0 1 0 5.472 L 0 0.108 Z M 13.008 0.264 L 12.84 1.236 A 11.04 11.04 0 0 0 12.318 1.119 A 12.216 12.216 0 0 0 12.24 1.104 A 5.566 5.566 0 0 0 11.964 1.052 Q 11.819 1.028 11.657 1.008 A 9.208 9.208 0 0 0 11.61 1.002 Q 11.256 0.96 10.872 0.96 A 4.626 4.626 0 0 0 10.436 0.979 Q 10.001 1.02 9.734 1.151 A 0.991 0.991 0 0 0 9.6 1.23 Q 9.216 1.5 9.216 2.064 Q 9.228 2.508 9.54 2.814 Q 9.852 3.12 10.32 3.378 A 12.014 12.014 0 0 0 10.94 3.696 A 14.634 14.634 0 0 0 11.346 3.882 A 6.586 6.586 0 0 1 12.193 4.329 A 5.916 5.916 0 0 1 12.372 4.446 A 3.288 3.288 0 0 1 13.066 5.072 A 3.065 3.065 0 0 1 13.158 5.19 Q 13.476 5.616 13.476 6.228 A 2.668 2.668 0 0 1 13.437 6.699 Q 13.367 7.09 13.17 7.368 Q 12.864 7.8 12.396 8.04 A 3.271 3.271 0 0 1 11.491 8.344 A 3.728 3.728 0 0 1 11.37 8.364 A 7.554 7.554 0 0 1 10.645 8.439 A 6.38 6.38 0 0 1 10.308 8.448 A 6.669 6.669 0 0 1 9.822 8.431 A 5.079 5.079 0 0 1 9.432 8.388 A 9.832 9.832 0 0 1 9.15 8.341 Q 9.011 8.316 8.889 8.289 A 5.243 5.243 0 0 1 8.748 8.256 Q 8.412 8.172 8.136 8.064 L 8.376 7.092 A 4.175 4.175 0 0 0 8.885 7.274 A 4.664 4.664 0 0 0 8.964 7.296 Q 9.24 7.368 9.582 7.428 A 4.034 4.034 0 0 0 10.107 7.484 A 4.708 4.708 0 0 0 10.308 7.488 A 6.359 6.359 0 0 0 10.797 7.47 A 4.92 4.92 0 0 0 11.166 7.428 A 3.062 3.062 0 0 0 11.509 7.356 Q 11.68 7.309 11.825 7.245 A 1.875 1.875 0 0 0 11.844 7.236 Q 12.132 7.104 12.294 6.888 Q 12.456 6.672 12.456 6.36 Q 12.444 5.892 12.15 5.598 A 2.739 2.739 0 0 0 11.856 5.345 Q 11.643 5.186 11.37 5.034 A 13.593 13.593 0 0 0 10.605 4.641 A 15.705 15.705 0 0 0 10.326 4.512 A 6.624 6.624 0 0 1 9.479 4.055 A 5.968 5.968 0 0 1 9.3 3.936 Q 8.832 3.612 8.514 3.168 A 1.664 1.664 0 0 1 8.237 2.51 A 2.317 2.317 0 0 1 8.196 2.064 Q 8.196 1.68 8.328 1.308 A 1.581 1.581 0 0 1 8.697 0.726 A 1.897 1.897 0 0 1 8.778 0.648 A 2.042 2.042 0 0 1 9.157 0.38 Q 9.359 0.267 9.606 0.18 A 2.84 2.84 0 0 1 10.061 0.063 Q 10.299 0.022 10.574 0.008 A 5.743 5.743 0 0 1 10.872 0 A 7.985 7.985 0 0 1 11.484 0.023 A 6.911 6.911 0 0 1 11.694 0.042 Q 12.084 0.084 12.372 0.132 A 11.542 11.542 0 0 1 12.837 0.224 A 9.91 9.91 0 0 1 13.008 0.264 Z M 14.964 8.292 L 14.964 0.108 L 17.592 0.108 A 6.789 6.789 0 0 1 18.569 0.175 A 5.268 5.268 0 0 1 19.35 0.348 A 3.709 3.709 0 0 1 20.306 0.79 A 3.329 3.329 0 0 1 20.7 1.092 A 3.245 3.245 0 0 1 21.465 2.125 A 3.885 3.885 0 0 1 21.57 2.364 Q 21.857 3.084 21.875 4.047 A 6.95 6.95 0 0 1 21.876 4.176 A 5.591 5.591 0 0 1 21.812 5.046 Q 21.736 5.53 21.569 5.937 A 3.42 3.42 0 0 1 21.54 6.006 A 3.808 3.808 0 0 1 21.026 6.87 A 3.351 3.351 0 0 1 20.628 7.29 A 3.668 3.668 0 0 1 19.369 8.014 A 4.218 4.218 0 0 1 19.272 8.046 A 5.379 5.379 0 0 1 17.98 8.28 A 6.311 6.311 0 0 1 17.592 8.292 L 14.964 8.292 Z M 15.972 1.032 L 15.972 7.368 L 17.592 7.368 A 4.615 4.615 0 0 0 18.519 7.277 A 4.096 4.096 0 0 0 18.834 7.2 Q 19.416 7.032 19.854 6.654 A 2.421 2.421 0 0 0 20.378 6.007 A 3.057 3.057 0 0 0 20.544 5.664 Q 20.763 5.133 20.792 4.404 A 5.735 5.735 0 0 0 20.796 4.176 Q 20.796 3.36 20.568 2.766 Q 20.34 2.172 19.926 1.788 A 2.521 2.521 0 0 0 19.143 1.298 A 3.034 3.034 0 0 0 18.918 1.218 A 4.01 4.01 0 0 0 18.164 1.063 A 5.149 5.149 0 0 0 17.592 1.032 L 15.972 1.032 Z"/></svg>')`,
            },
            '& + .MuiSwitch-track': {
              opacity: 1,
              backgroundColor: theme.palette.mode === 'dark' ? '#8796A5' : '#aab4be',
            },
          },
        },
        '& .MuiSwitch-thumb': {
          backgroundColor: theme.palette.mode === 'dark' ? '#003892' : '#001e3c',
          width: 32,
          height: 32,
          '&:before': {
            content: "''",
            position: 'absolute',
            width: '100%',
            height: '100%',
            left: 0,
            top: 0,
            backgroundRepeat: 'no-repeat',
            backgroundPosition: 'center',
            backgroundImage: `url('data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" width="23.28" height="8.184" viewBox="0 0 23.28 8.184"><path fill="${encodeURIComponent(
              '#fff',
            )}" d="M 0 8.184 L 0.432 0 L 1.716 0 L 3.564 4.872 Q 3.72 5.292 3.852 5.646 Q 3.965 5.95 4.052 6.197 A 21.655 21.655 0 0 1 4.08 6.276 Q 4.2 6.588 4.284 6.852 L 4.308 6.852 Q 4.38 6.588 4.488 6.276 A 68.977 68.977 0 0 0 4.577 6.02 Q 4.622 5.889 4.671 5.744 A 115.916 115.916 0 0 0 4.704 5.646 Q 4.824 5.292 4.992 4.872 L 6.876 0 L 8.16 0 L 8.58 8.184 L 7.56 8.184 L 7.356 3.684 A 124.615 124.615 0 0 1 7.34 3.268 Q 7.334 3.106 7.329 2.961 A 60.655 60.655 0 0 1 7.32 2.688 Q 7.308 2.28 7.308 2.016 L 7.308 1.512 L 7.284 1.512 Q 7.229 1.65 7.153 1.865 A 20.499 20.499 0 0 0 7.104 2.004 Q 7.018 2.24 6.889 2.596 A 1127.823 1127.823 0 0 0 6.858 2.682 A 175.166 175.166 0 0 1 6.736 3.017 Q 6.627 3.317 6.492 3.684 L 4.8 8.184 L 3.78 8.184 L 2.076 3.684 Q 1.919 3.288 1.802 2.969 A 17.727 17.727 0 0 1 1.704 2.694 Q 1.575 2.324 1.485 2.073 A 27.983 27.983 0 0 0 1.464 2.016 Q 1.356 1.704 1.296 1.512 L 1.272 1.512 Q 1.283 1.684 1.293 1.952 A 39.757 39.757 0 0 1 1.296 2.016 Q 1.308 2.52 1.26 3.684 L 1.02 8.184 L 0 8.184 Z M 17.112 8.184 L 17.112 0 L 18.072 0 L 22.368 6.492 L 22.392 6.492 A 18.032 18.032 0 0 1 22.367 6.038 A 21.798 21.798 0 0 1 22.356 5.748 A 10.871 10.871 0 0 1 22.338 5.434 Q 22.332 5.274 22.328 5.095 A 18.83 18.83 0 0 1 22.326 4.974 Q 22.32 4.536 22.32 4.08 L 22.32 0 L 23.28 0 L 23.28 8.184 L 22.32 8.184 L 18.024 1.668 L 18 1.668 Q 18.012 2.028 18.036 2.424 A 99.636 99.636 0 0 1 18.048 2.79 Q 18.054 2.983 18.06 3.197 A 160.141 160.141 0 0 1 18.06 3.204 A 31.986 31.986 0 0 1 18.072 4.088 A 15.86 15.86 0 0 1 18.072 4.092 L 18.072 8.184 L 17.112 8.184 Z M 9.684 8.184 L 12.048 4.02 L 9.684 0 L 10.824 0 L 12.756 3.324 L 14.676 0 L 15.816 0 L 13.392 4.116 L 15.828 8.184 L 14.664 8.184 L 12.696 4.764 L 10.824 8.184 L 9.684 8.184 Z"/></svg>')`,
          },
        },
        '& .MuiSwitch-track': {
          opacity: 1,
          backgroundColor: theme.palette.mode === 'dark' ? '#8796A5' : '#aab4be',
          borderRadius: 20 / 2,
        },
      }));

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
    await db.addReceipt(state.month.id, newReceiptName, newReceiptDate.$d);
    // console.log(newReceiptDate)
    setNewReceiptDate(null)
    setNewReceiptName("")

    fetchData();
  }

  const addExpense = async () => {
    const db = new DexieDB();
    await db.addExpense(state.month.id, "Rent", 13000, "USD");
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
        <tr key={receipt.id} onClick={()=>!edit ? navigate("/transactions", {state:{month:state.month, receipt}}):null} className='shadow-sm w-full bg-slate-50 border-dashed border-2 rounded-sm hover:bg-slate-100 hover:cursor-pointer'>
            <td>
                {edit && <input onChange={()=>toggleReceipt(receipt)} className='mr-2' type="checkbox"/>} {receipt.name}
            </td>
            <td>{dayjs(receipt.date).format("MM/DD/YYYY")}</td>
            <td>${displayUSDCurrency?((receipt.USD + receipt.MXN/17).toFixed(2)):(receipt.USD*17+receipt.MXN).toFixed(2)} {displayUSDCurrency?"USD":"MXN"}</td>
        </tr>
    )
  }

  function expenseComponent(expense) {
    return (
        <tr key={expense.id} className='shadow-sm w-full bg-slate-50 border-dashed border-0 rounded-sm '>
            <td>
            {edit && <input onChange={()=>toggleExpense(expense)} className='mr-2' type="checkbox"/>} {expense.name}
            </td>
            <td>${expense.USD}</td>
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
            <p className='text-4xl font-bold ml-4'>{state.month?.name}</p>
        </div>
        <div className='flex'>
            {!edit && <button disabled={data.receipts?.length<1 && data.expenses?.length<1} className='disabled:opacity-50 p-2 px-4 rounded-lg mx-4 text-white bg-slate-500 ' onClick={toggleEdit}>Edit</button>}
            {edit && (
                <div>
                    <button className='p-2 rounded-lg mx-4 text-white bg-slate-500 ' onClick={toggleEdit}>Cancel</button>
                    <button className='p-2 rounded-lg mx-4 text-white bg-red-500 ' onClick={deleteReceiptsAndExpenses}>Delete</button>
                </div>
            )}
            <FormControlLabel
                control={<MaterialUISwitch  checked={displayUSDCurrency} onChange={updateDisplayUSDCurrency} />}
                label="Currency Display"
            />
        </div>
        
        <div className='flex'>      
            <form className='w-full mr-2 mt-2 ' onSubmit={addReceipt}> 
                <p className='font-bold  text-2xl'>Receipts</p>
                <hr></hr>
                <table className='w-full text-left'>
                    {/* <thead>
                        <tr>
                            <th>Name</th>
                            <th>Date</th>
                            <th>Total</th>
                        </tr>
                    </thead> */}
                    <tbody>
                        <tr>
                            <td>
                            <input required type="text" value={newReceiptName} placeholder='Receipt Name' onChange={updateNewReceiptName} className='w-40 h-8 rounded-lg border-2 p-4 focus:outline-0 border-slate-200'></input>
                            </td>
                            <td>
                            <LocalizationProvider dateAdapter={AdapterDayjs}>
                                <DatePicker  slotProps={{ textField: { size: 'small', fullWidth:true, required:true } }} value={newReceiptDate} onChange={updateNewReceiptDate}/>
                            </LocalizationProvider>
                            </td>
                        </tr>


                        {data.receipts?.map(receipt => receiptComponent(receipt)).reverse()}
                    </tbody>
                </table>
                <input type="submit" hidden/>
            </form>

            <form className='w-full ml-2 mt-2 '>
                <p className='font-bold  text-2xl'>Expenses</p>
                <hr></hr>
                <table className='w-full text-left'>
                    {/* <thead>
                        <tr>
                            <th>Name</th>
                            <th>Total</th>
                        </tr>
                    </thead> */}
                    <tbody>
                        <tr>
                            <td>
                                <input required type="text" value={newExpenseName} placeholder='Expense Name' onChange={updateNewExpenseName} className='w-40 h-8 rounded-lg border-2 p-4 focus:outline-0 border-slate-200'></input>
                            </td>
                            <td>
                            <LocalizationProvider dateAdapter={AdapterDayjs}>
                                <DatePicker  slotProps={{ textField: { size: 'small', fullWidth:true, required:true } }} value={newReceiptDate} onChange={updateNewReceiptDate}/>
                            </LocalizationProvider>
                            </td>
                        </tr>
                        {data.expenses?.map(receipt => expenseComponent(receipt)).reverse()}
                    </tbody>
                </table>
            </form>

        </div>
    </div>
  );
  
}

export default Receipts;
