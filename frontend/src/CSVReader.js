import React, { useState } from 'react';
import Papa from 'papaparse';

const CSVReader = () => {
  const [file, setFile] = useState(null);
  const [topRows, setTopRows] = useState([]);

  const handleFileChange = (event) => {
    const file = event.target.files[0];
    if (file) {
      setFile(file);
    }
  };

  const handleFileRead = () => {
    if (file) {
      Papa.parse(file, {
        complete: (result) => {
          // Display the top 3 rows
          setTopRows(result.data.slice(0, 3));
        },
        header: true, // Assuming the first row contains headers
      });
    }
  };

  return (
    <div>
      <input type="file" accept=".csv" onChange={handleFileChange} />
      <button onClick={handleFileRead}>Show Top 3 Rows</button>

      <div>
        {topRows.length > 0 && (
          <table>
            <thead>
              <tr>
                {Object.keys(topRows[0]).map((header, index) => (
                  <th key={index}>{header}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {topRows.map((row, index) => (
                <tr key={index}>
                  {Object.values(row).map((value, i) => (
                    <td key={i}>{value}</td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
};

export default CSVReader;
