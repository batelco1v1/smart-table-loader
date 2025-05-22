# Smart Table Loader

Smart Table Loader is a lightweight, browser-based tool that lets you **upload and display CSV, Excel (.xls/.xlsx), or JSON files** in a dynamic and interactive HTML table powered by DataTables.js. This tool is great for quick data analysis without the need for installing heavy software.

![Smart Table Loader](preview.jpg)

## 🚀 Features

- Upload `.csv`, `.xls`, `.xlsx`, or `.json` files
- Automatic detection and sanitization of table headers
- DataTables integration with:
  - Column visibility toggling
  - Export to Excel, CSV, Copy
  - Responsive and scrollable tables
  - State saving (remembers table settings)
- File info display before rendering
- Minimal and clean UI using Google Fonts

## 🔧 Installation

Clone the repository and open `index.html` in any modern web browser:

```bash
git clone https://github.com/BaseMax/smart-table-loader.git
cd smart-table-loader
open index.html # or double-click to open in browser
```

## 📁 Project Structure

```
smart-table-loader/
├── css/
│   ├── buttons.dataTables.min.css
│   └── jquery.dataTables.min.css
├── js/
│   ├── papaparse.min.js
│   ├── xlsx.full.min.js
│   ├── jquery-3.7.1.min.js
│   ├── jquery.dataTables.min.js
│   ├── dataTables.buttons.min.js
│   ├── buttons.html5.min.js
│   ├── buttons.colVis.min.js
│   ├── buttons.print.min.js
│   └── lib.js                # Main file logic
├── index.html                # UI entry point
├── data.csv                 # Example data file
├── LICENSE
└── README.md
```

## 📊 Demo Usage

1. Open `index.html` in your browser.
2. Click on the "Upload" field and select a CSV, Excel, or JSON file.
3. View your data rendered in a feature-rich HTML table.

## 🔗 Validate CSV Files

Use [CSVLint.io](https://csvlint.io) to validate your CSV files before uploading.

## 🧪 Dependencies

This project uses:

- [PapaParse](https://www.papaparse.com/) (for parsing CSV)
- [SheetJS (xlsx)](https://github.com/SheetJS/sheetjs) (for Excel)
- [DataTables](https://datatables.net/) and extensions

## 📜 License

MIT License © 2025 [Max Base](https://github.com/BaseMax)
