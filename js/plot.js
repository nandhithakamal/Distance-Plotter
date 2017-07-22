var temp = 4;
var year = 2012;
var dataSet = [];
/*var data = [{
	"year": (year).toString(),
	"value": temp++
}, {
	"year": (year++).toString(),
	"value": temp++
}, {
	"year": (year++).toString(),
	"value": temp++
}, {
	"year": (year++).toString(),
	"value": temp++
}, {
	"year": (year++).toString(),
	"value": temp++
}, {
	"year": (year++).toString(),
	"value": temp--
}, {
	"year": (year++).toString(),
	"value": temp--
}, {
	"year": (year++).toString(),
	"value": -0.254
}, {
	"year": (year++).toString(),
	"value": 0.47
}, {
	"year": (year++).toString(),
	"value": 0.445
}, {
	"year": (year++).toString(),
	"value": 0.47
}];
console.log(data);*/

$.ajax({
	type: 'POST',
	contentType: 'application/json',
	//dataType: "json",
	url: "http://localhost:8090/fetch",
	crossDomain: false,
	success: function(input){
		dataSet = input;
		alert(JSON.stringify(input));
		var chart = AmCharts.makeChart("chartdiv", {
			"type": "serial",
			"categoryField": "time",
			"theme": "light",
			"marginTop":0,
			"marginRight": 80,
			"dataProvider": dataSet,
			"valueAxes": [{
				"axisAlpha": 0,
				"position": "left"
			}],
			"graphs": [{
				"id":"g1",
				"balloonText": "[[category]]<br><b><span style='font-size:14px;'>[[value]]</span></b>",
				"bullet": "round",
				"bulletSize": 8,
				"lineColor": "#d1655d",
				"lineThickness": 2,
				"negativeLineColor": "#637bb6",
				"type": "smoothedLine",
				"valueField": "value"
			}],
			"chartScrollbar": {
				"graph":"g1",
				"gridAlpha":0,
				"color":"#888888",
				"scrollbarHeight":55,
				"backgroundAlpha":0,
				"selectedBackgroundAlpha":0.1,
				"selectedBackgroundColor":"#888888",
				"graphFillAlpha":0,
				"autoGridCount":true,
				"selectedGraphFillAlpha":0,
				"graphLineAlpha":0.2,
				"graphLineColor":"#c2c2c2",
				"selectedGraphLineColor":"#888888",
				"selectedGraphLineAlpha":1

			},
			"chartCursor": {
				//"categoryBalloonDateFormat": "JJ:NN:SS:QQQ",
				"cursorAlpha": 0,
				"valueLineEnabled":true,
				"valueLineBalloonEnabled":true,
				"valueLineAlpha":0.5,
				"fullWidth":true
			},
			"dataDateFormat": "JJ:NN:SS.QQQ",
			"categoryAxis": {
				"minPeriod": "JJ:NN:SS.QQQ",
				"parseDates": false,
				"minorGridAlpha": 0.1,
				"minorGridEnabled": true
			},
			"export": {
				"enabled": true
			}
		});

			chart.addListener("rendered", zoomChart);
			if(chart.zoomChart){
				chart.zoomChart();
			}

			function zoomChart(){
				chart.zoomToIndexes(Math.round(chart.dataProvider.length * 0.4), Math.round(chart.dataProvider.length * 0.55));
			}

	},
	error: function(error){
		alert("There is some error!");
	},
	processData: false
});
