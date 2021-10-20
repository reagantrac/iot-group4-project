if (process.env.NODE_ENV !== 'production') {
  require('dotenv').config()
}

const express = require('express')
const app = express()
const bcrypt = require('bcrypt')
const passport = require('passport')
const flash = require('express-flash')
const session = require('cookie-session')
const db = require("./database")
const crypto = require("crypto")
const cookieParser = require('cookie-parser')

const initializePassport = require('./passport-config')
initializePassport(
  passport,
  email => users.find(user => user.email === email),
  id => users.find(user => user.id === id)
)

const users = []

app.set('view-engine', 'ejs')
app.set('trust proxy', 1)

app.use(cookieParser(process.env.SESSION_SECRET))
app.use(express.urlencoded({ extended: false }))
app.use(express.json());
app.use(flash())
app.use(session({
  name: 'session',
  keys: [process.env.SESSION_SECRET],
}))
app.use(passport.initialize())
app.use(passport.session())

app.use(express.static(__dirname + '/public/'));

//web page routes
app.get('/', (req, res) => {
    res.render('index.ejs');
})

app.get('/home', ifLoginState("logged_in"), (req, res) => {
    db.query(`SELECT * FROM dbo.rooms`)
    .then(result => res.render('home.ejs', {data: result}))
    .catch(err => res.sendStatus(500))
})

app.get('/login', ifLoginState("logged_out"), (req, res) => {
    res.render('login.ejs')
})

app.get('/info/:id', ifLoginState("logged_in"), (req, res) => {
    db.query(`SELECT * FROM dbo.rooms WHERE id = ${req.params.id}`)
    .then(result => res.render('info.ejs', {data: result[0]}))
    .catch(err => {if (err) res.redirect('/home')})
})

// device routes
app.get('/device/:id', (req,res) => {
    db.query(`SELECT * FROM dbo.rooms WHERE id = ${req.params.id}`)
    .then(result => res.send(result))
    .catch(err => {if (err) res.sendStatus(404)})
})

app.post('/device/:id', (req,res) => {
    if ("light_state" in req.body && "room_brightness" in req.body && "people" in req.body) {
        db.query(`UPDATE dbo.rooms 
        SET light_state = ${req.body.light_state}, room_brightness = ${req.body.room_brightness}, number_of_people = ${req.body.people}
        WHERE id = ${req.params.id}`)
        .catch(err=> console.log(err))
        .finally(() => {
            res.json({response: "OK"});
        })
    }
})

// rooms

app.post('/new', (req,res) => {
    id = parseInt(crypto.randomBytes(2).toString('hex'), 16)
    db.query(`INSERT INTO dbo.rooms (id, display_name, light_state, switch_state, room_brightness, light_brightness, number_of_people)
    VALUES ('${id}', '${req.body.roomName}', 0, 0, 0, 100, 0)`)
    .then(() => res.redirect('/home'))
    .catch(err => console.log(err))
})

// check login credentials
app.post('/login', passport.authenticate('local', {
    successRedirect: '/home',
  failureRedirect: '/login',
  failureFlash: true
}))

// register new user
app.post('/register', ifLoginState("logged_out"), (req, res) => {
    const hashedPassword = bcrypt.hashSync(req.body.password, 10)
    // db.query(`INSERT INTO dbo.users
    // VALUES `)
    // .then(() => res.redirect('/login'))
    // .catch(err => console.log(err))
    users.push({
      id: Date.now().toString(),
      name: req.body.name,
      email: req.body.email,
      password: hashedPassword
    })
    res.redirect('/login')
})

// log out user
app.post('/logout', ifLoginState("logged_in"), (req, res) => {
  req.logOut()
  res.redirect('/login')
})

app.post('/light-control/:id', ifLoginState("logged_in"), (req,res) => {
    db.query(`UPDATE dbo.rooms
    SET switch_state = ${req.body.lightSwitch}, light_brightness = ${req.body.brightness}, display_name = '${req.body.lightName}'
    WHERE id = ${req.params.id}`)
    .catch((err)=> {
        console.log(err)
    }).finally(() => {
        // db.query(`SELECT * FROM dbo.rooms WHERE id = ${req.params.id}`).then((result)=>{console.log(result)})
        res.sendStatus(200)
    })
    // WHERE id = ${req.body.id}`)
})

function ifLoginState(state) {
    return function(req, res, next) {
        if (state === "logged_in") {
            // if (req.isAuthenticated()) return next();
            // else return res.redirect('/login')
            return next()
        }
        else if (state === "logged_out") {
            if (!req.isAuthenticated()) return next();
            else return res.redirect('/home')
        }
        return res.redirect('/')
    }
}

app.listen(process.env.PORT || 3000)