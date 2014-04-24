// Background file to periodically send user's reading history back to the server

// Set the alarm and the seed time
console.log('event: background running');
console.log('event: newsHistoryRetriever created');

var initialized = false;
var topicAnalysisClient = new TopicAnalysisService(function(){
  initialized = true;
});

var NewsHistoryRetriever = function(){ 
var that = {
  start_range: Date.now() - 4*7*24*60*60*1000, // The past day
  end_range: Date.now() - 60*1000, // Now
  initialHistoryCall: true,

  // Function to update range after URLs from the previous range has been sent to server
  updateRange: function() {
    that.start_range = that.end_range;
    that.end_range = Date.now();
    that.initialHistoryCall = false;
  },

  // Query function for the records between start and end time
  getChromeHistory: function() {
    console.log('event: getChromeHistory')
    var searchObject = {
      text: "", 
      startTime: that.start_range, 
      endTime: that.end_range,
    };

    if (that.initialHistoryCall == true) {
      searchObject.maxResults = 1000;
    }

    chrome.history.search(searchObject, that.parseHistory);
  },

  // Filter by domain URL
  parseHistory: function(historyItemArray) {
    // console.log('event: parseHistory of ' + historyItemArray.length + ' urls')
    var old_date_start = new Date(that.start_range);
    var old_date_end = new Date(that.end_range);
    console.log('Parsing ' + historyItemArray.length + ' articles from: ' + old_date_start + ' to ' + old_date_end);

    var filteredArray = [];
    for (var i=0; i < historyItemArray.length; i++) {
      var historyItem = historyItemArray[i];
      // console.log(historyItem.lastVisitTime)
      // console.log(urlDomain(historyItem.url));
      
      if (isNewsDomain(historyItemArray[i].url)) {

        var newsItem = {};
        newsItem['date'] = Math.round(historyItemArray[i].lastVisitTime);
        newsItem['url'] = historyItemArray[i].url;
        filteredArray.push(newsItem);
      }
    }
    // Send the results to server
    if (filteredArray.length > 0) {
      console.log(filteredArray)
      that.sendHistoryToAPI(filteredArray, that.updateRange);  
    } else {
      that.updateRange(); 
    }
  },

  sendHistoryToAPI: function(array, successCB) {
    console.log('event: sendHistoryToAPI')
    topicAnalysisClient.submitHistory(array, successCB, function() {
      console.log("History was not successfully sent.")
    })
    console.log(array.length + " articles sent to the server.");
    successCB();
  }
}

return that;
};

var newsHistoryRetriever = new NewsHistoryRetriever();
newsHistoryRetriever.getChromeHistory();

// Returns true if URL domain is a news site
function isNewsDomain(url) {
  var whitelist = ["www.cnn.com", "www.cbs.com", "www.abcnews.go.com", "www.reuters.com", "www.dailynews.yahoo.", "www.yahoo.com", "news.yahoo.com", "www.bbc.co.uk","www.huffingtonpost.com", "news.google.com", "www.foxnews.com", "www.dailymail.co.uk", "www.washingtonpost.com", "www.wsj.com", "www.theguardian.com", "www.usatoday.com", "news.bbc.co.uk", "www.latimes.com", "www.nytimes.com", "www.nyt.com", "www.bbc.com"]
  
  return (whitelist.indexOf(urlDomain(url)) > -1)
}

// Helper function to extract the domain from URL
function urlDomain(url) {
  var a = document.createElement('a');
  a.href = url;
  return a.hostname;
}

// Set up the alarm for the periodic background job
alarmInfo = {
  delayInMinutes: 1,
  periodInMinutes: 1
}

chrome.alarms.create("sendHistory", alarmInfo)

chrome.alarms.onAlarm.addListener(function(alarm) {
  console.log('event: alarm ' + alarm.name);
  if (alarm.name == 'sendHistory') {
    newsHistoryRetriever.getChromeHistory();
  }
});