# Nekta Bee Company – Management System

## How to Open
1. Extract the zip file
2. Open the `nekta-bee` folder in VS Code
3. Open `index.html` directly in your browser (double-click), OR
4. Use the VS Code **Live Server** extension for the best experience

## Login Credentials
- **Username:** Username  
- **Password:** Password  

## Features
- **Dashboard** — Overview stats and recent activity
- **Farmers** — Add, edit, delete farmer records (name, phone, city, package, notes)
- **Trainees** — Manage beekeeping training enrollments
- **Trainers** — Manage instructors and their specializations
- **Product Sales** — Record beehive package and accessory sales with auto-pricing
- **Honey Purchases** — Track honey bought from farmers (Standard / Premium)
- **Transport** — Log transportation services and earnings
- **Training Schedules** — Book and manage training sessions
- **Reports** — Monthly income summary and farmer/sales reports

## Data Storage
All data is saved in your **browser's localStorage** — no server or internet needed.  
Data persists between sessions on the same browser and computer.

## File Structure
```
nekta-bee/
├── index.html        ← Main app (open this)
├── css/
│   └── style.css     ← All styles
├── js/
│   └── app.js        ← All logic & data management
└── README.md         ← This file
```

## Notes
- Fields marked with a red * are required
- Sub-totals on sales, honey, and transport are auto-calculated
- Use the ✏️ button to edit any record, 🗑️ to delete
- A confirmation dialog appears before any deletion
