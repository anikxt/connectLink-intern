import User from '../models/User.js';
import passport from 'passport';
import bcrypt from 'bcrypt';

const authController = () => {
  return {
    protected(req, res) {
      return res.status(200).send({
        success: true,
        message: 'You are authorized!',
      });
    },
    login(req, res) {
      res.render('auth/login');
    },
    async postLogin(req, res, next) {
      const { email, password } = req.body;
      // Validate request
      if (!email || !password) {
        req.flash('error', 'All fields are required');
        return res.redirect('/login');
      }
      passport.authenticate('local', (err, user, info) => {
        if (err) {
          req.flash('error', info.message);
          return next(err);
        }
        if (!user) {
          req.flash('error', info.message);
          return res.redirect('/login');
        }
        req.logIn(user, (err) => {
          if (err) {
            req.flash('error', info.message);
            return next(err);
          }

          return res.redirect('/');
        });
      })(req, res, next);
    },
    register(req, res) {
      res.render('auth/register');
    },
    async postRegister(req, res) {
      const { name, email, password } = req.body;
      // Validate request
      if (!name || !email || !password) {
        req.flash('error', 'All fields are required');
        req.flash('name', name);
        req.flash('email', email);
        return res.redirect('/register');
      }

      // Check if email exists
      const emailExists = await User.exists({ email: email });

      if (emailExists) {
        req.flash('error', 'Email already taken');
        req.flash('name', name);
        req.flash('email', email);
        return res.redirect('/register');
      } else {
        // Hashed password
        const hashedPassword = await bcrypt.hash(password, 10);

        // Create a User
        const user = new User({
          name,
          email,
          password: hashedPassword,
        });

        await user
          .save()
          .then(() => {
            // Login
            res.redirect('/');
          })
          .catch((err) => {
            req.flash('error', 'Something went wrong');
            return res.redirect('/register');
          });
      }
    },
    logout(req, res, next) {
      req.logout((err) => {
        if (err) {
          return next(err);
        }
        res.redirect('/login');
      });
    },
  };
};

export default authController;
