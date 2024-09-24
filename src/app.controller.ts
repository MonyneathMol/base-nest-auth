import { Controller, Get, Param, Post, Query, Request, UseGuards } from '@nestjs/common';
import moment = require("moment");
import { AppService } from 'src/app.service';


@Controller()
export class AppController {
  constructor(private readonly appService: AppService) {}

  @Get('hello')
  getHello(): string {
    //console.log(`start request get hello`);
    return this.appService.getHello();
  }

  @Get('server-time')
  async getCurrentTime(@Query('milisec') miliSec : number){
    var today = new Date()


  

    const currentTime = moment(today).format('YYYY-MM-DD HH:mm:ss');
    const localDate = today.toLocaleDateString()
    const localTime = today.toLocaleTimeString()
    const dbTime = await this.appService.getDatabaseTime()
    return {
      'current_time': currentTime,
      'local_time': `${localDate} ${localTime}`,
      'time':today.toString(),
      'database_time': dbTime,
      'timezone': this.appService.gettimeByMillisecond(+miliSec)
    }

  }

}
