var Serialport = require('serialport');
var mysql = require('mysql');
var express = require('express');
var bodyParser = require('body-parser');

var app = express();
var root = process.cwd();
var dataFromTable = [];
app.use(bodyParser.urlencoded({ extended: true }));
app.use("/js",express.static("js"));

app.get('/', function(req, res){
    res.sendFile("home.html", {root});
});
app.get('/graph', function(req, res){
    res.sendFile("graph.html", {root});
});
app.post('/fetch', function(req, res){
    var sqlQuery = "select * from inputdata order by time desc limit 10";
    con.query(sqlQuery, function (err, result, fields) {
        if (err) throw err;
        var numberOfRows = result.length;
        var row = 0;
        var temp = 1013;
        var yearArr = result[row]["time"];
        console.log(yearArr.toString());

        while(row < numberOfRows){
            var dateTime = result[row]["time"];
            console.log(dateTime);
            var millisecond = dateTime.getMilliseconds();
            var second = dateTime.getSeconds();
            var minute = dateTime.getMinutes();
            var hour = dateTime.getHours();
            var year = dateTime.getYear();
            var month = dateTime.getMonth();
            var date = dateTime.getDate();
            var time = hour + ":" + minute + ":" + second + "." + millisecond;
            console.log(time);
            dataFromTable[row] ={
                "time": time,
                "value": result[row]["distance"]
            };
            row++;
        }
    });
    res.send(dataFromTable);
});
app.listen(8090, function () {
  console.log('Distance Plotter on 8090');
});


var portName = 'COM3';
var distance = 0;
var time = 0;
var connected = false;

var sp = new Serialport(portName, {
    baudRate: 9600,
    dataBits: 8,
    parity: 'none',
    stopBits: 1,
    flowControl: false
});

var con = mysql.createConnection({
    host: 'localhost',
    user: "root",
    password: "",
    database: "ultrasonicReads"
});

function insertIntoDb(){
    var sql = "INSERT INTO inputdata VALUES ( now(2), " + distance + ");";
    con.query(sql, function (err, result) {
        if (err) throw err;
    });
}

con.connect(function(err){
    if (err) throw err;
    else{
        console.log("Connected to database!");
        connected = true;
    }
});

function fetchFromDb(){
    var sqlQuery = "select * from mq3data limit 10";
    con.query(sqlQuery, function (err, result, fields) {
        if (err) throw err;
        var numberOfRows = result.length;
        var row = 0;
        while(row < numberOfRows){
            dataFromTable[row] = {
                "time": result[row]["time"],
                "distance": result[row]["distance"]
            };
            console.log( dataFromTable[row]);
            row++;
        }
        return dataFromTable;
    });
}

sp.on('data', function(data) {
    distance = parseInt(data.toString('utf8'));
    console.log(data.toString());
    if (connected){
        if(!isNaN(distance))
            insertIntoDb();
    }
});
