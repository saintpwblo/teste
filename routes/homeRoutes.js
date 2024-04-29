//configuração do roteador
const express = require('express')
const router = express.Router()

//destino de upload das imagens
const multer = require('multer')
const upload = multer({dest: 'storage/books'})

//modelo da coleção que usamos no mongodb
const Books = require('../model/books')

//middlewares
router.use(express.urlencoded({extended:true}))
router.use(express.json())

const controller = require('../controller/controller')

//ROTAS
//buscar todos
router.get('/', controller.getBooks)

// buscar pelo nome
router.get('/searchname/:name', controller.getBookByName)

//buscar pelo id
router.get('/searchid/:id', controller.getBookById)

//inserir livro
router.post('/', controller.insertBook)

//inserir imagem
router.put('/cover/:id', upload.single('book-cover'), async (req, res) =>{
    let id = req.params.id
    let cover = req.file.path
    try {
        const insertedCover = await Books.findByIdAndUpdate(id, {cover: cover}, {new: true})
        res.status(201).json({message: "200", result: insertedCover})
    } catch (err) {
        res.status(500).json({message: err})
    }
    
})

//atualizar livro
router.put('/:id', controller.updateBook)

//deletar livro
router.delete('/:id', controller.deleteBook)

module.exports = router