const fileInput = document.getElementById('fileInput');
const fileInfo = document.getElementById('file-info');
const tableContainer = document.getElementById('table-container');

fileInput.addEventListener('change', handleFile, false);

function handleFile(event) {
  const file = event.target.files[0];
  if (!file) return;

  const ext = getFileExtension(file.name);
  showFileInfo(file);

  const reader = new FileReader();

  const onLoadHandlers = {
    csv: handleCSV,
    xls: handleExcel,
    xlsx: handleExcel,
    json: handleJSON,
  };

  if (!onLoadHandlers[ext]) {
    alert('Unsupported file type. Please upload CSV, XLS, XLSX, or JSON.');
    return;
  }

  reader.onload = onLoadHandlers[ext];

  if (ext === 'xls' || ext === 'xlsx') {
    reader.readAsArrayBuffer(file);
  } else {
    reader.readAsText(file);
  }
}

function handleCSV(e) {
  const parsed = Papa.parse(e.target.result, { header: true, skipEmptyLines: true });
  const data = sanitizeData(parsed.data);
  renderDataTable(data);
}

function handleExcel(e) {
  const binary = new Uint8Array(e.target.result);
  const workbook = XLSX.read(binary, { type: 'array' });
  const sheet = workbook.Sheets[workbook.SheetNames[0]];
  const data = sanitizeData(XLSX.utils.sheet_to_json(sheet, { defval: '' }));
  renderDataTable(data);
}

function handleJSON(e) {
  try {
    const raw = JSON.parse(e.target.result);
    const data = sanitizeData(Array.isArray(raw) ? raw : [raw]);
    renderDataTable(data);
  } catch (err) {
    alert('Invalid JSON file.');
    console.error('JSON Parse Error:', err);
  }
}

function getFileExtension(filename) {
  return filename.split('.').pop().toLowerCase();
}

function showFileInfo(file) {
  const sizeKB = (file.size / 1024).toFixed(2);
  fileInfo.textContent = `Selected File: ${file.name} (${sizeKB} KB)`;
}

function sanitizeData(data) {
  if (!Array.isArray(data) || !data.length) return [];

  // Cache all unique keys from all rows only once
  const keysSet = new Set();
  data.forEach(row => Object.keys(row).forEach(key => keysSet.add(key)));
  const keys = Array.from(keysSet);

  return data.map(row => {
    // Avoid recreating array each map iteration by caching keys above
    const sanitizedRow = {};
    for (const key of keys) {
      sanitizedRow[key] = row[key] ?? '';
    }
    return sanitizedRow;
  });
}

function renderDataTable(data) {
  if (!data.length) {
    tableContainer.innerHTML = '<p>No data found.</p>';
    return;
  }

  const columns = Object.keys(data[0]).map(key => ({ title: key, data: key }));

  tableContainer.innerHTML = '<table id="data-table" class="display nowrap" style="width:100%"></table>';

  $.fn.dataTable.ext.errMode = 'none';

  $('#data-table').DataTable({
    data,
    columns,
    destroy: true,
    responsive: true,
    scrollX: true,
    stateSave: true,
    dom: 'Bfrtip',
    buttons: ['copy', 'csv', 'excel', 'colvis'],
    error: (xhr, error, thrown) => {
      console.warn('DataTables error suppressed:', error);
    },
  });
}
