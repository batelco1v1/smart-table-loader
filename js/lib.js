  document.getElementById('fileInput').addEventListener('change', handleFile, false);

  function handleFile(event) {
    const file = event.target.files[0];
    if (!file) return;

    const extension = getFileExtension(file.name);
    showFileInfo(file);

    const reader = new FileReader();

    if (extension === 'csv') {
      reader.onload = e => {
        const csv = e.target.result;
        const parsed = Papa.parse(csv, { header: true });
        const data = sanitizeData(parsed.data);
        renderDataTable(data);
      };
      reader.readAsText(file);
    } else if (['xls', 'xlsx'].includes(extension)) {
      reader.onload = e => {
        const data = new Uint8Array(e.target.result);
        const workbook = XLSX.read(data, { type: 'array' });
        const sheet = workbook.Sheets[workbook.SheetNames[0]];
        const jsonData = sanitizeData(XLSX.utils.sheet_to_json(sheet));
        renderDataTable(jsonData);
      };
      reader.readAsArrayBuffer(file);
    } else {
      alert('Unsupported file type. Please upload CSV, XLS, or XLSX.');
    }
  }

  function getFileExtension(filename) {
    return filename.split('.').pop().toLowerCase();
  }

  function showFileInfo(file) {
    document.getElementById('file-info').innerText = `Selected File: ${file.name} (${(file.size / 1024).toFixed(2)} KB)`;
  }

  function sanitizeData(data) {
    if (!data || !data.length) return [];

    const allKeys = [...new Set(data.flatMap(row => Object.keys(row)))];
    return data.map(row => {
      const cleanedRow = {};
      allKeys.forEach(key => {
        cleanedRow[key] = row[key] ?? '';
      });
      return cleanedRow;
    });
  }

  function renderDataTable(data) {
    const container = document.getElementById('table-container');
    if (!data.length) {
      container.innerHTML = '<p>No data found.</p>';
      return;
    }

    const columns = Object.keys(data[0]).map(key => ({
      title: key,
      data: key
    }));

    container.innerHTML = '<table id="data-table" class="display nowrap" style="width:100%"></table>';
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
      }
    });
  }
