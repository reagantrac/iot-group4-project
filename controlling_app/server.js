if (process.env.NODE_ENV !== 'production') {
  require('dotenv').config()
}

const express = require('express')
const app = express()
const bcrypt = require('bcrypt')
const passport = require('passport')
const flash = require('express-flash')
const session = require('express-session')
const db = require("./database")

const initializePassport = require('./passport-config')
initializePassport(
  passport,
  email => users.find(user => user.email === email),
  id => users.find(user => user.id === id)
)

const users = []

app.set('view-engine', 'ejs')
app.use(express.urlencoded({ extended: false }))
app.use(flash())
app.use(session({
  secret: process.env.SESSION_SECRET,
  resave: false,
  saveUninitialized: false
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
    .catch(err => console.log(err))
    
})

app.get('/login', ifLoginState("logged_out"), (req, res) => {
  res.render('login.ejs')
})

app.get('/info', ifLoginState("logged_in"), (req, res) => {
  res.render('info.ejs')
})

// check login credentials
app.post('/login', ifLoginState("logged_out"), passport.authenticate('local', {
  successRedirect: '/home',
  failureRedirect: '/login',
  failureFlash: true
}))

// register new user
app.post('/register', ifLoginState("logged_out"), (req, res) => {
    const hashedPassword = bcrypt.hashSync(req.body.password, 10)
    users.push({
      id: Date.now().toString(),
      name: req.body.name,
      email: req.body.email,
      password: hashedPassword
    })
    res.redirect('/login')
})

// log out user
app.post('/logout', (req, res) => {
  req.logOut()
  res.redirect('/login')
})

app.post('/light-mode', (req,res) => {
    // console.log()
    // db.query(`SELECT * FROM dbo.rooms`).then((result)=>{console.log(result)})
    db.query(`UPDATE dbo.rooms
    SET switch_state = ${req.body.lightSwitch}, light_brightness = ${req.body.brightness}
    WHERE id = 1`)
    .then(()=>{
        res.redirect('/info')
    }).catch((err)=> {
        console.log(err)
    })
    // WHERE id = ${req.body.id}`)
})

function ifLoginState(state) {
    return function(req, res, next) {
        if (state === "logged_in") {
            if (req.isAuthenticated()) return next();
            else return res.redirect('/login')
        }
        else if (state === "logged_out") {
            if (!req.isAuthenticated()) return next();
            else return res.redirect('/home')
        }
        return res.redirect('/')
    }
}

app.listen(3000)