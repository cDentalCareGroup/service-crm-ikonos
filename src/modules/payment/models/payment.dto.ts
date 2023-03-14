export class PaymentItemDTO {
    id: number;
    patientId: number;
    referenceId: number;
    movementTypeId: number;
    paymentMethodId: number;
    amount: number;
    movementType: String;
    movementSign: String;
    createdAt: Date;
    dueDate: Date;
    status: string;
    isAplicable: boolean;
    aplicableAmount: number;
}

export interface DebtInfoDTO {
    amountDebt: number;
    debt: PaymentItemDTO;
}

export class RegisterPaymentDTO {
    patientId: number;
    paymentMethodId: number;
    amount: number;
    movementType: number;
    debts?: DebtInfoDTO[];
}