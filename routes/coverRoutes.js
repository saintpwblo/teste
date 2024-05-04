//configuração do roteador
const express = require('express')
const router = express.Router()

//configuração do multer
const multer = require('multer')
const upload = multer({dest: 'storage/books'})

//controller da rota /books/cover
const coverController = require('../controller/coverController')

//ROTAS
//buscar imagem por id
router.get('/:id', coverController.getBookCover)

//inserir imagem por id
router.put('/:id', upload.single('book-cover'), coverController.insertCover)

module.exports = router