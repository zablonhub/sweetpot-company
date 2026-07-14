// ════════════════════════════════════════════
//  Nekta Bee Company — Management System JS
//  All data stored in localStorage
// ════════════════════════════════════════════

// ── STORAGE HELPERS ──────────────────────────
const DB = {
  get: (key) => {
    try {
      const data = localStorage.getItem('nekta_' + key);
      return data ? JSON.parse(data) : [];
    } catch (e) {
      console.error('Error reading from localStorage:', e);
      return [];
    }
  },
  
  set: (key, data) => {
    try {
      localStorage.setItem('nekta_' + key, JSON.stringify(data));
      return true;
    } catch (e) {
      console.error('Error writing to localStorage:', e);
      toast('⚠️ Could not save data. Check browser storage settings.', true);
      return false;
    }
  },
  
  nextId: (key) => {
    const items = DB.get(key);
    return items.length === 0 ? 1 : Math.max(...items.map(i => i.id)) + 1;
  },
  
  // Verify data integrity and persistence
  verify: () => {
    const testKey = 'nekta_test_' + Date.now();
    try {
      localStorage.setItem(testKey, 'test');
      const value = localStorage.getItem(testKey);
      localStorage.removeItem(testKey);
      return value === 'test';
    } catch (e) {
      return false;
    }
  }
};

// ═══════════════════════════════════════════════
//  VALIDATION & UTILITIES
// ═══════════════════════════════════════════════
const Validators = {
  email: (email) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email),
  phone: (phone) => /^0[0-9]{9}$/.test(phone) || /^\+254[0-9]{9}$/.test(phone),
  positiveNumber: (num) => !isNaN(num) && Number(num) > 0,
  notEmpty: (str) => str.trim().length > 0,
  date: (dateStr) => {
    const date = new Date(dateStr);
    return !isNaN(date.getTime());
  },
  name: (name) => /^[a-zA-Z\s'-]{2,}$/.test(name.trim())
};

const Audit = {
  log: (action, type, id, oldData, newData) => {
    const logs = DB.get('auditLogs') || [];
    logs.push({
      id: logs.length + 1,
      timestamp: new Date().toISOString(),
      action,
      type,
      recordId: id,
      oldData,
      newData,
      user: 'System'
    });
    DB.set('auditLogs', logs);
  },
  
  getHistory: (type, id) => {
    const logs = DB.get('auditLogs') || [];
    return logs.filter(l => l.type === type && l.recordId === id);
  }
};

const Pagination = {
  paginate: (items, page, pageSize = 10) => {
    const start = (page - 1) * pageSize;
    const end = start + pageSize;
    return {
      data: items.slice(start, end),
      totalPages: Math.ceil(items.length / pageSize),
      currentPage: page,
      totalItems: items.length
    };
  },
  
  renderControls: (page, totalPages, onPageChange) => {
    let html = '<div class="pagination">';
    html += page > 1 ? `<button class="pagination-btn" onclick="${onPageChange}(${page-1})">← Prev</button>` : '<button class="pagination-btn" disabled>← Prev</button>';
    html += `<span class="pagination-info">Page ${page} of ${totalPages}</span>`;
    html += page < totalPages ? `<button class="pagination-btn" onclick="${onPageChange}(${page+1})">Next →</button>` : '<button class="pagination-btn" disabled>Next →</button>';
    html += '</div>';
    return html;
  }
};

const Exporters = {
  toCSV: (data, filename) => {
    if (!data || data.length === 0) {
      toast('No data to export', true);
      return;
    }
    const headers = Object.keys(data[0]);
    const rows = data.map(r => headers.map(h => {
      const val = r[h];
      return typeof val === 'string' && val.includes(',') ? `"${val}"` : val;
    }).join(','));
    
    const csv = [headers.join(','), ...rows].join('\n');
    const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement('a');
    link.href = URL.createObjectURL(blob);
    link.download = `${filename}_${new Date().toISOString().split('T')[0]}.csv`;
    link.click();
    URL.revokeObjectURL(link.href);
    toast(`✓ Exported ${data.length} records to CSV`);
  },
  
  toPDF: async (data, title) => {
    if (!window.jsPDF) {
      toast('PDF export requires jsPDF library', true);
      return;
    }
    const { jsPDF } = window;
    const doc = new jsPDF();
    doc.text(title, 10, 10);
    const cols = Object.keys(data[0] || {});
    const rows = data.map(r => cols.map(c => r[c]));
    doc.autoTable({ head: [cols], body: rows, startY: 20 });
    doc.save(`${title}_${new Date().toISOString().split('T')[0]}.pdf`);
    toast('✓ PDF exported successfully');
  }
};

const Searchers = {
  searchFarmers: (query) => {
    const farmers = DB.get('farmers');
    return farmers.filter(f => 
      f.name.toLowerCase().includes(query.toLowerCase()) ||
      f.first.toLowerCase().includes(query.toLowerCase()) ||
      f.last.toLowerCase().includes(query.toLowerCase()) ||
      (f.mphone || '').includes(query) ||
      (f.bphone || '').includes(query) ||
      (f.city || '').toLowerCase().includes(query.toLowerCase())
    );
  },
  
  searchSales: (query) => {
    const sales = DB.get('sales');
    return sales.filter(s =>
      s.customer.toLowerCase().includes(query.toLowerCase()) ||
      s.saleType.toLowerCase().includes(query.toLowerCase())
    );
  },
  
  searchHoney: (query) => {
    const honey = DB.get('honey');
    return honey.filter(h =>
      h.supplier.toLowerCase().includes(query.toLowerCase()) ||
      h.honeyType.toLowerCase().includes(query.toLowerCase())
    );
  },
  
  filterByDateRange: (items, startDate, endDate) => {
    return items.filter(item => {
      const date = new Date(item.date);
      return date >= new Date(startDate) && date <= new Date(endDate);
    });
  }
};

// ── AUTH ──────────────────────────────────────
function doLogin() {
  const user = document.getElementById('loginUser').value.trim();
  const pass = document.getElementById('loginPass').value.trim();
  const err  = document.getElementById('loginError');

  if (user === 'Username' && pass === 'Password') {
    document.getElementById('loginScreen').style.display = 'none';
    document.getElementById('app').style.display = 'flex';
    showPage('dashboard');
    err.style.display = 'none';
  } else {
    err.style.display = 'block';
    err.textContent = 'Invalid username or password.';
  }
}

function doLogout() {
  document.getElementById('loginScreen').style.display = 'flex';
  document.getElementById('app').style.display = 'none';
  // Clear login form for security
  document.getElementById('loginUser').value = '';
  document.getElementById('loginPass').value = '';
  document.getElementById('loginError').style.display = 'none';
}

