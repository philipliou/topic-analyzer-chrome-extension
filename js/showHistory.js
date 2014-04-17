// getHistory from the last week
// function that runs a function at end of every day
// sends results from getHistory to the server

// 
function getHistory() {
  console.log('event: getHistory');
  var searchObject = { text: ""};

  chrome.history.search(searchObject, function(results) {
      var urls = [];
      for (var i =0; i < results.length; i++) {
        var domain  = url_domain(results[i].url);
        urls.push(domain);
      }
      displayHistory(urls);
  })
}

// Displays the array of urls on the extension
function displayHistory(url_array) {
  console.log('event : displayHistory');
  for (var i = 0; i < url_array.length; i++) {
    console.log('!!!');
    var p = document.createElement('p');
    p.setAttribute('text', url_array[i]);
    $('#results').appendChild(p);
  }
}

// Send the list of URLs to server
function sendHistory() {

}

// Helper to parse domain from URL
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