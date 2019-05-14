const puppeteer = require('puppeteer');
const Nightmare = require('nightmare');
const phantom = require('phantom');
var plotly = require('plotly')("AndyWang17", "5FIFur0HyG7vjZGTDwsx");
async function loadPhantom(url) {
    //console.time(url);
    const instance = await phantom.create();
    const page = await instance.createPage();
    /*
    await page.on('onResourceRequested', function(requestData) {
        console.info('Requesting', requestData.url);
    });
    */
    const status = await page.open('http://'+url);
    await instance.exit();
    //console.timeEnd(url);
};

async function loadNightmare(url){
    const nightmare = Nightmare({show: false});
    //console.time("N:"+ url);
    await nightmare
        .goto('http://'+url)
            //.screenshot()
        .end()
        .catch(function(e)  {
            //console.log(e);
        });
    //console.timeEnd("N:"+ url);
}

async function loadPuppeteer(url) {
    //console.log(url +': Started');
    //console.time("P:" + url);
    const browser = await puppeteer.launch({headless:true});
    const page = await browser.newPage();
    page.setViewport({ width: 1366, height: 768 });
    await page.goto('http://'+url, { waitUntil: 'networkidle2', timeout: 3000000 });
    //await page.screenshot({path: url+'.jpg',fullPage: true});
    browser.close();
    //console.timeEnd("P:" + url);
}


/*
async function loadLibrary(url){
    var i ; 
    for(i = 0; i < 10; i ++){
        await loadPuppeteer(url);
    }
    for(i = 0; i < 10; i ++){
        await loadNightmare(url);
    }
    for(i = 0; i < 10; i ++){
        await loadPhantom(url);
    }
}
*/

const subjects = [
    {name :'phantom', fn: loadPhantom},
    {name :'nightmare', fn: loadNightmare},
    {name :'puppeteer', fn: loadPuppeteer},
];
  

  async function runOnce(url) {
    const result = {};
    for (let i = 0; i < subjects.length; i++) {
      const { name, fn } = subjects[i];
      const start = new Date();
      await fn(url);
      const end = new Date();
      result[name] = end - start;
    }
    return result;
  }
  
  async function runNTimes(n,url) {
    const total = {}
    console.log('Benchmark#1: Rendering wlocalhost:3000/');
    for (let i = 1; i <= n; i++) {
      const result = await runOnce(url);
      console.log('Run', i, result);
      for (const key in result) {
        total[key] = (total[key] || 0) + result[key];
      }
    }
    const average = {}
    for (const key in total) {
      average[key] = parseInt(total[key] / n, 10)
    }
    return average;
  }

  runNTimes(5,'localhost:3000/').then(result => console.log('Average:', result));
  
//capture('google.com');
//loadLibrary('localhost:3000/')
/*
var trace1 = {
    x: [1, 2, 3, 4],
    y: [10, 15, 13, 17],
    type: "scatter"
  };
  var trace2 = {
    x: [1, 2, 3, 4],
    y: [16, 5, 11, 9],
    type: "scatter"
  };
  var data = [trace1, trace2];
  var graphOptions = {filename: "basic-line", fileopt: "overwrite"};
  plotly.plot(data, graphOptions, function (err, msg) {
      console.log(msg);
  });*/