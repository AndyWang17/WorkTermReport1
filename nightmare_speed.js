const Nightmare = require('nightmare');


async function capture(url){
    const nightmare = Nightmare({show: true});
    console.time(url);
    await nightmare
        .goto('http://'+url)
            //.screenshot()
        .end()
        .catch(function(e)  {
            console.log(e);
        });
    console.timeEnd(url);
}
async function navigation (url){
    nightmare
    .goto('url')
    .insert('#gsc-i-id1', 'ubuntu')
    .click('input.gsc-search-button-v2')
    .wait('#search-results')
    .evaluate(function() {
            let searchResults = [];

            const results =  document.querySelectorAll('h6.library-search-result-title a');
            results.forEach(function(result) {
                    let row = {
                                    'title':result.innerText,
                                    'url':result.href
                              }
                    searchResults.push(row);
            });
            return searchResults;
    })
    .end()
    .then(function(result) {
            result.forEach(function(r) {
                    console.log('Title: ' + r.title);
                    console.log('URL: ' + r.url);
            })
    })
    .catch(function(e)  {
            console.log(e);
    });
}

capture('google.com');