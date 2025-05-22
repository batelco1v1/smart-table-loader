document.getElementById('fileInput').addEventListener('change', handleFile, false);

function handleFile(e) {
  const file = e.target.files[0];
  if (!file) return;

  const reader = new FileReader();
  const extension = file.name.split('.').pop().toLowerCase();

  if (extension === 'csv') {
    reader.onload = function (e) {
      const csv = e.target.result;
      const data = Papa.parse(csv, { header: true }).data;
      renderTable(data);
    };
    reader.readAsText(file);
  } else if (extension === 'xls' || extension === 'xlsx') {
    reader.onload = function (e) {
      const data = new Uint8Array(e.target.result);
      const workbook = XLSX.read(data, { type: 'array' });
      const firstSheet = workbook.Sheets[workbook.SheetNames[0]];
      const jsonData = XLSX.utils.sheet_to_json(firstSheet);
      renderTable(jsonData);
    };
    reader.readAsArrayBuffer(file);
  } else {
    alert('Unsupported file type');
  }
}

function renderTable(data) {
  if (!data.length) {
    document.getElementById('table-container').innerHTML = 'No data found.';
    return;
  }

  const allKeys = [...new Set(data.flatMap(row => Object.keys(row)))];

  const normalizedData = data.map(row => {
    const newRow = {};
    allKeys.forEach(key => {
      newRow[key] = row[key] !== undefined ? row[key] : '';
    });
    return newRow;
  });

  document.getElementById('table-container').innerHTML = '<table id="data-table" class="display" style="width:100%"></table>';

  const columns = allKeys.map(key => ({ title: key, data: key }));

  $.fn.dataTable.ext.errMode = 'none';

  $('#data-table').DataTable({
    data: normalizedData,
    columns: columns,
    destroy: true,
    error: (xhr, error, thrown) => {
      console.warn('DataTables error suppressed:', error);
    }
  });
}
