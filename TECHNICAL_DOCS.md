# 🔧 Technical Documentation - SweetPot Management System

## Architecture Overview

```
┌─────────────────────────────────────────────────┐
│         Browser Environment (localStorage)      │
├─────────────────────────────────────────────────┤
│  Frontend (HTML5 + CSS3)                        │
│  ├── Responsive UI                              │
│  ├── Forms & Validation                         │
│  └── Charts & Visualizations                    │
├─────────────────────────────────────────────────┤
│  Application Logic (JavaScript)                 │
│  ├── DB Module (Storage)                        │
│  ├── Validators Module                          │
│  ├── Searchers Module                           │
│  ├── Exporters Module                           │
│  ├── Pagination Module                          │
│  ├── Audit Module                               │
│  └── Business Logic Functions                   │
├─────────────────────────────────────────────────┤
│  Data Persistence (localStorage)                │
│  └── All data prefixed with nekta_              │
└─────────────────────────────────────────────────┘
```

---

## 📦 Modules Reference

### DB Module
```javascript
const DB = {
  get(key)          // Retrieve data from localStorage
  set(key, data)    // Save data to localStorage  
  nextId(key)       // Generate next ID for records
  verify()          // Check if storage is working
}

// Usage
const farmers = DB.get('farmers');
DB.set('farmers', farmers);
const newId = DB.nextId('farmers');
```

### Validators Module
```javascript
const Validators = {
  email(string)           // Validates email format
  phone(string)           // Validates Kenya phone (0712345678)
  positiveNumber(number)  // Validates positive numbers
  notEmpty(string)        // Checks string is not empty
  date(string)           // Validates date format
  name(string)           // Validates name (letters + spaces)
}

// Usage
if (!Validators.email(userEmail)) {
  toast('Invalid email', true);
}
```

### Searchers Module
```javascript
const Searchers = {
  searchFarmers(query)      // Searches by name/phone/city
  searchSales(query)        // Searches by customer/type
  searchHoney(query)        // Searches by supplier/type
  filterByDateRange(items, start, end)  // Date filtering
}

// Usage
const results = Searchers.searchFarmers('John');
```

### Pagination Module
```javascript
const Pagination = {
  paginate(items, page, pageSize)  // Returns paginated result
  renderControls(page, total, callback) // Renders UI buttons
}

// Usage
const result = Pagination.paginate(items, 1, 10);
// result = { data, totalPages, currentPage, totalItems }
```

### Exporters Module
```javascript
const Exporters = {
  toCSV(data, filename)    // Exports array to CSV file
  toPDF(data, title)      // Exports array to PDF file
}

// Usage
Exporters.toCSV(DB.get('farmers'), 'Farmers_List');
```

### Audit Module
```javascript
const Audit = {
  log(action, type, id, oldData, newData)  // Log a change
  getHistory(type, id)                     // Get record history
}

// Usage
Audit.log('CREATE', 'Farmer', farmer.id, null, farmer);
const history = Audit.getHistory('Farmer', 1);
```

---

## 📊 Data Schema

### Farmers Collection
```javascript
{
  id: number,
  first: string,           // First name (required)
  last: string,            // Last name (required)
  name: string,            // Full name (computed)
  email: string,           // Email (optional)
  bphone: string,          // Business phone
  mphone: string,          // Mobile phone
  city: string,            // City/town
  street: string,          // Street address
  package: string,         // Beehive package type
  date: string,            // Registration date (YYYY-MM-DD)
  notes: string,           // Custom notes
  createdAt: string,       // ISO timestamp
  updatedAt: string        // ISO timestamp
}

// Storage Key: "nekta_farmers"
```

### Sales Collection
```javascript
{
  id: number,
  customer: string,        // Customer name (required)
  saleType: string,        // Product type (required)
  package: string,         // Same as saleType
  units: number,           // Number of units (required)
  unitPrice: number,       // Price per unit (required)
  total: number,           // Total = units * unitPrice
  transport: string,       // "Yes" or "No"
  date: string,            // Sale date (YYYY-MM-DD)
  createdAt: string,
  updatedAt: string
}

// Storage Key: "nekta_sales"
```

