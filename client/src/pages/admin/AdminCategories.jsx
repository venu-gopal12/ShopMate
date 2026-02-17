import { useState } from "react";
import AdminSidebar from "../../components/layout/AdminSidebar";
import { useAdminCategories } from "../../hooks/useAdminCategories";
import { Copy, Edit, Trash2 } from "lucide-react";

const AdminCategories = () => {
    const { categories, loading, actionLoading, addCategory, deleteCategory } = useAdminCategories();
    const [name, setName] = useState("");
    const [description, setDescription] = useState("");

    const handleSubmit = async (e) => {
        e.preventDefault();
        const success = await addCategory(name, description);
        if (success) {
            setName("");
            setDescription("");
        }
    };

  return (
    <div className="flex min-h-screen bg-gray-100">
      <AdminSidebar />
      <main className="flex-1 p-8">
        <h1 className="text-2xl font-bold text-gray-900 mb-6">Manage Categories</h1>

        <div className="bg-white p-6 rounded shadow mb-8 max-w-lg">
            <h2 className="text-lg font-semibold mb-4">Add New Category</h2>
            <form onSubmit={handleSubmit} className="space-y-4">
                <input 
                    className="w-full border p-2 rounded"
                    placeholder="Category Name"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    required
                />
                <textarea 
                    className="w-full border p-2 rounded"
                    placeholder="Description"
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                />
                <button 
                  type="submit" 
                  disabled={actionLoading}
                  className="bg-indigo-600 text-white px-4 py-2 rounded hover:bg-indigo-700 disabled:opacity-50 flex items-center gap-2"
                >
                    {actionLoading && <div className="animate-spin h-4 w-4 border-b-2 border-white rounded-full"></div>}
                    Create Category
                </button>
            </form>
        </div>

        <div className="bg-white rounded shadow overflow-hidden max-w-2xl">
            {loading ? (
                 <div className="flex justify-center py-10">
                    <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-indigo-600"></div>
                </div>
            ) : (
                <table className="min-w-full divide-y divide-gray-200">
                  <thead className="bg-gray-50">
                    <tr>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Name</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Description</th>
                      <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-200">
                      {categories.map(cat => (
                          <tr key={cat._id}>
                              <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">{cat.name}</td>
                              <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{cat.description}</td>
                              <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                                  <button onClick={() => deleteCategory(cat._id)} className="text-red-600 hover:text-red-900 flex items-center gap-1 ml-auto">
                                      <Trash2 size={16} /> Delete
                                  </button>
                              </td>
                          </tr>
                      ))}
                  </tbody>
                </table>
            )}
        </div>
      </main>
    </div>
  );
};

export default AdminCategories;
