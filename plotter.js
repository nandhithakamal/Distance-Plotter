var Serialport = require('serialport');
var mysql = require('mysql');
var express = require('express');

var app = express();
var root = process.cwd();

app.get('/', function(req, res){
    res.sendFile("home.html", {root});
});
app.get('/graph', function(req, res){
    res.sendFile("graph.html", {root});
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

function getCurrentTime(){
    var now = new Date();
    var date = now.getFullYear()+'-'+(now.getMonth()+1)+'-'+now.getDate();
    var time = now.getHours() + ":" + now.getMinutes() + ":" + now.getSeconds();
    var dateTime = (date+' '+time).toString();
    return dateTime;

}

function insertIntoDb(){
    var sql = "INSERT INTO inputdata (time, distance) VALUES ( now(2), " + distance + ");";
    con.query(sql, function (err, result) {
        if (err) throw err;
        //console.log("1 record inserted");
    });
}

con.connect(function(err){
    if (err) throw err;
    else{
        console.log("Connected to database!");
        connected = true;
    }
});

sp.on('data', function(data) {
    //time = getCurrentTime();
    distance = parseInt(data.toString('utf8'));
    console.log(data.toString());
    if (connected){
        if(!isNaN(distance))
            insertIntoDb();
    }
});
