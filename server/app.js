var express = require( 'express' );
var app = express();
var path = require( 'path' );
var pg = require( 'pg' );
var bodyParser= require( 'body-parser' );
var urlencodedParser = bodyParser.urlencoded( {extended: true } );
var port = process.env.PORT || 8080;
//create a connection string to our database
var connectionString = 'postgres://localhost:5432/JAJADB';
// static folder
app.use( express.static( 'public' ) );

// spin up server
app.listen( port, function(){
  console.log( 'server up on', port );
});

// base url
app.get( '/', function( req, res ){
  console.log( 'base url hit' );
  res.sendFile( 'index.html' );
});

// add Empolyee
app.post( '/addEmployee', urlencodedParser, function( req, res ){
  console.log( 'addEmplyee route hit' );
  //cont to DB
  pg.connect( connectionString, function(err, client, done){
    if( err ){
      console.log(err);
    } else {
      console.log('connected to DB');
      // use wildcards to insert record
      client.query( 'INSERT INTO waitstaff (first_name, last_name, on_duty) VALUES ($1, $2, $3)',
                    [req.body.firstName, req.body.lastName, req.body.duty] );
      done();
      res.send('meow');
    } //end if else
  });// end connect
});

// add Dtables
app.post( '/addDtable', urlencodedParser, function( req, res ){
  console.log( 'addDtable route hit' );
  //cont to DB
  pg.connect( connectionString, function(err, client, done){
    if( err ){
      console.log(err);
    } else {
      console.log('connected to DB');
      // use wildcards to insert record
      client.query( 'INSERT INTO dtables(name, capacity, status) VALUES ($1, $2, $3)',
                    [req.body.name, req.body.capacity, req.body.status] );
      done();
      res.send('meow');
    } //end if else
  });// end connect
});


// get employees
app.get( '/allEmp', function( req, res ){
  console.log( 'allEmp route hit' );
  //connect to db
  pg.connect( connectionString, function( err, client, done){
    if(err){
      console.log(err);
    } else {
      console.log('connected to DB');
      var query = client.query( 'SELECT * FROM waitstaff' );
      //array for employees
      var allEmp = [];
      query.on( 'row', function( row ){
        allEmp.push (row);
      });
      query.on( 'end', function(){
        done();
        console.log( allEmp );

        res.send( allEmp );
      });
    } // end if else
  }); // end connect
}); // end app.get

// get dtables
app.get( '/allTable', function( req, res ){
  console.log( 'allTable route hit' );
  //connect to db
  pg.connect( connectionString, function( err, client, done){
    if(err){
      console.log(err);
    } else {
      console.log('connected to DB');
      var query = client.query( 'SELECT * FROM dtables' );
      //array for dtables
      var allTables = [];
      query.on( 'row', function( row ){
        allTables.push (row);
      });
      query.on( 'end', function(){
        done();
        console.log( allTables );

        res.send( allTables );
      });
    } // end if else
  }); // end connect
}); // end app.get
