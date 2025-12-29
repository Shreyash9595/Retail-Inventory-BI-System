import { useState, useEffect } from 'react'

function App() {
  const [bangleId, setBangleId] = useState('')
  const [size, setSize] = useState('2-4')
  const [qty, setQty] = useState(1)
  const [price, setPrice] = useState('') // New Price State
  const [stock, setStock] = useState([])
  const [searchTerm, setSearchTerm] = useState('')
  const [isSaleMode, setIsSaleMode] = useState(true)
  const [showDropdown, setShowDropdown] = useState(false)
  const [darkMode, setDarkMode] = useState(true)

  const fetchStock = async () => {
    const data = await window.api.getStock()
    setStock(data)
  }

  useEffect(() => {
    fetchStock()
    document.title = "Inventory Manager"
  }, [])

  const allIds = Array.from({ length: 300 }, (_, i) => `A${i + 1}`)
  const filteredIds = allIds.filter(id => id.includes(bangleId.toUpperCase()))

  const handleAction = async () => {
    if (!bangleId) return alert("Select a Bangle ID!")
    
    // Pass price only if in Restock mode
    const payload = { 
      id: bangleId, 
      size, 
      qty: parseInt(qty),
      price: isSaleMode ? 0 : parseInt(price || 0) 
    }

    const action = isSaleMode ? window.api.recordSale : window.api.updateStock
    await action(payload)
    
    setBangleId('')
    setPrice('') // Clear price field
    fetchStock()
  }

  const theme = {
    bg: darkMode ? '#121212' : '#f4f7f9',
    card: darkMode ? '#1e1e1e' : '#fff',
    text: darkMode ? '#e0e0e0' : '#2c3e50',
    subText: darkMode ? '#a0a0a0' : '#7f8c8d',
    border: darkMode ? '#333' : '#e1e8ed',
    inputBg: darkMode ? '#2d2d2d' : '#fff',
    rowEven: darkMode ? '#252525' : '#f8f9fa'
  }

  // Calculate Grand Total Value of entire shop
  const grandTotal = stock.reduce((acc, item) => acc + (item.quantity * (item.price || 0)), 0);

  return (
    <div style={{ padding: '40px', backgroundColor: theme.bg, color: theme.text, minHeight: '100vh', fontFamily: "'Segoe UI', Roboto, sans-serif", transition: '0.3s' }}>
      
      {/* HEADER */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '30px' }}>
        <div>
          <h1 style={{ margin: 0, fontSize: '28px', fontWeight: '700', color: darkMode ? '#4db8ff' : '#2c3e50' }}>Inventory Manager</h1>
          <div style={{ color: theme.subText, fontSize: '14px', marginTop: '5px' }}>
            Total Shop Value: <span style={{ color: '#2ecc71', fontWeight: 'bold' }}>₹{grandTotal.toLocaleString()}</span>
          </div>
        </div>
        <button 
          onClick={() => setDarkMode(!darkMode)}
          style={{ cursor: 'pointer', background: theme.card, color: theme.text, border: `1px solid ${theme.border}`, borderRadius: '20px', padding: '8px 16px', fontSize: '12px' }}
        >
          {darkMode ? '☀️ Light Mode' : '🌙 Dark Mode'}
        </button>
      </div>

      {/* ACTION CARD */}
      <div style={{ background: theme.card, padding: '30px', borderRadius: '12px', boxShadow: '0 8px 24px rgba(0,0,0,0.2)', marginBottom: '30px', border: `1px solid ${theme.border}` }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '20px' }}>
          <h2 style={{ fontSize: '18px', margin: 0 }}>{isSaleMode ? '📝 Record Sale' : '➕ Restock & Update Price'}</h2>
          <button 
            onClick={() => setIsSaleMode(!isSaleMode)}
            style={{ cursor: 'pointer', background: 'transparent', color: '#3498db', border: '1px solid #3498db', borderRadius: '6px', padding: '6px 12px', fontSize: '12px', fontWeight: '600' }}
          >
            Switch to {isSaleMode ? 'Restock' : 'Sale'}
          </button>
        </div>

        <div style={{ display: 'flex', gap: '20px', alignItems: 'center', flexWrap: 'wrap' }}>
          <div style={{ position: 'relative', flex: '1', minWidth: '200px' }}>
            <label style={{ display: 'block', fontSize: '12px', color: theme.subText, marginBottom: '5px' }}>Bangle ID</label>
            <input
              type="text"
              placeholder="Search (e.g. A10)..."
              value={bangleId}
              onFocus={() => setShowDropdown(true)}
              onBlur={() => setTimeout(() => setShowDropdown(false), 200)}
              onChange={(e) => setBangleId(e.target.value.toUpperCase())}
              style={{ width: '100%', padding: '12px', borderRadius: '8px', border: `1px solid ${theme.border}`, backgroundColor: theme.inputBg, color: theme.text, fontSize: '16px', outline: 'none' }}
            />
            {showDropdown && (
              <div style={{ position: 'absolute', top: '100%', left: 0, width: '100%', maxHeight: '200px', overflowY: 'auto', background: theme.card, borderRadius: '8px', zIndex: 10, boxShadow: '0 10px 25px rgba(0,0,0,0.3)', marginTop: '5px', border: `1px solid ${theme.border}` }}>
                {filteredIds.map(id => (
                  <div key={id} onClick={() => setBangleId(id)} style={{ padding: '12px', cursor: 'pointer', borderBottom: `1px solid ${theme.border}` }}>{id}</div>
                ))}
              </div>
            )}
          </div>

          <div style={{ width: '120px' }}>
            <label style={{ display: 'block', fontSize: '12px', color: theme.subText, marginBottom: '5px' }}>Size</label>
            <select value={size} onChange={(e) => setSize(e.target.value)} style={{ width: '100%', padding: '12px', borderRadius: '8px', border: `1px solid ${theme.border}`, backgroundColor: theme.inputBg, color: theme.text }}>
              {['2-2', '2-4', '2-6', '2-8', '2-10', '2-12'].map(s => <option key={s} value={s}>{s}</option>)}
            </select>
          </div>

          {/* PRICE INPUT - This is what was missing! */}
          {!isSaleMode && (
            <div style={{ width: '120px' }}>
              <label style={{ display: 'block', fontSize: '12px', color: theme.subText, marginBottom: '5px' }}>Unit Price (₹)</label>
              <input 
                type="number" 
                placeholder="0"
                value={price} 
                onChange={(e) => setPrice(e.target.value)} 
                style={{ width: '100%', padding: '12px', borderRadius: '8px', border: `1px solid #27ae60`, backgroundColor: theme.inputBg, color: theme.text }} 
              />
            </div>
          )}

          <div style={{ width: '100px' }}>
            <label style={{ display: 'block', fontSize: '12px', color: theme.subText, marginBottom: '5px' }}>Qty</label>
            <input type="number" value={qty} onChange={(e) => setQty(e.target.value)} style={{ width: '100%', padding: '12px', borderRadius: '8px', border: `1px solid ${theme.border}`, backgroundColor: theme.inputBg, color: theme.text }} min="1" />
          </div>

          <button 
            onClick={handleAction} 
            style={{ marginTop: '20px', padding: '12px 40px', background: isSaleMode ? '#e74c3c' : '#2ecc71', color: 'white', border: 'none', borderRadius: '8px', fontWeight: '700', cursor: 'pointer' }}
          >
            {isSaleMode ? 'CONFIRM SALE' : 'ADD STOCK'}
          </button>
        </div>
      </div>

      {/* STOCK OVERVIEW CARD */}
      <div style={{ background: theme.card, padding: '30px', borderRadius: '12px', boxShadow: '0 8px 24px rgba(0,0,0,0.2)', border: `1px solid ${theme.border}` }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
          <h2 style={{ fontSize: '18px', margin: 0 }}>Stock Overview</h2>
          <input 
            type="text" 
            placeholder="🔍 Filter list..." 
            onChange={(e) => setSearchTerm(e.target.value.toUpperCase())}
            style={{ padding: '10px 15px', borderRadius: '20px', width: '250px', border: `1px solid ${theme.border}`, backgroundColor: theme.inputBg, color: theme.text, outline: 'none' }}
          />
        </div>
        
        <div style={{ maxHeight: '500px', overflowY: 'auto', borderRadius: '8px', border: `1px solid ${theme.border}` }}>
          <table style={{ width: '100%', borderCollapse: 'collapse' }}>
            <thead style={{ position: 'sticky', top: 0, zIndex: 1 }}>
              <tr style={{ background: darkMode ? '#333' : '#f8f9fa', color: theme.subText, textAlign: 'left', fontSize: '12px', textTransform: 'uppercase' }}>
                <th style={{ padding: '15px' }}>Bangle ID</th>
                <th style={{ padding: '15px' }}>Size</th>
                <th style={{ padding: '15px' }}>Qty</th>
                <th style={{ padding: '15px' }}>Price / Unit</th>
                <th style={{ padding: '15px' }}>Total Value</th>
              </tr>
            </thead>
            <tbody>
              {stock.filter(item => item.id.includes(searchTerm)).map((item, idx) => (
                <tr key={idx} style={{ borderBottom: `1px solid ${theme.border}`, backgroundColor: idx % 2 === 0 ? theme.rowEven : theme.card }}>
                  <td style={{ padding: '15px', fontWeight: '600' }}>{item.id}</td>
                  <td style={{ padding: '15px' }}>{item.size}</td>
                  <td style={{ padding: '15px' }}>
                    <span style={{ 
                      padding: '4px 10px', borderRadius: '12px', fontSize: '13px', fontWeight: '700',
                      backgroundColor: item.quantity <= 5 ? (darkMode ? '#442222' : '#ffdada') : (darkMode ? '#113322' : '#d5f5e3'), 
                      color: item.quantity <= 5 ? (darkMode ? '#ff6666' : '#c0392b') : (darkMode ? '#66ffaa' : '#27ae60') 
                    }}>
                      {item.quantity} units
                    </span>
                  </td>
                  <td style={{ padding: '15px', color: theme.subText }}>
                    ₹{item.price ? item.price : 0}
                  </td>
                  <td style={{ padding: '15px', fontWeight: 'bold', color: darkMode ? '#4db8ff' : '#2980b9' }}>
                    ₹{(item.quantity * (item.price || 0)).toLocaleString()}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  )
}

export default App