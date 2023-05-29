import Dexie from 'dexie';

class DexieDB extends Dexie {
  constructor() {
    super('BudgetApp');

    this.version(7).stores({
        months: '++id, name, MXN, USD, showUSD',
        receipts: '++id, monthId, name, USD, MXN, date',
        transactions: '++id, catagory, receiptId, name, price, transactionCurrency',
        expenses: '++id, monthId, name, price, expenseCurrency'
    });
      

    this.months = this.table('months');
    this.receipts = this.table('receipts');
    this.transactions = this.table('transactions');
    this.expenses = this.table('expenses')
    this.initialize();
  }

  async initialize() {
    const lastMonth = await this.months.toCollection().last();
    if (!lastMonth || this.isNewMonth(lastMonth.name)) {
      await this.addMonth();
    }
  }

  isNewMonth(lastMonthName) {
    const lastMonthDate = new Date(lastMonthName);
    const currentMonth = new Date();
    return lastMonthDate.getMonth() !== currentMonth.getMonth() || lastMonthDate.getFullYear() !== currentMonth.getFullYear();
  }

  async updateMonthCurrency(monthId, showUSD) {
    const month = await this.months.get(monthId)
    
    if (!month) {
        console.error(`Could not find month with ID ${monthId}`)
        return
    }

    month.showUSD = showUSD

    await this.months.put(month)
  }

  async addMonth() {
    const monthName = new Date().toLocaleString('default', { month: 'long', year: 'numeric' });
    await this.months.add({ name: monthName, USD:0, MXN:0, showUSD:true});
  }

    async deleteMonths() {
        const months = (await this.getMonths()).flatMap(month=>month.id);
        await this.months.bulkDelete(months);
        await this.addMonth()
    }

  async getMonths() {
    return this.months.toArray();
  }

  async getReceiptsAndExpenses(monthId) {
    const receipts = await this.receipts.where('monthId').equals(monthId).toArray();
    const expenses = await this.expenses.where('monthId').equals(monthId).toArray();
    return {receipts, expenses};
  }

  async addReceipt(monthId, name, date) {
    await this.receipts.add({ monthId: monthId, name, USD:0, MXN:0, date});
  }

  async addExpense(monthId, name, price, expenseCurrency) {
    await this.expenses.add({ monthId: monthId, name, total: price, expenseCurrency});
    
    // Update the month total
    const month = await this.months.get(monthId);
    if (month) {
      month[expenseCurrency] += price;
      await this.months.put(month);
    } else {
      console.error(`Could not find month with ID ${monthId}`);
    }
}

  async getTransactions(receiptId) {
    return this.transactions.where('receiptId').equals(receiptId).toArray();
  }

  // DexieDB.js

async addTransaction(receiptId, name, price, transactionCurrency, catagory) { 
    this.transaction('rw', this.transactions, this.receipts, this.months, async () => {
        try {
            await this.transactions.add({ receiptId: receiptId, name, price, catagory, transactionCurrency });
        
            const receipt = await this.receipts.get(receiptId);
            if (receipt) {
                receipt[transactionCurrency] += price;
                await this.receipts.put(receipt);
        
                const month = await this.months.get(receipt.monthId);
                if (month) {
                    month[transactionCurrency] += price;
                    await this.months.put(month);
                }
            }
        } catch (error) {
            console.error('Failed to add transaction:', error);
        }
    });
  }
  


async deleteReceiptsAndExpenses(selected, monthId) {

    // Before deleting the receipt, we need to deduct its total from the month's total
    const receipts = await this.receipts.bulkGet(selected.receipts);
    const expenses = await this.expenses.bulkGet(selected.expenses)

    const month = await this.months.get(monthId);

    if (month) {
        for (var receipt of receipts) {
            month.USD -= receipt.USD;
            month.MXN -= receipt.MXN;
        }

        for (var expense of expenses) {
            month[expense.expenseCurrency] -= expense.total;
        }
        await this.months.put(month);
    }
      
    
    await this.transactions.where('receiptId').anyOf(selected.receipts).delete()
    await this.receipts.bulkDelete(selected.receipts);
    await this.expenses.bulkDelete(selected.expenses)
  }
  
  async deleteTransactions(selected, monthId, receiptId) {
    // Before deleting the transaction, we need to deduct its price from the receipt's and month's total
    const transactions = await this.transactions.bulkGet(selected)
    const receipt = await this.receipts.get(receiptId)
    const month = await this.months.get(monthId)

    if (!receipt || !month) {
        console.error(`Could not find month or receipt for transaction.`)
        return
    }

    for (var trans of transactions) {
        receipt[trans.transactionCurrency] -= trans.price
        month[trans.transactionCurrency] -= trans.price
    }

    await this.months.put(month)
    await this.receipts.put(receipt)
    await this.transactions.bulkDelete(selected)
  }
}

export default DexieDB;
