const mongoose = require('mongoose')

if (process.argv.length<3) {
  console.log('give password as argument')
  process.exit(1)
}

const password = process.argv[2]

const url =
`mongodb+srv://fullstack:${password}@cluster0.9jjge.mongodb.net/phonebook?retryWrites=true&w=majority`
mongoose.connect(url)

const personSchema = new mongoose.Schema({
  name: String,
  number: String,
})

const Person = mongoose.model('Person', personSchema,)

const person = new Person({
    name: process.argv[3],
    number: process.argv[4],
    important: false,
})

if (person.important === false){
    person.save().then(result => {
        console.log(`added ${result.name} number ${result.number} to phonebook`)
        mongoose.connection.close()
      }) 
}
else{
    Person.find({}).then(result => {
        console.log('phonebook:')
        result.forEach(person => {
          console.log( person.name, person.number)
        })
        mongoose.connection.close()
    })
}