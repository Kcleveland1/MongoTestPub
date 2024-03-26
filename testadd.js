const { MongoClient } = require("mongodb");

// The uri string must be the connection string for the database (obtained on Atlas).
const uri = "mongodb+srv://kc:f6eI9luYdSPGEDcN@cluster0.rad2ou2.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0";

// --- This is the standard stuff to get it to work on the browser
const express = require('express');
//const cookieParser = require('cookie-parser');
const app = express();
const port = 3000;
app.listen(port);
console.log('Server started at http://localhost:' + port);

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
//app.use(cookieParser());

// routes will go here

// Default route.
// Provides a selection of routes to go to as links.
app.get('/', function(req, res) {
  var outstring = 'You did not send me anything';
  outstring += '<p><a href=\"./login\">Login</a>';
  outstring += '<p><a href=\"./api/register/:userID&:pass\">Register</a>';
  outstring += '<p><a href=\"./clearcookie/:cookiename\">Clear Cookies<a>';
  outstring += '<p><a href=\"./showcookie\">Show Cookies<a>';
  outstring += '<p><a href=\"./\">Default<a>';
  res.send(outstring);
});

app.get('/setcookie', function (req, res) {
  console.log('setcookie');
  res.cookie('login', '/login', {maxAge : 20000})
  res.cookie('register', '/api/register/:userID&:pass', {maxAge : 20000})
  res.cookie('say', '/say/:name', {maxAge : 20000})
  res.cookie('mongo', '/api/mongo/:item', {maxAge : 20000})
  res.cookie('mongo2', '/api/mongo2/:inpkey&:item', {maxAge : 20000});
  res.send('cookies set ');  // complete sending
  //T4 REF 1
  outstring += '<p><a href=\"./showcookie\">Show Cookies<a>';
  res.send(outstring);
});

app.get('/showcookie', function (req, res) {
  mycookies=req.cookies;
  res.send(mycookies); //Send the cookies
});
// T5 REF
app.get('/clearcookie/:cookiename', function (req, res) {
  res.clearCookie(req.params.cookiename); //Shortcut for setting expiration in the past
  var outstring ='Cookie deleted';
  outstring += '<p><a href=\"./showcookie\">Show Cookies<a>';
  outstring += '<p><a href=\"./\">Default<a>';
  res.send(outstring);

});

// Report cookies on console and browser
app.get('/report', function (req, res) {
  // Cookies that have not been signed
  console.log('Cookies: ', req.cookies);

  // Cookies that have been signed
  console.log('Signed Cookies: ', req.signedCookies);

  //Send the cookies report to the browser
  mycookies=req.cookies;
  res.send(JSON.stringify(mycookies) + " --Done reporting");
});

app.get('/login', function(req, res) {
  var outstring = 'Enter userID and password: ';
  //T4 REF 2
  outstring += '<p><a href=\"./showcookie\">Show Cookies<a>';
  res.send(outstring);
});
// T2 REF
app.get('/api/register/:userID&:pass', function(req, res) {
  var outstring = 'Enter desired userID and password: ';
  outstring += '<p><a href=\"./showcookie\">Show Cookies<a>';
  res.send(outstring);
console.log("PARAMS: userID: " + req.params.userID + " pass: " + req.params.pass);
  
const client = new MongoClient(uri);
  
  // The following is the document to insert (made up with input parameters) :
  // First I make a document object using static fields
const doc2insert = { 
  };
  // Additional fields using inputs:
    doc2insert[req.params.userID]=req.params.pass;
  
  console.log("Adding: " + doc2insert);

async function run() {
    try {
      const database = client.db('MyDBexample');
      const where2put = database.collection('MyLogs');
  
      const doit = await where2put.insertOne(doc2insert);
      console.log(doit);
      res.send('Got this: ' + JSON.stringify(doit));  //Use stringify to print a json
  
    } finally {
      // Ensures that the client will close when you finish/error
      await client.close();
    }
  }
  run().catch(console.dir);
});

app.get('/say/:name', function(req, res) {
  res.send('Hello ' + req.params.name + '!');
  outstring += '<p><a href=\"./showcookie\">Show Cookies<a>';
  res.send(outstring);
});
  
// Access Example-1
// Route to access database using a parameter:
// access as ...app.github.dev/api/mongo/9876
app.get('/api/mongo/:item', function(req, res) {
const client = new MongoClient(uri);
outstring += '<p><a href=\"./showcookie\">Show Cookies<a>';
  res.send(outstring);

async function run() {
  try {
    const database = client.db('MyDBexample');
    const parts = database.collection('MyStuff');

    // Here we make a search query where the key is hardwired to 'partID' 
    // and the value is picked from the input parameter that comes in the route
     const query = { partID: req.params.item };
     console.log("Looking for: " + query);

    const part = await parts.findOne(query);
    console.log(part);
    res.send('Found this: ' + JSON.stringify(part));  //Use stringify to print a json

  } finally {
    // Ensures that the client will close when you finish/error
    await client.close();
  }
}
run().catch(console.dir);
});

// Access Example-2
// Route to access database using two parameters:
app.get('/api/mongo2/:inpkey&:item', function(req, res) {
// access as ...app.github.dev/api/mongo2/partID&12345
console.log("inpkey: " + req.params.inpkey + " item: " + req.params.item);
outstring += '<p><a href=\"./showcookie\">Show Cookies<a>';
  res.send(outstring);

const client = new MongoClient(uri);

async function run() {
  try {
    const database = client.db('MyDBexample');
    const where2look = database.collection('MyStuff');

    // Here we will make a query object using the parameters provided with the route
    // as they key:value pairs
    const query = {};
    query[req.params.inpkey]= req.params.item;

    console.log("Looking for: " + JSON.stringify(query));

    const part = await where2look.findOne(query);
    console.log('Found this entry: ', part);
    res.send('Found this: ' + JSON.stringify(part));  //Use stringify to print a json

  } finally {
    // Ensures that the client will close when you finish/error
    await client.close();
  }
}
run().catch(console.dir);
});
