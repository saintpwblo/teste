//modelo da coleção que usamos no mongodb
const Books = require('../model/books')


//BUSCAR LIVROS
exports.getBooks = async (req, res) =>{
    try {
        //resposta em json: todos os livros da coleção
        res.status(200).json(await Books.find())
    } catch (err) {
        res.status(500).json({message: err.message})
    }
}

//BUSCAR LIVROS PELO NOME
exports.getBookByName = async(req, res) =>{
    //nome passado como parâmetro na url
    let name = req.params.name
    try {
        //procura os livros similares ao passado na url
        let result = await Books.find({name: {$regex: new RegExp(name, 'i')}})

        //se não encontrar nenhum, retorna 404
        if (!result) return res.status(404).json({ message: "Livro não encontrado." })
        res.status(200).json(result)
    } catch (err) {
        res.status(500).json({ message: err.message })
    }
}

//BUSCAR UM ÚNICO LIVRO PELO ID
exports.getBookById = async(req, res) => {
    //semelhante ao searchname, com a diferença que vai retornar um único livro e será pelo ID
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
    //desestrutura o corpo da requisição, atribuindo cada valor passado à uma variável
    const {name, author, description, year, page_number} = req.body
    
    try {
        // se algum dos campos (com excessão de page_number) for nulo, vai retornar 422 (dados inválidos)
        if(!name || !author || !description || !year) return res.status(422).json({message: "Os campos name, author, description e year são obrigatórios."})
        
        //se o ano digitado tiver mais ou menos caracteres que 4, também retorna 422 
        if(year.length!=4) return res.status(422).json({message: "Ano de publicação é inválido."})
        
        //armazena valores no banco e retorna sucesso
        let createdBook = await Books.create({name, author, description, year, page_number})
        res.status(201).json({message: "Livro inserido com sucesso.", result: createdBook})
        
    } catch (err) {
        res.status(500).json({message: err.message})
    }
}


//ATUALIZAR LIVRO
exports.updateBook = async(req, res) =>{
    //update feito a partir do id do livro passado na url
    let id = req.params.id
    //desestruturação do corpo e atribuição à uma nova variável
    let {name, author, description, year, page_number} = req.body
    let book = {name, author, description, year, page_number}
    
    try{
        //similar à verificação de ano no POST, com diferença que é checado se o ano foi realmente mudado
        if(year!=undefined && year.length!=4) return res.status(422).json({message: "Ano de publicação é inválido."})
        
        //tenta atualizar o livro, se nenhum livro foi atualizado, retorna 404 (não encontrado)
        let updatedBook = await Books.updateOne({_id: id}, book)
        if (updatedBook.matchedCount===0) return res.status(404).json({message: "Livro não encontrado."})
            
        //livro foi encontrado e atualizado
        res.status(200).json({message: "Livro atualizado com sucesso.", result: updatedBook})
    } catch (err) {
        res.status(500).json({ message: err.message })
    }
}

//DELETAR LIVRO
exports.deleteBook = async(req, res) =>{
    //delete feito a partir do id do livro passado na url
    let id = req.params.id

    //chama os pacotes necessários para excluir uma imagem da api (caso tenha)
    //além de transformar o método fs.unlink em um baseado em promessa
    const path = require('path')
    const fs = require('fs')
    const {promisify} = require('util')
    const unlink = promisify(fs.unlink)

    try {
        //usa o id para procurar o livro
        let book = await Books.findById(id)

        //se não encontrar, retorna 404
        if(!book) return res.status(404).json({message: 'Livro não encontrado.'})
        //se encontrar o livro e ele não tiver uma capa, apenas exclui ele normalmente do banco
        else if(!book.cover) await Books.findByIdAndDelete(id)
        //se encontrar o livro e ele tiver uma capa, usa o Promise.All([]) para excluir a imagem da pasta da api e excluir o livro do banco
        else await Promise.all([unlink(path.join(process.cwd(), book.cover)), Books.findByIdAndDelete(id)])
        
        //livro foi encontrado e deletado
        res.status(200).json({message: 'Livro deletado com sucesso.'})
    } catch (err) {
        res.status(500).json({message: err.message})
    }
}