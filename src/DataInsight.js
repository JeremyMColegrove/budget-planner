import React, {useEffect, useState} from 'react'
import DexieDB from './DexieDB'
import { Doughnut,Line, Bar } from "react-chartjs-2";
import { Chart as ChartJS, ArcElement,BarElement, Tooltip, Legend,CategoryScale,LinearScale,PointElement,LineElement,Title, } from "chart.js";
import dayjs from 'dayjs';
import USDSwitch from './USDSwitch';

ChartJS.register(
    ArcElement, 
    Tooltip, 
    Legend, 
    BarElement,
    CategoryScale,
    LinearScale,
    PointElement,
    LineElement,
    Title,);

  const options = {
    responsive: true,
    plugins: {
      legend: {
        position: 'top'
      },
      title: {
        display: true,
        text: 'Monthy Spending',
      },
    },
  };

function DataInsight() {
    const [selectedMonth, setSelectedMonth] = useState(-1)
    const [data, setData] = useState([])
    const [showUSD, setShowUSD] = useState(true)
    const updateShowUSD = (e)=> setShowUSD(e.target.checked)
    const [doughnutData, setDoughnutData] = useState({
        labels:['Food', 'Entertainment', 'Transportation', 'Personal Care', 'Clothing', 'Miscellaneous', 'Expenses'], 
        datasets: [
            {
                label:`Total ${showUSD?"(USD)":"(MXN"}`, 
                data: [10, 5],
                borderWidth: 1,
                backgroundColor: [
                    'rgba(255, 99, 132, 0.2)',
                    'rgba(54, 162, 235, 0.2)',
                    'rgba(255, 206, 86, 0.2)',
                    'rgba(75, 192, 192, 0.2)',
                    'rgba(153, 102, 255, 0.2)',
                    'rgba(255, 159, 64, 0.2)',
                    'rgba(75, 159, 64, 0.2)',
                  ],
            }
        ]})
    const [monthlySpendingData, setMonthlySpendingData] = useState({
        labels:[],
        datasets: [{
            label: `Spending ${showUSD?"(USD)":"(MXN)"}`,
            data: [],
            borderColor: 'rgb(255, 99, 132)',
            backgroundColor: 'rgba(255, 99, 132, 0.5)',
        }]
    })
    useEffect(()=>{
        fetchData()
    }, [])

    useEffect(()=>{
        sortDataForGraphs()
    }, [selectedMonth, showUSD])

    useEffect(()=>{
        sortDataForGraphs()
    }, [data])

    const fetchData = async  () => {
        const db = new DexieDB()
        const data = await db.fetchData();
        setData(data)
    }

    function moneyRound(num) {
        return Math.ceil(num * 100) / 100;
    }

    const sortDataForGraphs = () => {
        var datasetCopy = JSON.parse(JSON.stringify(data))

        if (selectedMonth > -1) {
            datasetCopy.slice(selectedMonth, selectedMonth)
        } 

        

        var spending = []
        var labels = []

        // for monthly spending graph
        for (var i = 0; i<datasetCopy.length; i++) {
            var month = datasetCopy[i]    
            var total = 0;
            var averageConversion = 0
            for (var receipt of month.receipts) {
                averageConversion += receipt.conversionRate
              if (showUSD) {
                total += receipt.USD
                total += receipt.MXN / receipt.conversionRate
              } else {
                total += receipt.USD * receipt.conversionRate
                total += receipt.MXN
              }
            }
            averageConversion /= month.receipts.length
            for (var expense of month.expenses) {
                if (showUSD && expense.expenseCurrency == "MXN") {
                    total += expense.price / averageConversion
                  } else if (!showUSD && expense.expenseCurrency == "USD") {
                    total += expense.price * averageConversion
                  } else {
                    total += expense.price
                  }
            }
            // datasetCopy[i].total = total
            spending.push(total)
            labels.push(dayjs(month.date).format("MMM"))
          }

          setMonthlySpendingData(s=>{
            s = JSON.parse(JSON.stringify(s))
            s.datasets[0].data = spending
            s.labels = labels
            s.datasets[0].label = `Spending ${showUSD?"(USD)":"(MXN)"}`
            return s
          })

        var totalSpendingCat = [0, 0, 0, 0, 0, 0, 0]
        datasetCopy.forEach(m=>{
            m.expenses.forEach(e=>{
                if (showUSD && e.expenseCurrency == "MXN") {
                    totalSpendingCat[6] += e.price / averageConversion
                  } else if (!showUSD && e.expenseCurrency == "USD") {
                    totalSpendingCat[6] += e.price * averageConversion
                  } else {
                    totalSpendingCat[6] += e.price
                  }
            })

            m.receipts.forEach(r=>r.transactions.forEach(t=>{
            t.price = parseFloat(t.price)
            r.conversionRate = parseFloat(r.conversionRate)

            // convert the amount to the correct currency
            if (showUSD && t.transactionCurrency == "MXN") {
                t.price = moneyRound((t.price / r.conversionRate))
            } else if (!showUSD && t.transactionCurrency == "USD") {
                t.price = moneyRound((t.price * r.conversionRate))
            }

            // for each transaction, get the catagory
            switch (t.catagory) {
                case "Food":
                    totalSpendingCat[0]+= t.price;
                    break;
                case "Entertainment":
                    totalSpendingCat[1]+= t.price;
                    break;
                case "Transportation":
                    totalSpendingCat[2]+= t.price;
                    break;
                case "Personal Care":
                    totalSpendingCat[3]+= t.price;
                    break;
                case "Clothing":
                    totalSpendingCat[4]+= t.price;
                    break;
                case "Miscellaneous":
                    totalSpendingCat[5]+= t.price;
                    break;
            }
       }))})

        setDoughnutData(s=>{
            s = JSON.parse(JSON.stringify(s))
            s.datasets[0].data = totalSpendingCat
            s.datasets[0].label = `Total ${showUSD?"(USD)":"(MXN"}`
            return s;
        })
    }

  const monthComponent = (month, index, children)=> {
    return <div key={month.id} className={`w-30 mr-4 bg-slate-300 rounded-sm p-4 ${selectedMonth==index?"opacity-50":"hover:cursor-pointer hover:bg-slate-200"}`} onClick={()=>setSelectedMonth(index)}>
        {children}
    </div>
  }

  return (
    <div className='px-20 w-full'>
        {/* <p className='text-xl font-bold'>Month</p> */}
        <div className='flex my-6'>
            {monthComponent({id:1}, -1, <p>All Months</p>)}
            {data.map((month, index)=>{
                return monthComponent(month, index, <p>{dayjs(month.date).format("MMM YYYY")}</p>)
            })}

        </div>
        <div className='flex justify-evenly mb-6'>
            <p className='text-2xl font-bold mr-10'>Your spending, at a glance</p>
            <USDSwitch current={showUSD} handleSwitch={updateShowUSD}/>
        </div>
        <hr></hr>
        <div className='flex-wrap flex justify-evenly'>
            <div className='w-96 h-96 border-dashed border-2 my-3 border-slate-200'>
                <Doughnut data={doughnutData}  />
            </div>
            <div style={{width:'40em'}} className='h-96 flex justify-center items-center border-dashed border-2 my-3 border-slate-200'>
                <Bar options={options} data={monthlySpendingData} />
            </div>
        </div>
    </div>
  )
}

export default DataInsight