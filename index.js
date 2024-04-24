//configuração do ambiente, importando o arquivo .env, express e mongoose
require('dotenv').config()
const express = require('express')
const app = express()
const mongoose = require('mongoose')

//configuração de middleware pra leitura de json
app.use(express.urlencoded({extended: true}))
app.use(express.json())

//importando módulo que vai cuidar das rotas /books
const booksRoutes = require('./routes/homeRoutes')
app.use('/books', booksRoutes)

app.use('/storage', express.static('storage'))

// conexão com o mongodb, se der certo abre o app na porta especificada pelo .env
mongoose.connect(process.env.MONGODB_STRING)
.then(() => app.listen(parseInt(process.env.PORT), () => console.log('App rodando!')))
.catch((err) => console.log(err))