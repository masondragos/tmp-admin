import { Instance } from "../instance"
import { TermSheet, LenderTermSheet } from "@/@types/term-sheet"

export interface TermSheetWithLenderTermSheets extends TermSheet {
    lenderTermSheets?: LenderTermSheet[];
}

export const getTermSheetById = async (id: string): Promise<TermSheetWithLenderTermSheets> => {
    const response = await Instance.get(`/loan-connections/${id}`)
    return response.data
}

