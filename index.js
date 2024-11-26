const express = require('express')
const app = express()
var morgan = require('morgan')
const cors = require('cors')
require('dotenv').config()

app.use(cors())
app.use(express.json())
app.use(express.static('dist'))

const errorHandler = (error, request, response, next) => {
	console.error(error.message)

	if (error.name === 'CastError') {
		return response.status(400).send({ error: 'malformatted id' })
	}
	next(error)
}

const unknownEndpoint = (request, response) => {
	response.status(404).send({ error: 'unknown endpoint' })
}

morgan.token('body', (req) => JSON.stringify(req.body))
app.use(morgan(':method :url :status :res[content-length] - :response-time ms :body'))

const Person = require('./models/person')

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
	  Person.find({}).then(persons => {
      response.json(persons)
    })
  })

app.get('/api/persons/:id', (request, response, next) => {
    Person.findById(request.params.id)
    .then(person => {
      if (person) {
      response.json(person)
    } else {
      response.status(404).end()
    }})
    .catch(error => next(error))
})

app.delete('/api/persons/:id', (request, response) => {
  Person.findByIdAndDelete(request.params.id)
  .then(result => {
    response.status(204).end()
  })
  .catch(error => next(error))
})


app.post('/api/persons', (request, response) => {
  const body = request.body

  if (!body.name || !body.number) {
    return response.status(400).json({ error: 'name or number missing' })
  }

  const person = new Person({
    name: body.name,
    number: body.number,
  })

  person.save().then(savedPerson => {
    response.json(savedPerson)
  })
})

app.put('/api/persons/:id', (request, response, next) => {
	const body = request.body

	const person = {
		name: body.name,
		number: body.number,
	}

	Person.findByIdAndUpdate(request.params.id, person, { new: true })
	.then(updatedPerson => {
		response.json(updatedPerson)
	})
	.catch(error => next(error))
})

app.use(unknownEndpoint)
app.use(errorHandler)

const PORT = process.env.PORT
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`)
})
