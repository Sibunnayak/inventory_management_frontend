import React, { useEffect, useState } from "react";
import axios from "axios";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

function DashboardAdmin() {
  const [inventoryItems, setInventoryItems] = useState([]);
  const [selectedItem, setSelectedItem] = useState(null);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [success, setSuccess] = useState(false);
  const [loading, setLoading] = useState(true);

  const token = localStorage.getItem("token");

  // Fetch inventory items from the API
  const fetchInventoryItems = async () => {
    setLoading(true); 
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
  }, [success]);

  // Handle delete functionality
  const handleDelete = async (id) => {
    try {
      await axios.delete(
        `${import.meta.env.VITE_API_URL}/item/inventory/${id}`,
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      toast.success("Item deleted successfully!");
      setSuccess(!success);
    } catch (error) {
      console.error("Error deleting item:", error);
      toast.error("Failed to delete item.");
    }
  };

  // Handle edit functionality
  const handleEdit = async (e) => {
    e.preventDefault();
    try {
      const { name, partNumber, dateReceived, numberReceived } = selectedItem;

      // Prevent future dates
      const today = new Date().toISOString().split("T")[0];
      if (new Date(dateReceived) > new Date(today)) {
        toast.error("Date Received cannot be in the future.");
        return;
      }

      await axios.put(
        `${import.meta.env.VITE_API_URL}/item/inventory/${selectedItem._id}`,
        {
          name,
          partNumber,
          dateReceived,
          numberReceived,
        },
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      toast.success("Item updated successfully!");
      setIsEditModalOpen(false);
      setSuccess(!success);
    } catch (error) {
      console.error("Error updating item:", error);
      toast.error("Failed to update item.");
    }
  };

  const handleEditModalOpen = (item) => {
    setSelectedItem(item);
    setIsEditModalOpen(true);
  };

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
        <div className="text-center py-4">Loading...</div>
      ) : (
        <table className="min-w-full bg-white border">
          <thead>
            <tr className="bg-gray-100">
              <th className="px-4 py-2">S.No.</th>
              <th className="px-4 py-2">Name</th>
              <th className="px-4 py-2">Part Number</th>
              <th className="px-4 py-2">Date Received/Number</th>
              <th className="px-4 py-2">Date Dispatch/Number</th>
              <th className="px-4 py-2">Balance Items</th>
              <th className="px-4 py-2">QR Code</th>
              <th className="px-4 py-2">Action</th>
            </tr>
          </thead>
          <tbody>
            {inventoryItems.length === 0 ? (
              <tr>
                <td colSpan="8" className="text-center py-4">
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
                    {new Date(item.dateReceived).toLocaleDateString()}
                    <span className="text-xl">/</span>
                    <span className="text-lg">{item.numberReceived}</span>
                  </td>
                  <td className="px-4 py-2">
                    {item.dispatches?.length > 0 ? (
                      item.dispatches?.map((dispatch, i) => (
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
                  <td className="px-4 py-2">
                    <button
                      onClick={() => handleEditModalOpen(item)}
                      className="text-blue-500 mr-4"
                    >
                      ✏️
                    </button>
                    <button
                      onClick={() => handleDelete(item._id)}
                      className="text-red-500"
                    >
                      🗑️
                    </button>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      )}

      {/* Edit Modal */}
      {isEditModalOpen && selectedItem && (
        <div className="fixed inset-0 bg-gray-600 bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white p-8 rounded-lg shadow-lg w-1/2">
            <h2 className="text-2xl font-bold mb-4">Edit Item</h2>
            <form onSubmit={handleEdit} className="space-y-4">
              <div>
                <label className="block text-gray-700">Name</label>
                <select
                  value={selectedItem.name}
                  onChange={(e) =>
                    setSelectedItem({ ...selectedItem, name: e.target.value })
                  }
                  className="w-full border border-gray-300 p-2 rounded"
                >
                  <option value="C1">C1</option>
                  <option value="C2">C2</option>
                  <option value="C3">C3</option>
                  <option value="C4">C4</option>
                  <option value="C5">C5</option>
                </select>
              </div>
              <div>
                <label className="block text-gray-700">Part Number</label>
                <input
                  type="text"
                  value={selectedItem.partNumber}
                  onChange={(e) =>
                    setSelectedItem({
                      ...selectedItem,
                      partNumber: e.target.value,
                    })
                  }
                  className="w-full border border-gray-300 p-2 rounded"
                />
              </div>
              <div>
                <label className="block text-gray-700">Date Received</label>
                <input
                  type="date"
                  value={
                    new Date(selectedItem.dateReceived)
                      .toISOString()
                      .split("T")[0]
                  }
                  onChange={(e) =>
                    setSelectedItem({
                      ...selectedItem,
                      dateReceived: e.target.value,
                    })
                  }
                  className="w-full border border-gray-300 p-2 rounded"
                  max={new Date().toISOString().split("T")[0]}
                />
              </div>
              <div>
                <label className="block text-gray-700">Number Received</label>
                <input
                  type="number"
                  value={selectedItem.numberReceived}
                  onChange={(e) =>
                    setSelectedItem({
                      ...selectedItem,
                      numberReceived: e.target.value,
                    })
                  }
                  className="w-full border border-gray-300 p-2 rounded"
                />
              </div>
              <div className="flex justify-end space-x-4">
                <button
                  type="button"
                  onClick={() => setIsEditModalOpen(false)}
                  className="bg-gray-300 text-gray-800 px-4 py-2 rounded"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="bg-blue-500 text-white px-4 py-2 rounded"
                >
                  Save
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}

export default DashboardAdmin;
