import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import FileDownloadIcon from '@mui/icons-material/FileDownload';
import FileUploadIcon from '@mui/icons-material/FileUpload';
import DexieDB from './DexieDB';
import Dexie from 'dexie';
import { IconButton } from '@mui/material';
import dayjs from 'dayjs';
import PrintIcon from '@mui/icons-material/Print';
import * as XLSX from 'xlsx';

function Months() {
  const [months, setMonths] = useState([]);

  useEffect(() => {
    fetchData();
  }, []);

  async function fetchData() {
    const db = new DexieDB();
    var months = await db.getMonths();
    for (var i = 0; i<months.length; i++) {
      var month = months[i]
      var receipts = await db.getReceiptsAndExpenses(month.id)
      months[i].receipts = receipts.receipts

      var total = 0;
      for (var receipt of month.receipts) {
        if (month.showUSD) {
          total += receipt.USD
          total += receipt.MXN / receipt.conversionRate
        } else {
          total += receipt.USD * receipt.conversionRate
          total += receipt.MXN
        }
      }
      months[i].total = total
    }
    setMonths(months);
  }


  async function deleteMonths() {
    const db = new DexieDB();
    // await db.deleteMonths();
    await db.clearData()
    fetchData()
  }

  function monthComponent(month) {
    return (
            <div className='rounded-sm border-2 border-solid hover:bg-slate-100 border-gray-200 flex bg-slate-50 shadow-sm'>
                <Link to={`budget-planner/receipts`} state={{month:month}} key={month.id} >
                    <div className='p-8 font-medium'>{dayjs(month.name).format("MMM, YYYY")}</div>
                    <hr></hr>
                    <div className='px-8 py-4'>{`$${month.total?.toFixed(2)} ${month.showUSD?"USD":"MXN"}`}</div>
                </Link>
            </div>
    )
  }

  const handleDownload = async () => {
    const db = new DexieDB()
    const blob = await db.exportDB();
    const url = URL.createObjectURL(blob);

    const link = document.createElement('a');
    link.href = url;
    link.download = 'database.json';
    link.click();

    URL.revokeObjectURL(url);
  }

  const handleUpload = async (event) => {
    const file = event.target.files[0];
    if (file) {
      let db = new DexieDB()
      const reader = new FileReader();
      reader.onload = async (e) => {
        const data = e.target.result;
        await db.clearData(); // Clear the old data
        await db.importDB(new Blob([data])); // Import the new data
        window.location.reload(); // Refresh the page after import
      };
      reader.readAsText(file);
    }
  }

  const triggerFileUpload = () => {
    document.getElementById("file-upload").click();
  }



    async function exportToExcel() {
        const db = new DexieDB()
        const data = await db.fetchData();
        const workbook = XLSX.utils.book_new();

        for (let i = 0; i < data.length; i++) {
            const month = data[i];

            const receipts = month.receipts.map(receipt => {
                return receipt.transactions.map(transaction => {
                    return {
                        monthName: month.monthName,
                        MXN: month.MXN,
                        USD: month.USD,
                        receiptName: receipt.receiptName,
                        receiptUSD: receipt.USD,
                        receiptMXN: receipt.MXN,
                        transactionName: transaction.name,
                        transactionPrice: transaction.price,
                        transactionCurrency: transaction.transactionCurrency,
                        transactionCategory: transaction.catagory
                    };
                });
            }).flat();

            const expenses = month.expenses.map(expense => {
                return {
                    monthName: month.monthName,
                    MXN: month.MXN,
                    USD: month.USD,
                    expenseName: expense.expenseName,
                    expensePrice: expense.price,
                    expenseCurrency: expense.expenseCurrency
                };
            });

            const worksheetReceipts = XLSX.utils.json_to_sheet(receipts);
            const worksheetExpenses = XLSX.utils.json_to_sheet(expenses);

            XLSX.utils.book_append_sheet(workbook, worksheetReceipts, `${dayjs(month.monthName).format("MMMYYYY")}-Receipts`);
            XLSX.utils.book_append_sheet(workbook, worksheetExpenses, `${dayjs(month.monthName).format("MMMYYYY")}-Expenses`);
        }

        XLSX.writeFile(workbook, "BudgetData.xlsx");
    }

  
  return (
    <div className="w-full px-20 py-8">
        {/* <button onClick={deleteMonths}>Delete All Data</button> */}
        <div className="flex justify-between items-center">
            <p className='text-4xl font-bold pb-8'>Current Month</p>
            <div className='flex'>
                <div className='mr-10'>
                    <IconButton onClick={exportToExcel} className='aspect-square mr-10'>
                        <PrintIcon/>
                    </IconButton>
                </div>
                <div className='mr-10'>
                    <IconButton onClick={handleDownload} className='aspect-square mr-10'>
                        <FileDownloadIcon/>
                    </IconButton>
                </div>
                <div>
                    <IconButton onClick={triggerFileUpload} className='aspect-square ml-9'>
                        <FileUploadIcon/>
                        <input 
                            type="file"
                            id="file-upload"
                            style={{ display: 'none' }}
                            onChange={handleUpload} 
                        />
                    </IconButton>
                </div>
                
            </div>
            
        </div>
        <div className='flex'>
            {months && months.length > 0 && monthComponent(months[0])}
        </div>
        <p className='text-4xl font-bold py-8'>Previous Months</p>
        <div className='flex overflow-scroll'>
            {months.slice(1).map(month => monthComponent(month))}
            {months.length < 2 && "No Previous Months"}
        </div>
      
    </div>
  );
}

export default Months;