### Honey Purchases Collection
```javascript
{
  id: number,
  supplier: string,        // Farmer/supplier name (required)
  honeyType: string,       // Type of honey (required)
  qty: number,             // Quantity in KG (required)
  unitPrice: number,       // Price per KG (required)
  total: number,           // Total = qty * unitPrice
  date: string,            // Purchase date (YYYY-MM-DD)
  payment: string,         // Payment method
  bank: string,            // Bank details if applicable
  createdAt: string,
  updatedAt: string
}

// Storage Key: "nekta_honey"
```

### Trainees Collection
```javascript
{
  id: number,
  name: string,            // Trainee full name
  phone: string,
  date: string,            // Enrollment date
  trainer: string,         // Assigned trainer
  status: string           // Active/Completed
}

// Storage Key: "nekta_trainees"
```

### Trainers Collection
```javascript
{
  id: number,
  name: string,            // Trainer name
  phone: string,
  email: string,
  specialization: string,  // Area of expertise
  date: string             // Registration date
}

// Storage Key: "nekta_trainers"
```

### Audit Logs Collection
```javascript
{
  id: number,
  timestamp: string,       // ISO 8601 timestamp
  action: string,          // "CREATE", "UPDATE", "DELETE"
  type: string,            // "Farmer", "Sale", "HoneyPurchase", etc
  recordId: number,        // ID of affected record
  oldData: object,         // Previous values
  newData: object,         // New values
  user: string             // "System" (expandable)
}

// Storage Key: "nekta_auditLogs"
```

---

## 🔄 Function Flow Diagrams

### Add Record Flow
```
User Input Form
    ↓
Validators.check(data)
    ↓ (valid?)
DB.nextId() → Generate ID
    ↓
Create Record Object
    ↓
DB.set('collection', updatedArray)
    ↓
Audit.log('CREATE', ...)
    ↓
Toast notification
    ↓
Render list with new data
```

### Search Flow
```
User Types in Search Box
    ↓
searchAndRenderFarmers(query)
    ↓
Searchers.searchFarmers(query)
    ↓ (filter results)
Pagination.paginate(results, 1)
    ↓
renderFarmers(query, 1)
    ↓
Display filtered & paginated results
```

### Export Flow
```
User Clicks "Export CSV"
    ↓
Exporters.toCSV(data, 'filename')
    ↓
Format data to CSV string
    ↓
Create Blob object
    ↓
Trigger download
    ↓
Toast: "✓ Exported X records"
```

---

## 📱 API Reference

### Core Functions

#### Add/Save Functions
```javascript
addFarmer()           // Save new farmer
addSale()             // Save new sale
addHoney()            // Save honey purchase
addTrainee()          // Enroll trainee
addTrainer()          // Register trainer
```

#### Edit/Update Functions
```javascript
editFarmer(id)        // Load farmer into edit form
saveEditFarmer()      // Save farmer changes
editSale(id)
saveEditSale()
editHoney(id)
saveEditHoney()
```

#### Delete Functions
```javascript
deleteFarmer(id)      // Delete farmer with confirmation
deleteSale(id)
deleteHoney(id)
```

#### Render Functions
```javascript
renderFarmers(query, page)    // Render farmer list
renderSales(query, page)      // Render sales list
renderHoney(query, page)      // Render honey list
renderDashboard()             // Render dashboard
renderReports()               // Render reports
```

#### Search Functions
```javascript
searchAndRenderFarmers(query) // Search and display farmers
searchAndRenderSales(query)   // Search and display sales
searchAndRenderHoney(query)   // Search and display honey
```

#### Pagination Functions
```javascript
changeFarmerPage(page)        // Change farmer page
changeSalesPage(page)         // Change sales page
changeHoneyPage(page)         // Change honey page
```

#### Export Functions
```javascript
Exporters.toCSV(data, filename)    // Export to CSV
Exporters.toPDF(data, title)       // Export to PDF
exportData()                       // Download all data as JSON
importData()                       // Import from backup JSON
```

#### Navigation Functions
```javascript
showPage(name)      // Navigate to page (dashboard, farmers, sales, etc)
switchTab(section, panel)  // Switch between tabs
openModal(id)       // Open modal dialog
closeModal(id)      // Close modal dialog
```

#### Utility Functions
```javascript
toast(msg, isError)           // Show notification
confirmDelete(msg, callback)  // Show delete confirmation
fmt(number)                   // Format number as currency
calcTotalIncome()             // Calculate company total income
updateTopIncome()             // Update top bar income display
```

---

## 🔐 Security Considerations

