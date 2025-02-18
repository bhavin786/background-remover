import { useState } from "react";
import { useDropzone } from "react-dropzone";
import { loadGraphModel } from "@tensorflow/tfjs-converter"; // Ensure this is imported
import * as tf from "@tensorflow/tfjs";
import toast from "react-hot-toast";
import { Wand2, Download, ImageIcon, Layers, Settings2 } from "lucide-react";

function App() {
  const [selectedImage, setSelectedImage] = useState<string | null>(null);
  const [isProcessing, setIsProcessing] = useState(false);

  const onDrop = (acceptedFiles: File[]) => {
    if (acceptedFiles.length > 0) {
      const file = acceptedFiles[0];
      if (file.size > 10 * 1024 * 1024) {
        // 10MB limit
        toast.error("File size should be less than 10MB");
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
      "image/*": [".png", ".jpg", ".jpeg"],
    },
    maxFiles: 1,
  });

  const handleRemoveBackground = async () => {
    if (!selectedImage) return;

    setIsProcessing(true);

    try {
      const model = await loadGraphModel("/model.json"); // Adjusted path to model.json

      const image = new Image();
      image.src = selectedImage;
      await new Promise((resolve) => {
        image.onload = resolve;
      });

      const canvas = document.createElement("canvas");
      const ctx = canvas.getContext("2d");
      canvas.width = image.width;
      canvas.height = image.height;
      ctx.drawImage(image, 0, 0);

      const inputTensor = tf.browser
        .fromPixels(canvas)
        .resizeBilinear([256, 256])
        .expandDims(0)
        .toFloat()
        .div(255);
      const result = model.predict(inputTensor);

      const outputCanvas = document.createElement("canvas");
      const outputCtx = outputCanvas.getContext("2d");
      outputCanvas.width = 256;
      outputCanvas.height = 256;

      const mask = await result.squeeze().mul(255).toInt();
      tf.browser.toPixels(mask, outputCtx);

      const url = outputCanvas.toDataURL();
      setSelectedImage(url); // Set the processed background-removed image

      setIsProcessing(false);
    } catch (error) {
      console.error(error);
      toast.error("Failed to remove background");
      setIsProcessing(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 to-blue-50">
      {/* Header */}
      <header className="bg-white shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <Wand2 className="h-8 w-8 text-purple-600" />
              <h1 className="text-2xl font-bold text-gray-900">
                Background Remover
              </h1>
            </div>
            <button className="bg-purple-600 text-white px-4 py-2 rounded-lg hover:bg-purple-700 transition">
              Sign In
            </button>
          </div>
        </div>
      </header>

      {/* Dropzone and processing tools */}
      <div
        {...getRootProps()}
        className={`dropzone ${isDragActive ? "active" : ""}`}
      >
        <input {...getInputProps()} />
        <p>Drag 'n' drop a file here, or click to select one</p>
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
                ${!selectedImage || isProcessing ? "bg-gray-300 cursor-not-allowed" : "bg-purple-600 hover:bg-purple-700"}`}
            >
              <Wand2 className="h-5 w-5" />
              <span>
                {isProcessing ? "Processing..." : "Remove Background"}
              </span>
            </button>
            <button
              disabled={!selectedImage}
              className={`flex items-center justify-center space-x-2 p-3 rounded-lg
                ${!selectedImage ? "bg-gray-300 text-gray-500 cursor-not-allowed" : "bg-white border-2 border-purple-600 text-purple-600 hover:bg-purple-50"}`}
            >
              <Download className="h-5 w-5" />
              <span>Download</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default App;
