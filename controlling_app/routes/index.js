      /* GET login page. */ 
      router.get('/login', function(req, res, next) { 
        res.render('login', { title: 'Login Page', message:
         req.flash('loginMessage') }); 
     }); 
