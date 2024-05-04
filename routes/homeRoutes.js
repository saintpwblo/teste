//configuração do roteador
const express = require('express')
const router = express.Router()

//controller da rota /books
const controller = require('../controller/controller')

//arquivo que vai cuidar da rota de imagens, /books/cover
const coverRoutes = require('./coverRoutes')
router.use('/cover', coverRoutes)

//ROTAS
//buscar todos
router.get('/', controller.getBooks)

// buscar pelo nome
router.get('/searchname/:name', controller.getBookByName)

//buscar pelo id
router.get('/searchid/:id', controller.getBookById)

//inserir livro
router.post('/', controller.insertBook)

//atualizar livro
router.put('/:id', controller.updateBook)

//deletar livro
router.delete('/:id', controller.deleteBook)

//exportando rotas
module.exports = router