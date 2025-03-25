import React, { useState } from 'react';
import Papa from 'papaparse';
import { useNavigate } from 'react-router-dom';

const HomePage = ({ setTopRows }) => {
  const [file, setFile] = useState(null);
  const navigate = useNavigate();

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
          const rows = result.data.slice(0, 3);
          setTopRows(rows);
          navigate('/dashboard'); 
        },
        header: true,
      });
    }
  };

  return (
    <div>
      <h1>Upload CSV File</h1>
      <input type="file" accept=".csv" onChange={handleFileChange} />
      <button onClick={handleFileRead}>Go to Dashboard</button>
    </div>
  );
};

export default HomePage;
