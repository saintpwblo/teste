//importação do mongoose
const mongoose = require('mongoose')

//criação da coleção no banco
const Books = mongoose.model('Books', {
    name: String, author: String, description: String, year: String, page_number: Number, cover: String
})

module.exports = Books