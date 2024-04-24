const express = require('express')
const router = express.Router()

//destino de upload das imagens
const multer = require('multer')
const upload = multer({dest: '/storage/books'})

//modelo da coleção que usamos no mongodb
const Books = require('../model/books')

//middlewares
router.use(express.urlencoded({extended: true}))
router.use(express.json())

//ROTAS
//buscar todos
router.get('/', async (req, res) =>{
    try {
        res.status(200).json(await Books.find())   
    } catch (err) {
        res.status(500).json({message: err})
    }
})

//buscar pelo nome
router.get('/searchname/:name', async (req, res) =>{
        let name = req.params.name
    try {
        let resultQuery = await Books.find({name: { $regex: new RegExp(name, 'i')}})

        if(!resultQuery){
            res.status(404).json({message: "Livro não encontrado."})
            return
        } 

        res.status(200).json(resultQuery)
    } catch (err) {
        res.status(500).json({message: err})
    }
})

//buscar pelo id
router.get('/searchid/:id', async (req, res) =>{
    let id = req.params.id
    try {
        let resultQuery = await Books.findOne({_id: id})
        
        if(!resultQuery){
            res.status(422).json({message: "Livro não encontrado."})
            return
        } 

        res.status(200).json(resultQuery)
    } catch (err) {
        res.status(500).json({message: err})
    }
    
})

//inserir livro
router.post('/', async (req, res) =>{
    let {name, author, description, year, page_number} = req.body
    try {
        
        if(!name || !author || !description || !year || !page_number) 
        {
            res.status(422).json({message: "Todos os campos são obrigatórios."})
            return
        }

        if(year.length!=4){
            res.status(422).json({message: "Ano de publicação é inválido."})
            return
        }

        let book = {name, author, description, year, page_number}
        let createdBook = await Books.create(book)

        res.status(201).json({message: "Livro inserido com sucesso.", result: createdBook})
        
    } catch (err) {
        res.status(500).json({message: err})
    }
})

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
//obs: usar todos os campos, mesmo que não vá mudar algum deles
router.put('/:id', async (req, res) =>{
    let id = req.params.id
    let {name, author, description, year, page_number} = req.body
    let book = {name, author, description, year, page_number}
    
    try{
        
        if(year!=undefined && year.length!=4){
            res.status(422).json({message: "Ano de publicação é inválido."})
            return
        }

        let updatedBook = await Books.updateOne({_id: id}, book)
        if (updatedBook.matchedCount===0){
            res.status(404).json({message: "Livro não encontrado."})
            return
        } 

        res.status(200).json({message: "Livro atualizado com sucesso.", result: updatedBook})
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: err })
    }
})

//deletar livro
router.delete('/:id', async(req, res) =>{
    
    let id = req.params.id
    try {
        let deletedBook = await Books.findByIdAndDelete(id)
        if (!deletedBook) {
            res.status(422).json({ message: 'Livro não encontrado.' })
            return
        }

        res.status(200).json({ message: 'Livro removido com sucesso.', result: deletedBook })
    } catch (err) {
        res.status(500).json({message: err})
    }
})

module.exports = router