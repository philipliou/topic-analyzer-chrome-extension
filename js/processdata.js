function chartData() {
  this.title = {};
  this.chart = {};
  this.subtitle = {};
  this.xAxis = {
    tickmarkPlacement: 'on',
    title: {
      enabled: false
    }
  };
  this.yAxis = {
    title: {}
  };
  this.tooltip = {
    pointFormat: '<span style="color:{series.color}">{series.name}</span>: <b>{point.percentage:.1f}%</b> ({point.y:,.0f} millions)<br/>',
    shared: true
  };
  
  this.setTitle = function(title) {
    this.title.text = title;
  },

  this.setChartType = function(type) {
    this.chart.type = type;
  },

  this.setSubtitle = function(text) {
    this.subtitle.text = text;
  }

  // set x-axis labels
  this.setXAxisCategories = function(category_array) {
    this.xAxis.categories = category_array;
  }

  this.setYAxis = function(title) {
    this.yAxis.title.text = title;
  }

  this.setPlotOptions = function(plotOptionsObj) {
    this.plotOptions = plotOptionsObj;
  }

  // set y-values
  // each object = {
  //   name: "topic1",
  //   data: percentage,
  // }
  this.setSeries = function(objArray) {
    this.series = objArray;
  }
}