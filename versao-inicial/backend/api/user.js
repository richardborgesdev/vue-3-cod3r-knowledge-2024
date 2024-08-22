const bcrypt = require('bcrypt-nodejs');

module.exports = app => {
  const apiValidation = app.api.validation;
  const encryptPassword = password => {
    const salt = bcrypt.genSaltSync(10);
    return bcrypt.hashSync(password, salt);
  }

  const save = async (req, res) => {
    const user = {
      ...req.body,
    };

    if (req.params.id) {
      user.id = req.params.id;
    }

    try {
      apiValidation.existsOrError(user.name, 'Nome não informado');
      apiValidation.existsOrError(user.email, 'E-mail não informado');
      apiValidation.existsOrError(user.senha, 'Senha não informado');
      apiValidation.existsOrError(user.confirmPassword, 'Confirmação de senha inválida');
      apiValidation.equalsOrError(user.senha, user.confirmPassword, 'Senhas não conferem');

      const userFromDB = await app.db('users')
        .where({ email: user.email })
        .first();

        if (!user.id) {
          apiValidation.notExistsOrError(userFromDB, 'Usuário já cadastrado');
        }

        if (user.id) {
          app.db('users')
            .update(user)
            .where({ id: user.id })
            .then(_ => res.status(204).send())
            .catch(err => res.status(500).send(err));
        } else {
          app.db('users')
          .insert(user)
          .then(_ => res.status(204).send())
          .catch(err => res.status(500).send(err));
        }
    } catch (error) {
      return res.status(400).send(error);
    }

    user.password = encryptPassword(user.password);
    delete user.confirmPassword;
  };

  const get = (req, res) => {
    app.db('users')
    .select('id', 'name', 'email', 'admin')
    .then(users => res.json(users))
    .catch(err => res.status(500).send(err));
  }

  const getById = (req, res) => {
    app.db('users')
    .select('id', 'name', 'email', 'admin')
    .where({ id: req.params.id })
    .first()
    .then(user => res.json(user))
    .catch(err => res.status(500).send(err));
  }

  return {
    save,
    get,
    getById,
  };
}
