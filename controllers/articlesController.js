const { saveArticle, loadArticles } = require("../db/methods");
const { generateId, addArticleToCache, searchArticlesByTags, sortArticlesByDate, searchArticlesByCombinedText } = require("../helpers/articlesHelper");

const postArticle = async (req, res) => {
    try {
        const { title, content, tags } = req.body;

        if (!title || !content) {
            return res.status(400).json({ data: null, error: 'Title and content are required.', msg: "insufficient data" });
        }

        const article = {
            id: generateId(),
            title,
            content,
            tags: tags || [],
            createdAt: new Date()
        };

        saveArticle(article);
        addArticleToCache(article);
        res.status(201).json({ data: article, error: null, msg: "article posted successfully" });
    } catch (error) {
        console.error('An error occurred:', error);
        res.status(500).json({ data: null, error: "server errorr", msg: "error in posting article" });
    }
};

const getArticleById = async (req, res) => {
    try {
        const { id } = req.params;
        const articles = loadArticles();
        const article = articles.find(article => article.id === parseInt(id, 10));
      
        if (!article) {
          return res.status(404).json({ data: null, msg: "Article not found.",error: 'Article not found.' });
        }
      
        res.status(200).json({ data: article, error: null, msg: "article found successfully" });
    } catch (error) {
        console.error('An error occurred:', error);
        res.status(500).json({ data: null, error: "server error", msg: "server error in getting article" });
    }
};

const searchArticle = async (req, res) => {
    try {
        const { tags } = req.body;
        const articles = loadArticles();
        const resultIds = searchArticlesByTags(tags);
        const searchData = resultIds.map(id => articles.find(article => article.id === id));
        res.status(200).json({ data: searchData, error: null, msg: "article searched successfully" });
    } catch (error) {
        console.error('An error occurred:', error);
        res.status(500).json({ data: null, error: "server error", msg: "server error in searching article" });
    }
};

const searchArticleByContent = async (req, res) => {
    try {
        const { tags } = req.body;
        const articles = loadArticles();
        const resultIds = searchArticlesByCombinedText(tags);
        const searchData = resultIds.map(id => articles.find(article => article.id === id));
        res.status(200).json({ data: searchData, error: null, msg: "article searched successfully" });
    } catch (error) {
        console.error('An error occurred:', error);
        res.status(500).json({ data: null, error: "server error", msg: "server error in searching article" });
    }
};

const searchArticleByDate = async (req, res) => {
    try {
        const articles = loadArticles();
        const searchData = sortArticlesByDate(articles);
        res.status(200).json({ data: searchData, error: null, msg: "article searched successfully" });
    } catch (error) {
        console.error('An error occurred:', error);
        res.status(500).json({ data: null, error: "server error", msg: "server error in searching article" });
    }
};


module.exports = { postArticle, getArticleById, searchArticle, searchArticleByDate, searchArticleByContent }