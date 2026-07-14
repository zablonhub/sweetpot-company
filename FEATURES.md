# SweetPot Management System - Features & User Guide

##  Overview
SweetPot is a comprehensive management system for beekeeping companies, designed to track farmers, trainees, trainers, product sales, honey purchases, transportation, and training sessions. All data is stored securely in browser localStorage.

---

##  **Core Features**

### 1. **Authentication**
- Simple login system with Username/Password (default: Username / Password)
- Secure logout with form clearing
- Session persistence across browser restarts
- Storage verification on login with warning system

### 2. **Dashboard**
- **Statistics Cards** - Real-time overview of:
  - Total Farmers registered
  - Active Trainees
  - Registered Trainers
  - Product Sales revenue
  - Honey Purchase costs
  - Transport Earnings
  - Training Income
  - Total Company Income

- **Interactive Charts**:
  -  **Income Sources** - Doughnut chart showing revenue breakdown
  -  **Organization Overview** - Bar chart of personnel counts
  -  **Recent Sales** - Table of last 5 sales
  -  **Recent Honey Purchases** - Table of last 5 purchases

### 3. **Farmer Management**
-  **Add Farmers** with:
  - First & Last Name (required)
  - Email, Business Phone, Mobile Phone (with validation)
  - City/Town, Street Address
  - Preferred Package (Single/Mini/Full)
  - Registration Date
  - Custom Notes

-  **Search Farmers** by:
  - Name (first or last)
  - Phone number
  - City/Town

-  **Edit Farmer Records** - Update any field
-  **Delete Farmers** - With confirmation dialog
-  **Export to CSV** - Download farmer list
-  **Pagination** - View 10 farmers per page

### 4. **Product Sales Management**
- **Record Sales** of:
  - Beehive packages (Single, Mini, Full)
  - Accessories
  - Honey Extractors
  - Harvesting Kits

- **Auto-Calculated Pricing**:
  - Unit prices pre-set in system
  - Total auto-calculates: Units × Unit Price
  - Optional transportation tracking

-  **Search Sales** by:
  - Customer name
  - Product type

-  **Export to CSV/PDF** - Download sales reports
-  **Pagination** - 10 sales per page

### 5. **Honey Purchase Tracking**
- **Record Honey Purchases** from farmers:
  - Supplier name (required)
  - Honey type (Standard/Premium/Bee Products)
  - Quantity in KG
  - Unit price per KG
  - Auto-calculated total cost
  - Payment method (Cash/M-Pesa/Bank Transfer)

-  **Search Purchases** by:
  - Supplier name
  - Honey type

-  **Export Reports** - CSV and PDF formats
-  **Analytics** - Track spending by supplier

### 6. **Trainee Management**
- Enroll trainees in beekeeping programs
- Track training participation
- Manage trainee information
- Sort and search

### 7. **Trainer Management**
- Register beekeeping trainers/instructors
- Track trainer specializations
- Manage trainer availability

### 8. **Transport Management**
- Log transportation services
- Track earnings from transport
- Calculate transport costs
- Export transport records

### 9. **Training Schedules**
- Schedule training sessions
- Track training attendance
- Record training fees/income
- Export training reports

### 10. **Reports & Analytics**
-  **Monthly Income Trend** - Line chart of income over time
-  **Sales by Category** - Pie chart of sales breakdown
-  **Monthly Income Report** - Detailed table showing:
  - Product Sales
  - Training Income
  - Transport Earnings
  - Honey Purchases
  - Total Monthly Income

-  **Farmer Directory** - Complete farmer list with contact info
-  **Sales Report** - All recorded sales with totals
-  **Audit Trail** - Track all changes to records

---

##  **Data Management**

### Validation Features
 **Form Validation**:
- Required fields enforcement
- Email format validation
- Phone number validation (10-digit Kenya format)
- Name format validation (letters and spaces only)
- Positive number validation for prices/quantities
- Date validation

### Data Persistence
 **Automatic Saving**:
- All changes saved immediately to browser localStorage
- Data persists across sessions
- No internet required
- Backup system to prevent data loss

### Backup & Restore
-  **Download Backup** - Export all data as JSON file
-  **Restore from Backup** - Import previously saved data
- Located in top navigation bar

---

##  **User Experience Features**

### Search & Filter
-  Real-time search across all sections
- Multiple search criteria per section
- Filter results instantly

### Pagination
-  View 10 records per page
- Navigate using Previous/Next buttons
- Page indicators showing current position

### Notifications
-  Success messages (green toast) for completed actions
-  Error messages (red toast) for validation failures
-  Warning messages for important alerts

