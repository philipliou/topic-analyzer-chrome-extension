var topicAnalysisClient = new TopicAnalysisService(function() {
    initialized = true;
});

// TODO: Need to work on TreeMap display in extension
function displayTreeMap() {
    $('#container').highcharts({
        title: {
            text: 'Monthly Average Temperature',
            x: -20 //center
        },
        subtitle: {
            text: 'Source: WorldClimate.com',
            x: -20
        },
        xAxis: {
            categories: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun',
                'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec']
        },
        yAxis: {
            title: {
                text: 'Temperature (°C)'
            },
            plotLines: [{
                    value: 0,
                    width: 1,
                    color: '#808080'
                }]
        },
        tooltip: {
            valueSuffix: '°C'
        },
        legend: {
            layout: 'vertical',
            align: 'right',
            verticalAlign: 'middle',
            borderWidth: 0
        },
        series: [{
                name: 'Tokyo',
                data: [7.0, 6.9, 9.5, 14.5, 18.2, 21.5, 25.2, 26.5, 23.3, 18.3, 13.9, 9.6]
            }, {
                name: 'New York',
                data: [-0.2, 0.8, 5.7, 11.3, 17.0, 22.0, 24.8, 24.1, 20.1, 14.1, 8.6, 2.5]
            }, {
                name: 'Berlin',
                data: [-0.9, 0.6, 3.5, 8.4, 13.5, 17.0, 18.6, 17.9, 14.3, 9.0, 3.9, 1.0]
            }, {
                name: 'London',
                data: [3.9, 4.2, 5.7, 8.5, 11.9, 15.2, 17.0, 16.6, 14.2, 10.3, 6.6, 4.8]
            }]
    });
}

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
var COLOR_LIST = ["Crimson", "Gold", "BlueViolet", "DodgerBlue", "DeepPink", "ForestGreen", "Yellow", "GreenYellow", "Silver", "OrangeRed", "LemonChiffon"];
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
                convertJsonToChartOBject(data);
                if (reportUpdateListeners && reportUpdateListeners instanceof Array) {
                    for (var i in reportUpdateListeners) {
                        reportUpdateListeners[i](data, xhr);
                    }
                }
            },
            function(response, xhr) {
                console.log("Failed to convert")
            }
    )
}