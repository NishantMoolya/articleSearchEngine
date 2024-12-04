const fs = require('fs')

// Load articles from persistence (optional)
const loadArticles = () => {
    if (fs.existsSync('articles.json')) {
      const data = fs.readFileSync('articles.json', 'utf8');
      articles = JSON.parse(data);
      return articles;
    }
    return [];
  };

  const saveArticle = (newArticle) => {
    let articles = [];
  
    // Load existing articles if the file exists
    if (fs.existsSync('articles.json')) {
      const data = fs.readFileSync('articles.json', 'utf8');
      articles = JSON.parse(data);
    }
  
    // Append the new article to the list
    articles.push(newArticle);
  
    // Save the updated articles list back to the file
    fs.writeFileSync('articles.json', JSON.stringify(articles, null, 2));
  };

  module.exports = { loadArticles,saveArticle }