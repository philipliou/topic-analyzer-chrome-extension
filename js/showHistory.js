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
    $('<p/>', {
      text: url_array[i]
    }).appendTo('#results');
  }
}
// Returns true if domain is in Whitelist of news domains
function newsURL(url) {
  var whitelist = {
    'www.cnn.com': true,
    'www.newyorktimes.com': true,
    'www.nyt.com':true,
    'www.wallstreetjournal.com':true,
    'www.wsj.com':true,
  }
}
// Helper to parse domain from URL
function url_domain(data) {
  var a = document.createElement('a');
  a.href = data;
  return a.hostname;
}

document.addEventListener('DOMContentLoaded', 
  function() {
    // Do something onload
    // displayPercentChart();

    // percentChart button
    $("#percentChartButton").click(function() {
      console.log('event: displayPercentChart')
      displayPercentChart();
    });

    $("#anotherChart").click(function() {
      console.log('event: displayTreeMap')
      displayTreeMap();
    });
  }
);