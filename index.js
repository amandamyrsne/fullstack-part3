const express = require('express')
const app = express()
const morgan = require("morgan");
const cors = require('cors')


let persons = [
    { 
      "id": 1,
      "name": "Arto Hellas", 
      "number": "040-123456"
    },
    { 
      "id": 2,
      "name": "Ada Lovelace", 
      "number": "39-44-5323523"
    },
    { 
      "id": 3,
      "name": "Dan Abramov", 
      "number": "12-43-234345"
    },
    { 
      "id": 4,
      "name": "Mary Poppendieck", 
      "number": "39-23-6423122"
    }
]

const requestLogger = (request, response, next) => {
  console.log('Method:', request.method)
  console.log('Path:  ', request.path)
  console.log('Body:  ', request.body)
  console.log('---')
  next()
}

app.use(express.json())

app.use(requestLogger)

app.use(cors())

app.use(express.static('build'))

morgan.token("data", (req, res) => {
  const { body } = req;

  return JSON.stringify(body);
});
app.use(morgan(':method :url :status :res[content-length] - :response-time ms :data'))

const generateId = () => {
  const id = Math.floor(Math.random() * Math.floor(1000000))    
  return id 
}

app.post('/api/persons', (request, response) => {
  const body = request.body

  if (!body.name || !body.number) {
    return response.status(400).json({ 
      error: 'missing name and/or number' 
    })
  }
  if (persons.includes(body.name)){
    return response.status(400).json({
      error: 'name must be unique'
    })
  }

  const person = {
    name: body.name,
    number: body.number,
    id: generateId(),
  }

  persons = persons.concat(person)

  response.json(person)
})
app.get('/api/persons', (request, response) => {
    response.json(persons)
  })
app.get('/info', (request, response) => {
    const info  = `<div> <p>Phonebook has info for ${persons.length} people</p></div>
      <p>${new Date().toString()}</p>`

    response.send(info)
  })
  app.get('/api/persons/:id', (request, response) => {
    const id = Number(request.params.id)
    const person = persons.find(person => person.id === id)
    
    if (person) {
      response.json(person)
    } else {
      response.status(404).end()
    }
  })
  app.delete('/api/persons/:id', (request, response) => {
    const id = Number(request.params.id)
    persons = persons.filter(person => person.id !== id)
    response.status(204).end()
  })

const PORT = process.env.PORT || 3001
app.listen(PORT)
console.log(`Server running on port ${PORT}`)