//modelo da coleção que usamos no mongodb
const Books = require('../model/books')


//BUSCAR LIVROS
exports.getBooks = async (req, res) =>{
    try {
        res.status(200).json(await Books.find())
    } catch (err) {
        res.status(500).json({message: err.message})
    }
}

//BUSCAR LIVROS PELO NOME
exports.getBookByName = async(req, res) =>{
    let name = req.params.name
    try {
        let result = await Books.find({name: {$regex: new RegExp(name, 'i')}})

        if (!result) return res.status(404).json({ message: "Livro não encontrado." })
        res.status(200).json(result)
    } catch (err) {
        res.status(500).json({ message: err.message })
    }
}

//BUSCAR UM ÚNICO LIVRO PELO ID
exports.getBookById = async(req, res) => {
    let id = req.params.id
    try {
        let result = await Books.findById(id)
        if(!result) return res.status(404).json({message:'Livro não encontrado'})
        res.status(200).json(result)
    } catch (err) {
        res.status(500).json({message: err.message})
    }
}

//INSERIR LIVRO
exports.insertBook = async(req, res) => {
    let {name, author, description, year, page_number} = req.body
    try {
        
        if(!name || !author || !description || !year) return res.status(422).json({message: "Os campos name, author, description e year são obrigatórios."})

        if(year.length!=4) return res.status(422).json({message: "Ano de publicação é inválido."})
            
        let createdBook = await Books.create({name, author, description, year, page_number})

        res.status(201).json({message: "Livro inserido com sucesso.", result: createdBook})
        
    } catch (err) {
        res.status(500).json({message: err.message})
    }
}


//ATUALIZAR LIVRO
exports.updateBook = async(req, res) =>{
    let id = req.params.id
    let {name, author, description, year, page_number} = req.body
    let book = {name, author, description, year, page_number}
    
    try{
        
        if(year!=undefined && year.length!=4) return res.status(422).json({message: "Ano de publicação é inválido."})
            

        let updatedBook = await Books.updateOne({_id: id}, book)
        if (updatedBook.matchedCount===0)return res.status(404).json({message: "Livro não encontrado."})
            

        res.status(200).json({message: "Livro atualizado com sucesso.", result: updatedBook})
    } catch (err) {
        res.status(500).json({ message: err.message })
    }
}

//DELETAR LIVRO
exports.deleteBook = async(req, res) =>{
    let id = req.params.id

    const path = require('path')
    const fs = require('fs')
    const {promisify} = require('util')
    const unlink = promisify(fs.unlink)

    try {
        let book = await Books.findById(id)

        if(!book) return res.status(404).json({message: 'Livro não encontrado.'})
        else if(!book.cover) await Books.findByIdAndDelete(id)
        else await Promise.all([unlink(path.join(process.cwd(), book.cover)), Books.findByIdAndDelete(id)])

        res.status(200).json({message: 'Livro deletado com sucesso.'})
    } catch (err) {
        res.status(500).json({message: err.message})
    }
}