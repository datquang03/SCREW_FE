import React from "react";

const DataTable = ({ columns = [], data = [], title }) => {
  return (
    <div className="bg-white rounded-2xl shadow-sm ring-1 ring-gray-100 overflow-hidden">
      {title && (
        <div className="px-5 py-4 border-b border-gray-100 bg-gradient-to-r from-gray-50 to-white">
          <h3 className="font-bold text-gray-800">{title}</h3>
        </div>
      )}

      <div className="overflow-x-auto">
        <table className="min-w-full text-sm">
          <thead className="bg-gray-50">
            <tr>
              {columns.map((c, i) => (
                <th
                  key={c.key || c.dataIndex || i}
                  className="py-3 px-4 text-left font-semibold text-gray-600"
                >
                  {c.title}
                </th>
              ))}
            </tr>
          </thead>

          <tbody>
            {data.length === 0 && (
              <tr>
                <td
                  colSpan={columns.length}
                  className="py-8 px-4 text-center text-gray-500"
                >
                  Không có dữ liệu
                </td>
              </tr>
            )}

            {data.map((row, idx) => (
              <tr
                key={row.id || idx}
                className={idx % 2 === 0 ? "bg-white" : "bg-gray-50/60"}
              >
                {columns.map((c, i) => (
                  <td
                    key={`${i}-cell`}
                    className="py-3 px-4 text-gray-700"
                  >
                    {c.render ? c.render(row[c.dataIndex], row) : row[c.dataIndex]}
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default DataTable;
