import React, { useState, useEffect } from 'react';
import './App.css';

function App() {
  const [activeTab, setActiveTab] = useState('dashboard');
  const [inventory, setInventory] = useState([]);
  const [dailySales, setDailySales] = useState([]);
  const [expenses, setExpenses] = useState({
    rent: 15000,
    electricity: 3000,
    salary: 25000,
    transportation: 4000,
    insurance: 2000,
    other: 10000
  });

  const totalExpenses = Object.values(expenses).reduce((sum, val) => sum + val, 0);
  const totalStockValue = inventory.reduce((sum, item) => sum + (item.purchasePrice * item.stock), 0);
  const totalRevenue = inventory.reduce((sum, item) => sum + (item.sellingPrice * item.stock), 0);
  const totalProfit = inventory.reduce((sum, item) => {
    const grossProfit = item.sellingPrice - item.purchasePrice;
    const commission = (item.sellingPrice * item.commission) / 100;
    const gst = (item.sellingPrice * item.gst) / 100;
    const netProfit = grossProfit - commission - gst;
    return sum + (netProfit * item.stock);
  }, 0);

  const addInventoryItem = (item) => {
    setInventory([...inventory, { ...item, id: Date.now() }]);
  };

  const addSale = (sale) => {
    setDailySales([...dailySales, { ...sale, id: Date.now(), date: new Date().toISOString().split('T')[0] }]);
  };

  return (
    <div className="App">
      <header className="app-header">
        <h1>🏪 SmartRetail AI</h1>
        <p>Complete Business Management System</p>
      </header>

      <nav className="nav-tabs">
        <button 
          className={activeTab === 'dashboard' ? 'active' : ''}
          onClick={() => setActiveTab('dashboard')}
        >
          📊 Dashboard
        </button>
        <button 
          className={activeTab === 'inventory' ? 'active' : ''}
          onClick={() => setActiveTab('inventory')}
        >
          📦 Inventory
        </button>
        <button 
          className={activeTab === 'sales' ? 'active' : ''}
          onClick={() => setActiveTab('sales')}
        >
          💰 Sales
        </button>
        <button 
          className={activeTab === 'analysis' ? 'active' : ''}
          onClick={() => setActiveTab('analysis')}
        >
          📈 Analysis
        </button>
      </nav>

      <main className="main-content">
        {activeTab === 'dashboard' && (
          <Dashboard 
            totalStockValue={totalStockValue}
            totalRevenue={totalRevenue}
            totalProfit={totalProfit}
            totalExpenses={totalExpenses}
            inventory={inventory}
          />
        )}
        
        {activeTab === 'inventory' && (
          <InventoryManager 
            inventory={inventory}
            addInventoryItem={addInventoryItem}
          />
        )}
        
        {activeTab === 'sales' && (
          <SalesTracker 
            dailySales={dailySales}
            addSale={addSale}
            inventory={inventory}
          />
        )}
        
        {activeTab === 'analysis' && (
          <BusinessAnalysis 
            totalStockValue={totalStockValue}
            totalProfit={totalProfit}
            totalExpenses={totalExpenses}
            inventory={inventory}
          />
        )}
      </main>
    </div>
  );
}

function Dashboard({ totalStockValue, totalRevenue, totalProfit, totalExpenses, inventory }) {
  const roi = totalStockValue > 0 ? ((totalProfit - totalExpenses) / totalStockValue * 100).toFixed(2) : 0;
  const breakEven = totalExpenses > 0 ? (totalExpenses / 30).toFixed(0) : 0;

  return (
    <div className="dashboard">
      <h2>📊 Business Dashboard</h2>
      
      <div className="metrics-grid">
        <div className="metric-card">
          <h3>💼 Total Investment</h3>
          <p className="metric-value">₹{totalStockValue.toLocaleString()}</p>
        </div>
        
        <div className="metric-card">
          <h3>💰 Potential Revenue</h3>
          <p className="metric-value">₹{totalRevenue.toLocaleString()}</p>
        </div>
        
        <div className="metric-card">
          <h3>📈 Potential Profit</h3>
          <p className="metric-value">₹{totalProfit.toLocaleString()}</p>
        </div>
        
        <div className="metric-card">
          <h3>📉 Monthly Expenses</h3>
          <p className="metric-value">₹{totalExpenses.toLocaleString()}</p>
        </div>
        
        <div className="metric-card">
          <h3>🎯 ROI</h3>
          <p className={`metric-value ${roi > 0 ? 'positive' : 'negative'}`}>{roi}%</p>
        </div>
        
        <div className="metric-card">
          <h3>⚖️ Daily Break-even</h3>
          <p className="metric-value">₹{breakEven}</p>
        </div>
      </div>
      
      <div className="inventory-summary">
        <h3>📦 Inventory Summary</h3>
        <p>Total Items: {inventory.length}</p>
        <p>Categories: {[...new Set(inventory.map(item => item.category))].length}</p>
      </div>
    </div>
  );
}

