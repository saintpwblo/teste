//modelo da coleção que usamos no mongodb
const Books = require('../model/books')



//BUSCAR LIVROS
exports.getBooks = async (req, res) =>{
    try {
        res.status(200).json(await Books.find())
    } catch (err) {
        res.status(500).json({message: err})
    }
}

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

exports.getBookById = async(req, res) => {
    let id = req.params.id
    try {
        let result = Books.findById(id)
        if(!result) return res.status(404).json({message:'Livro não encontrado'})
        res.status(200).json(result)
    } catch (err) {
        res.status(500).json({message: err})
    }
}

//INSERIR LIVRO
exports.insertBook = async(req, res) => {
    let {name, author, description, year, page_number} = req.body
    try {
        
        if(!name || !author || !description || !year || !page_number) return res.status(422).json({message: "Todos os campos são obrigatórios."})

        if(year.length!=4){
            res.status(422).json({message: "Ano de publicação é inválido."})
            return
        }
        let createdBook = await Books.create({name, author, description, year, page_number})

        res.status(201).json({message: "Livro inserido com sucesso.", result: createdBook})
        
    } catch (err) {
        res.status(500).json({message: err})
    }
}

//INSERIR OU ATUALIZAR CAPA DO LIVRO
exports.insertCover = async(req, res) =>{
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
}

//ATUALIZAR LIVRO
exports.updateBook = async(req, res) =>{

}

//DELETAR LIVRO
exports.deleteBook = async(req, res) =>{
    let id = req.params.id

    try {
        let result = await Books.findByIdAndDelete(id)
        if(!result) return res.status(404).json({message: 'Livro não encontrado.'})

        res.status(200).json({message: 'Livro deletado com sucesso.', result})
    } catch (err) {
        res.status(500).json({message: err})
    }
    

}