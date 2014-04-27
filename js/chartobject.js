function chartData() {
  this.title = {};
  this.chart = {};
  this.subtitle = {
    text: 'Source: Your Chrome Browswer History'
  };
  this.xAxis = {
    tickmarkPlacement: 'on',
    title: {
      enabled: false
    }
  };
  this.yAxis = {
    title: {
      text: 'Composition Percent'
    }
  };
  this.tooltip = {
    pointFormat: '<span style="color:{series.color}">{series.name}</span>: <b>{point.percentage:.1f}%</b><br/>',
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

  this.setSeries = function(objArray) {
    this.series = objArray;
  }
}