var cassandra = require('cassandra-driver');

var client = new cassandra.Client({contactPoints: [process.env.CASSANDRA_IP || 'cassandra']});

/*
 * GET home page.
 */

exports.init_cassandra = function(req, res){

	client.connect()
		.then(function () {
			const query = "CREATE KEYSPACE IF NOT EXISTS countries WITH replication =" +
			  "{'class': 'SimpleStrategy', 'replication_factor': '1' }";
			return client.execute(query);
		})
		.then(function () {
			const query = "create table if not exists countries.countries (country varchar primary key, " +
				"region varchar, population varchar, area varchar, population_density varchar, " +
				"coastline varchar, net_migration varchar, infant_mortality varchar, gdp varchar," +
				" literacy varchar, phones varchar, arable varchar, crops varchar, other varchar, " +
				"climate varchar, birthrate varchar, deathrate varchar, agriculture varchar," +
				" industry varchar, service varchar);";
			return client.execute(query);
		})
		.then(function () {
			return client.metadata.getTable('countries', 'countries');
		})
		.then(function (table) {
			console.log('Table information');
			console.log('- Name: %s', table.name);
			console.log('- Columns:', table.columns);
			console.log('- Partition keys:', table.partitionKeys);
			console.log('- Clustering keys:', table.clusteringKeys);
		})
		.then(function () {
			console.log('Read cluster info');
			var str = '{"hosts": [';
			var i = 0;
			client.hosts.forEach(function (host) {
				i++;
	  			str += '{"address" : "' + host.address + '", "version" : "' + host.cassandraVersion + '", "rack" : "' + host.rack + '", "datacenter" : "' + host.datacenter + '"}';
	  			console.log("hosts.length: " + client.hosts.length);
				if (i < client.hosts.length)
					str += ',';

			});
			str += ']}';
			console.log('JSON string: ' + str);
			var jsonHosts = JSON.parse(str);
			res.render('cassandra', {page_title:"Cassandra Details", data: jsonHosts.hosts});
			console.log('initCassandra: success');
		})
		.catch(function (err) {
			console.error('There was an error', err);
			res.status(404).send({msg: err});
			return client.shutdown();
		});

};