var topicAnalysisClient = new TopicAnalysisService(function() {
    initialized = true;
});


var percentChartPlotOptions = {
    area: {
        stacking: 'percent',
        lineColor: '#ffffff',
        lineWidth: 1,
        marker: {
            lineWidth: 1,
            lineColor: '#ffffff'
        }
    }
};

// Returns a chartObject from JSON
function convertJsonToChartOBject(json, xhr) {
    var co = new chartData();
    co.setChartType('area');
    co.setTitle('Top 10 Topics + Others');
    co.setPlotOptions(percentChartPlotOptions);

    // Get and set dates
    var report = json.topics.report;
    var xLabels = [];
    for (propt in report) {
        xLabels.push(propt);
    }
    co.setXAxisCategories(xLabels);

    var cd = [];
    var count = 0;
    for (var topicId in json.topics.topics) {
        var obj = {'name': json.topics.topics[topicId].split(",").splice(0, 5) + "..."};
        obj.data = [];
        for (var grouping in json.topics.report) {
            obj.data.push(json.topics.report[grouping][topicId].totalScore);
        }
        obj.color = convertColorToAlpha(COLOR_LIST[count++], 0.8);
        cd.push(obj);
    }

    co.setSeries(cd);
    $('#container').highcharts(co);
}

function convertColorToAlpha(color, alhpa){
    var c  = $('<p></p>').css('color', color)[0];
    document.body.appendChild(c);
    var colorRgb = window.getComputedStyle(c).color;
    $(c).remove();
    delete c;
    var res = colorRgb.replace(")", ", "+alhpa+")").replace("rgb", "rgba");
    //console.log(res);
    return res;
}

// Display the chart on the extension
function displayPercentChart(startDate, endDate, groupBy) {
    // Redundant frontend check b/c done on backend already, but for safety.
    if (!startDate) {
        startDate = Date.now() - 1 * DAYS;
    }

    if (!endDate) {
        endDate = Date.now();
    }

    if (!groupBy) {
        groupBy = REPORT_GROUP_BY_DAY;
    }

//    console.log("Start Date: " + startDate + "->" + dateYmd(startDate));
//    console.log("End Date: " + endDate);
    
    topicAnalysisClient.getReport(
            dateYmd(startDate),
            dateYmd(endDate),
            groupBy,
            function(data, xhr) {
                if (reportUpdateListeners && reportUpdateListeners instanceof Array) {
                    for (var i in reportUpdateListeners) {
                        console.log("Calling function: "+reportUpdateListeners[i]);
                        reportUpdateListeners[i](data, xhr);
                    }
                }
                convertJsonToChartOBject(data);
            },
            function(response, xhr) {
                console.log("Failed to convert")
            }
    )
}