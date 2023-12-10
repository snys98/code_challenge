import schedule from 'node-schedule';

schedule.scheduleJob('*/5 * * * * *', function () {
  console.log('The answer to life, the universe, and everything!');
});
