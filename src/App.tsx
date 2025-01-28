import React, { useState } from 'react';
import { Upload, Image as ImageIcon, Wand2, Download, Layers, Settings2 } from 'lucide-react';
import { useDropzone } from 'react-dropzone';
import toast from 'react-hot-toast';

function App() {
  const [selectedImage, setSelectedImage] = useState<string | null>(null);
  const [isProcessing, setIsProcessing] = useState(false);

  const onDrop = (acceptedFiles: File[]) => {
    if (acceptedFiles.length > 0) {
      const file = acceptedFiles[0];
      if (file.size > 10 * 1024 * 1024) { // 10MB limit
        toast.error('File size should be less than 10MB');
        return;
      }
      const reader = new FileReader();
      reader.onload = () => {
        setSelectedImage(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: {
      'image/*': ['.png', '.jpg', '.jpeg']
    },
    maxFiles: 1
  });

  const handleRemoveBackground = async () => {
    setIsProcessing(true);
    // TODO: Implement background removal logic
    setTimeout(() => {
      setIsProcessing(false);
      toast.error('Background removal API not implemented yet');
    }, 1000);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 to-blue-50">
      {/* Header */}
      <header className="bg-white shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <Wand2 className="h-8 w-8 text-purple-600" />
              <h1 className="text-2xl font-bold text-gray-900">Background Remover</h1>
            </div>
            <button className="bg-purple-600 text-white px-4 py-2 rounded-lg hover:bg-purple-700 transition">
              Sign In
            </button>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Left Column - Upload and Preview */}
          <div className="space-y-6">
            <div
              {...getRootProps()}
              className={`border-2 border-dashed rounded-lg p-8 text-center cursor-pointer transition
                ${isDragActive ? 'border-purple-600 bg-purple-50' : 'border-gray-300 hover:border-purple-400'}`}
            >
              <input {...getInputProps()} />
              <Upload className="mx-auto h-12 w-12 text-gray-400" />
              <p className="mt-2 text-sm text-gray-600">
                Drag & drop an image here, or click to select
              </p>
              <p className="text-xs text-gray-500 mt-1">
                Supports PNG, JPG (up to 10MB)
              </p>
            </div>

            {selectedImage && (
              <div className="relative rounded-lg overflow-hidden bg-white shadow">
                <img
                  src={selectedImage}
                  alt="Preview"
                  className="w-full h-auto"
                />
              </div>
            )}
          </div>

          {/* Right Column - Tools and Options */}
          <div className="space-y-6">
            <div className="bg-white rounded-lg shadow p-6">
              <h2 className="text-lg font-semibold mb-4">Tools</h2>
              <div className="grid grid-cols-2 gap-4">
                <button
                  onClick={handleRemoveBackground}
                  disabled={!selectedImage || isProcessing}
                  className={`flex items-center justify-center space-x-2 p-3 rounded-lg text-white
                    ${!selectedImage || isProcessing
                      ? 'bg-gray-300 cursor-not-allowed'
                      : 'bg-purple-600 hover:bg-purple-700'}`}
                >
                  <Wand2 className="h-5 w-5" />
                  <span>{isProcessing ? 'Processing...' : 'Remove Background'}</span>
                </button>
                <button
                  disabled={!selectedImage}
                  className={`flex items-center justify-center space-x-2 p-3 rounded-lg
                    ${!selectedImage
                      ? 'bg-gray-300 text-gray-500 cursor-not-allowed'
                      : 'bg-white border-2 border-purple-600 text-purple-600 hover:bg-purple-50'}`}
                >
                  <Download className="h-5 w-5" />
                  <span>Download</span>
                </button>
              </div>
            </div>

            <div className="bg-white rounded-lg shadow p-6">
              <h2 className="text-lg font-semibold mb-4">Options</h2>
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-2">
                    <ImageIcon className="h-5 w-5 text-gray-500" />
                    <span>Output Format</span>
                  </div>
                  <select className="border rounded-md px-3 py-1">
                    <option>PNG</option>
                    <option>JPG</option>
                  </select>
                </div>
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-2">
                    <Layers className="h-5 w-5 text-gray-500" />
                    <span>Quality</span>
                  </div>
                  <select className="border rounded-md px-3 py-1">
                    <option>Original</option>
                    <option>High</option>
                    <option>Medium</option>
                  </select>
                </div>
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-2">
                    <Settings2 className="h-5 w-5 text-gray-500" />
                    <span>Advanced Settings</span>
                  </div>
                  <button className="text-purple-600 hover:text-purple-700">
                    Configure
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="bg-white border-t mt-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div>
              <h3 className="text-sm font-semibold text-gray-900 tracking-wider uppercase">
                Features
              </h3>
              <ul className="mt-4 space-y-2">
                <li>
                  <a href="#" className="text-gray-600 hover:text-gray-900">
                    Background Removal
                  </a>
                </li>
                <li>
                  <a href="#" className="text-gray-600 hover:text-gray-900">
                    Batch Processing
                  </a>
                </li>
                <li>
                  <a href="#" className="text-gray-600 hover:text-gray-900">
                    API Access
                  </a>
                </li>
              </ul>
            </div>
            <div>
              <h3 className="text-sm font-semibold text-gray-900 tracking-wider uppercase">
                Resources
              </h3>
              <ul className="mt-4 space-y-2">
                <li>
                  <a href="#" className="text-gray-600 hover:text-gray-900">
                    Documentation
                  </a>
                </li>
                <li>
                  <a href="#" className="text-gray-600 hover:text-gray-900">
                    Tutorials
                  </a>
                </li>
                <li>
                  <a href="#" className="text-gray-600 hover:text-gray-900">
                    Blog
                  </a>
                </li>
              </ul>
            </div>
            <div>
              <h3 className="text-sm font-semibold text-gray-900 tracking-wider uppercase">
                Company
              </h3>
              <ul className="mt-4 space-y-2">
                <li>
                  <a href="#" className="text-gray-600 hover:text-gray-900">
                    About
                  </a>
                </li>
                <li>
                  <a href="#" className="text-gray-600 hover:text-gray-900">
                    Contact
                  </a>
                </li>
                <li>
                  <a href="#" className="text-gray-600 hover:text-gray-900">
                    Privacy Policy
                  </a>
                </li>
              </ul>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}

export default App;