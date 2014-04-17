// getHistory from the last week
// function that runs a function at end of every day
// sends results from getHistory to the server

function getHistory() {
  console.log('event: getHistory');
  var searchObject = {};
  searchObject.text = "";

  var historyItems = chrome.history.search(searchObject, function(results) {
      for (var i =0; i < results.length; i++) {
        // console.log(url_domain(results[i].url));
        var url = results[i].url;
        console.log(url_domain(url));
      }
  })
}

function url_domain(data) {
  var a = document.createElement('a');
  a.href = data;
  return a.hostname;
}

document.addEventListener('DOMContentLoaded', 
  function() {
    getHistory();
  }
);

function parseSources(results) {

}