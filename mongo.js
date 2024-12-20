const mongoose = require('mongoose')

if (process.argv.length<3) {
  console.log('give password as argument')
  process.exit(1)
}

const password = process.argv[2]
const name = process.argv[3]
const number = process.argv[4]

const DBname = 'personApp'

const url =
  `mongodb+srv://kwasnykarolina98:${password}@cluster0.7qr2n.mongodb.net/${DBname}?retryWrites=true&w=majority&appName=Cluster0`

mongoose.set('strictQuery',false)

mongoose.connect(url)

const noteSchema = new mongoose.Schema({
  name: String,
  number: String,
})

const Person = mongoose.model('Person', noteSchema)

if (process.argv.length > 5){
  console.log('The program takes:\n' +
  '`node mongo.js password` to list all of the contacts and\n' +
  '`node mongo.js password name number` to add a new contact.')
  process.exit(1)
}

if (process.argv.length<4) {
  console.log('phonebook:')
  Person.find({}).then(result => {
    result.forEach(person => {
      console.log(`${person.name} ${person.number}`)
    })
    mongoose.connection.close()
  })

}else if (process.argv.length === 5) {
  const person = new Person({
    name: `${name}`,
    number: `${number}`,
  })

  person.save().then(() => {
    console.log(`added ${name} number ${number} to phonebook`)
    mongoose.connection.close()
  })
}
