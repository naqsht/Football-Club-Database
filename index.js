const express = require('express')
const path = require('path')
const PORT = process.env.PORT || 5000

const { Pool } = require('pg');
var pool;
pool = new Pool({
  connectionString: process.env.DATABASE_URL || 'postgres://postgres:Terrano1819@localhost/fcdb'
});

var app = express()

app.use(express.json());
app.use(express.urlencoded({extended:false}));
app.use(express.static(path.join(__dirname, 'public')))
app.set('views', path.join(__dirname, 'views'))
app.set('view engine', 'ejs')
app.get('/', (req, res) => res.render('public/index.html'))

// POST request for /addclub
app.post('/addclub', (req,res)=>{
  console.log("post request for /addclub action");

  var team = req.body.team;
  var manager = req.body.manager;
  var sname = req.body.sname;
  var yearf = req.body.yearf;
  var homestd = req.body.homestd;
  var league = req.body.league;
  var country = req.body.country;
  var intyearf = 1*yearf;

  if (team && manager && sname && yearf && homestd && league && country){
    var getUsersQuery = "INSERT INTO clubs VALUES ('" + team + "','" + manager + "'," + sname + ","+ intyearf +"," + homestd +",'"+ league +"')";
    pool.query(getUsersQuery, (error, result) => {
      if (error) {
        res.render('pages/clubnotadded.ejs')
      }
      const results = { 'rows': (result) ? result.rows : null};
      res.render('pages/clubadded.ejs', results);
      res.end()
      });
  }

  else {
    res.render('pages/clubnotadded.ejs')
    res.end();
  }
});


// GET request for /display clubs
app.get('/displayclubs', async (req,res) => {
  try {
    console.log("get request for /displayclubs");
    const client = await pool.connect()
    const result = await client.query('SELECT * FROM clubs');
    const results = { 'rows': (result) ? result.rows : null};
    res.render('pages/db', results );
    client.release();
  } catch (err) {
    console.error(err);
    res.render('pages/notadded.ejs')
  }
});


// POST request for /deleteclub
app.post('/deleteclub', (req, res) => {
  console.log("post request for /deleteclub");
  var team = req.body.team;

  if(team)  {
    var getUsersQuery = `DELETE FROM clubs WHERE team = '${ team }'`;
    pool.query(getUsersQuery, (error, result) => {
      if (error) {
        res.render('pages/clubnotadded.ejs')
      }
      const results = { 'rows': (result) ? result.rows : null};
      res.render('pages/clubadded.ejs', results);
    });
  }
  else {
    res.render('pages/clubnotadded.ejs')
  }
});


// POST request for /updateclub
app.post('/updateclub',(req,res)=>{
  console.log("post request for /updateclub");
  var team = req.body.team;
  var manager = req.body.manager;
  var sname = req.body.sname;
  var yearf = req.body.yearf;
  var homestd = req.body.homestd;
  var league = req.body.league;
  var country = req.body.country;
  var intyearf = 1*yearf;

  
  if(team && manager && sname && yearf && homestd && league && country)  {
    var getUsersQuery = `UPDATE clubs SET manager= ${manager}, sname=${sname}, yearf=${intyearf}, homestd='${homestd}', league='${league}', country='${country}' WHERE team = '${team}'`;
    pool.query(getUsersQuery, (error, result) => {
      if (error) {
        res.render('pages/clubnotadded.ejs')
      }
      const results = { 'rows': (result) ? result.rows : null};
      res.render('pages/clubadded.ejs', results);
    });
  }
  else {
    res.render('pages/clubnotadded.ejs')
  }
});


// GET request id
app.get('/:id', (req,res) => {
  console.log(req.params.id);
  var getUsersQuery = `SELECT * FROM clubs WHERE team = '${req.params.id}'`;

  console.log(getUsersQuery);

  pool.query(getUsersQuery, (error, result) => {
    if (error) {
      res.render('pages/clubnotadded.ejs')
    }
    var results = {'rows': result.rows };
    console.log(result);
    res.render('pages/displayclubs', results)
  });
});



// POST request for /searchclub
app.post('/searchclub', (req, res) => {
  console.log("post request for /searchclub");
  var team = req.body.team;

  if(team)  {
    var getUsersQuery = `SELECT * FROM clubs WHERE team = '${team}'`;
    pool.query(getUsersQuery, (error, result) => {
      if (error) {
        res.render('pages/clubnotadded.ejs')
      }
      const results = { 'rows': (result) ? result.rows : null};
      res.render('pages/displayclubs.ejs', results);
    });
  }
  else {
    res.render('pages/clubnotadded.ejs')
  }
});







app.listen(PORT, () => console.log(`Listening on ${ PORT }`))
