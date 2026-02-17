import { useState, useEffect, useCallback } from "react";
import API from "../api/api";
import { toast } from "sonner";

export const useAdminCategories = () => {
    const [categories, setCategories] = useState([]);
    const [loading, setLoading] = useState(true);
    const [actionLoading, setActionLoading] = useState(false); // For add/delete actions

    const fetchCategories = useCallback(async () => {
        try {
            const res = await API.get("/category");
            setCategories(res.data);
        } catch (err) {
            console.error("Failed to fetch categories", err);
            toast.error("Failed to load categories");
        } finally {
            setLoading(false);
        }
    }, []);

    useEffect(() => {
        fetchCategories();
    }, [fetchCategories]);

    const addCategory = async (name, description) => {
        setActionLoading(true);
        // Optimistic UI update could be tricky if we don't have the ID, 
        // but for creation it's usually better to wait for the ID from server 
        // OR generate a temp ID. 
        // For simplicity and correctness with IDs, we'll wait for server response here
        // but show a loading state.
        try {
            const res = await API.post("/category", { name, description });
            setCategories(prev => [res.data.category, ...prev]);
            toast.success("Category created");
            return true; // Success
        } catch (err) {
            toast.error(err.response?.data?.message || "Failed to create category");
            return false;
        } finally {
            setActionLoading(false);
        }
    };

    const deleteCategory = async (id) => {
        if (!window.confirm("Delete this category?")) return;

        // Optimistic Delete
        const previousCategories = [...categories];
        setCategories(prev => prev.filter(c => c._id !== id));

        try {
            await API.delete(`/category/${id}`);
            toast.success("Category deleted");
        } catch (err) {
            console.error(err);
            toast.error("Failed to delete category");
            // Revert
            setCategories(previousCategories);
        }
    };

    return {
        categories,
        loading,
        actionLoading,
        addCategory,
        deleteCategory,
        refreshCategories: fetchCategories
    };
};
