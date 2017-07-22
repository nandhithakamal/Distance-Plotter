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
    //var d = fetchFromDb();
    var sqlQuery = "select * from mq3data limit 10";
    con.query(sqlQuery, function (err, result, fields) {
        if (err) throw err;
        var numberOfRows = result.length;
        var row = 0;
        //console.log(numberOfRows);
        while(row < numberOfRows){
            dataFromTable[row] = {
                "year": result[row]["time"],
                "value": result[row]["alcoholvalue"]
            };
            console.log(dataFromTable[row]);
            row++;
        }
    });
    res.send(dataFromTable);
});
app.listen(8090, function () {
  console.log('Distance Plotter on 8090');
});


/*var portName = 'COM3';
var distance = 0;
var time = 0;
var connected = false;

var sp = new Serialport(portName, {
    baudRate: 9600,
    dataBits: 8,
    parity: 'none',
    stopBits: 1,
    flowControl: false
});*/

var con = mysql.createConnection({
    host: 'localhost',
    user: "root",
    password: "",
    database: "ultrasonicReads"
});
/*
function getCurrentTime(){
    var now = new Date();
    var date = now.getFullYear()+'-'+(now.getMonth()+1)+'-'+now.getDate();
    var time = now.getHours() + ":" + now.getMinutes() + ":" + now.getSeconds();
    var dateTime = (date+' '+time).toString();
    return dateTime;

}

function insertIntoDb(){
    var sql = "INSERT INTO mq3data VALUES ( now(2), " + distance + ");";
    con.query(sql, function (err, result) {
        if (err) throw err;
        //console.log("1 record inserted");
    });
}*/

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
        //console.log(numberOfRows);
        while(row < numberOfRows){
            dataFromTable[row] = {
                "time": result[row]["time"],
                "alcoholValue": result[row]["alcoholvalue"]
            };
            console.log( dataFromTable[row]);
            row++;
        }
        //console.log(dataFromTable);
        return dataFromTable;
    });
}

//fetchFromDb();
/*
sp.on('data', function(data) {
    //time = getCurrentTime();
    distance = parseInt(data.toString('utf8'));
    console.log(data.toString());
    if (connected){
        if(!isNaN(distance))
            insertIntoDb();
    }
});*/
