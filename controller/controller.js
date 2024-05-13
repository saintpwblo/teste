//modelo da coleção que usamos no mongodb
const Books = require('../model/books')


//BUSCAR LIVROS
exports.getBooks = async (_, res) =>{
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
    const {name, author, description, year, page_number, cover} = req.body
    
    try {
        
        //se o ano digitado tiver mais ou menos caracteres que 4, também retorna 422 
        if(year.length!=4) return res.status(422).json({message: "Ano de publicação é inválido."})
        
        //armazena valores no banco e retorna sucesso
        let createdBook = await Books.create({name, author, description, year, page_number, cover})
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
    let {name, author, description, year, page_number, cover} = req.body
    let book = {name, author, description, year, page_number, cover}
    
    try{
        //similar à verificação de ano no POST, com diferença que é checado se o ano foi realmente mudado
        if(year!=undefined && year.length!=4) return res.status(422).json({message: "Ano de publicação é inválido."})
        
        //tenta atualizar o livro, se nenhum livro foi atualizado, retorna 404 (não encontrado)
        let updatedBook = await Books.updateOne({_id: id}, book)
        if (updatedBook.matchedCount===0) return res.status(404).json({message: "Livro não encontrado."})
            
        //livro foi encontrado e atualizado
        res.status(200).json({message: "Livro atualizado com sucesso.", result: await Books.findById(id)})
    } catch (err) {
        res.status(500).json({ message: err.message })
    }
}

//DELETAR LIVRO
exports.deleteBook = async(req, res) =>{
    //delete feito a partir do id do livro passado na url
    let id = req.params.id

    
    try {
        //usa o id para procurar o livro
        let book = await Books.findById(id)

        //se não encontrar, retorna 404
        if(!book) return res.status(404).json({message: 'Livro não encontrado.'})
        await Books.findByIdAndDelete(id)
        
        //livro foi encontrado e deletado
        res.status(200).json({message: 'Livro deletado com sucesso.', result: book})
    } catch (err) {
        res.status(500).json({message: err.message})
    }
}