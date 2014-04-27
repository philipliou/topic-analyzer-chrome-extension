var topicAnalysisClient = new TopicAnalysisService(function(){
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
}
var seriesArray = [
  {
      name: 'Asia',
      data: [502, 635, 809, 947, 1402, 3634, 5268]
  }, 
  {
      name: 'Africa',
      data: [106, 107, 111, 133, 221, 767, 1766]
  }, 
  {
      name: 'Europe',
      data: [163, 203, 276, 408, 547, 729, 628]
  }, 
  {
      name: 'America',
      data: [18, 31, 54, 156, 339, 818, 1201]
  }, 
  {
      name: 'Oceania',
      data: [2, 2, 2, 6, 13, 30, 46]
  }
]
var catArray = ['1750', '1800', '1850', '1900', '1950', '1999', '2050']

// Get report JSON from the server
topicAnalysisClient.getReport("",
  "",
  "",
  function(response, xhr){ console.log(response)}, 
  function(response, xhr){ console.log(response)}
)

var sampleData = {
  "topics": {
    "topics": {
      "1000043": "internet, web, computer, site, online, technology, company, software, information, service, mail, microsoft, sites, system, digital, companies, phone, computers, users",
      "others": "Other topics",
      "1000032": "body, author, tagline, end, life, book, story, class, info, man, world, writer, stories, death, writes, writing, lives, human, characters",
      "1000022": "world, history, years, war, century, great, early, time, america, made, ii, died, life, king, modern, society, country, culture, family",
      "1000024": "year, woods, golf, won, open, round, play, horse, win, williams, tour, today, club, match, tournament, shot, par, players, race",
      "1000010": "officials, today, president, made, meeting, week, members, time, decision, news, public, agreement, union, deal, plan, make, group, conference, report",
      "1000001": "house, street, home, room, water, small, open, place, floor, wall, city, building, light, glass, store, white, walls, feet, door",
      "1000020": "people, time, back, day, don, ve, good, days, didn, years, man, night, asked, things, told, lot, thought, thing, make",
      "1000030": "people, time, make, years, don, good, long, work, change, things, lot, ve, important, put, find, problem, making, part, big",
      "1000004": "court, law, state, case, federal, judge, legal, justice, lawyers, department, states, rights, lawyer, supreme, decision, cases, government, general, filed",
      "1000029": "set, style, review, sound, love, music, show, voice, sense, long, young, makes, high, made, black, play, song, white, pop"
    },
    "report": {
      "Friday": {
        "1000001": {
          "historyCount": 11,
          "totalScore": 1.0946972343439212
        },
        "1000004": {
          "historyCount": 10,
          "totalScore": 1.3412258520546136
        },
        "1000010": {
          "historyCount": 29,
          "totalScore": 3.9020501466338824
        },
        "1000020": {
          "historyCount": 17,
          "totalScore": 1.9772632461183788
        },
        "1000022": {
          "historyCount": 14,
          "totalScore": 1.1825639083184232
        },
        "1000024": {
          "historyCount": 11,
          "totalScore": 1.4474753185577227
        },
        "1000029": {
          "historyCount": 16,
          "totalScore": 1.8392095547116296
        },
        "1000030": {
          "historyCount": 25,
          "totalScore": 3.100426789245443
        },
        "1000032": {
          "historyCount": 7,
          "totalScore": 0.8909071565652638
        },
        "1000043": {
          "historyCount": 13,
          "totalScore": 1.7667091172805598
        },
        "others": {
          "historyCount": 92,
          "totalScore": 10.529852271857827
        }
      },
      "Monday": {
        "1000001": {
          "historyCount": 8,
          "totalScore": 1.2899967212122478
        },
        "1000004": {
          "historyCount": 9,
          "totalScore": 1.0488235572344415
        },
        "1000010": {
          "historyCount": 11,
          "totalScore": 1.1832226195009017
        },
        "1000020": {
          "historyCount": 8,
          "totalScore": 0.7737420198538495
        },
        "1000022": {
          "historyCount": 4,
          "totalScore": 0.3487866099207976
        },
        "1000024": {
          "historyCount": 5,
          "totalScore": 0.5305578378312934
        },
        "1000029": {
          "historyCount": 5,
          "totalScore": 0.45763036272875546
        },
        "1000030": {
          "historyCount": 11,
          "totalScore": 1.4144503485762492
        },
        "1000032": {
          "historyCount": 2,
          "totalScore": 0.24532220406938696
        },
        "1000043": {
          "historyCount": 5,
          "totalScore": 0.5267026943017395
        },
        "others": {
          "historyCount": 37,
          "totalScore": 4.078456030760132
        }
      },
      "Saturday": {
        "1000001": {
          "historyCount": 10,
          "totalScore": 0.8825523604158082
        },
        "1000004": {
          "historyCount": 13,
          "totalScore": 1.0867853224993953
        },
        "1000010": {
          "historyCount": 23,
          "totalScore": 2.461028931856302
        },
        "1000020": {
          "historyCount": 27,
          "totalScore": 3.8617668320300633
        },
        "1000022": {
          "historyCount": 2,
          "totalScore": 0.25810029491702013
        },
        "1000024": {
          "historyCount": 4,
          "totalScore": 0.4046348324656617
        },
        "1000029": {
          "historyCount": 35,
          "totalScore": 3.803311450160898
        },
        "1000030": {
          "historyCount": 27,
          "totalScore": 3.1521655037373155
        },
        "1000032": {
          "historyCount": 13,
          "totalScore": 1.0921788486501638
        },
        "1000043": {
          "historyCount": 26,
          "totalScore": 2.2403372168110627
        },
        "others": {
          "historyCount": 110,
          "totalScore": 11.733092255080187
        }
      },
      "Sunday": {
        "1000001": {
          "historyCount": 8,
          "totalScore": 0.8128163094782482
        },
        "1000004": {
          "historyCount": 5,
          "totalScore": 0.46847748824580887
        },
        "1000010": {
          "historyCount": 14,
          "totalScore": 1.2669791782876638
        },
        "1000020": {
          "historyCount": 13,
          "totalScore": 1.5531407161651354
        },
        "1000022": {
          "historyCount": 8,
          "totalScore": 0.5847781330737232
        },
        "1000024": {
          "historyCount": 3,
          "totalScore": 0.28010341346633755
        },
        "1000029": {
          "historyCount": 15,
          "totalScore": 1.742205149657671
        },
        "1000030": {
          "historyCount": 19,
          "totalScore": 2.2074139253140794
        },
        "1000032": {
          "historyCount": 8,
          "totalScore": 0.9716867428322328
        },
        "1000043": {
          "historyCount": 7,
          "totalScore": 0.6347872963506318
        },
        "others": {
          "historyCount": 35,
          "totalScore": 3.789791879033059
        }
      },
      "Thursday": {
        "1000001": {
          "historyCount": 7,
          "totalScore": 0.5765499004593071
        },
        "1000004": {
          "historyCount": 2,
          "totalScore": 0.2820293450558982
        },
        "1000010": {
          "historyCount": 17,
          "totalScore": 1.6689751384039229
        },
        "1000020": {
          "historyCount": 18,
          "totalScore": 2.134632755521081
        },
        "1000022": {
          "historyCount": 7,
          "totalScore": 0.755668922489361
        },
        "1000024": {
          "historyCount": 7,
          "totalScore": 0.5894919920341801
        },
        "1000029": {
          "historyCount": 17,
          "totalScore": 1.9373412123344425
        },
        "1000030": {
          "historyCount": 20,
          "totalScore": 2.958130543682431
        },
        "1000032": {
          "historyCount": 11,
          "totalScore": 1.0070923590518315
        },
        "1000043": {
          "historyCount": 11,
          "totalScore": 1.6308671379672661
        },
        "others": {
          "historyCount": 73,
          "totalScore": 7.777896681871972
        }
      },
      "Tuesday": {
        "1000001": {
          "historyCount": 2,
          "totalScore": 0.19309644840222923
        },
        "1000004": {
          "historyCount": 2,
          "totalScore": 0.2776624074239478
        },
        "1000010": {
          "historyCount": 10,
          "totalScore": 1.2314319028391731
        },
        "1000020": {
          "historyCount": 3,
          "totalScore": 0.2181211141398204
        },
        "1000022": {
          "historyCount": 2,
          "totalScore": 0.1883725249172495
        },
        "1000024": {
          "historyCount": 1,
          "totalScore": 0.10659344571205848
        },
        "1000029": {
          "historyCount": 5,
          "totalScore": 0.43278652744555896
        },
        "1000030": {
          "historyCount": 6,
          "totalScore": 0.7508030450039177
        },
        "1000032": {
          "historyCount": 1,
          "totalScore": 0.06329281190846255
        },
        "1000043": {
          "historyCount": 4,
          "totalScore": 0.4422503911031481
        },
        "others": {
          "historyCount": 34,
          "totalScore": 3.360416938194162
        }
      },
      "Wednesday": {
        "1000001": {
          "historyCount": 6,
          "totalScore": 0.5983242029433696
        },
        "1000004": {
          "historyCount": 3,
          "totalScore": 0.3072916899011431
        },
        "1000010": {
          "historyCount": 26,
          "totalScore": 3.6419673632357394
        },
        "1000020": {
          "historyCount": 15,
          "totalScore": 1.6333659571909946
        },
        "1000022": {
          "historyCount": 8,
          "totalScore": 0.7797593057191515
        },
        "1000024": {
          "historyCount": 13,
          "totalScore": 1.6780180093226738
        },
        "1000029": {
          "historyCount": 7,
          "totalScore": 0.6401071070720894
        },
        "1000030": {
          "historyCount": 21,
          "totalScore": 2.5173304490676953
        },
        "1000032": {
          "historyCount": 4,
          "totalScore": 0.3427095177335099
        },
        "1000043": {
          "historyCount": 6,
          "totalScore": 0.7549348578082066
        },
        "others": {
          "historyCount": 71,
          "totalScore": 8.509132587541595
        }
      }
    }
  }
}

// Convert returned json to chart object
function convertJsonToChartOBject(json) {
  var co = new chartData();
  co.setChartType('area');
  co.setTitle('Top 10 Topics in 7 Days');
  co.setPlotOptions(percentChartPlotOptions);

  // Get and set dates
  var report = json.topics.report;
  var xLabels = [];
  for (propt in report) {
    xLabels.push(propt)
  }
  co.setXAxisCategories(xLabels);

  var cd = [];
  for(var topicId in json.topics.topics){
     var obj  = {'name': json.topics.topics[topicId].split(",")[0]};
     obj.data = [];
     for(var grouping in json.topics.report){
        obj.data.push(json.topics.report[grouping][topicId].totalScore);
     }
     cd.push(obj);
  }

  co.setSeries(cd);
  return co;
}

// Display the chart on the extension
// Sets the chart object properties from the data
function displayPercentChart() {
  // co = new chartData();
  // Set dates
  // co.setXAxisCategories(catArray);
  
  // Set topics and percentages
  // co.setSeries(seriesArray);
  var co = convertJsonToChartOBject(sampleData);
  $('#container').highcharts(co);
}

// var chartData = [];
// for(var topicId in data.topics.topics){
//    var obj  = {'name': data.topics.topics[topicId]};
//    obj.data = [];

//    for(var grouping in data.topics.report){
//       obj.data.push(data.topics.report[grouping][topicId].totalScore);

//    }
//    chartData.push(obj);
// }

