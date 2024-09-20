import React, { useState } from "react";
import axios from "axios";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const GenerateScanner = () => {
  const [Name, setName] = useState("");
  const [partNumber, setPartNumber] = useState("");
  const [dateReceived, setDateReceived] = useState("");
  const [numberOfItems, setNumberOfItems] = useState("");

  const handleGenerateQRCode = async (e) => {
    e.preventDefault();

    const token = localStorage.getItem("token");
    if (!Name || !partNumber || !dateReceived || !numberOfItems) {
      toast.error("All fields are required!");
      return;
    }

    // Validate the dateReceived to ensure it's not a future date
    const today = new Date().toISOString().split("T")[0];
    if (new Date(dateReceived) > new Date(today)) {
      toast.error("Date Received cannot be in the future!");
      return;
    }
    try {
      const response = await axios.post(
        `${import.meta.env.VITE_API_URL}/item/inventory-create`,
        {
          Name,
          partNumber,
          dateReceived,
          quantityReceived: numberOfItems,
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      if (response.status === 201) {
        toast.success("Item added successfully to inventory!");
        window.location.href = "/home/dashboard";
      } else {
        toast.error("Unexpected response status. Please try again.");
      }
    } catch (error) {
      toast.error("Error generating QR code. Please try again.");
      console.error("Error generating QR code", error);
    }
  };

  return (
    <div className="flex items-center justify-center h-screen bg-gray-100">
      <div className="w-full max-w-md bg-white p-8 rounded-lg shadow-md">
        <h1 className="text-2xl font-bold mb-6 text-center">
          QR Code Generator
        </h1>
        <form onSubmit={handleGenerateQRCode} className="space-y-4">
          <div>
            <label className="block text-gray-700 font-medium mb-2">
              Name:
            </label>
            <select
              value={Name}
              onChange={(e) => setName(e.target.value)}
              className="w-full border border-gray-300 p-2 rounded"
            >
              <option value="">Select Name</option>
              <option value="C1">C1</option>
              <option value="C2">C2</option>
              <option value="C3">C3</option>
              <option value="C4">C4</option>
              <option value="C5">C5</option>
            </select>
          </div>
          <div>
            <label className="block text-gray-700 font-medium mb-2">
              Part Number:
            </label>
            <input
              type="text"
              value={partNumber}
              onChange={(e) => setPartNumber(e.target.value)}
              className="w-full border border-gray-300 p-2 rounded"
            />
          </div>
          <div>
            <label className="block text-gray-700 font-medium mb-2">
              Date Received:
            </label>
            <input
              type="date"
              value={dateReceived}
              onChange={(e) => setDateReceived(e.target.value)}
              className="w-full border border-gray-300 p-2 rounded"
            />
          </div>
          <div>
            <label className="block text-gray-700 font-medium mb-2">
              Number of Items:
            </label>
            <input
              type="number"
              value={numberOfItems}
              onChange={(e) => setNumberOfItems(e.target.value)}
              className="w-full border border-gray-300 p-2 rounded"
            />
          </div>
          <button
            type="submit"
            className="w-full bg-blue-500 text-white p-2 rounded hover:bg-blue-600"
          >
            Generate QR
          </button>
        </form>
        <ToastContainer />
      </div>
    </div>
  );
};

export default GenerateScanner;
