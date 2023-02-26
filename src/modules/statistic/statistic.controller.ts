import { Controller, Get } from '@nestjs/common';
import { StatisticService } from './statistic.service';

@Controller('statistic')
export class StatisticController {

    constructor(private statisticsService: StatisticService){}

    @Get('')
    async getGeneralStatistics() {
        return this.statisticsService.getGeneralStatistics();
    }
}
