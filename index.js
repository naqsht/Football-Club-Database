const express = require('express')
const path = require('path')
const PORT = process.env.PORT || 5000

const { Pool } = require('pg');
var pool;
pool = new Pool({
  connectionString: process.env.DATABASE_URL || 'postgres://postgres:@localhost/people'
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
    var getUsersQuery = "INSERT INTO ppl VALUES ('" + team + "','" + manager + "'," + sname + ","+ intyearf +"," + homestd +",'"+ league +"')";
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




app.listen(PORT, () => console.log(`Listening on ${ PORT }`))
