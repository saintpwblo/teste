//importação do path e do modelo da coleção do banco
const Books = require('../model/books')
const path = require('path')

//BUSCAR IMAGEM DO LIVRO
exports.getBookCover = async(req, res) =>{
    const id = req.params.id
    try {
        let book = await Books.findOne({_id: id}, {cover: 1, _id: 0})

        if(!book) return res.status(404).json({message: 'Imagem não encontrada.'})
        res.status(200).sendFile(path.join(__dirname + '/../' + book.cover))
    } catch (err) {
        res.status(500).json({message: err})
    }
}

//INSERIR OU ATUALIZAR CAPA DO LIVRO
exports.insertCover = async(req, res) =>{

    const fs = require('fs')
    const {promisify} = require('util')
    const unlink = promisify(fs.unlink)

    let id = req.params.id
    let cover = req.file.path
    try {
        let book = await Books.findById(id)
        
        if(!book.cover) await Books.findByIdAndUpdate(id, {cover: cover})
        await Promise.all([unlink(path.join(__dirname + '/../' + book.cover)), Books.findByIdAndUpdate(id, {cover: cover})])

        res.status(201).json({message: "200"})
    } catch (err) {
        res.status(500).json({message: err})
    }
}

