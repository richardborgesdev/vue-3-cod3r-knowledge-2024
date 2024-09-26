module.exports = app => {
  const { existsOrError } = app.api.validation;

  const save = (req, res) => {
    const article = { ...req.body };

    if (req.params.id) {
      article.id = req.params.id;
    }

    try {
      existsOrError(article.name, 'Nome não informado');
      existsOrError(article.description, 'Descrição não informada');
      existsOrError(article.categoryId, 'Categoria não informada');
      existsOrError(article.userId, 'Autor não informada');
      existsOrError(article.content, 'Conteúdo não informado');
    } catch (error) {
      res.status(400).send(error);
    }

    if (article.id) {
      app.db('articles')
        .update(article)
        .where({ id: article.id })
        .then(_ => res.status(204).send())
        .catch(err => res.status(500).send(err));
    } else {
      app.db('articles')
        .insert(article)
        .then(_ => res.status(204).send())
        .catch(err => res.status(500).send(err));
    }
  }

  const remove = async (req, res) => {
    try {
      const rowsDeleted = await app.db('articles')
        .where({ id: req.params.id }).del();

      try {
        existsOrError(rowsDeleted, 'Artigo não encontrado');
      } catch (error) {
        return res.status(400).send(error);
      }

      res.status(204).send();
    } catch (error) {
      res.status(500).send(error);
    }
  }

  const limit = 10;
  const get = async (req, res) => {
    const page = req.query.page || 1;

    const result = await app.db('articles').count('id').first();
    const count = parseInt(result.count);

    app.db('articles')
      .select('id', 'name', 'description')
      .limit(limit).offset(page * limit - limit)
      .then(articles => res.json({ data: articles, count, limit }))
      .catch(err => res.status(500).send(err));
  }

  const getById = (req, res) => {
    app.db('articles')
      .where({ id: req.params.id })
      .first()
      .then(article => {
        article.content = article.content.toString();

        return res.json(article);
      })
      .catch(err => res.status(500).send(err));
  }

  return {
    save,
    remove,
    get,
    getById,
  }
}
