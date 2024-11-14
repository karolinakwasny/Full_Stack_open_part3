const express = require('express')
const app = express()
var morgan = require('morgan')

app.use(express.json())

morgan.token('body', (req) => JSON.stringify(req.body))
app.use(morgan(':method :url :status :res[content-length] - :response-time ms :body'))

let persons = [
    {
      "id": "1",
      "name": "Arto Hellas",
      "number": "040-123456"
    },
    {
      "id": "2",
      "name": "Ada Lovelace",
      "number": "39-44-5323523"
    },
    {
      "id": "3",
      "name": "Dan Abramov",
      "number": "12-43-234345"
    },
    {
      "id": "4",
      "name": "Mary Poppendieck",
      "number": "39-23-6423122"
    }
  ]

  app.get('/info', (request, response) => {
    const numberOfPersons = persons.length
    const currentDate = new Date().toString()
    response.send(`Phonebook has info for ${numberOfPersons} people <p>${currentDate}</p>`)
  })

  app.get('/api/persons', (request, response) => {
	response.json(persons)
  })

  app.get('/api/persons/:id', (request, response) => {
	const id = request.params.id
	const person = persons.find(person => person.id === id)
	if (person) {
		response.json(person)
	  } else {
		response.status(404).end()
	  }
  })

  app.delete('/api/persons/:id', (request, response) => {
    const id = request.params.id
    persons = persons.filter(person => person.id !== id)

    response.status(204).end()
  })

  const getRandomId = () => {
    let randomNumber
    do {
        randomNumber = Math.floor(Math.random() * 9999)
    } while (persons.some(person => person.id === randomNumber))
    return String(randomNumber)
  }

  app.post('/api/persons', (request, response) => {
    const body = request.body

	if (!body.name) {
		return response.status(400).json({
		  error: 'No name provided'
		})
	  }

	if (!body.number) {
		return response.status(400).json({
		  error: 'No number provided'
		})
	}
    const personName = persons.find(person => person.name === body.name)
    if (personName){
		return response.status(400).json({
		  error: 'Person with that name already exists'
		})
	  }

    person = {
      id: getRandomId(),
      name: body.name,
      number: body.number,
    }

    persons.concat.apply(person)
    response.json(person)
  })



  const PORT = 3001
  app.listen(PORT, () => {
	console.log(`Server running on port ${PORT}`)
  })
