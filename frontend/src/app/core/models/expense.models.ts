export type SplitType = 'EQUAL' | 'PERCENTAGE' | 'EXACT_AMOUNT' | 'SHARES';
export type ExpenseStatus = 'PENDING' | 'PARTIALLY_SETTLED' | 'SETTLED';

export interface CreateExpenseRequest {
    title: string;
    description?: string;
    totalAmount: number;
    splitType: SplitType;
    participantIds: number[];
    groupId?: number;
    percentages?: number[];
    exactAmounts?: number[];
    shares?: number[];
}

export interface ExpenseResponse {
    id: number;
    title: string;
    description: string;
    totalAmount: number;
    paidByName: string;
    splitType: SplitType;
    status: ExpenseStatus;
    groupName: string;
    createdAt: string;
}
