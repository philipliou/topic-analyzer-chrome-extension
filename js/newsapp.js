var DAYS = 1000 * 60 * 60 * 24;

function getHistory() {
    console.log('event: getHistory');
    var searchObject = {text: ""};

    chrome.history.search(searchObject, function(results) {
        var urls = [];
        for (var i = 0; i < results.length; i++) {
            var domain = url_domain(results[i].url);
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
        'www.nyt.com': true,
        'www.wallstreetjournal.com': true,
        'www.wsj.com': true,
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
                var epoch = epochFromText(range);//call method only once
                $("#toDate").val(epoch.toDate);
                $("#fromDate").val(epoch.fromDate);
                updateGraph();
            });

            $("#groupings :button").click(function() {
                var grouping = $(this).attr("value");
                $("#grouping").val(grouping);
                updateGraph();
            });

//this has to be called by click handler to ensure proper sequence of action.
            var updateGraph = function() {
                var toDate = $("#timespan #toDate").attr("value");
                var fromDate = $("#timespan #fromDate").attr("value");
                var groupBy = $("#grouping").attr("value");
                displayPercentChart(fromDate, toDate, groupBy);
                console.log("event: displayPercentChart");
            };
        }
);



// Helper function to calculate the time ranges in epoch time based on text
function epochFromText(range) {
    var toDate = Date.now()
    var fromDate = Date.now() - 1 * DAYS
    switch (range) {
        case 'week':
            fromDate = Date.now() - 7 * DAYS
            break;
        case 'month':
            fromDate = Date.now() - 30 * DAYS
            break;
        case 'year':
            fromDate = Date.now() - 365 * DAYS
            break;
    }
    return {
        toDate: toDate,
        fromDate: fromDate
    }
}


//added by joseph
var tableApp = angular.module('dataTable', [])
        .controller("dataTableCtrl", function($scope) {
            $scope.topics = {};
            $scope.report = {};
            $scope.hasExamples = function(entry) {
                if (!(entry.examples instanceof Array)) {
                    //console.log("Examples: "+entry.examples+" Length: "+ entry.examples.length);
                    return entry.examples.length > 0;
                }
                return false;
            };
            $scope.getLink = function(example) {
                return example.split("||")[1];
            };
            reportUpdateListeners.push(function(data) {
                $scope.topics = data.topics.topics;
                $scope.report = data.topics.report;
                $scope.$apply();
            });

        });

var treeLoader = function(reportData) {
    $("#treeMapContainer").html("");//clear the tree
    //tree map
    var w = $('.container').width(),
            h = 800 - 180,
            x = d3.scale.linear().range([0, w]),
            y = d3.scale.linear().range([0, h]),
            color = d3.scale.category20c(),
            root,
            node;

    var treemap = d3.layout.treemap()
            .round(false)
            .size([w, h])
            .sticky(true)
            .value(function(d) {
                return d.size;
            });

    var svg = d3.select("#treeMapContainer").append("div")
            .attr("class", "chart")
            .style("width", w + "px")
            .style("height", h + "px")
            .append("svg:svg")
            .attr("width", w)
            .attr("height", h)
            .append("svg:g")
            .attr("transform", "translate(.5,.5)");

    function size(d) {
        return d.size;
    }

    function count(d) {
        return 1;
    }

    function zoom(d) {
        var kx = w / d.dx, ky = h / d.dy;
        x.domain([d.x, d.x + d.dx]);
        y.domain([d.y, d.y + d.dy]);

        var t = svg.selectAll("g.cell").transition()
                .duration(d3.event.altKey ? 7500 : 750)
                .attr("transform", function(d) {
                    return "translate(" + x(d.x) + "," + y(d.y) + ")";
                });

        t.select("rect")
                .attr("width", function(d) {
                    return kx * d.dx - 1;
                })
                .attr("height", function(d) {
                    return ky * d.dy - 1;
                });

        t.select("text")
                .attr("x", function(d) {
                    return kx * d.dx / 2;
                })
                .attr("y", function(d) {
                    return ky * d.dy / 2;
                })
                .style("opacity", function(d) {
                    return kx * d.dx > d.w ? 1 : 0;
                });

        node = d;
        d3.event.stopPropagation();
    }

    var convertToTreeData = function(topics) {
        var top = {"name": "Words", "children": []};
        for (var i in topics) {
            var topic = {"name": topics[i].topic, "children": []};
            for (var j in topics[i].words) {
                topic.children.push({
                    'name': topics[i].words[j].word,
                    'size': Math.floor(topics[i].words[j].weight * topics[i].weight)
                });
            }
            top.children.push(topic);
        }
        return top;
    };

    node = root = convertToTreeData(reportData.topics.words);

    var nodes = treemap.nodes(root).filter(function(d) {
        //console.log(d);
        return !d.children;
    });

    var cell = svg.selectAll("g")
            .data(nodes)
            .enter().append("svg:g")
            .attr("class", "cell")
            .attr("transform", function(d) {
                return "translate(" + d.x + "," + d.y + ")";
            })
            .on("click", function(d) {
                return zoom(node === d.parent ? root : d.parent);
            });

    cell.append("svg:rect")
            .attr("width", function(d) {
                return d.dx - 1;
            })
            .attr("height", function(d) {
                return d.dy - 1;
            })
            .style("fill", function(d) {
                return color(d.parent.name);
            });

    cell.append("svg:text")
            .attr("x", function(d) {
                return d.dx / 2;
            })
            .attr("y", function(d) {
                return d.dy / 2;
            })
            .attr("dy", ".35em")
            .attr("text-anchor", "middle")
            .text(function(d) {
                return d.name;
            })
            .style("opacity", function(d) {
                d.w = this.getComputedTextLength();
                return d.dx > d.w ? 1 : 0;
            });

    d3.select(window).on("click", function() {
        zoom(root);
    });

    d3.select("select").on("change", function() {
        treemap.value(this.value === "size" ? size : count).nodes(root);
        zoom(node);
    });


};

reportUpdateListeners.push(treeLoader);
$(function() {
    $('#treeMapBtn').click(function() {
        var top = $('#treeMapContainer').offset().top;
        
        $('#treeMapContainer').stop().animate({
            'top': top > 0 ? -1000 : 70
        }, 500);
    });
});