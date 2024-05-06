//configuração do ambiente, importando o arquivo .env, módulos express, mongoose e cors
require('dotenv').config({path: './config/.env'})
const path = require('path')

const express = require('express')
const app = express()
const mongoose = require('mongoose')

const cors = require('cors')
app.use(cors())

//configuração dos middlewares
app.use(express.urlencoded({extended: true}))
app.use(express.json())

//importando módulo que vai cuidar das rotas /books
const booksRoutes = require('./routes/homeRoutes')
app.use('/books', booksRoutes)


//indicando qual é o caminho das imagens
app.use('/storage', express.static(path.join(process.cwd() + '/storage')))

//redirecionando para a rota principal
app.get('/', (_, res) => res.redirect('/books'))

// conexão com o mongodb, se der certo abre o app na porta especificada pelo .env
mongoose.connect(process.env.MONGODB_STRING)
.then(() => app.listen(parseInt(process.env.PORT), () => console.log('Rodando')))
.catch((err) => console.log(err))