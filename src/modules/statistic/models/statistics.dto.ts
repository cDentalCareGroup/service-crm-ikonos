import { CallEntity } from "src/modules/calls/models/call.entity";



export class GetStatisticsCallsDTO {
    active: CallEntity[];
    solvedCalls: CallEntity[];
    expiredCalls: CallEntity[];

    constructor(active: CallEntity[],
        solvedCalls: CallEntity[],
        expiredCalls: CallEntity[]) {
        this.active = active;
        this.solvedCalls = solvedCalls;
        this.expiredCalls = expiredCalls;
    }
} 