// Background file to periodically send user's reading history back to the server

// Set the alarm and the seed time
console.log('event: background running');
console.log('event: newsHistoryRetriever created');
var MAX_RESULTS = 10000;
var KEY_LAST_PUSH = 'lastHistoryPush';
var inProgress = false;//avoid double calls.
var initialized = false;
/**
 * 
 * @type TopicAnalysisService.service
 */
var topicAnalysisClient = new TopicAnalysisService(function() {
    initialized = true;
});

var NewsHistoryRetriever = function() {
    var that = {
        //always start from teh beginning of time if last push is not persisted
        start_range: topicAnalysisClient.get(KEY_LAST_PUSH, false, 1),
        //current time is the last push, we won't want to miss anything
        end_range: Date.now(), // Now
        //initialHistoryCall: true,
        // Function to update range after URLs from the previous range has been sent to server
        updateRange: function() {
            //persist, while  updating varuable
            topicAnalysisClient.store(KEY_LAST_PUSH, that.start_range = that.end_range, false);
            that.end_range = Date.now();
            that.initialHistoryCall = false;
            inProgress = false;
        },
        // Query function for the records between start and end time
        getChromeHistory: function() {
            console.log('event: getChromeHistory');
            if (!inProgress) {
                var searchObject = {
                    text: "",
                    startTime: Number(that.start_range),
                    endTime: that.end_range,
                    maxResults: MAX_RESULTS //no need to limit this since time range is already a constraint
                };
                inProgress = true;
                chrome.history.search(searchObject, that.parseHistory);
            } else {
                console.log("Another update in progress.");
            }
        },
        // Filter by domain URL
        parseHistory: function(historyItemArray) {
            // console.log('event: parseHistory of ' + historyItemArray.length + ' urls')
            var old_date_start = new Date(that.start_range);
            var old_date_end = new Date(that.end_range);
            console.log('Parsing ' + historyItemArray.length + ' articles from: ' + old_date_start + ' to ' + old_date_end);

            var filteredArray = [];
            var maxVisitTime = 0;
            for (var i = 0; i < historyItemArray.length; i++) {
                //var historyItem = historyItemArray[i];
                // console.log(historyItem.lastVisitTime)
                // console.log(urlDomain(historyItem.url));
                if (historyItemArray[i].lastVisitTime > maxVisitTime) {
                    maxVisitTime = historyItemArray[i].lastVisitTime;
                }
                if (isNewsDomain(historyItemArray[i].url)) {
                    var newsItem = {};
                    newsItem['date'] = Math.round(historyItemArray[i].lastVisitTime);
                    newsItem['url'] = historyItemArray[i].url;
                    filteredArray.push(newsItem);
                }
            }
            
            if (maxVisitTime > 0) {
                that.end_range = maxVisitTime;
            }
            // Send the results to server
            if (filteredArray.length > 0) {
                console.log(filteredArray);
                that.sendHistoryToAPI(filteredArray, that.updateRange);
            } else {
                that.updateRange();
            }
        },
        sendHistoryToAPI: function(array, successCB) {
            console.log('event: sendHistoryToAPI');
            topicAnalysisClient.submitHistory(array, successCB, function() {
                console.log("History was not successfully sent.");
                inProgress = false;
            });
            console.log(array.length + " articles sent to the server.");
            //successCB(); already called
        }
    };

    return that;
};

var newsHistoryRetriever = new NewsHistoryRetriever();
newsHistoryRetriever.getChromeHistory();

// Returns true if URL domain is a news site
function isNewsDomain(url) {
    var domainsArr = topicAnalysisClient.get(KEY_DOMAINS, true, DEFAULT_DOMAINS);
    var aTag = createATag(url);
    //ensure it's not the home page and that the domain name is whitelisted
    return aTag.pathname !== "/" && (domainsArr.indexOf(aTag.hostname) > -1);
}

//Craete a Tag
function createATag(url) {
    var a = document.createElement('a');
    a.href = url;
    return a;
}

// Helper function to extract the domain from URL
function urlDomain(url) {
    return createATag(url).hostname;
}

// Set up the alarm for the periodic background job
alarmInfo = {
    delayInMinutes: 1,
    periodInMinutes: 1
};

chrome.alarms.create("sendHistory", alarmInfo)

chrome.alarms.onAlarm.addListener(function(alarm) {
    console.log('event: alarm ' + alarm.name);
    if (alarm.name == 'sendHistory') {
        newsHistoryRetriever.getChromeHistory();
    }
});

chrome.browserAction.onClicked.addListener(function(activeTab) {
    var tabUrl = 'html/newsapp.html';
    chrome.tabs.create({
        url: tabUrl
    });
});