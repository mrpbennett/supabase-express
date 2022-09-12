// import {default as bodyParser} from 'body-parser'
import dotenv from 'dotenv'
import {default as cors, default as express} from 'express'
import Joi from 'joi'
import {supabase} from './utils/supabase.js'

// load in evniroment variables
dotenv.config()

const app = express()
const port = process.env.PORT || 8000

app.use(cors())
app.use(express.json())

const corsOptions = {
  origin: '*',
  methods: 'GET,PUT,PATCH,POST,DELETE',
  optionsSuccessStatus: 200,
}

// get all books
app.get('/api/get-all-books', cors(corsOptions), async (req, res) => {
  const {data, error} = await supabase.from('books-express').select('*')

  if (error) console.error(error)

  res.send(data)
})

// get book by ID
app.get('/api/get-book-by-id/:id', cors(corsOptions), async (req, res) => {
  const {data, error} = await supabase
    .from('books-express')
    .select('*')
    .eq('id', req.params.id)

  if (error)
    res
      .status(404)
      .send({message: `Book with ID ${req.params.id} was not found`})

  res.send(data)
})

// add a book
app.post('/api/add-book', cors(corsOptions), async (req, res) => {
  // book schema
  const schema = Joi.object({
    author: Joi.string().min(3).required(),
    title: Joi.string().min(3).required(),
    pagecount: Joi.number().integer().required(),
    isbn: Joi.string().required(),
  })

  const result = schema.validate(req.body)

  // check for validation if no validation return 400
  if (result.error) {
    res.status(400).send({message: `${result.error.details[0].message}`})
    return
  }

  const book = {
    author: req.body.author,
    title: req.body.title,
    pagecount: parseInt(req.body.pagecount),
    isbn: req.body.isbn,
  }

  // insert book object into supabase db
  const {data, error} = await supabase.from('books-express').insert(book)

  if (error)
    res
      .status(400)
      .send({message: `ERROR CODE: ${error.code}: ${error.message}`})

  // return valid book object back to client
  if (data) res.send(book)
})

app.listen(port, () => {
  console.log(`Server running on http://localhost:${port}`)
})
