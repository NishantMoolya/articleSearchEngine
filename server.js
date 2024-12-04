const express = require('express')
const cors = require('cors')
const articlesRouter = require('./routers/articlesRouter')

const app = express()

const port = process.env.PORT || 8000

app.use(cors())
app.use(express.json())
app.use(express.urlencoded({ extended:false }))

app.use('/v1/api/articles', articlesRouter)

app.listen(port,() => console.log("server started at port",port))