### Current Implementation
- ✅ Client-side validation (JavaScript)
- ✅ localStorage error handling
- ✅ Audit trail logging
- ✅ Confirmation dialogs for deletions
- ⚠️ No authentication (hardcoded credentials)
- ⚠️ No encryption (localStorage is readable)

### Recommendations for Production
1. Add server-side validation
2. Implement JWT authentication
3. Add role-based access control (RBAC)
4. Encrypt sensitive data
5. Use HTTPS only
6. Add rate limiting
7. Implement database instead of localStorage

---

## 🚀 Performance Optimization

### Current Optimizations
- ✅ Pagination (10 records per page)
- ✅ Lazy chart rendering
- ✅ Debounced search
- ✅ Efficient localStorage access
- ✅ DOM manipulation caching

### Recommendations
1. Implement data compression for large datasets
2. Add search debouncing (wait 300ms after typing)
3. Cache computed values
4. Use Web Workers for heavy processing
5. Implement service workers for offline support

---

## 🧪 Testing Guide

### Unit Test Example
```javascript
// Test Validators
function testValidators() {
  console.assert(Validators.email('test@example.com') === true);
  console.assert(Validators.email('invalid') === false);
  console.assert(Validators.phone('0712345678') === true);
  console.assert(Validators.positiveNumber(10) === true);
  console.assert(Validators.positiveNumber(-10) === false);
}

// Test DB
function testDB() {
  DB.set('test', [{id: 1, name: 'John'}]);
  const data = DB.get('test');
  console.assert(data[0].name === 'John');
  console.assert(DB.nextId('test') === 2);
}

testValidators();
testDB();
```

### Integration Test Example
```javascript
// Test complete farmer creation flow
function testFarmerCreation() {
  // Clear previous data
  DB.set('farmers', []);
  
  // Simulate form submission
  document.getElementById('f_first').value = 'John';
  document.getElementById('f_last').value = 'Doe';
  addFarmer();
  
  // Verify farmer was saved
  const farmers = DB.get('farmers');
  console.assert(farmers.length === 1);
  console.assert(farmers[0].name === 'John Doe');
  
  // Verify audit log
  const audit = DB.get('auditLogs');
  console.assert(audit.length > 0);
  console.assert(audit[0].action === 'CREATE');
}

testFarmerCreation();
```

---

## 🔧 Extending the System

### Add New Module
```javascript
const MyModule = {
  myFunction(param) {
    // Implementation
  }
};
```

### Add New Data Type
```javascript
// 1. Create render function
function renderMyType(searchQuery = '', page = 1) {
  // Implementation
}

// 2. Add search function
Searchers.searchMyType = (query) => {
  // Filter logic
};

// 3. Add audit logging
Audit.log('CREATE', 'MyType', id, null, data);

// 4. Add to pagination
currentPages.mytype = 1;

// 5. Add export capability
Exporters.toCSV(DB.get('mytype'), 'MyType_Export');
```

---

## 📞 Browser Console Debugging

```javascript
// Check all stored data
Object.keys(localStorage)

// View specific collection
JSON.parse(localStorage.getItem('nekta_farmers'))

// Clear all data (caution!)
Object.keys(localStorage).forEach(k => {
  if (k.startsWith('nekta_')) localStorage.removeItem(k);
});

// View audit trail
JSON.parse(localStorage.getItem('nekta_auditLogs'))

// Test validator
Validators.email('test@example.com')

// Test search
Searchers.searchFarmers('John')

// Check storage size
Object.keys(localStorage).reduce((sum, k) => {
  return sum + localStorage.getItem(k).length;
}, 0) / 1024 + ' KB'
```

---

## 📚 Dependencies

### External Libraries
- **Chart.js 4.4.0** - Charts and graphs
- **Browser APIs**: 
  - localStorage (data persistence)
  - Blob (file exports)
  - FileReader (backup imports)
  - Fetch (potential for backend)

### Browser Support
- Chrome 90+
- Firefox 88+
- Safari 14+
- Edge 90+
- Mobile browsers (iOS Safari 14+, Chrome Android)

---

## 🎓 Version History

| Version | Date | Changes |
|---------|------|---------|
| 1.0 | June 2026 | Initial CRUD system |
| 2.0 | July 2026 | Added search, validation, export, pagination, audit |

---

## 📄 License

Educational project for SweetPot Management System.

---

**Last Updated:** July 2026
**Maintainer:** Academic Enhancement Package
