import React, { useState } from 'react';
import './App.css';

function App() {
  const [expenses, setExpenses] = useState([]);

  const addExpense = (expense) => {
    setExpenses([...expenses, expense]);
  };

  const deleteExpense = (index) => {
    setExpenses(expenses.filter((_, i) => i !== index));
  };

  const total = expenses.reduce((sum, exp) => sum + parseFloat(exp.amount), 0);

  return (
    <div className="App">
      <h1>Expense Tracker</h1>
      <ExpenseForm onAdd={addExpense} />
      <ExpenseList expenses={expenses} onDelete={deleteExpense} />
      <h2>Total: ${total.toFixed(2)}</h2>
    </div>
  );
}

function ExpenseForm({ onAdd }) {
  const [description, setDescription] = useState('');
  const [amount, setAmount] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    if (description && amount) {
      onAdd({ description, amount: parseFloat(amount) });
      setDescription('');
      setAmount('');
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <input
        type="text"
        placeholder="Description"
        value={description}
        onChange={(e) => setDescription(e.target.value)}
      />
      <input
        type="number"
        placeholder="Amount"
        value={amount}
        onChange={(e) => setAmount(e.target.value)}
      />
      <button type="submit">Add Expense</button>
    </form>
  );
}

function ExpenseList({ expenses, onDelete }) {
  return (
    <ul>
      {expenses.map((exp, index) => (
        <ExpenseItem key={index} expense={exp} onDelete={() => onDelete(index)} />
      ))}
    </ul>
  );
}

function ExpenseItem({ expense, onDelete }) {
  return (
    <li>
      {expense.description}: ${expense.amount.toFixed(2)}
      <button onClick={onDelete}>Delete</button>
    </li>
  );
}

export default App;
