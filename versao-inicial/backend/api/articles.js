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

  const remove = async (req, res) => {
    try {
      const rowsDeleted = await app.db('articles')
        .where({ id: req.params.id }).del();
      notExistsOrError(rowsDeleted, 'Artigo não encontrado');

      res.status(204).send();
    } catch (error) {
      res.status(500).send(error);
    }
  }

  return {
    save,
    remove,
  }
}
