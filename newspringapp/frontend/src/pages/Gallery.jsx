import React, { useState, useEffect } from 'react';
import convoImg from '../assets/convo.jpg';
import madrasImg from '../assets/Madras.jpg';
import guindyImg from '../assets/guindy.jpg';
import bgImage from '../assets/background.jpg';

const Gallery = () => {
  const userRole = 'user'; // Change to 'admin' to see upload/delete options

  const [images, setImages] = useState([
    { url: convoImg, description: '165th Convocation', date: '2025-09-10' },
    { url: madrasImg, description: 'UNOM Main campus', date: '2025-05-30' },
    { url: guindyImg, description: 'UNOM Guindy campus', date: '2025-04-12' },
  ]);

  const [uploadData, setUploadData] = useState({ image: null, description: '', date: '' });
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedIndex, setSelectedIndex] = useState(null);

  const handleChange = (e) => {
    const { name, value, files } = e.target;
    if (name === 'image') setUploadData({ ...uploadData, image: files[0] });
    else setUploadData({ ...uploadData, [name]: value });
  };

  const handleUpload = (e) => {
    e.preventDefault();
    if (!uploadData.image) return;
    const newImage = {
      url: URL.createObjectURL(uploadData.image),
      description: uploadData.description,
      date: uploadData.date,
    };
    setImages([newImage, ...images]);
    setUploadData({ image: null, description: '', date: '' });
  };

  const handleDelete = () => {
    const updated = [...images];
    updated.splice(selectedIndex, 1);
    setImages(updated);
    setSelectedIndex(null);
  };

  const filteredImages = images.filter((img) =>
    img.description.toLowerCase().includes(searchTerm.toLowerCase())
  );

  useEffect(() => {
    const handleKeyDown = (e) => {
      if (selectedIndex === null) return;
      if (e.key === 'Escape') setSelectedIndex(null);
      else if (e.key === 'ArrowRight') setSelectedIndex((prev) => (prev + 1) % filteredImages.length);
      else if (e.key === 'ArrowLeft')
        setSelectedIndex((prev) => (prev === 0 ? filteredImages.length - 1 : prev - 1));
    };
    if (selectedIndex !== null) document.addEventListener('keydown', handleKeyDown);
    return () => document.removeEventListener('keydown', handleKeyDown);
  }, [selectedIndex, filteredImages.length]);

  return (
    <div className="min-h-screen bg-cover bg-center bg-no-repeat" style={{ backgroundImage: `url(${bgImage})` }}>
      <div className="bg-black bg-opacity-50 py-10 flex justify-center">
        <div className="bg-white bg-opacity-75 rounded shadow p-6 w-full max-w-screen-xl overflow-y-auto">
          <h2 className="text-center mb-6 font-bold text-gray-900 text-3xl drop-shadow-md">Alumni Gallery</h2>

          {/* Search */}
          <div className="mb-6">
            <input
              type="text"
              className="w-full p-2 border border-gray-300 rounded"
              placeholder="Search by description..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>

          {/* Upload (Admin Only) */}
          {userRole === 'admin' && (
            <div className="bg-white p-4 rounded shadow mb-6">
              <h4 className="mb-4 text-lg font-semibold">Upload New Image</h4>
              <form onSubmit={handleUpload}>
                <input
                  type="file"
                  name="image"
                  accept="image/*"
                  className="mb-4 w-full"
                  onChange={handleChange}
                  required
                />
                {uploadData.image && (
                  <div className="mb-4 text-center">
                    <img
                      src={URL.createObjectURL(uploadData.image)}
                      alt="Preview"
                      className="mx-auto max-h-52 rounded border"
                    />
                  </div>
                )}
                <input
                  type="text"
                  name="description"
                  placeholder="Image Description"
                  className="mb-4 w-full p-2 border border-gray-300 rounded"
                  value={uploadData.description}
                  onChange={handleChange}
                  required
                />
                <input
                  type="date"
                  name="date"
                  className="mb-4 w-full p-2 border border-gray-300 rounded"
                  value={uploadData.date}
                  onChange={handleChange}
                  required
                />
                <button type="submit" className="w-full bg-green-600 text-white py-2 rounded hover:bg-green-700">
                  Upload
                </button>
              </form>
            </div>
          )}

          {/* Image Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
            {filteredImages.length === 0 ? (
              <div className="text-center col-span-full mt-10">
                <h5 className="text-lg">No images found.</h5>
              </div>
            ) : (
              filteredImages.map((img, index) => (
                <div
                  key={index}
                  className="relative overflow-hidden rounded shadow cursor-pointer"
                  onClick={() => setSelectedIndex(index)}
                >
                  <img
                    src={img.url}
                    alt={img.description}
                    className="object-cover h-56 w-full transition-transform duration-300 ease-in-out hover:scale-105"
                  />
                  <div className="absolute bottom-0 w-full bg-black bg-opacity-60 text-white px-4 py-2 backdrop-blur-sm">
                    <h6 className="text-sm font-semibold mb-0">{img.description}</h6>
                    <small>{img.date}</small>
                  </div>
                </div>
              ))
            )}
          </div>

          {/* Modal */}
          {selectedIndex !== null && (
            <div
              className="fixed inset-0 z-50 flex items-center justify-center bg-white bg-opacity-15 backdrop-blur-sm cursor-zoom-out"
              onClick={() => setSelectedIndex(null)}
            >
              <div
                className="relative bg-white bg-opacity-95 rounded-lg shadow-xl p-6 max-w-3xl w-full cursor-default"
                onClick={(e) => e.stopPropagation()}
              >
                <button
                  className="absolute top-2 right-2 text-gray-500 hover:text-red-500"
                  onClick={() => setSelectedIndex(null)}
                >
                  ✕
                </button>
                <img
                  src={filteredImages[selectedIndex].url}
                  alt={filteredImages[selectedIndex].description}
                  className="mx-auto max-h-[60vh] w-full object-contain rounded border mb-4"
                />
                <h5 className="text-center font-semibold text-xl">
                  {filteredImages[selectedIndex].description}
                </h5>
                <p className="text-center text-gray-600">{filteredImages[selectedIndex].date}</p>

                <div className="flex justify-between mt-4">
                  <button
                    className="px-4 py-2 border rounded hover:bg-gray-100"
                    onClick={() =>
                      setSelectedIndex(
                        selectedIndex === 0 ? filteredImages.length - 1 : selectedIndex - 1
                      )
                    }
                  >
                    ← Prev
                  </button>
                  <button
                    className="px-4 py-2 border rounded hover:bg-gray-100"
                    onClick={() => setSelectedIndex((selectedIndex + 1) % filteredImages.length)}
                  >
                    Next →
                  </button>
                </div>

                {userRole === 'admin' && (
                  <button
                    className="mt-4 w-full bg-red-600 text-white py-2 rounded hover:bg-red-700"
                    onClick={handleDelete}
                  >
                    Delete Image
                  </button>
                )}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Gallery;
