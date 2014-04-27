var DAYS = 1000*60*60*24;

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
    displayPercentChart();

    $("#timespan :button").click(function() {
      var range = $(this).attr("value");
      $("#toDate").val(epochFromText(range).toDate);
      $("#fromDate").val(epochFromText(range).fromDate);
    });

    $("#groupings :button").click(function() {
      var grouping = $(this).attr("value");
      $("#grouping").val(grouping);
    });

    $("#timespan, #groupings :button").click(function() {
      var toDate = $("#timespan #toDate").attr("value")
      var fromDate = $("#timespan #fromDate").attr("value")
      var groupBy = $("#grouping").attr("value")
      displayPercentChart(toDate, fromDate, groupBy)
      console.log("event: displayPercentChart")
    })
  }
);



// Helper function to calculate the time ranges in epoch time based on text
function epochFromText(range) {
  var toDate = Date.now()
  var fromDate = Date.now() - 1*DAYS
  switch(range) {
    case 'week':
      fromDate = Date.now() - 7*DAYS
      break;
    case 'month':
      fromDate = Date.now() - 30*DAYS
      break;
    case 'year':
      fromDate = Date.now() - 365*DAYS
      break;
  }
  return {
    toDate: toDate,
    fromDate: fromDate
  }
}