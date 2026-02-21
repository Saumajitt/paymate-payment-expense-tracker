export interface PaymentRequest {
    amount: number;
    receiverId?: number;
    description?: string;
    paymentMethodId?: string;
}

export interface PaymentResponse {
    paymentIntentId: string;
    clientSecret: string;
    transactionId: number;
    message: string;
}