### Responsive Design
-  Mobile-friendly interface
- Touch-optimized buttons
- Scales to tablet and desktop
- Professional UI with honey/amber theme

### Charts & Visualizations
-  Interactive Chart.js visualizations
- Real-time data updates
- Professional styling

---

##  **Advanced Features**

### Audit Trail
-  Track all record changes
- View history of edits and deletions
- Timestamp and user tracking
- Useful for compliance and auditing

### Export Functionality
-  **CSV Export** - Compatible with Excel
-  **PDF Export** - Professional reports
- Works for all major sections
- Auto-generated filenames with dates

### Role-Based Access
- Single login system (can be expanded)
- Secure logout
- Session timeout support

### Data Integrity
-  Input validation at every step
- localStorage error handling
- Data corruption prevention
- Automatic backups

---

##  **Getting Started**

### First Time Users
1. Open `index.html` in your browser
2. Login with:
   - Username: `Username`
   - Password: `Password`
3. Navigate using the sidebar menu
4. Add your first farmer/sale/record

### Adding Records
1. Click "+ Add New [Item]" tab
2. Fill in the form fields
3. Red asterisks (*) indicate required fields
4. Click "Save [Item]"
5. Confirmation message appears when saved

### Searching Records
1. Go to any list page (Farmers, Sales, Honey, etc.)
2. Type in the search box
3. Results filter instantly
4. Use Prev/Next to navigate pages

### Exporting Data
1. Navigate to any list
2. Click " CSV" to download spreadsheet
3. Click " PDF" for professional reports
4. Files auto-save with date stamp

### Backing Up Data
1. Click " Backup" in top navigation
2. File downloads as `SweetPot_Backup_[DATE].json`
3. Store safely for recovery

### Restoring Data
1. Click " Restore" in top navigation
2. Select previously saved backup file
3. All data restores automatically
4. Page refreshes to show updated data

---

##  **Data Fields**

### Farmers
- ID, First Name, Last Name, Email, Business Phone, Mobile Phone
- City, Street Address, Package, Registration Date, Notes

### Sales
- Sale ID, Customer Name, Product Type, Units, Unit Price
- Total Amount, Date, Transportation Request

### Honey Purchases
- Supplier Name, Honey Type, Quantity (KG), Unit Price
- Total Cost, Date, Payment Method

### Trainees
- Full Name, Training ID, Date of Birth, Registration Date

### Trainers
- Trainer Name, Specialization, Contact Info

### Transport
- Date, Description, Cost, Destination

### Training Sessions
- Trainer Name, Venue, Date, Amount Charged

---

##  **Technical Details**

### Storage
- Browser localStorage for all data
- Keys prefixed with `nekta_`
- JSON format for data storage
- Automatic verification on login

### Browser Compatibility
- Chrome 90+
- Firefox 88+
- Safari 14+
- Edge 90+

### Performance
- Handles 1000+ records smoothly
- Pagination prevents slowdown
- Lightweight (no backend required)
- Real-time updates

### Security
- Client-side validation
- No data sent to external servers
- Can be used offline
- Clear logout (clears login form)

---

##  **Troubleshooting**

### Data Not Saving
-  Check if browser storage is enabled
- Check browser console for errors
- Try refreshing the page
- Use " Backup" to manually export

### Can't Login
- Verify username and password are exact
- Check caps lock
- Clear browser cache and try again
- JavaScript must be enabled

### Charts Not Showing
- Add some data first (charts show when data exists)
- Refresh the page
- Check browser console
- Ensure Chart.js library loaded (requires internet)

### Slow Performance
- Check how many records you have
- Clear old audit logs if needed
- Use search/filter to reduce data
- Try different browser

---

##  **Tips & Best Practices**

1. **Regular Backups** - Download backup weekly
2. **Consistent Data** - Use same spelling for names
3. **Phone Format** - Use 10-digit format: 0712345678
4. **Email Format** - Must include @ and domain
5. **Dates** - Use consistent date format (YYYY-MM-DD)
6. **Notes Field** - Add helpful notes for later reference
7. **Search Before Adding** - Avoid duplicate entries
8. **Export Regularly** - Keep CSV copies for records

---

##  **Support**

For issues or feature requests:
- Check browser console (F12)
- Verify all required fields are filled
- Ensure data format matches requirements
- Try the "Restore" function with a backup
- Clear browser cache and restart

---

##  **License & Credits**

SweetPot Management System v2.0
Built with HTML5, CSS3, JavaScript, and Chart.js
Designed for Nekta Bee Company

All data stored locally. No external servers. No tracking.

---

**Last Updated:** July 2026
**Version:** 2.0 (Enhanced with search, pagination, validation, exports)
