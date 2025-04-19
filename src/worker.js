// worker.js
import Papa from 'papaparse';

onmessage = function (e) {
  const { csvData, searchQuery } = e.data;

  Papa.parse(csvData, {
    header: true, // Use the first row as headers
    skipEmptyLines: true, // Skip empty rows
    step: function (results) {
      const row = results.data[0];
      const last_name = row.last_name || '';
      
      // Check if the last name matches the search query
      if (last_name.toLowerCase().includes(searchQuery.toLowerCase())) {
        postMessage(row); // Send matched row back
      }
    },
    complete: function () {
      postMessage({ type: 'done' }); // Indicate parsing is complete
    },
    error: function (error) {
      postMessage({ type: 'error', error });
    },
  });
};