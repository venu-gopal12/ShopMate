import { useState, useEffect, useCallback } from "react";
import API from "../api/api";
import { toast } from "sonner";

export const useSellerOrders = () => {
    const [orders, setOrders] = useState([]);
    const [loading, setLoading] = useState(true);
    const [updatingIds, setUpdatingIds] = useState(new Set()); // Track items being updated

    const fetchOrders = useCallback(async () => {
        try {
            const res = await API.get("/seller/orders");
            setOrders(res.data);
        } catch (err) {
            console.error("Failed to fetch seller orders", err);
            toast.error("Failed to load orders");
        } finally {
            setLoading(false);
        }
    }, []);

    useEffect(() => {
        fetchOrders();
    }, [fetchOrders]);

    const updateItemStatus = async (orderId, productId, status) => {
        console.log(`[useSellerOrders] Updating ${orderId} item ${productId} to ${status}`);
        const loadingKey = `${orderId}-${productId}`;
        setUpdatingIds(prev => new Set(prev).add(loadingKey));

        // Optimistic Update
        const previousOrders = [...orders];
        setOrders(prevOrders => 
            prevOrders.map(order => {
                if (order._id.toString() === orderId.toString()) {
                    return {
                        ...order,
                        items: order.items.map(item => {
                            // Debugging id comparison
                            const prodId = item.product?._id || item.product;
                            if (prodId?.toString() === productId.toString()) {
                                console.log(`[useSellerOrders] Optimistic match found for ${productId}`);
                                return { ...item, status };
                            }
                            return item;
                        })
                    };
                }
                return order;
            })
        );

        try {
            const res = await API.put("/seller/order-item/status", { orderId, productId, status });
            console.log("[useSellerOrders] Server response:", res.data);
            
            // Confirm update with server response (fully populated)
            setOrders(prevOrders => 
                prevOrders.map(order => 
                    order._id.toString() === orderId.toString() ? res.data.order : order
                )
            );
            toast.success(`Status updated to ${status}`);
        } catch (err) {
            console.error(err);
            toast.error("Failed to update status");
            // Revert on failure
            setOrders(previousOrders);
        } finally {
             setUpdatingIds(prev => {
                const newSet = new Set(prev);
                newSet.delete(loadingKey);
                return newSet;
            });
        }
    };

    const isUpdating = (orderId, productId) => updatingIds.has(`${orderId}-${productId}`);

    return {
        orders,
        loading,
        updateItemStatus,
        isUpdating,
        refreshOrders: fetchOrders
    };
};
