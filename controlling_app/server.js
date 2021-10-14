if (process.env.NODE_ENV !== 'production') {
  require('dotenv').config()
}

const express = require('express')
const app = express()
const bcrypt = require('bcrypt')
const passport = require('passport')
const flash = require('express-flash')
const session = require('express-session')
// const methodOverride = require('method-override')

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
// app.use(methodOverride('_method'))

app.use(express.static(__dirname + '/public/'));

app.get('/', (req, res) => {
    res.render('index.ejs');
})

// app.get('/home', ifLoginState("logged_in"), (req, res) => {
//   res.render('home.ejs', { name: req.user.name })
// })

app.get('/home', (req, res) => {
  res.render('home.ejs')
})


app.get('/login', ifLoginState("logged_out"), (req, res) => {
  res.render('login.ejs')
})

app.get('/info', ifLoginState("logged_in"), (req, res) => {
  res.render('info.ejs')
})


app.post('/login', ifLoginState("logged_out"), passport.authenticate('local', {
  successRedirect: '/home',
  failureRedirect: '/login',
  failureFlash: true
}))

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

app.post('/logout', (req, res) => {
  req.logOut()
  res.redirect('/login')
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