function InventoryManager({ inventory, addInventoryItem }) {
  const [newItem, setNewItem] = useState({
    name: '',
    category: '',
    purchasePrice: '',
    sellingPrice: '',
    commission: '',
    gst: '',
    stock: ''
  });

  const handleSubmit = (e) => {
    e.preventDefault();
    if (newItem.name && newItem.purchasePrice && newItem.sellingPrice) {
      addInventoryItem({
        ...newItem,
        purchasePrice: parseFloat(newItem.purchasePrice),
        sellingPrice: parseFloat(newItem.sellingPrice),
        commission: parseFloat(newItem.commission) || 0,
        gst: parseFloat(newItem.gst) || 0,
        stock: parseInt(newItem.stock) || 0
      });
      setNewItem({
        name: '',
        category: '',
        purchasePrice: '',
        sellingPrice: '',
        commission: '',
        gst: '',
        stock: ''
      });
    }
  };

  return (
    <div className="inventory-manager">
      <h2>📦 Inventory Management</h2>
      
      <form onSubmit={handleSubmit} className="add-item-form">
        <h3>Add New Item</h3>
        <div className="form-grid">
          <input
            type="text"
            placeholder="Item Name"
            value={newItem.name}
            onChange={(e) => setNewItem({...newItem, name: e.target.value})}
            required
          />
          <input
            type="text"
            placeholder="Category"
            value={newItem.category}
            onChange={(e) => setNewItem({...newItem, category: e.target.value})}
          />
          <input
            type="number"
            placeholder="Purchase Price"
            value={newItem.purchasePrice}
            onChange={(e) => setNewItem({...newItem, purchasePrice: e.target.value})}
            required
          />
          <input
            type="number"
            placeholder="Selling Price"
            value={newItem.sellingPrice}
            onChange={(e) => setNewItem({...newItem, sellingPrice: e.target.value})}
            required
          />
          <input
            type="number"
            placeholder="Commission %"
            value={newItem.commission}
            onChange={(e) => setNewItem({...newItem, commission: e.target.value})}
          />
          <input
            type="number"
            placeholder="GST %"
            value={newItem.gst}
            onChange={(e) => setNewItem({...newItem, gst: e.target.value})}
          />
          <input
            type="number"
            placeholder="Stock Quantity"
            value={newItem.stock}
            onChange={(e) => setNewItem({...newItem, stock: e.target.value})}
          />
        </div>
        <button type="submit">Add Item</button>
      </form>
      
      <div className="inventory-list">
        <h3>Current Inventory</h3>
        <div className="table-container">
          <table>
            <thead>
              <tr>
                <th>Item</th>
                <th>Category</th>
                <th>Purchase</th>
                <th>Selling</th>
                <th>Stock</th>
                <th>Value</th>
              </tr>
            </thead>
            <tbody>
              {inventory.map(item => (
                <tr key={item.id}>
                  <td>{item.name}</td>
                  <td>{item.category}</td>
                  <td>₹{item.purchasePrice}</td>
                  <td>₹{item.sellingPrice}</td>
                  <td>{item.stock}</td>
                  <td>₹{(item.purchasePrice * item.stock).toLocaleString()}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

function SalesTracker({ dailySales, addSale, inventory }) {
  const [newSale, setNewSale] = useState({
    itemName: '',
    quantity: ''
  });

  const handleSubmit = (e) => {
    e.preventDefault();
    if (newSale.itemName && newSale.quantity) {
      const item = inventory.find(i => i.name === newSale.itemName);
      if (item) {
        const revenue = item.sellingPrice * parseInt(newSale.quantity);
        const cost = item.purchasePrice * parseInt(newSale.quantity);
        const commission = (revenue * item.commission) / 100;
        const profit = revenue - cost - commission;
        
        addSale({
          ...newSale,
          quantity: parseInt(newSale.quantity),
          revenue,
          cost,
          commission,
          profit
        });
        setNewSale({ itemName: '', quantity: '' });
      }
    }
  };

  const totalDailySales = dailySales.reduce((sum, sale) => sum + sale.revenue, 0);
  const totalDailyProfit = dailySales.reduce((sum, sale) => sum + sale.profit, 0);

  return (
    <div className="sales-tracker">
      <h2>💰 Sales Tracking</h2>
      
      <div className="sales-summary">
        <div className="metric-card">
          <h3>Today's Revenue</h3>
          <p className="metric-value">₹{totalDailySales.toLocaleString()}</p>
        </div>
        <div className="metric-card">
          <h3>Today's Profit</h3>
          <p className="metric-value">₹{totalDailyProfit.toLocaleString()}</p>
        </div>
      </div>
      
      <form onSubmit={handleSubmit} className="add-sale-form">
        <h3>Record Sale</h3>
        <select
          value={newSale.itemName}
          onChange={(e) => setNewSale({...newSale, itemName: e.target.value})}
          required
        >
          <option value="">Select Item</option>
          {inventory.map(item => (
            <option key={item.id} value={item.name}>{item.name}</option>
          ))}
        </select>
        <input
          type="number"
          placeholder="Quantity Sold"
          value={newSale.quantity}
          onChange={(e) => setNewSale({...newSale, quantity: e.target.value})}
          required
        />
        <button type="submit">Record Sale</button>
      </form>
      
      <div className="sales-list">
        <h3>Today's Sales</h3>
        <table>
          <thead>
            <tr>
              <th>Item</th>
              <th>Quantity</th>
              <th>Revenue</th>
              <th>Profit</th>
            </tr>
          </thead>
          <tbody>
            {dailySales.map(sale => (
              <tr key={sale.id}>
                <td>{sale.itemName}</td>
                <td>{sale.quantity}</td>
                <td>₹{sale.revenue.toLocaleString()}</td>
                <td>₹{sale.profit.toLocaleString()}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

function BusinessAnalysis({ totalStockValue, totalProfit, totalExpenses, inventory }) {
  const netProfit = totalProfit - totalExpenses;
  const roi = totalStockValue > 0 ? (netProfit / totalStockValue * 100).toFixed(2) : 0;
  const survivalScore = roi > 15 ? 85 : roi > 5 ? 65 : roi > 0 ? 45 : 25;
  
  const growthStrategies = [
    { name: 'Digital Marketing', investment: 15000, roi: 200, timeline: '3 months' },
    { name: 'Loyalty Program', investment: 5000, roi: 300, timeline: '1 month' },
    { name: 'Home Delivery', investment: 12000, roi: 220, timeline: '2 months' },
    { name: 'POS System', investment: 20000, roi: 400, timeline: '1 month' },
    { name: 'Fresh Produce Section', investment: 25000, roi: 180, timeline: '1 month' }
  ];

  return (
    <div className="business-analysis">
      <h2>📈 Business Analysis</h2>
      
      <div className="analysis-grid">
        <div className="analysis-card">
          <h3>💰 Financial Health</h3>
          <p>Net Profit: ₹{netProfit.toLocaleString()}</p>
          <p>ROI: {roi}%</p>
          <p className={netProfit > 0 ? 'positive' : 'negative'}>
            Status: {netProfit > 0 ? 'Profitable' : 'Loss Making'}
          </p>
        </div>
        
        <div className="analysis-card">
          <h3>🔮 5-Year Survival</h3>
          <p className="survival-score">{survivalScore}%</p>
          <p>Risk Level: {survivalScore > 70 ? 'Low' : survivalScore > 50 ? 'Medium' : 'High'}</p>
        </div>
        
        <div className="analysis-card">
          <h3>📊 Break-even Analysis</h3>
          <p>Daily Target: ₹{(totalExpenses / 30).toFixed(0)}</p>
          <p>Monthly Target: ₹{totalExpenses.toLocaleString()}</p>
        </div>
      </div>
      
      <div className="growth-strategies">
        <h3>🚀 Growth Strategies</h3>
        <div className="strategies-grid">
          {growthStrategies.map((strategy, index) => (
            <div key={index} className="strategy-card">
              <h4>{strategy.name}</h4>
              <p>Investment: ₹{strategy.investment.toLocaleString()}</p>
              <p>Expected ROI: {strategy.roi}%</p>
              <p>Timeline: {strategy.timeline}</p>
            </div>
          ))}
        </div>
      </div>
      
      <div className="recommendations">
        <h3>💡 Recommendations</h3>
        <ul>
          <li>Focus on high-margin items (Appliances, Furniture)</li>
          <li>Implement inventory turnover tracking</li>
          <li>Develop customer loyalty programs</li>
          <li>Consider online sales channels</li>
          <li>Optimize supplier relationships for better margins</li>
        </ul>
      </div>
    </div>
  );
}

export default App;