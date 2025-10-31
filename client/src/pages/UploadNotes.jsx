import React, { useState, useContext } from "react";
import { CopyPlus, Files, BookmarkCheck, Upload, LogIn } from "lucide-react";
import axios from "axios";
import { toast } from "react-hot-toast";
import { AppContext } from "../context/AppContext";
import { useNavigate } from "react-router-dom";

function UploadNotes() {
  const { backendUrl, user } = useContext(AppContext);
  const navigate = useNavigate();
  const today = new Date().toISOString().split("T")[0];

  const [formData, setFormData] = useState({
    title: "",
    topic: "",
    category: "",
  });
  const [file, setFile] = useState(null);
  const [loading, setLoading] = useState(false);

  // If user not logged in
  if (!user) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-gray-50 px-4">
        <div className="bg-white shadow-md border border-gray-200 rounded-xl p-8 text-center max-w-md">
          <h2 className="text-2xl font-semibold text-gray-800 mb-3">
            You’re not logged in
          </h2>
          <p className="text-gray-600 mb-6">
            Please log in to upload your notes and access full features.
          </p>
          <button
            onClick={() => navigate("/login")}
            className="bg-rose-500 hover:bg-rose-600 text-white font-medium py-2.5 px-6 rounded-md flex items-center justify-center gap-2 mx-auto active:scale-95 transition-all"
          >
            Go to Login
            <LogIn className="w-5 h-5" />
          </button>
        </div>
      </div>
    );
  }

  // Handle input
  const handleChange = (e) => {
    setFormData((prev) => ({ ...prev, [e.target.id]: e.target.value }));
  };

  // Handle file select
  const handleFileChange = (e) => {
    setFile(e.target.files[0]);
  };

  // Submit form
  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!file) {
      toast.error("Please select a file to upload");
      return;
    }

    const data = new FormData();
    data.append("title", formData.title);
    data.append("topic", formData.topic);
    data.append("category", formData.category);
    data.append("file", file);

    setLoading(true);
    try {
      const res = await axios.post(`${backendUrl}/api/v1/docs/upload`, data, {
        withCredentials: true,
        headers: { "Content-Type": "multipart/form-data" },
      });

      if (res.data.success) {
        toast.success(res.data.message || "File uploaded successfully!");
        setFormData({ title: "", topic: "", category: "" });
        setFile(null);
      } else {
        toast.error(res.data.message || "Upload failed!");
      }
    } catch (error) {
      console.error("Upload error:", error);
      toast.error(
        error.response?.data?.message || "Internal error. Try again later."
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gray-50 px-4 py-10">
      <form
        onSubmit={handleSubmit}
        className="bg-white text-gray-600 w-full max-w-md p-6 rounded-xl shadow-md border border-gray-200 mt-12"
      >
        <h2 className="text-xl font-semibold text-gray-800 text-center mb-6">
          Upload Your Notes
        </h2>

        {/* Title */}
        <label className="font-medium text-sm" htmlFor="title">
          Title
        </label>
        <input
          id="title"
          className="w-full border mt-1.5 mb-4 border-gray-300 outline-none rounded-md py-2.5 px-3 focus:ring-2 focus:ring-indigo-400"
          type="text"
          placeholder="Enter title"
          value={formData.title}
          onChange={handleChange}
          required
        />

        {/* Topic */}
        <label className="font-medium text-sm" htmlFor="topic">
          Topic
        </label>
        <input
          id="topic"
          className="w-full border mt-1.5 mb-4 border-gray-300 outline-none rounded-md py-2.5 px-3 focus:ring-2 focus:ring-indigo-400"
          type="text"
          placeholder="Enter topic (e.g., Indexing, Queries)"
          value={formData.topic}
          onChange={handleChange}
          required
        />

        {/* Uploaded By */}
        <label className="font-medium text-sm" htmlFor="uploadedBy">
          Uploaded By
        </label>
        <input
          id="uploadedBy"
          className="w-full border mt-1.5 mb-4 border-gray-300 outline-none rounded-md py-2.5 px-3 bg-gray-100 text-gray-500"
          type="text"
          placeholder={`${user?.name} (${user.email})`}
          disabled
        />

        {/* Category + Date */}
        <div className="flex items-center gap-4 mb-4">
          <div className="w-1/2">
            <label className="font-medium text-sm" htmlFor="category">
              Category
            </label>
            <select
              id="category"
              className="w-full border mt-1.5 border-gray-300 outline-none rounded-md py-2.5 px-3 bg-white focus:ring-2 focus:ring-indigo-400"
              value={formData.category}
              onChange={handleChange}
              required
            >
              <option value="">Select DB</option>
              <option value="MongoDB">MongoDB</option>
              <option value="PostgreSQL">PostgreSQL</option>
            </select>
          </div>

          <div className="w-1/2">
            <label className="font-medium text-sm" htmlFor="date">
              Date
            </label>
            <input
              id="date"
              type="date"
              value={today}
              readOnly
              className="w-full border mt-1.5 border-gray-300 outline-none rounded-md py-2.5 px-3 bg-gray-100 text-gray-500"
            />
          </div>
        </div>

        {/* File Upload */}
        <label className="font-medium text-sm mt-3 block" htmlFor="file">
          Upload File{" "}
          <span className="text-xs text-red-500 mt-1 mb-2">
            (Only PDF, DOCX, or TXT files up to 2MB are allowed)
          </span>
        </label>
        <div className="flex items-center justify-between border border-dashed border-gray-400 rounded-md mt-2 p-3 hover:border-indigo-400 transition">
          <input
            type="file"
            id="file"
            accept=".pdf,.doc,.docx,.txt"
            className="text-sm text-gray-600 w-full"
            onChange={handleFileChange}
            required
          />
          <Upload className="w-5 h-5 text-gray-500 ml-2" />
        </div>

        {/* Buttons */}
        <div className="flex items-center justify-between mt-5">
          <button
            type="submit"
            disabled={loading}
            className={`${
              loading ? "bg-gray-400" : "bg-indigo-500 hover:bg-indigo-600"
            } text-white font-medium py-2 px-6 rounded-md active:scale-95 transition-all`}
          >
            {loading ? "Uploading..." : "Upload"}
          </button>

          <div className="flex items-center gap-3 text-gray-600">
            <button type="button">
              <CopyPlus className="w-5 h-5 hover:text-indigo-500 transition" />
            </button>
            <button type="button">
              <Files className="w-5 h-5 hover:text-indigo-500 transition" />
            </button>
            <button type="button">
              <BookmarkCheck className="w-5 h-5 hover:text-indigo-500 transition" />
            </button>
          </div>
        </div>
      </form>

      {/* Suggestion Section */}
      <div className="text-center mt-6 text-sm text-gray-500 max-w-sm">
        <p>
          You can upload your{" "}
          <span className="text-indigo-600 font-medium">MongoDB</span> or{" "}
          <span className="text-indigo-600 font-medium">PostgreSQL</span> notes
          as PDF, DOCX, or text files.
        </p>
        <p className="mt-2">
          Make sure your content is relevant, properly titled, and easy to read.
        </p>
      </div>
    </div>
  );
}

export default UploadNotes;
