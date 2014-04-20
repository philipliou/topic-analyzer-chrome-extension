// Background file to periodically send user's reading history back to the server

// Set the alarm and the seed time
console.log('event: background running');

console.log('event: newsHistoryRetriever created');
var newsHistoryRetriever = {
  start_range: Date.now() - 24*60*60*1000, // The past day
  end_range: Date.now(), // Now

  updateRange: function() {
    this.start_range = this.end_range;
    this.end_range = this.start_range + 24*60*60;
  },

  // Query function for the records between start and end time
  getChromeHistory: function() {
    var searchObject = {text: "", startTime: this.start_range, endTime: this.end_range};
    chrome.history.search(searchObject, this.parseHistory);
  },

  // Filter by domain URL
  parseHistory: function(historyItemArray) {
    console.log('historyarrayLength: ' + historyItemArray.length);
    var filteredArray = [];
    for (var i=0; i < historyItemArray.length; i++) {
      var historyItem = historyItemArray[i];
      // console.log(historyItem.lastVisitTime)
      // console.log(historyItem.url);
      
      if (isNewsDomain(historyItemArray[i].url)) {
        console.log(historyItem.url);
        filteredArray.push(historyItemArray[i]);
      }
    }

    // Send the results to server
    this.sendHistoryToAPI(filteredArray, this.updateRange);
  }

  sendHistoryToAPI: function(array, callback) {
    var backendURL = "www.joseph.com"
    var xhttp = new XMLHttpRequest()
    xhttp.open("POST", backendURL, false)
    xhttp.send()
    callback();
  }
}

function isNewsDomain(url) {
  var whitelist = ["www.cnn.com", "www.cbs.com", "www.abcnews.go.com", "www.reuters.com", "www.dailynews.yahoo.", "www.yahoo.com", "news.yahoo.com", "www.bbc.co.uk","www.huffingtonpost.com", "news.google.com", "www.foxnews.com", "www.dailymail.co.uk", "www.washingtonpost.com", "www.wsj.com", "www.theguardian.com", "www.usatoday.com", "news.bbc.co.uk", "www.latimes.com"]
  
  return (whitelist.indexOf(urlDomain(url)) > 0)
}

function urlDomain(url) {
  var a = document.createElement('a');
  a.href = url;
  return a.hostname;
}



alarmInfo = {
  delayInMinutes: 1,
  periodInMinutes: 1
}

chrome.alarms.create("sendHistory", alarmInfo)

chrome.alarms.onAlarm.addListener(function(alarm) {
  console.log('event: ' + alarm.name);

  // Add check for alarm name, if == "sendHistory" then initiate that process.
  if (alarm.name == 'sendHistory') {
    // sendHistorytoAPI();
    newsHistoryRetriever.getChromeHistory();
  }

});

// For every alarm, update the new start and end time for the query parameters

// Filter by domain URL

// Generate the final JSON from the HistoryItems

// Send to endpoint 