import React, { useEffect, useState, useContext, useMemo } from "react";
import { useTable } from "react-table";
import { FileDown, FileSearch, Loader2 } from "lucide-react";
import axios from "axios";
import { AppContext } from "../context/AppContext";

const AllNotes = () => {
  const { backendUrl } = useContext(AppContext);
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  // Fetch notes from backend
  useEffect(() => {
    const fetchNotes = async () => {
      try {
        const res = await axios.get(`${backendUrl}/api/v1/docs/all-notes`);
        setData(res.data.notes || []);
      } catch (err) {
        console.error("Error fetching notes:", err);
        setError("Failed to load notes");
      } finally {
        setLoading(false);
      }
    };
    fetchNotes();
  }, [backendUrl]);

  // Table columns
  const columns = useMemo(
    () => [
      { Header: "Sl. No", accessor: (_, i) => i + 1 },
      { Header: "Uploaded By", accessor: "uploadedByName" },
      {
        Header: "Upload Date",
        accessor: "createdAt",
        Cell: ({ value }) => {
          const date = new Date(value);
          return date.toLocaleDateString("en-IN", {
            day: "2-digit",
            month: "short",
            year: "numeric",
          });
        },
      },
      { Header: "Topic", accessor: "topic" },
      { Header: "Title", accessor: "title" },
      { Header: "DB Type", accessor: "category" },
      {
        Header: "Download",
        accessor: "fileUrl",
        Cell: ({ value }) => (
          <a
            href={value}
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center justify-center text-red-500 hover:text-black transition"
          >
            <FileDown className="w-6 h-6" />
          </a>
        ),
      },
    ],
    []
  );

  const { getTableProps, getTableBodyProps, headerGroups, rows, prepareRow } =
    useTable({ columns, data });

  if (loading)
    return (
      <div className="flex items-center justify-center h-screen text-gray-600">
        <Loader2 className="w-6 h-6 mr-2 animate-spin" /> Loading notes...
      </div>
    );

  if (error)
    return (
      <div className="flex items-center justify-center h-screen text-red-500">
        {error}
      </div>
    );

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 px-6 py-12">
      <div className="bg-white w-full max-w-7xl rounded-xl p-8 border border-gray-200 shadow-sm">
        {/* Header */}
        <div className="text-center mb-6">
          <h2 className="text-2xl font-semibold text-gray-800">
            Uploaded Notes{" "}
            <FileSearch className="inline w-6 h-6 ml-2 text-blue-500" />
          </h2>
          <p className="text-gray-500 text-sm mt-2 max-w-2xl mx-auto">
            View all uploaded notes. Each entry shows who uploaded it, when it
            was added, and which DB topic it belongs to.
          </p>
        </div>

        {/* Table */}
        {data.length === 0 ? (
          <p className="text-center text-gray-500 mt-6">
            No notes uploaded yet.
          </p>
        ) : (
          <div className="overflow-x-auto">
            <table
              {...getTableProps()}
              className="w-full text-base text-left border-collapse"
            >
              <thead className="bg-violet-100 text-black font-semibold">
                {headerGroups.map((headerGroup) => (
                  <tr {...headerGroup.getHeaderGroupProps()}>
                    {headerGroup.headers.map((column) => (
                      <th
                        {...column.getHeaderProps()}
                        className="px-6 py-4 font-semibold border-b border-gray-200 text-center"
                      >
                        {column.render("Header")}
                      </th>
                    ))}
                  </tr>
                ))}
              </thead>
              <tbody {...getTableBodyProps()}>
                {rows.map((row) => {
                  prepareRow(row);
                  return (
                    <tr
                      {...row.getRowProps()}
                      className="hover:bg-gray-50 transition"
                    >
                      {row.cells.map((cell) => (
                        <td
                          {...cell.getCellProps()}
                          className="px-6 py-3 border-b border-gray-100 text-gray-700 text-center"
                        >
                          {cell.render("Cell")}
                        </td>
                      ))}
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}

        {/* Footer note */}
        <div className="text-center mt-4">
          <p className="text-xs text-red-500">
            If any file seems missing or incorrect, contact support or report
            it.
          </p>
        </div>
      </div>
    </div>
  );
};

export default AllNotes;
