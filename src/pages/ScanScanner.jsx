import React, { useState, useRef, useEffect } from "react";
import { BrowserMultiFormatReader } from "@zxing/library";
import axios from "axios";
import { useNavigate } from "react-router-dom";

function ScanScanner() {
  const [scannerImage, setScannerImage] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [dispatchQuantity, setDispatchQuantity] = useState(0);
  const [captureQrCode, setCaptureQrCode] = useState("");
  const [isCameraOpen, setIsCameraOpen] = useState(false);
  const [capturedImage, setCapturedImage] = useState(null);
  const [cameraStream, setCameraStream] = useState(null);
  const videoRef = useRef(null);
  const canvasRef = useRef(null);
  const navigate = useNavigate();

  useEffect(() => {
    // Cleanup camera stream on component unmount
    return () => {
      if (cameraStream) {
        const tracks = cameraStream.getTracks();
        tracks.forEach((track) => track.stop());
      }
    };
  }, [cameraStream]);

  useEffect(() => {
    // Cleanup URL object on component unmount
    return () => {
      if (
        scannerImage &&
        typeof scannerImage === "string" &&
        scannerImage.startsWith("blob:")
      ) {
        URL.revokeObjectURL(scannerImage);
      }
    };
  }, [scannerImage]);

  const handleFileChange = (event) => {
    const file = event.target.files[0];
    if (file) {
      setScannerImage(file);
    }
  };

  const handleUploadScanner = () => {
    setIsModalOpen(true);
  };

  const captureImage = () => {
    const canvas = canvasRef.current;
    if (videoRef.current && canvas) {
      const context = canvas.getContext("2d");
      canvas.width = videoRef.current.videoWidth;
      canvas.height = videoRef.current.videoHeight;
      context.drawImage(videoRef.current, 0, 0, canvas.width, canvas.height);
      const dataURL = canvas.toDataURL("image/png");
      setCapturedImage(dataURL);
      // Stop the camera stream
      if (cameraStream) {
        const tracks = cameraStream.getTracks();
        tracks.forEach((track) => track.stop());
      }
      setCameraStream(null);
      setIsCameraOpen(false);
    } else {
      console.error(
        "videoRef.current or canvasRef.current is null during image capture"
      );
    }
  };

  // Convert File to Base64 string
  const fileToBase64 = (file) => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onloadend = () => resolve(reader.result);
      reader.onerror = reject;
      reader.readAsDataURL(file);
    });
  };

  const handleModalSubmit = async () => {
    const dispatchDate = new Date().toISOString().split("T")[0];

    // If scannerImage exists, it's an uploaded file; convert it to base64, otherwise use captureQrCode
    let qrCode;
    if (scannerImage) {
      qrCode = await fileToBase64(scannerImage); // Convert file to base64
    } else {
      qrCode = captureQrCode; // Use captured image's base64 if no QR code
    }

    const token = localStorage.getItem("token");
    try {
      const response = await axios.post(
        `${import.meta.env.VITE_API_URL}/item/scan-qrCode`,
        { qrCode, dispatchDate, dispatchNumber: dispatchQuantity },
        {
          headers: {
            Authorization: `Bearer ${token}`, // Include the token in the Authorization header
          },
        }
      );
      setIsModalOpen(false);
      navigate("/home/user-dashboard");
    } catch (error) {
      console.error("Error submitting dispatch:", error);
    }
  };

  const handleCaptureQrCode = async () => {
    if (!isCameraOpen) {
      try {
        const stream = await navigator.mediaDevices.getUserMedia({
          video: true,
        });
        setCameraStream(stream);
        setIsCameraOpen(true);
        setTimeout(() => {
          if (videoRef.current) {
            videoRef.current.srcObject = stream;
            videoRef.current.setAttribute("playsinline", true); // For iOS
            videoRef.current.play();
          } else {
            console.error("videoRef.current is null after setting up stream");
          }
        }, 100); // Delay to ensure videoRef is set
      } catch (error) {
        console.error("Error accessing camera:", error);
      }
    } else {
      // Create a canvas element to capture the image
      const canvas = canvasRef.current;
      if (videoRef.current && canvas) {
        const context = canvas.getContext("2d");
        canvas.width = videoRef.current.videoWidth;
        canvas.height = videoRef.current.videoHeight;
        context.drawImage(videoRef.current, 0, 0, canvas.width, canvas.height);
        const codeReader = new BrowserMultiFormatReader();
        try {
          const result = await codeReader.decodeFromImage(canvas);
          console.log("QR Code detected:", result.text);
          setCaptureQrCode(result.text); // Set the QR code value
          setCapturedImage(canvas.toDataURL("image/png")); // Optionally set the image for display
          captureImage(); // Stop the camera stream and clean up
        } catch (error) {
          console.error("Error decoding QR code:", error);
        }
      } else {
        console.error(
          "videoRef.current or canvasRef.current is null during QR code capture"
        );
      }
    }
  };

  return (
    <div className="flex h-screen">
      <div className="w-1/2 p-4 border-r border-gray-300">
        <h2 className="text-xl font-bold mb-4">Upload QR Code</h2>
        <input
          type="file"
          accept="image/*"
          onChange={handleFileChange}
          className="mb-4"
        />
        {scannerImage && (
          <img
            src={URL.createObjectURL(scannerImage)}
            alt="Scanner"
            className="w-full h-auto"
          />
        )}
        <button
          onClick={handleUploadScanner}
          className="mt-4 bg-blue-500 text-white px-4 py-2 rounded"
        >
          Upload QR Code
        </button>
      </div>
      <div className="w-1/2 p-4">
        <h2 className="text-xl font-bold mb-4">Capture QR Code</h2>
        {!isCameraOpen && !capturedImage && (
          <button
            onClick={handleCaptureQrCode}
            className="bg-green-500 text-white px-4 py-2 rounded"
          >
            Open Camera
          </button>
        )}
        {isCameraOpen && !capturedImage && (
          <div>
            <video
              ref={videoRef}
              style={{ width: "100%" }}
              playsInline
              autoPlay
            ></video>
            <canvas ref={canvasRef} style={{ display: "none" }}></canvas>
            <button
              onClick={captureImage}
              className="mt-4 bg-yellow-500 text-white px-4 py-2 rounded"
            >
              Capture
            </button>
          </div>
        )}
        {capturedImage && (
          <div>
            <img
              src={capturedImage}
              alt="Captured QR Code"
              className="w-full h-auto"
            />
            <button
              onClick={() => setIsModalOpen(true)}
              className="mt-4 bg-blue-500 text-white px-4 py-2 rounded"
            >
              Upload
            </button>
          </div>
        )}
      </div>

      {/* Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-gray-600 bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white p-8 rounded-lg shadow-lg w-1/3">
            <h2 className="text-xl font-bold mb-4">Dispatch Details</h2>
            <p className="mb-4">
              Today's Date: {new Date().toISOString().split("T")[0]}
            </p>
            <div className="mb-4">
              <label className="block text-gray-700">Dispatch Quantity</label>
              <input
                type="number"
                value={dispatchQuantity}
                onChange={(e) => setDispatchQuantity(e.target.value)}
                className="w-full border border-gray-300 p-2 rounded"
                min="1"
              />
            </div>
            <div className="flex justify-end">
              <button
                onClick={handleModalSubmit}
                className="bg-blue-500 text-white px-4 py-2 rounded mr-2"
              >
                Submit
              </button>
              <button
                onClick={() => setIsModalOpen(false)}
                className="bg-gray-500 text-white px-4 py-2 rounded"
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default ScanScanner;
