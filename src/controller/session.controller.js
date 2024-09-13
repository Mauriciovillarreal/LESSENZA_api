const passport = require('passport');
const UserCurrentDto = require('../dto/userCurrent.dto');
const { usersModel } = require('../dao/MONGO/models/users.model');
const { productionLogger } = require('../utils/logger');

class SessionController {
  githubAuth = passport.authenticate('github', { scope: 'user:email' });

  githubCallback = (req, res, next) => {
    passport.authenticate('github', { failureRedirect: '/login' }, async (err, user) => {
      if (err) {
        console.error('Error en autenticación de GitHub:', err);
        return res.status(500).json({ message: 'Authentication error' });
      }
      if (!user) {
        console.log('GitHub callback: Usuario no encontrado');
        return res.redirect('/login');
      }

      req.logIn(user, async (err) => {
        if (err) {
          console.error('Error al iniciar sesión con GitHub:', err);
          return res.status(500).json({ message: 'Login error' });
        }
        // Actualizar la última conexión
        console.log(`Usuario ${user.email} autenticado con GitHub, actualizando última conexión`);
        user.last_connection = new Date();
        await user.save();

        req.session.user = user;
        return res.redirect('https://lessenza.onrender.com');
      });
    })(req, res, next);
  };

  getCurrentUser = async (req, res) => {
    console.log('Datos de la sesión:', req.session);  // Verifica los datos de la sesión
    if (req.isAuthenticated()) {
      console.log('Usuario autenticado:', req.user);
      const userDto = new UserCurrentDto(req.user);
      res.json({ user: userDto });
    } else {
      console.log('Usuario no autenticado');
      res.status(401).json({ error: 'Not authenticated' });
    }
  };

  login = (req, res, next) => {
    passport.authenticate('login', async (error, user, info) => {
      if (error) {
        console.error('Error durante el inicio de sesión:', error);
        return res.status(500).json({ error: 'Internal Server Error' });
      }
      if (!user) {
        console.log('Fallo de inicio de sesión: correo o contraseña incorrectos');
        return res.status(401).json({ error: 'Email or password incorrect' });
      }

      req.logIn(user, async (error) => {
        if (error) {
          console.error('Error al iniciar sesión al usuario:', error);
          return res.status(500).json({ error: 'Internal Server Error' });
        }

        console.log(`Usuario ${user.email} ha iniciado sesión. Actualizando última conexión.`);
        req.session.user = user;

        user.last_connection = new Date();
        await user.save();

        return res.status(200).json({
          message: 'Login successful',
          first_name: user.first_name,
          email: user.email,
          role: user.role,
          last_name: user.last_name,
          cart: user.cart,
        });
      });
    })(req, res, next);
  };

  register = (req, res, next) => {
    passport.authenticate('register', (error, user, info) => {
      if (error) {
        console.error('Error durante el registro:', error);
        return next(error);
      }
      if (!user) {
        console.log('Fallo al registrar usuario');
        return res.status(400).json({ message: 'Error registering user' });
      }

      req.logIn(user, (error) => {
        if (error) {
          console.error('Error al iniciar sesión tras registro:', error);
          return next(error);
        }
        console.log(`Usuario ${user.email} registrado y autenticado con éxito.`);
        return res.status(200).json({ success: true, message: 'User registered successfully' });
      });
    })(req, res, next);
  };

  logout = (req, res) => {
    console.log('Logout: req.session', req.session);
    console.log('Logout: req.user', req.user);
    if (req.isAuthenticated()) {
      const userId = req.user._id;
      console.log(`Logout: Cerrando sesión para el usuario con ID: ${userId}`);
      req.session.destroy(async (error) => {
        if (error) {
          console.error('Logout: Error al destruir la sesión', error);
          return res.status(500).json({ status: 'error', error: error.message });
        }
  
        console.log(`Logout: Sesión destruida exitosamente para el usuario con ID: ${userId}`);
        try {
          // Actualizamos la última conexión del usuario después de cerrar sesión
          await usersModel.findByIdAndUpdate(userId, { last_connection: new Date() });
          console.log(`Logout: Última conexión actualizada para el usuario con ID: ${userId}`);
        } catch (updateError) {
          console.error('Logout: Error al actualizar la última conexión', updateError);
          return res.status(500).json({ status: 'error', error: updateError.message });
        }
  
        return res.status(200).json({ status: 'success', message: 'Logout successful' });
      });
    } else {
      console.log('Logout: No hay usuario en la sesión');
      return res.status(200).json({ status: 'success', message: 'Logout successful' });
    }
  };

}

module.exports = new SessionController();
