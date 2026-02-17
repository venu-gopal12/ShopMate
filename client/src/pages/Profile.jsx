import { useState, useEffect, useContext } from "react";
import API from "../api/api";
import Navbar from "../components/layout/Navbar";
import Footer from "../components/layout/Footer";
import { AuthContext } from "../context/AuthContext";
import { toast } from "sonner";
import { User, MapPin, Save, Trash2, Plus } from "lucide-react";

const Profile = () => {
    const { user, setUser } = useContext(AuthContext); // Assuming setUser updates context
    const [activeTab, setActiveTab] = useState("details"); // details, addresses
    const [profileData, setProfileData] = useState({
        name: "",
        email: "",
        password: ""
    });
    const [addresses, setAddresses] = useState([]);
    const [newAddress, setNewAddress] = useState({
        street: "", city: "", state: "", zip: "", country: ""
    });
    const [showAddressForm, setShowAddressForm] = useState(false);

    useEffect(() => {
        if (user) {
            setProfileData({ name: user.name, email: user.email, password: "" });
            fetchAddresses();
        }
    }, [user]);

    const fetchAddresses = async () => {
        try {
            const res = await API.get("/users/profile");
            if (res.data.addresses) setAddresses(res.data.addresses);
        } catch (err) {
            console.error("Error fetching addresses", err);
        }
    };

    const handleProfileUpdate = async (e) => {
        e.preventDefault();
        try {
            const updateData = { name: profileData.name };
            if (profileData.password) updateData.password = profileData.password;

            const res = await API.put("/users/profile", updateData);
            toast.success("Profile updated successfully");
            // Ideally update auth context user here if needed
            // setUser(res.data); 
        } catch (err) {
            toast.error("Failed to update profile");
        }
    };

    const handleAddAddress = async (e) => {
        e.preventDefault();
        try {
            const res = await API.post("/users/address", newAddress);
            setAddresses(res.data.addresses);
            setShowAddressForm(false);
            setNewAddress({ street: "", city: "", state: "", zip: "", country: "" });
            toast.success("Address added");
        } catch (err) {
            toast.error("Failed to add address");
        }
    };

    const handleRemoveAddress = async (addressId) => {
        try {
            const res = await API.delete(`/users/address/${addressId}`);
            setAddresses(res.data.addresses);
            toast.success("Address removed");
        } catch (err) {
            toast.error("Failed to remove address");
        }
    };

    return (
        <div className="flex flex-col min-h-screen bg-gray-50">
            <Navbar />
            <main className="flex-grow max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-10 w-full">
                <h1 className="text-3xl font-bold text-gray-900 mb-8">Account Settings</h1>

                <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
                    <div className="flex border-b border-gray-100">
                        <button
                            onClick={() => setActiveTab("details")}
                            className={`flex-1 py-4 text-sm font-bold text-center transition-colors ${
                                activeTab === "details" ? "bg-indigo-50 text-indigo-600 border-b-2 border-indigo-600" : "text-gray-500 hover:bg-gray-50"
                            }`}
                        >
                            <User className="w-4 h-4 inline mr-2" />
                            Profile Details
                        </button>
                        <button
                            onClick={() => setActiveTab("addresses")}
                            className={`flex-1 py-4 text-sm font-bold text-center transition-colors ${
                                activeTab === "addresses" ? "bg-indigo-50 text-indigo-600 border-b-2 border-indigo-600" : "text-gray-500 hover:bg-gray-50"
                            }`}
                        >
                            <MapPin className="w-4 h-4 inline mr-2" />
                            Addresses
                        </button>
                    </div>

                    <div className="p-8">
                        {activeTab === "details" ? (
                            <form onSubmit={handleProfileUpdate} className="space-y-6 max-w-md mx-auto">
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">Full Name</label>
                                    <input
                                        type="text"
                                        value={profileData.name}
                                        onChange={(e) => setProfileData({...profileData, name: e.target.value})}
                                        className="w-full px-4 py-2 rounded-xl border border-gray-200 focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 outline-none transition-all"
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">Email Address</label>
                                    <input
                                        type="email"
                                        value={profileData.email}
                                        disabled
                                        className="w-full px-4 py-2 rounded-xl border border-gray-200 bg-gray-50 text-gray-500 cursor-not-allowed"
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">New Password (Optional)</label>
                                    <input
                                        type="password"
                                        value={profileData.password}
                                        onChange={(e) => setProfileData({...profileData, password: e.target.value})}
                                        placeholder="Leave blank to keep current"
                                        className="w-full px-4 py-2 rounded-xl border border-gray-200 focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 outline-none transition-all"
                                    />
                                </div>
                                <button type="submit" className="w-full py-3 bg-indigo-600 text-white font-bold rounded-xl hover:bg-indigo-700 transition-colors shadow-lg shadow-indigo-100">
                                    <Save className="w-4 h-4 inline mr-2" />
                                    Save Changes
                                </button>
                            </form>
                        ) : (
                            <div className="space-y-6">
                                {!showAddressForm ? (
                                    <button 
                                        onClick={() => setShowAddressForm(true)}
                                        className="w-full py-3 border-2 border-dashed border-gray-300 rounded-xl text-gray-500 font-bold hover:border-indigo-500 hover:text-indigo-600 hover:bg-indigo-50 transition-all"
                                    >
                                        <Plus className="w-5 h-5 inline mr-2" />
                                        Add New Address
                                    </button>
                                ) : (
                                    <form onSubmit={handleAddAddress} className="bg-gray-50 p-6 rounded-xl border border-gray-100 space-y-4 animate-in fade-in slide-in-from-top-4">
                                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                            <input placeholder="Street Address" required value={newAddress.street} onChange={e => setNewAddress({...newAddress, street: e.target.value})} className="w-full px-4 py-2 rounded-lg border border-gray-200" />
                                            <input placeholder="City" required value={newAddress.city} onChange={e => setNewAddress({...newAddress, city: e.target.value})} className="w-full px-4 py-2 rounded-lg border border-gray-200" />
                                            <input placeholder="State" required value={newAddress.state} onChange={e => setNewAddress({...newAddress, state: e.target.value})} className="w-full px-4 py-2 rounded-lg border border-gray-200" />
                                            <input placeholder="ZIP Code" required value={newAddress.zip} onChange={e => setNewAddress({...newAddress, zip: e.target.value})} className="w-full px-4 py-2 rounded-lg border border-gray-200" />
                                            <input placeholder="Country" required value={newAddress.country} onChange={e => setNewAddress({...newAddress, country: e.target.value})} className="w-full px-4 py-2 rounded-lg border border-gray-200" />
                                        </div>
                                        <div className="flex gap-3">
                                            <button type="submit" className="px-6 py-2 bg-indigo-600 text-white font-bold rounded-lg">Save Address</button>
                                            <button type="button" onClick={() => setShowAddressForm(false)} className="px-6 py-2 bg-white text-gray-600 font-bold rounded-lg border border-gray-200">Cancel</button>
                                        </div>
                                    </form>
                                )}

                                <div className="grid gap-4">
                                    {addresses.map((addr) => (
                                        <div key={addr._id} className="flex items-center justify-between p-4 bg-white border border-gray-200 rounded-xl hover:shadow-md transition-shadow">
                                            <div>
                                                <p className="font-medium text-gray-900">{addr.street}</p>
                                                <p className="text-sm text-gray-500">{addr.city}, {addr.state} {addr.zip}</p>
                                                <p className="text-sm text-gray-500">{addr.country}</p>
                                            </div>
                                            <button 
                                                onClick={() => handleRemoveAddress(addr._id)}
                                                className="p-2 text-gray-400 hover:text-red-500 hover:bg-red-50 rounded-lg transition-colors"
                                            >
                                                <Trash2 className="w-5 h-5" />
                                            </button>
                                        </div>
                                    ))}
                                    {addresses.length === 0 && !showAddressForm && (
                                        <p className="text-center text-gray-400 py-4">No addresses saved yet.</p>
                                    )}
                                </div>
                            </div>
                        )}
                    </div>
                </div>
            </main>
            <Footer />
        </div>
    );
};

export default Profile;
