'use strict'

const got = require('got');
const strsplit = require('strsplit');
const strftime = require('strftime');
//const geolib = require('geolib');
//const tle = require('tle');

const delaySeconds = 3;
const url = 'http://spaceflight.nasa.gov/realdata/sightings/SSapplications/Post/JavaSSOP/orbit/ISS/SVPOST.html';
const localPosition = { latitude: 59.9503479, longitude: 10.907592799999975 };

got(url)
  .then(response => {
    // console.log(response.body);
    const pageBody = response.body;
    // console.log(strsplit(pageBody, "<PRE>")[1]);
    var issRawData = response.body;
    issRawData = strsplit(issRawData, "<PRE>")[1];  // strip text before <PRE>
    issRawData = strsplit(issRawData, "</PRE>")[0];  // strip text atter </PRE>
    // console.log(issRawData);
    issRawData = strsplit(issRawData, "Vector Time (GMT): ");
    issRawData.shift();  // strip/pop the first item in list
    // console.log(issRawData.length);

    issRawData.every(  // http://stackoverflow.com/a/6260865
      function displayTle(tleGroup) {
        console.log("");
        // console.log(tleGroup);

        var tleGroupRawDate = tleGroup.slice(0,21);
        console.log(tleGroupRawDate);  // 2016/256/00:55:10.325

        var tleGroupDate = new Date(0);

        var dayOfYearArray = strsplit(tleGroupRawDate, '/');
        console.log(dayOfYearArray);  // [ '2016', '256', '00:55:10.325' ]

        tleGroupDate.setFullYear(dayOfYearArray[0]);
        tleGroupDate.setUTCMonth(0);
        tleGroupDate.setUTCDate(dayOfYearArray[1]);
        console.log(tleGroupDate);

        var dayOfYearTimeArray = strsplit(dayOfYearArray[2], ':')
        console.log(dayOfYearTimeArray);  // [ '00', '55', '10.325' ]

        tleGroupDate.setUTCHours(dayOfYearTimeArray[0]);
        tleGroupDate.setUTCMinutes(dayOfYearTimeArray[1]);
        console.log(tleGroupDate);

        var dayOfYearSecondsArray = strsplit(dayOfYearTimeArray[2], '.');
        console.log(dayOfYearSecondsArray);  // [ '10', '325' ]

        tleGroupDate.setUTCSeconds(dayOfYearSecondsArray[0]);
        tleGroupDate.setUTCMilliseconds(dayOfYearSecondsArray[1]);
        console.log(tleGroupDate);  // 2016-09-12T00:55:10.325Z

        // console.log('-----------------------------------------------------------------------');
        var tleRawData = strsplit(tleGroup, "TWO LINE MEAN ELEMENT SET")[1];
        tleRawData = tleRawData.slice(8, 160);
        // console.log(tleRawData);
        var tleRawDataLines = strsplit(tleRawData, '\n');
        tleRawDataLines.pop();  // pop/remove last empty item with '\n'
        // console.log(tleRawDataLines);
        // console.log('-----------------------------------------------------------------------');

        var dateNow = new Date();
        // console.log(tleGroupDate.getTime());
        // console.log(dateNow.getTime());

        // http://stackoverflow.com/a/6260865
        if (tleGroupDate.getTime() - dateNow.getTime() >= 0)
          return false;  // mimic break in forEach or every
        else
          return true;
      }
    );
  })
  .catch(error => {
    console.log(error.response.body);
});
