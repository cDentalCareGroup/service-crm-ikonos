import { Body, Controller, Get, Post } from '@nestjs/common';
import { StatisticService } from './statistic.service';

@Controller('statistic')
export class StatisticController {

    constructor(private statisticsService: StatisticService){}

    @Get('')
    async getGeneralStatistics() {
        return this.statisticsService.getGeneralStatistics();
    }

    @Get('calls')
    async getStatisticsCalls() {
        return this.statisticsService.getStatisticsCalls();
    }

    @Get('balance')
    async getStatisticsBalance() {
        return this.statisticsService.getStatisticsBalance();
    }

    @Get('reports/calls')
    async getCallsReport() {
        return this.statisticsService.getCallsReport();
    }

    @Post('reports/services/sales')
    async getSalesServicesReport(@Body() body: any) {
        return this.statisticsService.getSalesServicesReport(body);
    }



}
