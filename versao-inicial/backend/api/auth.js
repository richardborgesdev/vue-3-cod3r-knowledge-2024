const { authSecret } = require('./.env');
const jwt = require('jwt-simple');
const bcrypt = require('bcrypt-nodejs');

module.exports = app => {
  const signin = async (req, res) => {
    if (!req.body.email || !req.body.password) {
      return res.status(400).send('Informe usuário e senha!');
    }

    const user = await app.db('users')
      .where({ email: req.body.email })
      .firts();

    if (!user) {
      return res.status(400).send('Usuário não encontrado!');
    }

    const isMatch = bcrypt.compareSync(req.body.password, user.password);

    if (!isMatch) {
      return res.status(401).send('Email/Senha inválido');
    }

    const now = Math.floor(Date.now() / 1000);

    const payload = {
      id: user.id,
      name: user.name,
      email: user.email,
      admin: user.admin,
      iat: now, // issued at
      exp: now + (60 * 60 * 24 * 3),
    };

    res.json({
      ...payload,
      token: jwt.encode(payload, authSecret),
    });
  }

  const validateToken = async (req, res) => {
    const userData = req.body || body;

    try {
      if (userData) {
        const token = jwt.decode(userData.token, authSecret);

        if (new Date(token.exp * 1000) > new Date()) {
          return res.send(true);
        }
      }
    } catch (error) {
      // token problem
    }

    res.send(false);
  }

  return {
    signin,
    validateToken,
  }
}
