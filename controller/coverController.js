//importação do path e do modelo da coleção do banco
const Books = require('../model/books')
const path = require('path')

//BUSCAR IMAGEM DO LIVRO
exports.getBookCover = async(req, res) =>{
    //get é feito a partir do id do livro passado na url
    const id = req.params.id
    try {
        //procura apenas a imagem a partir do id
        let book = await Books.findOne({_id: id}, {cover: 1, _id: 0})
        //se não encontrar livro, retorna 404
        if(!book) return res.status(404).json({message: 'Livro não encontrado.'}) 
        //se livro for encontrado mas não tiver capa, retorna 200
        else if (!book.cover) return res.status(200).json({message: 'Livro encontrado não tem capa.'})
        //se encontrar, retorna como arquivo a imagem, usando o caminho absoluto até a pasta das imagens
        res.status(200).sendFile(path.join(process.cwd(), book.cover))
    } catch (err) {
        res.status(500).json({message: err.message})
    }
}

//INSERIR OU ATUALIZAR CAPA DO LIVRO
exports.insertCover = async(req, res) =>{ 
    //chama os pacotes necessários para atualizar uma imagem da api (caso tenha)
    //além de transformar o método fs.unlink em um baseado em promessa
    const fs = require('fs')
    const {promisify} = require('util')
    const unlink = promisify(fs.unlink)

    //usa o id passado na url e o caminho até a imagem
    let id = req.params.id
    let cover = req.file.path
    try {
        //busca livro pelo id
        let book = await Books.findById(id)

        //se o livro não for encontrado, retorna 404
        if(!book) return res.status(404).json({message: 'Livro não encontrado.'})
        //se o livro for encontrado e não tiver capa, apenas insere no banco como o caminho até a imagem
        else if(!book.cover) await Books.findByIdAndUpdate(id, {cover: cover})
        //se o livro for encontrado e tiver capa, exclui a imagem anterior da pasta da api e atualiza com a nova (no banco também)
        else await Promise.all([unlink(path.join(process.cwd(), book.cover)), Books.findByIdAndUpdate(id, {cover: cover})])

        res.status(200).json({message: "Imagem atualizada com sucesso."})
    } catch (err) {
        res.status(500).json({message: err.message})
    }
}

