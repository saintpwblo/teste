//importação do mongoose
const mongoose = require('mongoose')

//criação da coleção no banco
const Books = mongoose.model('Books', {
    name: {type: String, required: true}, 
    author: {type: String, required: true}, 
    description: {type: String, required: true}, 
    year: {type: String, required: true}, 
    page_number: {type: Number}, 
    cover: {type: String, required: true}
})

module.exports = Books
