import React from 'react'
import logo from './logo192.png'

function Dashbar({handleLinkClicked, currentLink}) {

    const handleClick = (link) => {
        if (currentLink != link)
            handleLinkClicked(link)
    }

    return (
        <div className='w-full h-16 bg-slate-200'>
            {/* Display logo */}
            <div className='flex items-center h-full mx-20'>
                <img src={logo} className='w-8 aspect-square rounded-md object-cover'/>
                <p className='text-lg font-bold mx-4'>Budgetr</p>

                {/* links */}
                <div onClick={()=>handleClick("dashboard")} className={`font-bold  py-2 px-4 rounded-md ${currentLink=="dashboard"?"opacity-50 hover:cursor-auto":"text-slate-700 hover:text-slate-500 hover:cursor-pointer"}`}>Dashboard</div>
                <div onClick={()=>handleClick("data")} className={`font-bold  py-2 px-4 rounded-md ${currentLink=="data"?"opacity-50 hover:cursor-auto":"text-slate-700 hover:text-slate-500 hover:cursor-pointer"}`}>Data Insights</div>

            </div>

        </div>
    )
}

export default Dashbar