import { Controller, Get } from '@nestjs/common';
import { StatisticService } from './statistic.service';

@Controller('statistic')
export class StatisticController {

    constructor(private statisticsService: StatisticService){}

    @Get('all')
    async getGeneralStatistics() {
        return this.statisticsService.getGeneralStatistics();
    }
}
