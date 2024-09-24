module.exports = app => {
  const { existsOrError, notExistsOrError } = app.api.validation;

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
}
