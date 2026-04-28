import api from "../api/api";

export default function transferedItemUndo(transferedId) {
    try {
        const res = api.post(`/internal-transfer/${transferedId}/undo`);
        console.log("Undo transfer response:", res);
        return res;
    } catch (error) {
        console.error("Error undoing transfer:", error);
        throw error;
    }
}