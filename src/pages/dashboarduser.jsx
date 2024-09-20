import React, { useEffect, useState } from "react";
import axios from "axios";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

function DashboardUser() {
  const [inventoryItems, setInventoryItems] = useState([]);
  const [loading, setLoading] = useState(true); 

  const token = localStorage.getItem("token") || ""; 

  // Fetch inventory items from the API
  const fetchInventoryItems = async () => {
    try {
      const response = await axios.get(
        `${import.meta.env.VITE_API_URL}/item/inventory-list`,
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      setInventoryItems(response.data);
    } catch (error) {
      console.error("Error fetching inventory items:", error);
      toast.error("Failed to fetch inventory data.");
    } finally {
      setLoading(false); 
    }
  };

  useEffect(() => {
    fetchInventoryItems();
  }, []);

  // Download the QR code when clicked
  const handleDownloadQR = (qrCodeUrl) => {
    const link = document.createElement("a");
    link.href = qrCodeUrl;
    link.download = "QRCode.png";
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className="p-4">
      <h1 className="text-2xl font-bold mb-6">Inventory Details</h1>

      {loading ? (
        <div className="text-center">Loading...</div> 
      ) : (
        <table className="min-w-full bg-white border text-sm">
          <thead>
            <tr className="bg-gray-100">
              <th className="px-4 py-2 text-left">S.No.</th>
              <th className="px-4 py-2 text-left">Name</th>
              <th className="px-4 py-2 text-left">Part Number</th>
              <th className="px-4 py-2 text-left">Date Received/Number</th>
              <th className="px-4 py-2 text-left">Date Dispatch/Number</th>
              <th className="px-4 py-2 text-left">Balance Items</th>
              <th className="px-4 py-2 text-left">QR Code</th>
            </tr>
          </thead>
          <tbody>
            {inventoryItems.length === 0 ? (
              <tr>
                <td colSpan="7" className="text-center py-4">
                  No inventory items found.
                </td>
              </tr>
            ) : (
              inventoryItems.map((item, index) => (
                <tr key={item._id} className="border-t">
                  <td className="px-4 py-2">{index + 1}</td>
                  <td className="px-4 py-2">{item.name}</td>
                  <td className="px-4 py-2">{item.partNumber}</td>
                  <td className="px-4 py-2">
                    {item.dateReceived
                      ? new Date(item.dateReceived).toLocaleDateString()
                      : "N/A"}
                    <span className="text-xl">/</span>
                    <span className="text-lg">
                      {item.numberReceived || "N/A"}
                    </span>
                  </td>
                  <td className="px-4 py-2">
                    {item.dispatches?.length > 0 ? (
                      item.dispatches.map((dispatch, i) => (
                        <div key={i}>
                          {new Date(dispatch.date).toLocaleDateString()}
                          <span className="text-xl">/</span>
                          <span className="text-lg">{dispatch.number}</span>
                        </div>
                      ))
                    ) : (
                      <span>N/A</span>
                    )}
                  </td>
                  <td className="px-4 py-2">{item.balance}</td>
                  <td className="px-4 py-2">
                    {item.qrCode && (
                      <img
                        src={item.qrCode}
                        alt="QR Code"
                        className="w-16 h-16 cursor-pointer"
                        onClick={() => handleDownloadQR(item.qrCode)}
                      />
                    )}
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      )}
    </div>
  );
}

export default DashboardUser;
