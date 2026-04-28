import api from "../api/api";

export default function transferedItem(payload) {
    try {
        const res = api.post(`/internal-transfer`, payload);
        console.log("Transfer response:", res);
        return res;
    } catch (error) {
        console.error("Error transferring item:", error);
        throw error;
    }
}