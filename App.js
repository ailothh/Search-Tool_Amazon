import React, { useState, useEffect } from 'react';
import parquet from 'parquet-wasm';
import './App.css';

// BASED ON PARQUET FILE, adjust for excel what its based in from breach and forums collected

function App() {
  const [searchQuery, setSearchQuery] = useState('');
  const [matchedRows, setMatchedRows] = useState([]);
  const [isLoading, setIsLoading] = useState(true); // Loading state
  const [searchInProgress, setSearchInProgress] = useState(false); // Search in progress state

  // Initialize parquet-wasm asynchronously
  useEffect(() => {
    const initializeParquetWasm = async () => {
      try {
        // Initialize parquet-wasm if initSync is available
        if (parquet.initSync) {
          parquet.initSync(); // Use initSync if it's available
          console.log('parquet-wasm initialized');
        }

        const loadParquetFile = async () => {
          try {
            // Fetch the Parquet file from the public folder
            const fileResponse = await fetch('/amazon.com_Employeesfinal2_1.parquet');
            const buffer = await fileResponse.arrayBuffer();
            console.log(parquet); // Log parquet obj

            // Try reading the file using available methods; this from stackO 30-49 adjust 
            if (parquet.readParquet) {
              const data = await parquet.readParquet(buffer);
              console.log('Data from Parquet file:', data);
              setMatchedRows(data);
            } else {
              console.error('readParquet method is not available in this version of parquet-wasm');
            }

            setIsLoading(false);
          } catch (error) {
            console.error('Error loading or reading Parquet file:', error);
            setIsLoading(false);
          }
        };

        loadParquetFile();
      } catch (error) {
        console.error('Error initializing parquet-wasm:', error);
        setIsLoading(false);
      }
    };

    initializeParquetWasm();
  }, []); // Empty comp

  //Handle search and get matched rows
  const handleSearch = () => {
    setSearchInProgress(true);
    const query = searchQuery.trim().toLowerCase();

    //Filter rows based last n
    const matchedData = matchedRows.filter((row) => {
      const lastName = row['last_name'] ? row['last_name'].toLowerCase() : '';
      return lastName.includes(query);
    });

    setMatchedRows(matchedData);
    setSearchInProgress(false);
  };

  return (
    <div className="App">
      <header className="App-header">
        <h1>Employee Directory</h1>
        <div className="search-box">
          <input
            type="text"
            placeholder="Search by last name"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
          <button onClick={handleSearch} disabled={isLoading || searchInProgress}>
            {searchInProgress ? 'Searching...' : 'Search'}
          </button>
        </div>

        <div className="data-container">
          {isLoading ? (
            <p>Loading data...</p>
          ) : matchedRows.length > 0 ? (
            matchedRows.map((row, index) => (
              <div key={index} className="data-card">
                {Object.entries(row).map(([key, value]) => (
                  <div key={key} className="data-field">
                    <span className="field-key">{key}:</span>
                    <span className="field-value">{value || 'N/A'}</span>
                  </div>
                ))}
              </div>
            ))
          ) : (
            <p>{searchInProgress ? 'Searching...' : 'No matches found.'}</p>
          )}
        </div>
      </header>
    </div>
  );
}

export default App;