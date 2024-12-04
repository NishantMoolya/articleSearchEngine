const fs = require('fs')

// generate next Id
const generateId = (articles) => {
    if (fs.existsSync('articles.json')) {
      const data = fs.readFileSync('articles.json', 'utf8');
      articles = JSON.parse(data);
      nextId = articles.length ? articles[articles.length - 1].id + 1 : 1;
      return nextId;
    }
    return 1;
  };

  // Path for the tag cache file
const tagCacheFilePath = "tagCache.json";
const combinedCacheFilePath = 'combinedCache.json';

  // Create an in-memory tag cache
const tagCache = new Map();
const combinedCache = new Map();

// Load the `tagCache` from a file once at startup
const initializeTagCache = () => {
  if (fs.existsSync(tagCacheFilePath)) {
    const rawData = fs.readFileSync(tagCacheFilePath, "utf-8");
    const tagCacheObject = JSON.parse(rawData);

    // Populate the Map from the loaded Object
    Object.entries(tagCacheObject).forEach(([key, value]) => {
      tagCache.set(key, value);
    });
    console.log("Tag cache loaded from file.");
  } else {
    console.log("No existing tag cache found. Starting fresh.");
  }

  if (fs.existsSync(combinedCacheFilePath)) {
    const rawData = fs.readFileSync(combinedCacheFilePath, 'utf-8');
    const combinedCacheObject = JSON.parse(rawData);
    Object.entries(combinedCacheObject).forEach(([key, value]) => {
      combinedCache.set(key, value);
    });
    console.log('Combined cache loaded from file.');
  } else {
    console.log('No existing combined cache found. Starting fresh.');
  }
};

// Save the `tagCache` back to the file when updates occur
const saveCachesToFile = () => {
  const tagCacheObject = Object.fromEntries(tagCache); // Convert Map to Object
  fs.writeFileSync(tagCacheFilePath, JSON.stringify(tagCacheObject, null, 2));

  const combinedCacheObject = Object.fromEntries(combinedCache);
  fs.writeFileSync(combinedCacheFilePath, JSON.stringify(combinedCacheObject, null, 2));

  console.log('Caches saved to file.');
};

// Add an article to the cache
const addArticleToCache = (article) => {
  article.tags.forEach((tag) => {
    const tagKey = tag.toLowerCase();

    if (!tagCache.has(tagKey)) {
      tagCache.set(tagKey, []);
    }
    tagCache.get(tagKey).push(article.id);
  });

  // Save cache after adding an article
  saveCachesToFile();
};

// Add article to the combined cache (title + content)
const addArticleToCombinedCache = (article) => {
  // Combine the title and content into one text field (normalized for case-insensitive search)
  const combinedText = (article.title + ' ' + article.content).toLowerCase();

  // Add the article ID to the cache for the combined text
  if (!combinedCache.has(combinedText)) {
    combinedCache.set(combinedText, []);
  }
  combinedCache.get(combinedText).push(article.id);

  // Save combined cache after adding an article
  saveCachesToFile();
};

// Search for articles by tags
const searchArticlesByTags = (tags) => {
  const matchingArticleIds = new Set();

  tags.forEach((tag) => {
    const tagKey = tag.toLowerCase();
    if (tagCache.has(tagKey)) {
      tagCache.get(tagKey).forEach((id) => matchingArticleIds.add(id));
    }
  });

  return Array.from(matchingArticleIds);
};

// Search articles by combined title and content
const searchArticlesByCombinedText = (searchText) => {
  const searchKey = searchText.toLowerCase();
  const matchingArticleIds = [];

  combinedCache.forEach((articleIds, combinedText) => {
    if (combinedText.includes(searchKey)) {
      matchingArticleIds.push(...articleIds);
    }
  });

  return matchingArticleIds;
};

// Initialize the tag cache at startup
initializeTagCache();

const sortArticlesByDate = (articles) => {
  return articles.sort((a, b) => new Date(b.date) - new Date(a.date)); // Descending order
};

module.exports = { generateId,addArticleToCache,searchArticlesByTags,sortArticlesByDate,addArticleToCombinedCache,searchArticlesByCombinedText }