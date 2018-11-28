var cassandra = require('cassandra-driver');

var client = new cassandra.Client({contactPoints: [process.env.CASSANDRA_IP || 'cassandra']});
client.connect(function(err, result){
	console.log('countries: cassandra connected');
});


/*
 * GET users listing.
 */
exports.list = function(req, res){

	console.log('countries: list');
	client.execute('SELECT * FROM countries.countries',[], function(err, result){
		if(err){
			console.log('countries: list err:', err);
			res.status(404).send({msg: err});
		} else {
			console.log('countries: list success:', result.rows);
			res.render('countries', {page_title:"Countries - Node.js", data: result.rows})
		}
	});

};

exports.add = function(req, res){
  res.render('add_countries',{page_title:"Add Countries - Node.js"});
};

exports.edit = function(req, res){

    const country = req.params.country;


    console.log('countries: edit');

	client.execute("SELECT * from countries.countries WHERE country = " + "\'" + country + "\'",[],
		function(err, result){
		if(err){
			console.log('countries: edit err:', err);
			res.status(404).send({msg: err});
		} else {
			console.log('countries: edit success:');
			res.render('edit_countries',{page_title:"Edit Countries - Node.js", data: result.rows});
			console.log(result.rows);
		}
	});

};

/*Save the customer*/
exports.save = function(req,res){

    var input = JSON.parse(JSON.stringify(req.body));

	console.log('countries: save');

	client.execute(`INSERT INTO countries.countries (country, region, population) VALUES 
	('${input.country}', '${input.region}', '${input.population}')`,
		[], function(err, result){
		if(err){
			console.log('countries: add err:', err);
			res.status(404).send({msg: err});
		} else {
			console.log('countries: add success:');
			res.redirect('/countries');
		}
	});
};

exports.save_edit = function(req,res){

    var input = JSON.parse(JSON.stringify(req.body));
    var country = req.params.country;

	console.log('countries: save_edit');

	client.execute("UPDATE countries.countries set region = " + "\'" +
		input.region + "\'" + ", population = " + "\'" + input.population + "\'" +
		" WHERE country = " + "\'" + country + "\'",
		[], function(err, result){
		if(err){
			console.log('countries: save_edit err:', err);
			res.status(404).send({msg: err});
		} else {
			console.log('customers: save_edit success:');
			res.redirect('/countries');
		}
	});

};


exports.delete_country = function(req,res){

    var country = req.params.country;

	console.log('countries: delete');

	client.execute("DELETE FROM countries.countries WHERE country = " + "\'" + country + "\'",[],
		function(err, result){
		if(err){
			console.log('countries: delete err:', err);
			res.status(404).send({msg: err});
		} else {
			console.log('countries: delete success:');
			res.redirect('/countries');
		}
	});

};

exports.search_country = function (req, res) {
	var region = req.params.region;
	console.log('countries: search');
	client.execute(" SELECT * FROM countries.countries WHERE region LIKE" + "\'" + "\%" + region + "\%" + "\'",
	[], function (err, result) {
		if(err){
			console.log('countries: search error', err);
        } else {
			console.log('countries : delete success:', result.rows);
            res.render('countries', {page_title:"Region " + region + "- Node.js", data: result.rows})
        }
	});
};


