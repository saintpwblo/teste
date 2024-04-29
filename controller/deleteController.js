const Books = require('../model/books')

const express = require('express')
const router = express.Router()

router.use(express.urlencoded({extended:true}))
router.use(express.json())

function deleteBookById(res, id){
    try {
        let result = Books.findByIdAndDelete(id)
        if(!result){
            res.status(404).json({message: 'Livro não encontrado.'})
        }
        res.status(200).json({message: 'Livro deletado com sucesso.', result})
    } catch (err) {
        res.status(500).json({message: err})
    }
}

module.exports = deleteBookById