// Allow Enter key on login
document.addEventListener('DOMContentLoaded', () => {
  // Verify localStorage is working
  if (!DB.verify()) {
    console.warn('⚠️ localStorage may be disabled or full. Data persistence may not work.');
    const loginScreen = document.getElementById('loginScreen');
    const warningDiv = document.createElement('div');
    warningDiv.style.cssText = 'position:fixed;top:10px;left:50%;transform:translateX(-50%);background:#ff9800;color:#fff;padding:12px 20px;border-radius:8px;font-size:12px;font-weight:600;z-index:9999;';
    warningDiv.textContent = '⚠️ Storage disabled: Changes may not be saved.';
    loginScreen.appendChild(warningDiv);
  }
  
  // Setup login listeners
  ['loginUser','loginPass'].forEach(id => {
    document.getElementById(id).addEventListener('keydown', e => {
      if (e.key === 'Enter') doLogin();
    });
  });
  
  // Set today's date on all date inputs
  const today = new Date().toISOString().split('T')[0];
  document.querySelectorAll('input[type="date"]').forEach(el => { el.value = today; });
});

// ── PAGE NAVIGATION ───────────────────────────
function showPage(name) {
  document.querySelectorAll('.content > div').forEach(el => el.classList.add('section-hidden'));
  document.getElementById('page-' + name).classList.remove('section-hidden');
  document.querySelectorAll('.nav-item').forEach(el => el.classList.remove('active'));
  document.querySelectorAll('.nav-item').forEach(el => {
    if (el.dataset.page === name) el.classList.add('active');
  });
  if (name === 'dashboard') renderDashboard();
  if (name === 'farmers')   renderFarmers();
  if (name === 'trainees')  renderTrainees();
  if (name === 'trainers')  renderTrainers();
  if (name === 'sales')     renderSales();
  if (name === 'honey')     renderHoney();
  if (name === 'transport') renderTransport();
  if (name === 'trainings') renderTrainings();
  if (name === 'reports')   renderReports();
  updateTopIncome();
}

// ── TABS ──────────────────────────────────────
function switchTab(section, panel) {
  const container = document.getElementById('page-' + section);
  container.querySelectorAll('.tab').forEach((t, i) => {
    t.classList.toggle('active', t.dataset.panel === panel);
  });
  container.querySelectorAll('.tab-panel').forEach(p => {
    p.classList.toggle('active', p.id === section + '-' + panel);
  });
}

// ── TOAST ─────────────────────────────────────
function toast(msg, isError = false) {
  const t = document.getElementById('toast');
  t.textContent = (isError ? '✗ ' : '✓ ') + msg;
  t.className = 'show' + (isError ? ' error' : '');
  setTimeout(() => { t.className = ''; }, 2800);
}

// ── MODAL SYSTEM ──────────────────────────────
function openModal(id) {
  document.getElementById(id).classList.add('open');
}

function closeModal(id) {
  document.getElementById(id).classList.remove('open');
}

function confirmDelete(message, onConfirm) {
  document.getElementById('confirmMsg').textContent = message;
  document.getElementById('confirmBtn').onclick = () => {
    closeModal('confirmModal');
    onConfirm();
  };
  openModal('confirmModal');
}

