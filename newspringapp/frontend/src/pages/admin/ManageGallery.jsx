import React, { useState, useEffect } from "react";
import axios from "axios";

const ManageGallery = () => {
  const [images, setImages] = useState([]);
  const [selectedFile, setSelectedFile] = useState(null);
  const [previewURL, setPreviewURL] = useState(null);
  const [uploading, setUploading] = useState(false);

  // Fetch gallery images on mount
  useEffect(() => {
    fetchGallery();
  }, []);

  const fetchGallery = async () => {
    try {
      const res = await axios.get("/api/admin/gallery");
      setImages(res.data);
    } catch (error) {
      console.error("Error fetching gallery:", error);
    }
  };

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    setSelectedFile(file);
    setPreviewURL(URL.createObjectURL(file));
  };

  const handleUpload = async () => {
    if (!selectedFile) return;
    setUploading(true);
    const formData = new FormData();
    formData.append("image", selectedFile);

    try {
      await axios.post("/api/admin/gallery/upload", formData);
      setSelectedFile(null);
      setPreviewURL(null);
      fetchGallery();
    } catch (error) {
      console.error("Image upload failed:", error);
    } finally {
      setUploading(false);
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Are you sure you want to delete this image?")) return;
    try {
      await axios.delete(`/api/admin/gallery/${id}`);
      fetchGallery();
    } catch (error) {
      console.error("Failed to delete image:", error);
    }
  };

  return (
    <div className="max-w-5xl mx-auto p-6 bg-white rounded-lg shadow-md">
      <h2 className="text-3xl font-bold text-[#930911] mb-6">Manage Gallery</h2>

      {/* Upload Section */}
      <div className="mb-6">
        <input
          type="file"
          accept="image/*"
          onChange={handleFileChange}
          className="mb-3"
        />
        {previewURL && (
          <div className="mb-3">
            <img src={previewURL} alt="Preview" className="h-40 rounded shadow" />
          </div>
        )}
        <button
          onClick={handleUpload}
          disabled={!selectedFile || uploading}
          className="bg-[#930911] text-white px-4 py-2 rounded hover:bg-[#BA3D47] transition"
        >
          {uploading ? "Uploading..." : "Upload Image"}
        </button>
      </div>

      {/* Gallery Display */}
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
        {images.map((img) => (
          <div
            key={img.id}
            className="relative border rounded overflow-hidden group"
          >
            <img
              src={img.url}
              alt="Event"
              className="object-cover w-full h-40"
            />
            <button
              onClick={() => handleDelete(img.id)}
              className="absolute top-2 right-2 bg-black bg-opacity-50 text-white px-2 py-1 text-xs rounded opacity-0 group-hover:opacity-100 transition"
            >
              Delete
            </button>
          </div>
        ))}
      </div>
    </div>
  );
};

export default ManageGallery;
