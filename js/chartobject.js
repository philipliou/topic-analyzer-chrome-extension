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
        ,
        labels: {
            rotation: 0,
//            align: 'right',
//            verticalAlign: 'bottom',
            style: {
                fontSize: '11px',
                fontFamily: 'Verdana, sans-serif'
            },
            formatter: function() {
                return '<a href="#' + this.value + '">' + this.value + '</a>';
            },
            useHTML: true
        }
    };
    this.yAxis = {
        title: {
            text: 'Composition Percent'
        }
    };
    this.tooltip = {
        pointFormat: '<span style="color:{series.color}">{series.name}</span>: <b>{point.percentage:.1f}%</b><br/>',
        shared: false
    };
    this.legend = {
        // layout: 'horizontal', // default
        itemDistance: 800
    }

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