//configuração do roteador
const express = require('express')
const router = express.Router()

//configuração do multer
const multer = require('multer')
const upload = multer({dest: 'storage/books'})

//controller da rota /books
const controller = require('../controller/controller')

//controller da rota /books/cover
const coverController = require('../controller/coverController')

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

//buscar imagem por id
router.get('/cover/:id', coverController.getBookCover)

//inserir imagem por id
router.put('/cover/:id', upload.single('book-cover'), coverController.insertCover)

//exportando rotas
module.exports = router