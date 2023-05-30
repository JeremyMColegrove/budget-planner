import {React, useState} from 'react';
import { BrowserRouter as Router, Route, Routes} from 'react-router-dom';

import Months from './Months.js';
import Receipts from './Receipts';
import Transactions from './Transactions';
import './index.css'
import Dashbar from './Dashbar.js';
import DataInsight from './DataInsight.js';


const Overview = () => {
  return <Router>
      <Routes>
        <Route path="budget-planner/receipts" element={<Receipts />}/>
        <Route path="budget-planner/transactions" element={<Transactions />}/>
        <Route path="*" element={<Months/>}/>
      </Routes>
    </Router>
}

const DataInsights = () => {
  return <DataInsight/>
}
function App() {
  const [location, setLocation] = useState("dashboard")

  return (
    <>
      <Dashbar currentLink={location} handleLinkClicked={setLocation}/>
      {location=="dashboard" && Overview()}
      {location=="data" && DataInsights()}
    </>

  );
}

export default App;
