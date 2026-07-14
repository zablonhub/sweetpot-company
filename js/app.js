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
      toast(' Could not save data. Check browser storage settings.', true);
      return false;
    }
  },
  
  nextId: (key) => {
    const items = DB.get(key);
    const numericIds = items.map(i => Number(i.id)).filter(Number.isFinite);
    if (numericIds.length === 0) return 1;

    let nextId = Math.max(...numericIds) + 1;
    while (items.some(i => Number(i.id) === nextId)) {
      nextId += 1;
    }
    return nextId;
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

const sampleFarmers = [
  { id: 1, first: 'James', last: 'Wanjiku', name: 'James Wanjiku', email: 'james.wanjiku@gmail.com', bphone: '+254712345678', mphone: '0712345678', city: 'Nakuru', street: 'Kikuyu Road', package: 'Starter', date: '2024-01-12', notes: 'Prefers weekly collection', createdAt: '2024-01-12T08:00:00.000Z' },
  { id: 2, first: 'Mary', last: 'Njeri', name: 'Mary Njeri', email: 'mary.njeri@yahoo.com', bphone: '+254723456789', mphone: '0723456789', city: 'Kisii', street: 'Kisii Main Street', package: 'Premium', date: '2024-01-15', notes: 'Requests fast delivery', createdAt: '2024-01-15T09:15:00.000Z' },
  { id: 3, first: 'Daniel', last: 'Kiptoo', name: 'Daniel Kiptoo', email: 'daniel.kiptoo@outlook.com', bphone: '+254734567890', mphone: '0734567890', city: 'Eldoret', street: 'Kapsabet Road', package: 'Enterprise', date: '2024-02-03', notes: 'Handles large volume', createdAt: '2024-02-03T10:30:00.000Z' },
  { id: 4, first: 'Grace', last: 'Akinyi', name: 'Grace Akinyi', email: 'grace.akinyi@gmail.com', bphone: '+254745678901', mphone: '0745678901', city: 'Mombasa', street: 'Likoni Road', package: 'Starter', date: '2024-02-10', notes: 'Needs monthly invoice', createdAt: '2024-02-10T11:00:00.000Z' },
  { id: 5, first: 'Peter', last: 'Mugo', name: 'Peter Mugo', email: 'peter.mugo@gmail.com', bphone: '+254756789012', mphone: '0756789012', city: 'Nyeri', street: 'Kenyatta Avenue', package: 'Premium', date: '2024-03-05', notes: 'Interested in training support', createdAt: '2024-03-05T08:45:00.000Z' },
  { id: 6, first: 'Lucy', last: 'Wangare', name: 'Lucy Wangare', email: 'lucy.wangare@yahoo.com', bphone: '+254767890123', mphone: '0767890123', city: 'Kericho', street: 'Tea Factory Road', package: 'Starter', date: '2024-03-11', notes: 'Prefers cash payment', createdAt: '2024-03-11T09:20:00.000Z' },
  { id: 7, first: 'Brian', last: 'Odhiambo', name: 'Brian Odhiambo', email: 'brian.odhiambo@gmail.com', bphone: '+254778901234', mphone: '0778901234', city: 'Kakamega', street: 'Mumias Road', package: 'Enterprise', date: '2024-03-20', notes: 'Active during harvest season', createdAt: '2024-03-20T12:05:00.000Z' },
  { id: 8, first: 'Anne', last: 'Kariuki', name: 'Anne Kariuki', email: 'anne.kariuki@outlook.com', bphone: '+254789012345', mphone: '0789012345', city: 'Nairobi', street: 'Westlands Road', package: 'Premium', date: '2024-04-02', notes: 'Understands modern apiary methods', createdAt: '2024-04-02T07:30:00.000Z' },
  { id: 9, first: 'Kevin', last: 'Mutua', name: 'Kevin Mutua', email: 'kevin.mutua@gmail.com', bphone: '+254790123456', mphone: '0790123456', city: 'Machakos', street: 'Mumbuni Road', package: 'Starter', date: '2024-04-17', notes: 'Needs transport coordination', createdAt: '2024-04-17T10:10:00.000Z' },
  { id: 10, first: 'Ruth', last: 'Muthoni', name: 'Ruth Muthoni', email: 'ruth.muthoni@yahoo.com', bphone: '+254701234567', mphone: '0701234567', city: 'Murang\'a', street: 'Kangema Road', package: 'Premium', date: '2024-05-01', notes: 'Interested in premium products', createdAt: '2024-05-01T08:20:00.000Z' },
  { id: 11, first: 'Charles', last: 'Ochieng', name: 'Charles Ochieng', email: 'charles.ochieng@gmail.com', bphone: '+254711234567', mphone: '0711234567', city: 'Kisumu', street: 'Milimani Road', package: 'Enterprise', date: '2024-05-08', notes: 'Large export order', createdAt: '2024-05-08T09:50:00.000Z' },
  { id: 12, first: 'Susan', last: 'Muli', name: 'Susan Muli', email: 'susan.muli@outlook.com', bphone: '+254721234567', mphone: '0721234567', city: 'Kitui', street: 'Kitui Town Road', package: 'Starter', date: '2024-05-19', notes: 'Prefers monthly updates', createdAt: '2024-05-19T11:35:00.000Z' },
  { id: 13, first: 'Eric', last: 'Ndegwa', name: 'Eric Ndegwa', email: 'eric.ndegwa@yahoo.com', bphone: '+254731234567', mphone: '0731234567', city: 'Thika', street: 'Kamwangi Road', package: 'Premium', date: '2024-06-04', notes: 'Interested in product bundles', createdAt: '2024-06-04T10:00:00.000Z' },
  { id: 14, first: 'Hellen', last: 'Mwaniki', name: 'Hellen Mwaniki', email: 'hellen.mwaniki@gmail.com', bphone: '+254741234567', mphone: '0741234567', city: 'Kiambu', street: 'Ruiru Road', package: 'Starter', date: '2024-06-11', notes: 'Needs field support', createdAt: '2024-06-11T08:10:00.000Z' },
  { id: 15, first: 'Noah', last: 'Kimutai', name: 'Noah Kimutai', email: 'noah.kimutai@gmail.com', bphone: '+254751234567', mphone: '0751234567', city: 'Bomet', street: 'Longisa Road', package: 'Enterprise', date: '2024-06-20', notes: 'Works with cooperative groups', createdAt: '2024-06-20T09:45:00.000Z' },
  { id: 16, first: 'Cynthia', last: 'Kiprop', name: 'Cynthia Kiprop', email: 'cynthia.kiprop@yahoo.com', bphone: '+254761234567', mphone: '0761234567', city: 'Narok', street: 'Mara Road', package: 'Premium', date: '2024-07-01', notes: 'Requests regular stock updates', createdAt: '2024-07-01T07:55:00.000Z' }
];

const sampleTrainees = [
  { id: 1, name: 'Faith Nyambura', tid: 'TRN-001', dob: '1993-04-12', date: '2024-01-08' },
  { id: 2, name: 'Samson Otieno', tid: 'TRN-002', dob: '1991-09-22', date: '2024-01-10' },
  { id: 3, name: 'Vivian Chepkorir', tid: 'TRN-003', dob: '1995-03-18', date: '2024-01-15' },
  { id: 4, name: 'Morris Wekesa', tid: 'TRN-004', dob: '1990-12-05', date: '2024-01-20' },
  { id: 5, name: 'Sharon Atieno', tid: 'TRN-005', dob: '1994-07-19', date: '2024-02-02' },
  { id: 6, name: 'David Mwangi', tid: 'TRN-006', dob: '1992-11-14', date: '2024-02-08' },
  { id: 7, name: 'Linet Achieng', tid: 'TRN-007', dob: '1996-02-07', date: '2024-02-14' },
  { id: 8, name: 'Emmanuel Kibet', tid: 'TRN-008', dob: '1989-10-27', date: '2024-03-01' },
  { id: 9, name: 'Miriam Wambui', tid: 'TRN-009', dob: '1993-06-11', date: '2024-03-09' },
  { id: 10, name: 'Isaac Omondi', tid: 'TRN-010', dob: '1991-08-30', date: '2024-03-16' },
  { id: 11, name: 'Esther Kilonzo', tid: 'TRN-011', dob: '1997-01-04', date: '2024-03-22' },
  { id: 12, name: 'George Kamau', tid: 'TRN-012', dob: '1988-05-17', date: '2024-04-03' },
  { id: 13, name: 'Diana Naliaka', tid: 'TRN-013', dob: '1994-09-09', date: '2024-04-12' },
  { id: 14, name: 'Nixon Barasa', tid: 'TRN-014', dob: '1992-12-21', date: '2024-04-25' },
  { id: 15, name: 'Caroline Oduor', tid: 'TRN-015', dob: '1995-02-26', date: '2024-05-06' },
  { id: 16, name: 'Brian Mutiso', tid: 'TRN-016', dob: '1990-07-15', date: '2024-05-14' }
];

const sampleTrainers = [
  { id: 1, name: 'Joseph Mburu', training: 'Modern Beekeeping', phone: '0711000001' },
  { id: 2, name: 'Catherine Langat', training: 'Honey Processing', phone: '0711000002' },
  { id: 3, name: 'Pauline Anyango', training: 'Apiary Business Management', phone: '0711000003' },
  { id: 4, name: 'Meshack Njoroge', training: 'Hive Maintenance', phone: '0711000004' },
  { id: 5, name: 'Rosemary Mumo', training: 'Quality Control', phone: '0711000005' },
  { id: 6, name: 'Kevin Cheruiyot', training: 'Harvest Planning', phone: '0711000006' },
  { id: 7, name: 'Naomi Kiarie', training: 'Marketing & Sales', phone: '0711000007' },
  { id: 8, name: 'Simon Kiplagat', training: 'Hive Installation', phone: '0711000008' }
];

const sampleSales = [
  { id: 1, customer: 'James Wanjiku', saleType: 'Bee-hive (Single hive)', package: 'Bee-hive (Single hive)', units: 4, unitPrice: 15000, total: 60000, transport: 'Yes', date: '2024-01-12', createdAt: '2024-01-12T08:00:00.000Z' },
  { id: 2, customer: 'Mary Njeri', saleType: 'Bee-hive (Mini package)', package: 'Bee-hive (Mini package)', units: 2, unitPrice: 120000, total: 240000, transport: 'Yes', date: '2024-01-18', createdAt: '2024-01-18T09:00:00.000Z' },
  { id: 3, customer: 'Daniel Kiptoo', saleType: 'Full Package', package: 'Full Package', units: 3, unitPrice: 190000, total: 570000, transport: 'No', date: '2024-02-05', createdAt: '2024-02-05T10:10:00.000Z' },
  { id: 4, customer: 'Grace Akinyi', saleType: 'Accessories', package: 'Accessories', units: 12, unitPrice: 500, total: 6000, transport: 'No', date: '2024-02-14', createdAt: '2024-02-14T11:20:00.000Z' },
  { id: 5, customer: 'Peter Mugo', saleType: 'Harvesting Kit', package: 'Harvesting Kit', units: 5, unitPrice: 3500, total: 17500, transport: 'Yes', date: '2024-02-22', createdAt: '2024-02-22T12:40:00.000Z' },
  { id: 6, customer: 'Lucy Wangare', saleType: 'Honey Extractor', package: 'Honey Extractor', units: 1, unitPrice: 8000, total: 8000, transport: 'No', date: '2024-03-01', createdAt: '2024-03-01T09:20:00.000Z' },
  { id: 7, customer: 'Brian Odhiambo', saleType: 'Bee-hive (Single hive)', package: 'Bee-hive (Single hive)', units: 8, unitPrice: 15000, total: 120000, transport: 'Yes', date: '2024-03-09', createdAt: '2024-03-09T07:55:00.000Z' },
  { id: 8, customer: 'Anne Kariuki', saleType: 'Bee-hive (Mini package)', package: 'Bee-hive (Mini package)', units: 3, unitPrice: 120000, total: 360000, transport: 'Yes', date: '2024-03-15', createdAt: '2024-03-15T10:05:00.000Z' },
  { id: 9, customer: 'Kevin Mutua', saleType: 'Accessories', package: 'Accessories', units: 20, unitPrice: 500, total: 10000, transport: 'No', date: '2024-03-24', createdAt: '2024-03-24T08:15:00.000Z' },
  { id: 10, customer: 'Ruth Muthoni', saleType: 'Harvesting Kit', package: 'Harvesting Kit', units: 7, unitPrice: 3500, total: 24500, transport: 'Yes', date: '2024-04-02', createdAt: '2024-04-02T11:25:00.000Z' },
  { id: 11, customer: 'Charles Ochieng', saleType: 'Bee-hive (Full Package)', package: 'Bee-hive (Full Package)', units: 5, unitPrice: 190000, total: 950000, transport: 'Yes', date: '2024-04-10', createdAt: '2024-04-10T09:10:00.000Z' },
  { id: 12, customer: 'Susan Muli', saleType: 'Honey Extractor', package: 'Honey Extractor', units: 2, unitPrice: 8000, total: 16000, transport: 'No', date: '2024-04-16', createdAt: '2024-04-16T10:30:00.000Z' },
  { id: 13, customer: 'Eric Ndegwa', saleType: 'Bee-hive (Single hive)', package: 'Bee-hive (Single hive)', units: 6, unitPrice: 15000, total: 90000, transport: 'Yes', date: '2024-05-03', createdAt: '2024-05-03T12:05:00.000Z' },
  { id: 14, customer: 'Hellen Mwaniki', saleType: 'Accessories', package: 'Accessories', units: 15, unitPrice: 500, total: 7500, transport: 'No', date: '2024-05-11', createdAt: '2024-05-11T08:23:00.000Z' },
  { id: 15, customer: 'Noah Kimutai', saleType: 'Bee-hive (Mini package)', package: 'Bee-hive (Mini package)', units: 4, unitPrice: 120000, total: 480000, transport: 'Yes', date: '2024-05-22', createdAt: '2024-05-22T10:45:00.000Z' },
  { id: 16, customer: 'Cynthia Kiprop', saleType: 'Harvesting Kit', package: 'Harvesting Kit', units: 3, unitPrice: 3500, total: 10500, transport: 'No', date: '2024-05-29', createdAt: '2024-05-29T09:35:00.000Z' },
  { id: 17, customer: 'James Wanjiku', saleType: 'Bee-hive (Full Package)', package: 'Bee-hive (Full Package)', units: 2, unitPrice: 190000, total: 380000, transport: 'Yes', date: '2024-06-08', createdAt: '2024-06-08T07:40:00.000Z' },
  { id: 18, customer: 'Mary Njeri', saleType: 'Accessories', package: 'Accessories', units: 10, unitPrice: 500, total: 5000, transport: 'No', date: '2024-06-19', createdAt: '2024-06-19T08:55:00.000Z' },
  { id: 19, customer: 'Daniel Kiptoo', saleType: 'Honey Extractor', package: 'Honey Extractor', units: 1, unitPrice: 8000, total: 8000, transport: 'Yes', date: '2024-06-25', createdAt: '2024-06-25T12:20:00.000Z' },
  { id: 20, customer: 'Grace Akinyi', saleType: 'Bee-hive (Single hive)', package: 'Bee-hive (Single hive)', units: 5, unitPrice: 15000, total: 75000, transport: 'No', date: '2024-07-03', createdAt: '2024-07-03T11:35:00.000Z' },
  { id: 21, customer: 'Peter Mugo', saleType: 'Bee-hive (Mini package)', package: 'Bee-hive (Mini package)', units: 2, unitPrice: 120000, total: 240000, transport: 'Yes', date: '2024-07-11', createdAt: '2024-07-11T10:50:00.000Z' },
  { id: 22, customer: 'Lucy Wangare', saleType: 'Full Package', package: 'Full Package', units: 1, unitPrice: 190000, total: 190000, transport: 'No', date: '2024-07-18', createdAt: '2024-07-18T09:25:00.000Z' }
];

const sampleHoney = [
  { id: 1, supplier: 'Moses Karanja', honeyType: 'Premium Honey', qty: 35, unitPrice: 1200, total: 42000, date: '2024-01-14', payment: 'Bank', bank: 'Co-op Bank', createdAt: '2024-01-14T09:20:00.000Z' },
  { id: 2, supplier: 'Jane Wairimu', honeyType: 'Standard Honey', qty: 22, unitPrice: 900, total: 19800, date: '2024-01-20', payment: 'Cash', bank: '', createdAt: '2024-01-20T10:35:00.000Z' },
  { id: 3, supplier: 'Stephen Mwakio', honeyType: 'Premium Honey', qty: 40, unitPrice: 1200, total: 48000, date: '2024-02-01', payment: 'Bank', bank: 'KCB', createdAt: '2024-02-01T08:10:00.000Z' },
  { id: 4, supplier: 'Asha Binti', honeyType: 'Standard Honey', qty: 18, unitPrice: 900, total: 16200, date: '2024-02-09', payment: 'Cash', bank: '', createdAt: '2024-02-09T07:45:00.000Z' },
  { id: 5, supplier: 'Njuguna Mugo', honeyType: 'Premium Honey', qty: 27, unitPrice: 1200, total: 32400, date: '2024-02-16', payment: 'Bank', bank: 'Equity', createdAt: '2024-02-16T11:50:00.000Z' },
  { id: 6, supplier: 'Catherine Awuor', honeyType: 'Standard Honey', qty: 24, unitPrice: 900, total: 21600, date: '2024-03-02', payment: 'Cash', bank: '', createdAt: '2024-03-02T09:15:00.000Z' },
  { id: 7, supplier: 'Daniel Nyaga', honeyType: 'Premium Honey', qty: 31, unitPrice: 1200, total: 37200, date: '2024-03-10', payment: 'Bank', bank: 'NCBA', createdAt: '2024-03-10T12:25:00.000Z' },
  { id: 8, supplier: 'Lydia Kiplagat', honeyType: 'Standard Honey', qty: 20, unitPrice: 900, total: 18000, date: '2024-03-18', payment: 'Cash', bank: '', createdAt: '2024-03-18T08:50:00.000Z' },
  { id: 9, supplier: 'Benson Ouma', honeyType: 'Premium Honey', qty: 45, unitPrice: 1200, total: 54000, date: '2024-03-29', payment: 'Bank', bank: 'Co-op Bank', createdAt: '2024-03-29T10:20:00.000Z' },
  { id: 10, supplier: 'Hilda Muthoni', honeyType: 'Standard Honey', qty: 19, unitPrice: 900, total: 17100, date: '2024-04-06', payment: 'Cash', bank: '', createdAt: '2024-04-06T07:30:00.000Z' },
  { id: 11, supplier: 'Omondi Otieno', honeyType: 'Premium Honey', qty: 28, unitPrice: 1200, total: 33600, date: '2024-04-12', payment: 'Bank', bank: 'KCB', createdAt: '2024-04-12T11:40:00.000Z' },
  { id: 12, supplier: 'Purity Kinya', honeyType: 'Standard Honey', qty: 21, unitPrice: 900, total: 18900, date: '2024-04-24', payment: 'Cash', bank: '', createdAt: '2024-04-24T09:05:00.000Z' },
  { id: 13, supplier: 'Kennedy Njoroge', honeyType: 'Premium Honey', qty: 36, unitPrice: 1200, total: 43200, date: '2024-05-04', payment: 'Bank', bank: 'Equity', createdAt: '2024-05-04T08:22:00.000Z' },
  { id: 14, supplier: 'Miriam Korir', honeyType: 'Standard Honey', qty: 25, unitPrice: 900, total: 22500, date: '2024-05-16', payment: 'Cash', bank: '', createdAt: '2024-05-16T10:15:00.000Z' },
  { id: 15, supplier: 'Caleb Kamau', honeyType: 'Premium Honey', qty: 29, unitPrice: 1200, total: 34800, date: '2024-05-28', payment: 'Bank', bank: 'NCBA', createdAt: '2024-05-28T09:55:00.000Z' },
  { id: 16, supplier: 'Winnie Nduta', honeyType: 'Standard Honey', qty: 23, unitPrice: 900, total: 20700, date: '2024-06-07', payment: 'Cash', bank: '', createdAt: '2024-06-07T07:35:00.000Z' },
  { id: 17, supplier: 'Elias Ruto', honeyType: 'Premium Honey', qty: 33, unitPrice: 1200, total: 39600, date: '2024-06-18', payment: 'Bank', bank: 'Co-op Bank', createdAt: '2024-06-18T11:10:00.000Z' },
  { id: 18, supplier: 'Doreen Kendi', honeyType: 'Standard Honey', qty: 17, unitPrice: 900, total: 15300, date: '2024-06-30', payment: 'Cash', bank: '', createdAt: '2024-06-30T08:40:00.000Z' },
  { id: 19, supplier: 'Victor Sigei', honeyType: 'Premium Honey', qty: 32, unitPrice: 1200, total: 38400, date: '2024-07-08', payment: 'Bank', bank: 'KCB', createdAt: '2024-07-08T10:00:00.000Z' },
  { id: 20, supplier: 'Sarah Mwikali', honeyType: 'Standard Honey', qty: 26, unitPrice: 900, total: 23400, date: '2024-07-12', payment: 'Cash', bank: '', createdAt: '2024-07-12T09:30:00.000Z' },
  { id: 21, supplier: 'Patrick Ndegwa', honeyType: 'Premium Honey', qty: 38, unitPrice: 1200, total: 45600, date: '2024-07-22', payment: 'Bank', bank: 'Equity', createdAt: '2024-07-22T12:45:00.000Z' },
  { id: 22, supplier: 'Joyce Adhiambo', honeyType: 'Standard Honey', qty: 16, unitPrice: 900, total: 14400, date: '2024-07-27', payment: 'Cash', bank: '', createdAt: '2024-07-27T07:50:00.000Z' }
];

const sampleTransport = [
  { id: 1, item: 'Single', qty: 2, rate: 2000, cost: 4000, date: '2024-01-10', notes: 'Rural delivery to Naivasha' },
  { id: 2, item: 'Mini Package', qty: 1, rate: 20, cost: 20, date: '2024-01-16', notes: 'City courier' },
  { id: 3, item: 'Full Package', qty: 3, rate: 25, cost: 75, date: '2024-02-02', notes: 'Farm gate pickup' },
  { id: 4, item: 'Accessories', qty: 4, rate: 30, cost: 120, date: '2024-02-11', notes: 'Spare parts delivery' },
  { id: 5, item: 'Harvesting Kit', qty: 2, rate: 30, cost: 60, date: '2024-02-20', notes: 'Equipment transfer' },
  { id: 6, item: 'Honey Extractor', qty: 1, rate: 100, cost: 100, date: '2024-03-03', notes: 'Machine relocation' },
  { id: 7, item: 'Single', qty: 3, rate: 2000, cost: 6000, date: '2024-03-12', notes: 'Multiple site delivery' },
  { id: 8, item: 'Mini Package', qty: 2, rate: 20, cost: 40, date: '2024-03-19', notes: 'Warehouse transfer' },
  { id: 9, item: 'Full Package', qty: 4, rate: 25, cost: 100, date: '2024-03-28', notes: 'Bulk delivery' },
  { id: 10, item: 'Accessories', qty: 3, rate: 30, cost: 90, date: '2024-04-05', notes: 'Supplier pickup' },
  { id: 11, item: 'Harvesting Kit', qty: 1, rate: 30, cost: 30, date: '2024-04-15', notes: 'Field support' },
  { id: 12, item: 'Honey Extractor', qty: 2, rate: 100, cost: 200, date: '2024-04-23', notes: 'Workshop delivery' },
  { id: 13, item: 'Single', qty: 5, rate: 2000, cost: 10000, date: '2024-05-02', notes: 'Long-distance delivery' },
  { id: 14, item: 'Mini Package', qty: 3, rate: 20, cost: 60, date: '2024-05-10', notes: 'Cross-county dispatch' },
  { id: 15, item: 'Full Package', qty: 2, rate: 25, cost: 50, date: '2024-05-18', notes: 'Co-op collection' },
  { id: 16, item: 'Accessories', qty: 2, rate: 30, cost: 60, date: '2024-06-05', notes: 'Replacement stock' },
  { id: 17, item: 'Harvesting Kit', qty: 3, rate: 30, cost: 90, date: '2024-06-17', notes: 'Training site delivery' },
  { id: 18, item: 'Honey Extractor', qty: 1, rate: 100, cost: 100, date: '2024-06-29', notes: 'Demo unit movement' }
];

const sampleTrainings = [
  { id: 1, trainee: 'Faith Nyambura', trainer: 'Joseph Mburu', booking: 'Booked', date: '2024-01-08', amount: 12000, pkg: 'Starter' },
  { id: 2, trainee: 'Samson Otieno', trainer: 'Catherine Langat', booking: 'Confirmed', date: '2024-01-10', amount: 15000, pkg: 'Intermediate' },
  { id: 3, trainee: 'Vivian Chepkorir', trainer: 'Pauline Anyango', booking: 'Booked', date: '2024-01-15', amount: 13500, pkg: 'Starter' },
  { id: 4, trainee: 'Morris Wekesa', trainer: 'Meshack Njoroge', booking: 'Confirmed', date: '2024-01-20', amount: 14000, pkg: 'Intermediate' },
  { id: 5, trainee: 'Sharon Atieno', trainer: 'Rosemary Mumo', booking: 'Booked', date: '2024-02-02', amount: 16000, pkg: 'Advanced' },
  { id: 6, trainee: 'David Mwangi', trainer: 'Kevin Cheruiyot', booking: 'Confirmed', date: '2024-02-08', amount: 12500, pkg: 'Starter' },
  { id: 7, trainee: 'Linet Achieng', trainer: 'Naomi Kiarie', booking: 'Booked', date: '2024-02-14', amount: 14500, pkg: 'Intermediate' },
  { id: 8, trainee: 'Emmanuel Kibet', trainer: 'Simon Kiplagat', booking: 'Confirmed', date: '2024-03-01', amount: 15000, pkg: 'Advanced' },
  { id: 9, trainee: 'Miriam Wambui', trainer: 'Joseph Mburu', booking: 'Booked', date: '2024-03-09', amount: 13000, pkg: 'Starter' },
  { id: 10, trainee: 'Isaac Omondi', trainer: 'Catherine Langat', booking: 'Confirmed', date: '2024-03-16', amount: 15500, pkg: 'Intermediate' },
  { id: 11, trainee: 'Esther Kilonzo', trainer: 'Pauline Anyango', booking: 'Booked', date: '2024-03-22', amount: 16500, pkg: 'Advanced' },
  { id: 12, trainee: 'George Kamau', trainer: 'Meshack Njoroge', booking: 'Confirmed', date: '2024-04-03', amount: 13800, pkg: 'Starter' },
  { id: 13, trainee: 'Diana Naliaka', trainer: 'Rosemary Mumo', booking: 'Booked', date: '2024-04-12', amount: 14800, pkg: 'Intermediate' },
  { id: 14, trainee: 'Nixon Barasa', trainer: 'Kevin Cheruiyot', booking: 'Confirmed', date: '2024-04-25', amount: 15200, pkg: 'Advanced' },
  { id: 15, trainee: 'Caroline Oduor', trainer: 'Naomi Kiarie', booking: 'Booked', date: '2024-05-06', amount: 14200, pkg: 'Starter' },
  { id: 16, trainee: 'Brian Mutiso', trainer: 'Simon Kiplagat', booking: 'Confirmed', date: '2024-05-14', amount: 15800, pkg: 'Intermediate' }
];

function assignGeneratedIds(records) {
  return records.map((record, index) => ({
    ...record,
    id: index + 1
  }));
}

function seedDatabase() {
  const dataKeys = ['farmers', 'trainees', 'trainers', 'sales', 'honey', 'transport', 'trainings'];
  const hasExistingData = dataKeys.some(key => DB.get(key).length > 0);

  if (localStorage.getItem('nekta_seeded') === 'true' || hasExistingData) {
    return;
  }

  const seeded = DB.set('farmers', assignGeneratedIds(sampleFarmers))
    && DB.set('trainees', assignGeneratedIds(sampleTrainees))
    && DB.set('trainers', assignGeneratedIds(sampleTrainers))
    && DB.set('sales', assignGeneratedIds(sampleSales))
    && DB.set('honey', assignGeneratedIds(sampleHoney))
    && DB.set('transport', assignGeneratedIds(sampleTransport))
    && DB.set('trainings', assignGeneratedIds(sampleTrainings));

  if (seeded) {
    localStorage.setItem('nekta_seeded', 'true');
  }
}

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
    const nextId = logs.length ? Math.max(...logs.map(l => Number(l.id) || 0)) + 1 : 1;
    logs.push({
      id: nextId,
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
    toast(` Exported ${data.length} records to CSV`);
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
    toast(' PDF exported successfully');
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
    console.warn(' localStorage may be disabled or full. Data persistence may not work.');
    const loginScreen = document.getElementById('loginScreen');
    const warningDiv = document.createElement('div');
    warningDiv.style.cssText = 'position:fixed;top:10px;left:50%;transform:translateX(-50%);background:#ff9800;color:#fff;padding:12px 20px;border-radius:8px;font-size:12px;font-weight:600;z-index:9999;';
    warningDiv.textContent = ' Storage disabled: Changes may not be saved.';
    loginScreen.appendChild(warningDiv);
  }

  seedDatabase();
  
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
  t.textContent = (isError ? ' ' : ' ') + msg;
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
  toast(' Data backup downloaded successfully!');
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
        
        toast(' Data restored successfully! Please refresh the page.');
        setTimeout(() => location.reload(), 1500);
      } catch (e) {
        toast(' Invalid backup file.', true);
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
    <div class="stat-card"><div class="stat-label"> Farmers</div><div class="stat-value">${farmers.length}</div></div>
    <div class="stat-card"><div class="stat-label"> Trainees</div><div class="stat-value">${trainees.length}</div></div>
    <div class="stat-card"><div class="stat-label"> Trainers</div><div class="stat-value">${trainers.length}</div></div>
    <div class="stat-card"><div class="stat-label"> Product Sales</div><div class="stat-value">Ksh ${fmt(totalSales)}</div></div>
    <div class="stat-card"><div class="stat-label"> Honey Purchased</div><div class="stat-value">Ksh ${fmt(totalHoney)}</div></div>
    <div class="stat-card"><div class="stat-label"> Transport Earnings</div><div class="stat-value">Ksh ${fmt(totalTransport)}</div></div>
    <div class="stat-card"><div class="stat-label"> Training Income</div><div class="stat-value">Ksh ${fmt(totalTraining)}</div></div>
    <div class="stat-card"><div class="stat-label"> Total Income</div><div class="stat-value">Ksh ${fmt(calcTotalIncome())}</div></div>
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
  toast(' Farmer saved successfully!');
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
  toast(' Farmer updated successfully!');
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
        <button class="btn btn-sm btn-secondary" onclick="editFarmer(${r.id})" title="Edit farmer">Edit</button>
        <button class="btn btn-sm btn-danger" onclick="deleteFarmer(${r.id})" title="Delete farmer">Delete</button>
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
  toast(' Sale saved successfully!');
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
      <td><button class="btn btn-sm btn-secondary" onclick="editSale(${r.id})" title="Edit sale">Edit</button>
        <button class="btn btn-sm btn-danger" onclick="deleteSale(${r.id})" title="Delete sale">Delete</button></td></tr>
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
  toast(' Honey purchase saved successfully!');
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
  toast(' Honey purchase updated successfully!');
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
      <td><button class="btn btn-sm btn-secondary" onclick="editHoney(${r.id})" title="Edit honey purchase">Edit</button>
        <button class="btn btn-sm btn-danger" onclick="deleteHoney(${r.id})" title="Delete honey purchase">Delete</button></td></tr>
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
