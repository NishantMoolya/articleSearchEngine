const express = require('express')
const { postArticle, getArticleById, searchArticle, searchArticleByDate, searchArticleByContent } = require('../controllers/articlesController')

const articlesRouter = express.Router()

articlesRouter.get('/search/tags', searchArticle)
articlesRouter.get('/search/latest', searchArticleByDate)
articlesRouter.get('/search', searchArticleByContent)
articlesRouter.get('/:id', getArticleById)
articlesRouter.post('/', postArticle)

module.exports = articlesRouter