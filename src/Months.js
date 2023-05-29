import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';

import DexieDB from './DexieDB';
import Dexie from 'dexie';

function Months() {
  const [months, setMonths] = useState([]);

  useEffect(() => {
    fetchData();
  }, []);

  async function fetchData() {
    const db = new DexieDB();
    const months = await db.getMonths();
    setMonths(months);
  }


  async function deleteMonths() {
    const db = new DexieDB();
    await db.deleteMonths();
    fetchData()
  }

  function monthComponent(month) {
    return (
            <div className='rounded-sm border-2 border-solid hover:bg-slate-100 border-gray-200 flex bg-slate-50 shadow-sm'>
                <Link to={`/receipts`} state={{month:month}} key={month.id} >
                    <div className='p-8 font-medium'>{month.name}</div>
                    <hr></hr>
                    <div className='px-8 py-4'>${month.showUSD?(month.USD + month.MXN/17).toFixed(2):(month.USD*17 + month.MXN).toFixed(2)} {month.showUSD?"USD":"MXN"}</div>
                </Link>
            </div>
    )
  }

  return (
    <div className="w-full px-20 py-8">
        <button onClick={deleteMonths}>Delete Months</button>
        <p className='text-4xl font-bold pb-8'>Current Month</p>
        <div className='flex'>
            {months && months.length > 0 && monthComponent(months[0])}
        </div>
        <p className='text-4xl font-bold py-8'>Previous Months</p>
        <div className='flex overflow-scroll'>
            {months.slice(1).map(month => monthComponent(month))}
        </div>
      
    </div>
  );
}

export default Months;
