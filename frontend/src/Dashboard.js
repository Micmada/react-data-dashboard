import React, { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { Responsive, WidthProvider } from 'react-grid-layout';
import { Plus, Trash , ChevronDown} from 'lucide-react';
import 'react-grid-layout/css/styles.css';
import 'react-resizable/css/styles.css';

const ResponsiveGridLayout = WidthProvider(Responsive);

const Dashboard = ({ topRows }) => {
  const navigate = useNavigate();
  const tableRef = useRef(null);
 
  const [layout, setLayout] = useState([
    { i: 'table', x: 0, y: 0, w: 4, h: 3, type: 'table', selectedColumns: [] },
    { i: 'chart', x: 4, y: 0, w: 4, h: 3, type: 'chart', selectedColumns: [] }
  ]);
  
  const [openDropdowns, setOpenDropdowns] = useState({});

  const breakpoints = { lg: 1200, md: 996, sm: 768, xs: 480, xxs: 0 };
  const cols = { lg: 12, md: 10, sm: 8, xs: 6, xxs: 4 };

  const addWidget = (type) => {
    const newWidget = {
      i: Date.now().toString(),
      x: (layout.length * 2) % 12,
      y: Math.floor(layout.length / 2) * 2,
      w: 4,
      h: 3,
      type,
      selectedColumns: []
    };
    setLayout([...layout, newWidget]);
  };
  
  const removeWidget = (id) => {
    setLayout(layout.filter(widget => widget.i !== id));
  };


   useEffect(() => {
    if (tableRef.current) {
      const tableHeight = Math.ceil(tableRef.current.clientHeight / 50); 
      setLayout((prevLayout) =>
        prevLayout.map((widget) =>
          widget.type === 'table' ? { ...widget, h: tableHeight } : widget
        )
      );
    }
  }, [topRows])
  

  const toggleDropdown = (widgetId) => {
    setOpenDropdowns((prev) => ({
      ...prev,
      [widgetId]: !prev[widgetId]
    }));
  };

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (!event.target.closest(".dropdown-container")) {
        setOpenDropdowns({});
      }
    };
    document.addEventListener("click", handleClickOutside);
    return () => document.removeEventListener("click", handleClickOutside);
  }, []);

  const toggleColumnSelection = (widgetId, column) => {
    setLayout((prevLayout) =>
      prevLayout.map((widget) =>
        widget.i === widgetId
          ? {
              ...widget,
              selectedColumns: widget.selectedColumns.includes(column)
                ? widget.selectedColumns.filter((col) => col !== column)
                : [...widget.selectedColumns, column]
            }
          : widget
      )
    );
  };

  return (
    <div className="p-6 bg-gray-100 min-h-screen">
      {/* Header */}
      <div className="flex justify-between items-center mb-4">
        <h1 className="text-3xl font-bold">📊 Dashboard</h1>
        <button 
          onClick={() => navigate('/')}
          className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
        >
          Go Back
        </button>
      </div>

      {/* Widget Controls */}
      <div className="flex gap-2 mb-4">
        <button onClick={() => addWidget('table')} className="px-4 py-2 bg-green-500 text-white rounded-lg flex items-center gap-1">
          <Plus size={16} /> Add Table
        </button>
        <button onClick={() => addWidget('chart')} className="px-4 py-2 bg-purple-500 text-white rounded-lg flex items-center gap-1">
          <Plus size={16} /> Add Chart
        </button>
      </div>

      {/* Responsive Grid Layout */}
      <ResponsiveGridLayout 
        className="layout bg-gray-200 p-2 rounded-lg"
        layouts={{ lg: layout }}
        breakpoints={breakpoints}
        cols={cols}
        rowHeight={100}
        width={window.innerWidth}
        onLayoutChange={(newLayout) => {
          setLayout((prevLayout) =>
            prevLayout.map((widget) => {
              const updatedWidget = newLayout.find((w) => w.i === widget.i);
              return updatedWidget ? { ...widget, ...updatedWidget } : widget;
            })
          );
        }}
        isResizable
        isDraggable
      >
        {layout.map((widget) => (
          <div key={widget.i} data-grid={widget} className="bg-white rounded-lg shadow-md relative p-4">
            <button
              onClick={() => removeWidget(widget.i)}
              className="absolute top-2 right-2 text-red-500 hover:text-red-700"
              onMouseDown={(e) => e.stopPropagation()} 
            >
              <Trash size={20} />
            </button>

            {widget.type === 'table' && (
              <div ref={tableRef}>
                <h2 className="text-xl font-semibold mb-2">📄 Data Table</h2>

                  {/* Column Selection Dropdown */}
                  <div className="relative inline-block mb-2 dropdown-container">
                    <button
                      className="px-3 py-1 bg-gray-300 rounded-md flex items-center gap-1"
                      onClick={(e) => {
                        e.stopPropagation(); 
                        toggleDropdown(widget.i);
                      }}
                      onMouseDown={(e) => e.stopPropagation()} 
                    >
                      Select Columns <ChevronDown size={16} />
                    </button>
                    {openDropdowns[widget.i] && (
                      <div 
                        className="absolute left-0 mt-1 w-48 bg-white border rounded-md shadow-lg p-2 z-50"
                        style={{ top: "100%" }} 
                        onMouseDown={(e) => e.stopPropagation()} 
                      >
                        {/* Add check to ensure topRows is not empty */}
                        {topRows && topRows.length > 0 && Object.keys(topRows[0]).map((column, index) => (
                          <label key={index} className="block text-sm">
                            <input
                              type="checkbox"
                              checked={widget.selectedColumns.includes(column)}
                              onChange={() => toggleColumnSelection(widget.i, column)}
                              className="mr-2"
                              onMouseDown={(e) => e.stopPropagation()}
                            />
                            {column}
                          </label>
                        ))}
                      </div>
                    )}
                  </div>



                  {/* Data Table */}
                  <div className="flex-1 overflow-auto border border-gray-300 rounded-lg"
                    onMouseDown={(e) => e.stopPropagation()} 
                  >
                    {topRows && topRows.length > 0 ? (
                      <div className="overflow-auto max-h-[400px]">
                        <table className="w-full min-w-max border-collapse border border-gray-300">
                          <thead className="bg-gray-200 sticky top-0">
                          <tr>
                    {Array.isArray(widget.selectedColumns) && widget.selectedColumns.length > 0
                      ? widget.selectedColumns.map((header, index) => (
                          <th key={index} className="border border-gray-300 p-2 text-left">
                            {header}
                          </th>
                        ))
                      : (topRows && topRows.length > 0
                          ? Object.keys(topRows[0]).map((header, index) => (
                              <th key={index} className="border border-gray-300 p-2 text-left">
                                {header}
                              </th>
                            ))
                          : <th className="border border-gray-300 p-2 text-left">No Data</th>
                        )}
                  </tr>

                          </thead>
                          <tbody>
                            {topRows.map((row, rowIndex) => (
                              <tr key={rowIndex} className="hover:bg-gray-100">
                              {Array.isArray(widget.selectedColumns) && widget.selectedColumns.length > 0
                                ? widget.selectedColumns.map((col, colIndex) => (
                                    <td key={colIndex} className="border border-gray-300 p-2 whitespace-nowrap">
                                      {row && row[col] !== undefined ? row[col] : "N/A"}
                                    </td>
                                  ))
                                : (row 
                                    ? Object.values(row).map((value, i) => (
                                        <td key={i} className="border border-gray-300 p-2 whitespace-nowrap">
                                          {value}
                                        </td>
                                      ))
                                    : <td className="border border-gray-300 p-2 whitespace-nowrap">No Data</td>
                                  )}
                            </tr>
                            
                            ))}
                          </tbody>
                        </table>
                      </div>
                    ) : (
                      <p className="text-gray-500 text-center p-4">No data available.</p>
                    )}
                  </div>

              </div>
            )}



            {widget.type === 'chart' && (
              <div>
                <h2 className="text-xl font-semibold mb-2">📈 Chart (Coming Soon)</h2>
                <p className="text-gray-500">Chart visualization will be added here.</p>
              </div>
            )}
          
          </div>
        ))}
      </ResponsiveGridLayout>
    </div>
  );
};

export default Dashboard;
