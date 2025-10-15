import { Instance } from "../instance"

interface UpdateLenderTermSheetStatusRequest {
    termSheetId: number;
    status: "approved" | "rejected";
}

export const updateLenderTermSheetStatus = async (request: UpdateLenderTermSheetStatusRequest) => {
    const response = await Instance.put(`/term-sheets/${request.termSheetId}/status`, {
        status: request.status
    });
    return response.data;
}

