import { useMutation } from "@tanstack/react-query";
import { updateLenderTermSheetStatus } from "@/services/loan-connections/update-lender-term-sheet-status.service";

export const useUpdateLenderTermSheetStatus = () => {
    return useMutation({
        mutationFn: updateLenderTermSheetStatus,
        mutationKey: ['updateLenderTermSheetStatus']
    })
}

