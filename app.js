
/**
 * Module dependencies.
 */

var express = require('express');
var routes = require('./routes');
var http = require('http');
var path = require('path');

//load countries route
var countries = require('./routes/countries');
//load cassandra route
var cassandrainfo = require('./routes/cassandrainfo');

var app = express();

var cassandra = require('cassandra-driver');

const client = new cassandra.Client({contactPoints: [process.env.CASSANDRA_IP || 'cassandra']});

// all environments
app.set('port', process.env.PORT || 3000);
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');
app.use(express.logger('dev'));
app.use(express.json());
app.use(express.urlencoded());
app.use(express.methodOverride());

app.use(express.static(path.join(__dirname, 'public')));

app.get('/', routes.index);
app.get('/cassandrainfo', cassandrainfo.init_cassandra);
app.get('/countries', countries.list);
app.get('/countries/add', countries.add);
app.post('/countries/add', countries.save);
app.get('/countries/delete/:country', countries.delete_country);
app.get('/countries/edit/:country', countries.edit);
app.post('/countries/edit/:country',countries.save_edit);
app.get('/countries/search/:region', countries.search_country);

app.use(app.router);

http.createServer(app).listen(app.get('port'), function(){
  console.log('Express server listening on port ' + app.get('port'));
});