// ── DATA BACKUP & RESTORE ──────────────────────
function exportData() {
  const dataKeys = ['farmers', 'trainees', 'trainers', 'sales', 'honey', 'transport', 'trainings'];
  const allData = {};
  
  dataKeys.forEach(key => {
    allData[key] = DB.get(key);
  });
  
  const json = JSON.stringify(allData, null, 2);
  const blob = new Blob([json], { type: 'application/json' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = `SweetPot_Backup_${new Date().toISOString().split('T')[0]}.json`;
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  URL.revokeObjectURL(url);
  toast('✓ Data backup downloaded successfully!');
}

function importData() {
  const input = document.createElement('input');
  input.type = 'file';
  input.accept = '.json';
  input.onchange = (e) => {
    const file = e.target.files[0];
    if (!file) return;
    
    const reader = new FileReader();
    reader.onload = (event) => {
      try {
        const data = JSON.parse(event.target.result);
        const dataKeys = ['farmers', 'trainees', 'trainers', 'sales', 'honey', 'transport', 'trainings'];
        
        dataKeys.forEach(key => {
          if (Array.isArray(data[key])) {
            DB.set(key, data[key]);
          }
        });
        
        toast('✓ Data restored successfully! Please refresh the page.');
        setTimeout(() => location.reload(), 1500);
      } catch (e) {
        toast('✗ Invalid backup file.', true);
      }
    };
    reader.readAsText(file);
  };
  input.click();
}

// ── INCOME SUMMARY ────────────────────────────
function calcTotalIncome() {
  const sales     = DB.get('sales').reduce((s, r) => s + (r.total || 0), 0);
  const transport = DB.get('transport').reduce((s, r) => s + (r.cost || 0), 0);
  const trainings = DB.get('trainings').reduce((s, r) => s + (r.amount || 0), 0);
  return sales + transport + trainings;
}

function updateTopIncome() {
  document.getElementById('topIncome').textContent = 'Ksh ' + fmt(calcTotalIncome());
}

function fmt(n) {
  return Number(n || 0).toLocaleString('en-KE', { minimumFractionDigits: 2, maximumFractionDigits: 2 });
}

// ══════════════════════════════════════════════
//  CHART RENDERING
// ══════════════════════════════════════════════
let charts = {}; // Store chart instances

function destroyChart(chartName) {
  if (charts[chartName]) {
    charts[chartName].destroy();
    delete charts[chartName];
  }
}

function renderIncomeSourcesChart() {
  destroyChart('incomeChart');
  const sales     = DB.get('sales').reduce((s, r) => s + (r.total || 0), 0);
  const honey     = DB.get('honey').reduce((s, r) => s + (r.total || 0), 0);
  const transport = DB.get('transport').reduce((s, r) => s + (r.cost || 0), 0);
  const trainings = DB.get('trainings').reduce((s, r) => s + (r.amount || 0), 0);
  
  const ctx = document.getElementById('incomeChart');
  if (!ctx) return;
  
  charts.incomeChart = new Chart(ctx, {
    type: 'doughnut',
    data: {
      labels: ['Product Sales', 'Transport', 'Training', 'Honey (Cost)'],
      datasets: [{
        data: [sales, transport, trainings, honey],
        backgroundColor: ['#F0A500', '#2D7D46', '#1A6FA8', '#C97B00'],
        borderColor: '#FFFFFF',
        borderWidth: 2
      }]
    },
    options: {
      responsive: true,
      maintainAspectRatio: true,
      plugins: {
        legend: {
          position: 'bottom',
          labels: { font: { size: 12, weight: '600' }, padding: 16, color: '#6B5A3E' }
        }
      }
    }
  });
}

function renderOrgChart() {
  destroyChart('orgChart');
  const farmers  = DB.get('farmers').length;
  const trainees = DB.get('trainees').length;
  const trainers = DB.get('trainers').length;
  
  const ctx = document.getElementById('orgChart');
  if (!ctx) return;
  
  charts.orgChart = new Chart(ctx, {
    type: 'bar',
    data: {
      labels: ['Farmers', 'Trainees', 'Trainers'],
      datasets: [{
        label: 'Count',
        data: [farmers, trainees, trainers],
        backgroundColor: ['#F0A500', '#2D7D46', '#1A6FA8'],
        borderRadius: 8,
        borderSkipped: false
      }]
    },
    options: {
      indexAxis: 'y',
      responsive: true,
      maintainAspectRatio: true,
      plugins: {
        legend: { display: false }
      },
      scales: {
        x: { beginAtZero: true, ticks: { color: '#6B5A3E' }, grid: { color: '#F3EAD4' } },
        y: { ticks: { color: '#6B5A3E' }, grid: { display: false } }
      }
    }
  });
}

function renderMonthlyIncomeChart() {
  destroyChart('monthlyIncomeChart');
  const ctx = document.getElementById('monthlyIncomeChart');
  if (!ctx) return;
  
  const sales = DB.get('sales');
  const transport = DB.get('transport');
  const trainings = DB.get('trainings');
  
  const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
  const monthlyData = months.map((_, i) => {
    const m = String(i + 1).padStart(2, '0');
    const s = sales.filter(r => r.date?.includes(`-${m}-`)).reduce((sum, r) => sum + (r.total || 0), 0);
    const t = transport.filter(r => r.date?.includes(`-${m}-`)).reduce((sum, r) => sum + (r.cost || 0), 0);
    const tr = trainings.filter(r => r.date?.includes(`-${m}-`)).reduce((sum, r) => sum + (r.amount || 0), 0);
    return s + t + tr;
  });
  
  charts.monthlyIncomeChart = new Chart(ctx, {
    type: 'line',
    data: {
      labels: months,
      datasets: [{
        label: 'Total Income',
        data: monthlyData,
        borderColor: '#F0A500',
        backgroundColor: 'rgba(240,165,0,0.1)',
        tension: 0.4,
        fill: true,
        pointBackgroundColor: '#F0A500',
        pointBorderColor: '#FFFFFF',
        pointBorderWidth: 2,
        pointRadius: 5,
        pointHoverRadius: 7
      }]
    },
    options: {
      responsive: true,
      maintainAspectRatio: true,
      plugins: {
        legend: { labels: { font: { size: 12 }, color: '#6B5A3E' } }
      },
      scales: {
        y: { beginAtZero: true, ticks: { color: '#6B5A3E' }, grid: { color: '#F3EAD4' } },
        x: { ticks: { color: '#6B5A3E' }, grid: { display: false } }
      }
    }
  });
}

function renderSalesCategoryChart() {
  destroyChart('salesCategoryChart');
  const ctx = document.getElementById('salesCategoryChart');
  if (!ctx) return;
  
  const sales = DB.get('sales');
  const categories = {};
  
  sales.forEach(s => {
    categories[s.saleType] = (categories[s.saleType] || 0) + (s.total || 0);
  });
  
  charts.salesCategoryChart = new Chart(ctx, {
    type: 'pie',
    data: {
      labels: Object.keys(categories),
      datasets: [{
        data: Object.values(categories),
        backgroundColor: ['#F0A500', '#C97B00', '#2D7D46', '#1A6FA8', '#A67C00'],
        borderColor: '#FFFFFF',
        borderWidth: 2
      }]
    },
    options: {
      responsive: true,
      maintainAspectRatio: true,
      plugins: {
        legend: {
          position: 'bottom',
          labels: { font: { size: 11 }, padding: 12, color: '#6B5A3E' }
        }
      }
    }
  });
}

// ══════════════════════════════════════════════
//  DASHBOARD
// ══════════════════════════════════════════════
function renderDashboard() {
  const farmers   = DB.get('farmers');
  const trainees  = DB.get('trainees');
  const trainers  = DB.get('trainers');
  const sales     = DB.get('sales');
  const honey     = DB.get('honey');
  const transport = DB.get('transport');
  const trainings = DB.get('trainings');

  const totalSales     = sales.reduce((s, r) => s + (r.total || 0), 0);
  const totalHoney     = honey.reduce((s, r) => s + (r.total || 0), 0);
  const totalTransport = transport.reduce((s, r) => s + (r.cost || 0), 0);
  const totalTraining  = trainings.reduce((s, r) => s + (r.amount || 0), 0);

  document.getElementById('dashStats').innerHTML = `
    <div class="stat-card"><div class="stat-label">👨‍🌾 Farmers</div><div class="stat-value">${farmers.length}</div></div>
    <div class="stat-card"><div class="stat-label">👤 Trainees</div><div class="stat-value">${trainees.length}</div></div>
    <div class="stat-card"><div class="stat-label">🎓 Trainers</div><div class="stat-value">${trainers.length}</div></div>
    <div class="stat-card"><div class="stat-label">📦 Product Sales</div><div class="stat-value">Ksh ${fmt(totalSales)}</div></div>
    <div class="stat-card"><div class="stat-label">🍯 Honey Purchased</div><div class="stat-value">Ksh ${fmt(totalHoney)}</div></div>
    <div class="stat-card"><div class="stat-label">🚚 Transport Earnings</div><div class="stat-value">Ksh ${fmt(totalTransport)}</div></div>
    <div class="stat-card"><div class="stat-label">💼 Training Income</div><div class="stat-value">Ksh ${fmt(totalTraining)}</div></div>
    <div class="stat-card"><div class="stat-label">💰 Total Income</div><div class="stat-value">Ksh ${fmt(calcTotalIncome())}</div></div>
  `;

  const recentSales = sales.slice(-5).reverse();
  document.getElementById('recentSales').innerHTML = recentSales.length ? `
    <table><thead><tr><th>Customer</th><th>Package</th><th>Total</th></tr></thead><tbody>
    ${recentSales.map(r => `<tr><td>${r.customer}</td><td>${r.saleType}</td><td class="text-green">Ksh ${fmt(r.total)}</td></tr>`).join('')}
    </tbody></table>
  ` : '<div class="empty">No sales recorded yet.</div>';

  const recentHoney = honey.slice(-5).reverse();
  document.getElementById('recentHoney').innerHTML = recentHoney.length ? `
    <table><thead><tr><th>Supplier</th><th>Qty (KG)</th><th>Total</th></tr></thead><tbody>
    ${recentHoney.map(r => `<tr><td>${r.supplier}</td><td>${r.qty}</td><td class="text-green">Ksh ${fmt(r.total)}</td></tr>`).join('')}
    </tbody></table>
  ` : '<div class="empty">No honey purchases recorded yet.</div>';
  
  // Render charts
  setTimeout(() => {
    renderIncomeSourcesChart();
    renderOrgChart();
  }, 100);
}

// ══════════════════════════════════════════════
//  FARMERS
// ══════════════════════════════════════════════
function addFarmer() {
  const first  = document.getElementById('f_first').value.trim();
  const last   = document.getElementById('f_last').value.trim();
  const email  = document.getElementById('f_email').value.trim();
  const mphone = document.getElementById('f_mphone').value.trim();
  const bphone = document.getElementById('f_bphone').value.trim();
  
  // Validation
  if (!Validators.notEmpty(first)) { toast('First name is required.', true); return; }
  if (!Validators.notEmpty(last)) { toast('Last name is required.', true); return; }
  if (!Validators.name(first)) { toast('First name must contain only letters and spaces.', true); return; }
  if (!Validators.name(last)) { toast('Last name must contain only letters and spaces.', true); return; }
  if (email && !Validators.email(email)) { toast('Invalid email format.', true); return; }
  if (mphone && !Validators.phone(mphone)) { toast('Invalid mobile phone format (10 digits, starting with 0).', true); return; }
  if (bphone && !Validators.phone(bphone)) { toast('Invalid business phone format.', true); return; }

  const farmer = {
    id:       DB.nextId('farmers'),
    first,
    last,
    name:     first + ' ' + last,
    email,
    bphone,
    mphone,
    city:     document.getElementById('f_city').value.trim(),
    street:   document.getElementById('f_street').value.trim(),
    package:  document.getElementById('f_pkg').value,
    date:     document.getElementById('f_date').value,
    notes:    document.getElementById('f_notes').value.trim(),
    createdAt: new Date().toISOString()
  };

  const farmers = DB.get('farmers');
  farmers.push(farmer);
  DB.set('farmers', farmers);
  Audit.log('CREATE', 'Farmer', farmer.id, null, farmer);
  toast('✓ Farmer saved successfully!');
  clearFarmerForm();
  renderFarmers();
  switchTab('farmers', 'list');
}

function deleteFarmer(id) {
  confirmDelete('Delete this farmer record? This cannot be undone.', () => {
    DB.set('farmers', DB.get('farmers').filter(r => r.id !== id));
    toast('Farmer deleted.');
    renderFarmers();
  });
}

function editFarmer(id) {
  const r = DB.get('farmers').find(f => f.id === id);
  if (!r) return;
  document.getElementById('ef_id').value    = r.id;
  document.getElementById('ef_first').value = r.first;
  document.getElementById('ef_last').value  = r.last;
  document.getElementById('ef_email').value = r.email;
  document.getElementById('ef_bphone').value= r.bphone;
  document.getElementById('ef_mphone').value= r.mphone;
  document.getElementById('ef_city').value  = r.city;
  document.getElementById('ef_street').value= r.street;
  document.getElementById('ef_pkg').value   = r.package;
  document.getElementById('ef_date').value  = r.date;
  document.getElementById('ef_notes').value = r.notes;
  openModal('editFarmerModal');
}

function saveEditFarmer() {
  const id    = parseInt(document.getElementById('ef_id').value);
  const first = document.getElementById('ef_first').value.trim();
  const last  = document.getElementById('ef_last').value.trim();
  const email = document.getElementById('ef_email').value.trim();
  const mphone = document.getElementById('ef_mphone').value.trim();
  const bphone = document.getElementById('ef_bphone').value.trim();
  
  // Validation
  if (!Validators.notEmpty(first)) { toast('First name is required.', true); return; }
  if (!Validators.notEmpty(last)) { toast('Last name is required.', true); return; }
  if (!Validators.name(first)) { toast('First name format is invalid.', true); return; }
  if (!Validators.name(last)) { toast('Last name format is invalid.', true); return; }
  if (email && !Validators.email(email)) { toast('Invalid email format.', true); return; }
  if (mphone && !Validators.phone(mphone)) { toast('Invalid mobile phone format.', true); return; }
  if (bphone && !Validators.phone(bphone)) { toast('Invalid business phone format.', true); return; }

  const oldData = DB.get('farmers').find(f => f.id === id);
  const newData = {
    ...oldData, first, last, name: first + ' ' + last,
    email, bphone, mphone,
    city:    document.getElementById('ef_city').value.trim(),
    street:  document.getElementById('ef_street').value.trim(),
    package: document.getElementById('ef_pkg').value,
    date:    document.getElementById('ef_date').value,
    notes:   document.getElementById('ef_notes').value.trim(),
    updatedAt: new Date().toISOString()
  };
  
  const farmers = DB.get('farmers').map(r => r.id !== id ? r : newData);
  DB.set('farmers', farmers);
  Audit.log('UPDATE', 'Farmer', id, oldData, newData);
  closeModal('editFarmerModal');
  toast('✓ Farmer updated successfully!');
  renderFarmers();
}

// Pagination storage for each section
let currentPages = {
  farmers: 1, sales: 1, honey: 1, transport: 1, trainees: 1, trainers: 1, trainings: 1
};

function searchAndRenderFarmers(query) {
  currentPages.farmers = 1;
  renderFarmers(query);
}

function changeFarmerPage(page) {
  const query = document.getElementById('farmerSearch')?.value || '';
  renderFarmers(query, page);
}

function renderFarmers(searchQuery = '', page = 1) {
  let farmers = DB.get('farmers');
  
  // Apply search filter
  if (searchQuery) {
    farmers = Searchers.searchFarmers(searchQuery);
  }
  
  // Apply pagination
  const pageSize = 10;
  const result = Pagination.paginate(farmers, page, pageSize);
  currentPages.farmers = page;
  
  const tbody = document.getElementById('farmersTbody');
  document.getElementById('farmerCount').textContent = result.totalItems + ' record(s)' + (searchQuery ? ` (filtered)` : '');
  
  tbody.innerHTML = result.data.length ? result.data.map(r => `
    <tr>
      <td><span class="badge badge-amber">F-${String(r.id).padStart(3,'0')}</span></td>
      <td>${r.name}</td>
      <td>${r.mphone || r.bphone || '—'}</td>
      <td>${r.city || '—'}</td>
      <td>${r.date || '—'}</td>
      <td>${r.package ? `<span class="badge badge-blue">${r.package}</span>` : '—'}</td>
      <td>
        <button class="btn btn-sm btn-secondary" onclick="editFarmer(${r.id})" title="Edit">✏️</button>
        <button class="btn btn-sm btn-danger" onclick="deleteFarmer(${r.id})" title="Delete">🗑️</button>
      </td>
    </tr>
  `).join('') : '<tr><td colspan="7" class="empty">No farmers found.</td></tr>';
  
  // Render pagination
  if (result.totalPages > 1) {
    document.getElementById('farmersPagination').innerHTML = Pagination.renderControls(page, result.totalPages, 'changeFarmerPage');
  } else {
    document.getElementById('farmersPagination').innerHTML = '';
  }
}

function clearFarmerForm() {
  ['f_first','f_last','f_email','f_bphone','f_mphone','f_city','f_street','f_notes'].forEach(id => document.getElementById(id).value = '');
  document.getElementById('f_pkg').value  = '';
  document.getElementById('f_date').value = new Date().toISOString().split('T')[0];
}

// ══════════════════════════════════════════════
//  TRAINEES
// ══════════════════════════════════════════════
function addTrainee() {
  const name = document.getElementById('tr_name').value.trim();
  if (!name) { toast('Full name is required.', true); return; }

  const trainees = DB.get('trainees');
  trainees.push({
    id:    DB.nextId('trainees'),
    name,
    tid:   document.getElementById('tr_tid').value.trim(),
    dob:   document.getElementById('tr_dob').value,
    date:  document.getElementById('tr_date').value,
  });
  DB.set('trainees', trainees);
  toast('Trainee saved!');
  clearForm(['tr_name','tr_tid']);
  renderTrainees();
  switchTab('trainees', 'list');
}

function deleteTrainee(id) {
  confirmDelete('Delete this trainee record?', () => {
    DB.set('trainees', DB.get('trainees').filter(r => r.id !== id));
    toast('Trainee deleted.');
    renderTrainees();
  });
}

function editTrainee(id) {
  const r = DB.get('trainees').find(t => t.id === id);
  if (!r) return;
  document.getElementById('etr_id').value   = r.id;
  document.getElementById('etr_name').value = r.name;
  document.getElementById('etr_tid').value  = r.tid;
  document.getElementById('etr_dob').value  = r.dob;
  document.getElementById('etr_date').value = r.date;
  openModal('editTraineeModal');
}

function saveEditTrainee() {
  const id   = parseInt(document.getElementById('etr_id').value);
  const name = document.getElementById('etr_name').value.trim();
  if (!name) { toast('Name is required.', true); return; }
  DB.set('trainees', DB.get('trainees').map(r => r.id !== id ? r : {
    ...r, name,
    tid:  document.getElementById('etr_tid').value.trim(),
    dob:  document.getElementById('etr_dob').value,
    date: document.getElementById('etr_date').value,
  }));
  closeModal('editTraineeModal');
  toast('Trainee updated.');
  renderTrainees();
}

function renderTrainees() {
  const trainees = DB.get('trainees');
  document.getElementById('traineesTbody').innerHTML = trainees.length ? trainees.map(r => `
    <tr>
      <td><span class="badge badge-blue">T-${String(r.id).padStart(3,'0')}</span></td>
      <td>${r.name}</td>
      <td>${r.tid || '—'}</td>
      <td>${r.dob || '—'}</td>
      <td>${r.date || '—'}</td>
      <td>
        <button class="btn btn-sm btn-secondary" onclick="editTrainee(${r.id})"> Edit</button>
        <button class="btn btn-sm btn-danger" onclick="deleteTrainee(${r.id})">Delete</button>
      </td>
    </tr>
  `).join('') : '<tr><td colspan="6" class="empty">No trainees added yet.</td></tr>';
}

// ══════════════════════════════════════════════
//  TRAINERS
// ══════════════════════════════════════════════
function addTrainer() {
  const name = document.getElementById('trnr_name').value.trim();
  if (!name) { toast('Trainer name is required.', true); return; }

  const trainers = DB.get('trainers');
  trainers.push({
    id:       DB.nextId('trainers'),
    name,
    training: document.getElementById('trnr_training').value.trim(),
    phone:    document.getElementById('trnr_phone').value.trim(),
  });
  DB.set('trainers', trainers);
  toast('Trainer saved!');
  clearForm(['trnr_name','trnr_training','trnr_phone']);
  renderTrainers();
  switchTab('trainers', 'list');
}

function deleteTrainer(id) {
  confirmDelete('Delete this trainer record?', () => {
    DB.set('trainers', DB.get('trainers').filter(r => r.id !== id));
    toast('Trainer deleted.');
    renderTrainers();
  });
}

function editTrainer(id) {
  const r = DB.get('trainers').find(t => t.id === id);
  if (!r) return;
  document.getElementById('etrnr_id').value       = r.id;
  document.getElementById('etrnr_name').value     = r.name;
  document.getElementById('etrnr_training').value = r.training;
  document.getElementById('etrnr_phone').value    = r.phone;
  openModal('editTrainerModal');
}

function saveEditTrainer() {
  const id   = parseInt(document.getElementById('etrnr_id').value);
  const name = document.getElementById('etrnr_name').value.trim();
  if (!name) { toast('Name is required.', true); return; }
  DB.set('trainers', DB.get('trainers').map(r => r.id !== id ? r : {
    ...r, name,
    training: document.getElementById('etrnr_training').value.trim(),
    phone:    document.getElementById('etrnr_phone').value.trim(),
  }));
  closeModal('editTrainerModal');
  toast('Trainer updated.');
  renderTrainers();
}

function renderTrainers() {
  const trainers = DB.get('trainers');
  document.getElementById('trainersTbody').innerHTML = trainers.length ? trainers.map(r => `
    <tr>
      <td><span class="badge badge-green">TR-${String(r.id).padStart(3,'0')}</span></td>
      <td>${r.name}</td>
      <td>${r.training || '—'}</td>
      <td>${r.phone || '—'}</td>
      <td>
        <button class="btn btn-sm btn-secondary" onclick="editTrainer(${r.id})"> Edit</button>
        <button class="btn btn-sm btn-danger" onclick="deleteTrainer(${r.id})">Delete</button>
      </td>
    </tr>
  `).join('') : '<tr><td colspan="5" class="empty">No trainers added yet.</td></tr>';
}

// ══════════════════════════════════════════════
//  PRODUCT SALES
// ══════════════════════════════════════════════
const SALE_PRICES = {
  'Bee-hive (Single hive)':    15000,
  'Bee-hive (Mini package)':  120000,
  'Bee-hive (Full Package)':  190000,
  'Accessories':                 500,
  'Honey Extractor':           8000,
  'Harvesting Kit':             3500,
};

function updateSalePrice() {
  const type = document.getElementById('s_type').value;
  if (SALE_PRICES[type]) document.getElementById('s_price').value = SALE_PRICES[type];
  calcSaleTotal();
}

function calcSaleTotal() {
  const units = parseFloat(document.getElementById('s_units').value) || 0;
  const price = parseFloat(document.getElementById('s_price').value) || 0;
  document.getElementById('s_total').value = 'Ksh ' + fmt(units * price);
}

function addSale() {
  const customer = document.getElementById('s_cust').value.trim();
  const saleType = document.getElementById('s_type').value;
  const units = parseFloat(document.getElementById('s_units').value);
  const price = parseFloat(document.getElementById('s_price').value);
  
  if (!Validators.notEmpty(customer)) { toast('Customer name is required.', true); return; }
  if (!saleType) { toast('Please select a type of sale.', true); return; }
  if (!Validators.positiveNumber(units)) { toast('Units must be positive.', true); return; }
  if (!Validators.positiveNumber(price)) { toast('Price must be positive.', true); return; }

  const sale = {
    id:          DB.nextId('sales'),
    customer,
    saleType,
    package:     saleType,
    units,
    unitPrice:   price,
    total:       units * price,
    transport:   document.getElementById('s_transport').value,
    date:        document.getElementById('s_date').value,
    createdAt:   new Date().toISOString()
  };
  
  const sales = DB.get('sales');
  sales.push(sale);
  DB.set('sales', sales);
  Audit.log('CREATE', 'Sale', sale.id, null, sale);
  toast('✓ Sale saved successfully!');
  clearSaleForm();
  renderSales();
  switchTab('sales', 'list');
  updateTopIncome();
}

function deleteSale(id) {
  confirmDelete('Delete this sale record?', () => {
    DB.set('sales', DB.get('sales').filter(r => r.id !== id));
    toast('Sale deleted.');
    renderSales();
    updateTopIncome();
  });
}

function editSale(id) {
  const r = DB.get('sales').find(s => s.id === id);
  if (!r) return;
  document.getElementById('es_id').value        = r.id;
  document.getElementById('es_cust').value      = r.customer;
  document.getElementById('es_type').value      = r.saleType;
  document.getElementById('es_units').value     = r.units;
  document.getElementById('es_price').value     = r.unitPrice;
  document.getElementById('es_transport').value = r.transport;
  document.getElementById('es_date').value      = r.date;
  calcEditSaleTotal();
  openModal('editSaleModal');
}

function calcEditSaleTotal() {
  const units = parseFloat(document.getElementById('es_units').value) || 0;
  const price = parseFloat(document.getElementById('es_price').value) || 0;
  document.getElementById('es_total').value = 'Ksh ' + fmt(units * price);
}

function saveEditSale() {
  const id       = parseInt(document.getElementById('es_id').value);
  const customer = document.getElementById('es_cust').value.trim();
  if (!customer) { toast('Customer name required.', true); return; }
  const units = parseFloat(document.getElementById('es_units').value) || 1;
  const price = parseFloat(document.getElementById('es_price').value) || 0;
  DB.set('sales', DB.get('sales').map(r => r.id !== id ? r : {
    ...r, customer,
    saleType:  document.getElementById('es_type').value,
    units, unitPrice: price, total: units * price,
    transport: document.getElementById('es_transport').value,
    date:      document.getElementById('es_date').value,
  }));
  closeModal('editSaleModal');
  toast('Sale updated.');
  renderSales();
  updateTopIncome();
}

function searchAndRenderSales(query) {
  currentPages.sales = 1;
  renderSales(query);
}

function changeSalesPage(page) {
  const query = document.getElementById('salesSearch')?.value || '';
  renderSales(query, page);
}

function renderSales(searchQuery = '', page = 1) {
  let sales = DB.get('sales');
  if (searchQuery) { sales = Searchers.searchSales(searchQuery); }
  const pageSize = 10;
  const result = Pagination.paginate(sales, page, pageSize);
  currentPages.sales = page;
  const total = sales.reduce((s, r) => s + (r.total || 0), 0);
  document.getElementById('salesTotalBadge').textContent = '  ' + result.totalItems + ' sales | Total: Ksh ' + fmt(total);
  const tbody = document.getElementById('salesTbody');
  tbody.innerHTML = result.data.length ? result.data.map(r => `
    <tr><td><span class="badge badge-amber">S-${String(r.id).padStart(3,'0')}</span></td>
      <td>${r.customer}</td><td>${r.saleType}</td><td>${r.units}</td><td>Ksh ${fmt(r.unitPrice)}</td>
      <td class="text-green">Ksh ${fmt(r.total)}</td><td>${r.date || '—'}</td>
      <td><span class="badge ${r.transport === 'Yes' ? 'badge-blue' : 'badge-green'}">${r.transport}</span></td>
      <td><button class="btn btn-sm btn-secondary" onclick="editSale(${r.id})">✏️</button>
        <button class="btn btn-sm btn-danger" onclick="deleteSale(${r.id})">🗑️</button></td></tr>
  `).join('') : '<tr><td colspan="9" class="empty">No sales found.</td></tr>';
  if (result.totalPages > 1) {
    document.getElementById('salesPagination').innerHTML = Pagination.renderControls(page, result.totalPages, 'changeSalesPage');
  } else { document.getElementById('salesPagination').innerHTML = ''; }
}

function clearSaleForm() {
  document.getElementById('s_cust').value = '';
  document.getElementById('s_type').value = '';
  document.getElementById('s_units').value = 1;
  document.getElementById('s_price').value = '';
  document.getElementById('s_total').value = '';
  document.getElementById('s_transport').value = 'No';
  document.getElementById('s_date').value = new Date().toISOString().split('T')[0];
}

// ══════════════════════════════════════════════
//  HONEY PURCHASES
// ══════════════════════════════════════════════
const HONEY_PRICES = { 'Standard Honey': 900, 'Premium Honey': 1200 };

function updateHoneyPrice() {
  const type = document.getElementById('h_type').value;
  if (HONEY_PRICES[type]) document.getElementById('h_price').value = HONEY_PRICES[type];
  calcHoneyTotal();
}

function calcHoneyTotal() {
  const qty   = parseFloat(document.getElementById('h_qty').value) || 0;
  const price = parseFloat(document.getElementById('h_price').value) || 0;
  document.getElementById('h_total').value = 'Ksh ' + fmt(qty * price);
}

function addHoney() {
  const supplier = document.getElementById('h_supplier').value.trim();
  const qty = parseFloat(document.getElementById('h_qty').value);
  const price = parseFloat(document.getElementById('h_price').value);
  
  if (!Validators.notEmpty(supplier)) { toast('Supplier name is required.', true); return; }
  if (!Validators.positiveNumber(qty)) { toast('Quantity must be positive.', true); return; }
  if (!Validators.positiveNumber(price)) { toast('Unit price must be positive.', true); return; }

  const honeyRecord = {
    id:        DB.nextId('honey'),
    supplier,
    honeyType: document.getElementById('h_type').value,
    qty,
    unitPrice: price,
    total:     qty * price,
    date:      document.getElementById('h_date').value,
    payment:   document.getElementById('h_payment').value,
    bank:      document.getElementById('h_bank').value.trim(),
    createdAt: new Date().toISOString()
  };
  const honey = DB.get('honey');
  honey.push(honeyRecord);
  DB.set('honey', honey);
  Audit.log('CREATE', 'HoneyPurchase', honeyRecord.id, null, honeyRecord);
  toast('✓ Honey purchase saved successfully!');
  clearHoneyForm();
  renderHoney();
  switchTab('honey', 'list');
}

function deleteHoney(id) {
  confirmDelete('Delete this honey purchase record?', () => {
    DB.set('honey', DB.get('honey').filter(r => r.id !== id));
    toast('Record deleted.');
    renderHoney();
  });
}

function editHoney(id) {
  const r = DB.get('honey').find(h => h.id === id);
  if (!r) return;
  document.getElementById('eh_id').value       = r.id;
  document.getElementById('eh_supplier').value = r.supplier;
  document.getElementById('eh_type').value     = r.type;
  document.getElementById('eh_qty').value      = r.qty;
  document.getElementById('eh_price').value    = r.unitPrice;
  document.getElementById('eh_date').value     = r.date;
  document.getElementById('eh_payment').value  = r.payment;
  document.getElementById('eh_bank').value     = r.bank;
  calcEditHoneyTotal();
  openModal('editHoneyModal');
}

function calcEditHoneyTotal() {
  const qty   = parseFloat(document.getElementById('eh_qty').value) || 0;
  const price = parseFloat(document.getElementById('eh_price').value) || 0;
  document.getElementById('eh_total').value = 'Ksh ' + fmt(qty * price);
}

function saveEditHoney() {
  const id       = parseInt(document.getElementById('eh_id').value);
  const supplier = document.getElementById('eh_supplier').value.trim();
  const qty = parseFloat(document.getElementById('eh_qty').value);
  const price = parseFloat(document.getElementById('eh_price').value);
  
  if (!Validators.notEmpty(supplier)) { toast('Supplier name is required.', true); return; }
  if (!Validators.positiveNumber(qty)) { toast('Quantity must be positive.', true); return; }
  if (!Validators.positiveNumber(price)) { toast('Price must be positive.', true); return; }
  
  const oldData = DB.get('honey').find(h => h.id === id);
  const newData = {
    ...oldData, supplier,
    honeyType: document.getElementById('eh_type').value,
    qty, unitPrice: price, total: qty * price,
    date:      document.getElementById('eh_date').value,
    payment:   document.getElementById('eh_payment').value,
    bank:      document.getElementById('eh_bank').value.trim(),
    updatedAt: new Date().toISOString()
  };
  DB.set('honey', DB.get('honey').map(r => r.id !== id ? r : newData));
  Audit.log('UPDATE', 'HoneyPurchase', id, oldData, newData);
  closeModal('editHoneyModal');
  toast('✓ Honey purchase updated successfully!');
  renderHoney();
}

function searchAndRenderHoney(query) {
  currentPages.honey = 1;
  renderHoney(query);
}

function changeHoneyPage(page) {
  const query = document.getElementById('honeySearch')?.value || '';
  renderHoney(query, page);
}

function renderHoney(searchQuery = '', page = 1) {
  let honey = DB.get('honey');
  if (searchQuery) { honey = Searchers.searchHoney(searchQuery); }
  const pageSize = 10;
  const result = Pagination.paginate(honey, page, pageSize);
  currentPages.honey = page;
  const total = honey.reduce((s, r) => s + (r.total || 0), 0);
  document.getElementById('honeyTotalBadge').textContent = '  ' + result.totalItems + ' purchases | Total Cost: Ksh ' + fmt(total);
  const tbody = document.getElementById('honeyTbody');
  tbody.innerHTML = result.data.length ? result.data.map(r => `
    <tr><td><span class="badge badge-amber">H-${String(r.id).padStart(3,'0')}</span></td>
      <td>${r.supplier}</td><td>${r.honeyType || r.type}</td><td>${r.qty} KG</td>
      <td>Ksh ${fmt(r.unitPrice)}</td><td class="text-green">Ksh ${fmt(r.total)}</td>
      <td>${r.date || '—'}</td><td><span class="badge badge-blue">${r.payment}</span></td>
      <td><button class="btn btn-sm btn-secondary" onclick="editHoney(${r.id})">✏️</button>
        <button class="btn btn-sm btn-danger" onclick="deleteHoney(${r.id})">🗑️</button></td></tr>
  `).join('') : '<tr><td colspan="9" class="empty">No honey purchases found.</td></tr>';
  if (result.totalPages > 1) {
    document.getElementById('honeyPagination').innerHTML = Pagination.renderControls(page, result.totalPages, 'changeHoneyPage');
  } else { document.getElementById('honeyPagination').innerHTML = ''; }
}

function clearHoneyForm() {
  document.getElementById('h_supplier').value = '';
  document.getElementById('h_qty').value = 1;
  document.getElementById('h_price').value = 900;
  document.getElementById('h_total').value = '';
  document.getElementById('h_bank').value = '';
  document.getElementById('h_date').value = new Date().toISOString().split('T')[0];
}

// ══════════════════════════════════════════════
//  TRANSPORT
// ══════════════════════════════════════════════
const TRANSPORT_RATES = {
  'Single': 2000, 'Mini Package': 20, 'Full Package': 25,
  'Accessories': 30, 'Harvesting Kit': 30, 'Honey Extractor': 100,
};

function updateTransportRate() {
  const item = document.getElementById('tp_item').value;
  if (TRANSPORT_RATES[item]) document.getElementById('tp_rate').value = TRANSPORT_RATES[item];
  calcTransportTotal();
}

function calcTransportTotal() {
  const qty  = parseFloat(document.getElementById('tp_qty').value) || 0;
  const rate = parseFloat(document.getElementById('tp_rate').value) || 0;
  document.getElementById('tp_total').value = 'Ksh ' + fmt(qty * rate);
}

function addTransport() {
  const item = document.getElementById('tp_item').value;
  if (!item) { toast('Service type is required.', true); return; }

  const qty  = parseFloat(document.getElementById('tp_qty').value) || 1;
  const rate = parseFloat(document.getElementById('tp_rate').value) || 0;

  const transport = DB.get('transport');
  transport.push({
    id:   DB.nextId('transport'),
    item,
    qty,
    rate,
    cost: qty * rate,
    date: document.getElementById('tp_date').value,
    notes: document.getElementById('tp_notes').value.trim(),
  });
  DB.set('transport', transport);
  toast('Transport record saved!');
  clearTransportForm();
  renderTransport();
  switchTab('transport', 'list');
  updateTopIncome();
}

function deleteTransport(id) {
  confirmDelete('Delete this transport record?', () => {
    DB.set('transport', DB.get('transport').filter(r => r.id !== id));
    toast('Record deleted.');
    renderTransport();
    updateTopIncome();
  });
}

function editTransport(id) {
  const r = DB.get('transport').find(t => t.id === id);
  if (!r) return;
  document.getElementById('etp_id').value    = r.id;
  document.getElementById('etp_item').value  = r.item;
  document.getElementById('etp_qty').value   = r.qty;
  document.getElementById('etp_rate').value  = r.rate;
  document.getElementById('etp_date').value  = r.date;
  document.getElementById('etp_notes').value = r.notes;
  calcEditTransportTotal();
  openModal('editTransportModal');
}

function calcEditTransportTotal() {
  const qty  = parseFloat(document.getElementById('etp_qty').value) || 0;
  const rate = parseFloat(document.getElementById('etp_rate').value) || 0;
  document.getElementById('etp_total').value = 'Ksh ' + fmt(qty * rate);
}

function saveEditTransport() {
  const id   = parseInt(document.getElementById('etp_id').value);
  const item = document.getElementById('etp_item').value;
  if (!item) { toast('Service type required.', true); return; }
  const qty  = parseFloat(document.getElementById('etp_qty').value) || 1;
  const rate = parseFloat(document.getElementById('etp_rate').value) || 0;
  DB.set('transport', DB.get('transport').map(r => r.id !== id ? r : {
    ...r, item, qty, rate, cost: qty * rate,
    date:  document.getElementById('etp_date').value,
    notes: document.getElementById('etp_notes').value.trim(),
  }));
  closeModal('editTransportModal');
  toast('Transport updated.');
  renderTransport();
  updateTopIncome();
}

function renderTransport() {
  const transport = DB.get('transport');
  const total = transport.reduce((s, r) => s + (r.cost || 0), 0);
  document.getElementById('transportTotalBadge').textContent = '  Total: Ksh ' + fmt(total);
  document.getElementById('transportTbody').innerHTML = transport.length ? transport.map(r => `
    <tr>
      <td><span class="badge badge-amber">TP-${String(r.id).padStart(3,'0')}</span></td>
      <td>${r.item}</td>
      <td>${r.qty}</td>
      <td>Ksh ${fmt(r.rate)}</td>
      <td class="text-green">Ksh ${fmt(r.cost)}</td>
      <td>${r.date || '—'}</td>
      <td>${r.notes || '—'}</td>
      <td>
        <button class="btn btn-sm btn-secondary" onclick="editTransport(${r.id})">Edit</button>
        <button class="btn btn-sm btn-danger" onclick="deleteTransport(${r.id})">Delete</button>
      </td>
    </tr>
  `).join('') : '<tr><td colspan="8" class="empty">No transport records yet.</td></tr>';
}

function clearTransportForm() {
  document.getElementById('tp_qty').value = 1;
  document.getElementById('tp_rate').value = 2000;
  document.getElementById('tp_total').value = '';
  document.getElementById('tp_notes').value = '';
  document.getElementById('tp_date').value = new Date().toISOString().split('T')[0];
}

// ══════════════════════════════════════════════
//  TRAININGS
// ══════════════════════════════════════════════
function addTraining() {
  const trainee = document.getElementById('tng_trainee').value.trim();
  const trainer = document.getElementById('tng_trainer').value.trim();
  if (!trainee || !trainer) { toast('Trainee and Trainer are required.', true); return; }

  const trainings = DB.get('trainings');
  trainings.push({
    id:      DB.nextId('trainings'),
    trainee,
    trainer,
    booking: document.getElementById('tng_booking').value,
    date:    document.getElementById('tng_date').value,
    amount:  parseFloat(document.getElementById('tng_amount').value) || 0,
    pkg:     document.getElementById('tng_pkg').value.trim(),
  });
  DB.set('trainings', trainings);
  toast('Training session saved!');
  clearForm(['tng_trainee','tng_trainer','tng_pkg']);
  document.getElementById('tng_amount').value = '';
  renderTrainings();
  switchTab('trainings', 'list');
  updateTopIncome();
}

function deleteTraining(id) {
  confirmDelete('Delete this training record?', () => {
    DB.set('trainings', DB.get('trainings').filter(r => r.id !== id));
    toast('Training deleted.');
    renderTrainings();
    updateTopIncome();
  });
}

function editTraining(id) {
  const r = DB.get('trainings').find(t => t.id === id);
  if (!r) return;
  document.getElementById('etng_id').value      = r.id;
  document.getElementById('etng_trainee').value = r.trainee;
  document.getElementById('etng_trainer').value = r.trainer;
  document.getElementById('etng_booking').value = r.booking;
  document.getElementById('etng_date').value    = r.date;
  document.getElementById('etng_amount').value  = r.amount;
  document.getElementById('etng_pkg').value     = r.pkg;
  openModal('editTrainingModal');
}

function saveEditTraining() {
  const id      = parseInt(document.getElementById('etng_id').value);
  const trainee = document.getElementById('etng_trainee').value.trim();
  const trainer = document.getElementById('etng_trainer').value.trim();
  if (!trainee || !trainer) { toast('Trainee and Trainer required.', true); return; }
  DB.set('trainings', DB.get('trainings').map(r => r.id !== id ? r : {
    ...r, trainee, trainer,
    booking: document.getElementById('etng_booking').value,
    date:    document.getElementById('etng_date').value,
    amount:  parseFloat(document.getElementById('etng_amount').value) || 0,
    pkg:     document.getElementById('etng_pkg').value.trim(),
  }));
  closeModal('editTrainingModal');
  toast('Training updated.');
  renderTrainings();
  updateTopIncome();
}

function renderTrainings() {
  const trainings = DB.get('trainings');
  const total = trainings.reduce((s, r) => s + (r.amount || 0), 0);
  document.getElementById('trainingIncomeBadge').textContent = '  Total Income: Ksh ' + fmt(total);
  document.getElementById('trainingsTbody').innerHTML = trainings.length ? trainings.map(r => `
    <tr>
      <td><span class="badge badge-blue">TN-${String(r.id).padStart(3,'0')}</span></td>
      <td>${r.trainee}</td>
      <td>${r.trainer}</td>
      <td>${r.booking || '—'}</td>
      <td>${r.date || '—'}</td>
      <td class="text-green">Ksh ${fmt(r.amount)}</td>
      <td>${r.pkg || '—'}</td>
      <td>
        <button class="btn btn-sm btn-secondary" onclick="editTraining(${r.id})">Edit</button>
        <button class="btn btn-sm btn-danger" onclick="deleteTraining(${r.id})">Delete</button>
      </td>
    </tr>
  `).join('') : '<tr><td colspan="8" class="empty">No training sessions recorded yet.</td></tr>';
}

// ══════════════════════════════════════════════
//  REPORTS
// ══════════════════════════════════════════════
function renderReports() {
  const sales     = DB.get('sales');
  const honey     = DB.get('honey');
  const transport = DB.get('transport');
  const trainings = DB.get('trainings');
  const farmers   = DB.get('farmers');

  // Monthly income report
  const months = {};
  const addToMonth = (date, field, val) => {
    if (!date) return;
    const key = date.substring(0, 7);
    if (!months[key]) months[key] = { sales: 0, transport: 0, training: 0, honey: 0 };
    months[key][field] += val;
  };

  sales.forEach(r     => addToMonth(r.date, 'sales', r.total || 0));
  transport.forEach(r => addToMonth(r.date, 'transport', r.cost || 0));
  trainings.forEach(r => addToMonth(r.date, 'training', r.amount || 0));
  honey.forEach(r     => addToMonth(r.date, 'honey', r.total || 0));

  const sortedMonths = Object.keys(months).sort();
  let grandSales = 0, grandTransport = 0, grandTraining = 0, grandHoney = 0;

  document.getElementById('incomeReportTbody').innerHTML = sortedMonths.length ? sortedMonths.map(m => {
    const d = months[m];
    const total = d.sales + d.transport + d.training;
    grandSales += d.sales; grandTransport += d.transport;
    grandTraining += d.training; grandHoney += d.honey;
    const label = new Date(m + '-01').toLocaleDateString('en-KE', { month: 'long', year: 'numeric' });
    return `<tr>
      <td>${label}</td>
      <td>Ksh ${fmt(d.sales)}</td>
      <td>—</td>
      <td>Ksh ${fmt(d.training)}</td>
      <td>Ksh ${fmt(d.transport)}</td>
      <td>Ksh ${fmt(d.honey)}</td>
      <td class="text-green">Ksh ${fmt(total)}</td>
    </tr>`;
  }).join('') : '<tr><td colspan="7" class="empty">No data yet.</td></tr>';

  const grandTotal = grandSales + grandTransport + grandTraining;
  document.getElementById('incomeReportFoot').innerHTML = `
    <tr class="income-row">
      <td><strong>TOTAL</strong></td>
      <td>Ksh ${fmt(grandSales)}</td>
      <td>—</td>
      <td>Ksh ${fmt(grandTraining)}</td>
      <td>Ksh ${fmt(grandTransport)}</td>
      <td>Ksh ${fmt(grandHoney)}</td>
      <td>Ksh ${fmt(grandTotal)}</td>
    </tr>`;

  // Farmers report
  document.getElementById('farmerReportTbody').innerHTML = farmers.length ? farmers.map(r => `
    <tr><td>F-${String(r.id).padStart(3,'0')}</td><td>${r.name}</td><td>${r.city || '—'}</td><td>${r.mphone || r.bphone || '—'}</td></tr>
  `).join('') : '<tr><td colspan="4" class="empty">No farmers.</td></tr>';

  // Sales report
  document.getElementById('salesReportTbody').innerHTML = sales.length ? sales.map(r => `
    <tr><td>S-${String(r.id).padStart(3,'0')}</td><td>${r.customer}</td><td>${r.saleType}</td><td>${r.units}</td><td class="text-green">Ksh ${fmt(r.total)}</td></tr>
  `).join('') : '<tr><td colspan="5" class="empty">No sales.</td></tr>';
  
  // Render charts
  setTimeout(() => {
    renderMonthlyIncomeChart();
    renderSalesCategoryChart();
  }, 100);
}

// ── UTILITY ───────────────────────────────────
function clearForm(ids) {
  ids.forEach(id => { const el = document.getElementById(id); if (el) el.value = ''; });
}
