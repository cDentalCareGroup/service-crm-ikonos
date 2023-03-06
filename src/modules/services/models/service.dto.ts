


export class RegisterServiceDTO {
    name: string;
    price: number;
    categoryId: number;
    labCost: number;
}

export class UpdateServiceDTO {
    id: number;
    name: string;
    price: number;
    categoryId: number;
    status: string;
}