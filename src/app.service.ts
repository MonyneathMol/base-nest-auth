import { Injectable } from '@nestjs/common';
import moment = require('moment');
import { DataSource } from 'typeorm';

@Injectable()
export class AppService {

  constructor(private readonly datasource: DataSource) {}
  getHello(): string {
    return 'Hello World!';
  }

  async getDatabaseTime() {
    const time = await this.datasource.query(`SELECT NOW() as time`);
    const date = time[0]['time']
    console.log(`TIME RECIEVED`,date)
    
    return date
  }


  gettimeByMillisecond(miliSec: number){

    const ts = new Date(+miliSec)
    const momn = moment(ts).format('YYYY-MM-DD HH:mm:ss');
    

    const newDate = new Date(momn).toString()
    // const timezone = moment.tz(ts, "Asia/Bangkok")
    const ttt = new Date(newDate)
    console.log('timezone', ttt)

    return newDate
  }
}
