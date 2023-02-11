

export class RegisterPadDTO {
    name: string;
    description: string;
    price: number;
    type: string;
    day: number;
    status: boolean;
    maxMembers: number;
    maxAdditionals: number;
}

export class UpdatePadDTO {
    name: string;
    description: string;
    price: number;
    type: string;
    day: number;
    status: boolean;
    id: number;
}


export class RegisterPadComponentDTO {
    padCatalogueId: number;
    serviceId: number;
    globalQuantity: number;
    maxPatientQuantity: number;
    discount: number;
}