//configuração do ambiente, importando o arquivo .env, módulos express, mongoose e cors
require('dotenv').config()

const express = require('express')
const app = express()

const mongoose = require('mongoose')

const cors = require('cors')

app.use(cors())

//importando módulo que vai cuidar das rotas /books
const booksRoutes = require('./routes/homeRoutes')
app.use('/books', booksRoutes)

//indicando qual é o caminho das imagens
app.use('/storage', express.static('storage'))

// conexão com o mongodb, se der certo abre o app na porta especificada pelo .env
mongoose.connect(process.env.MONGODB_STRING)
.then(() => app.listen(parseInt(process.env.PORT), () => console.log('App rodando!')))
.catch((err) => console.log(err))