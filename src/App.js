import React from 'react';
import { BrowserRouter as Router, Route, Routes} from 'react-router-dom';

import Months from './Months.js';
import Receipts from './Receipts';
import Transactions from './Transactions';
import './index.css'

function App() {
  return (
    <>
    <Router>
      <Routes>
        <Route path="/receipts" element={<Receipts />}/>
        <Route path="/transactions" element={<Transactions />}/>
        <Route path="*" element={<Months/>}/>
      </Routes>
    </Router>
    </>

  );
}

export default App;
