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

const validateSchema = request => {
  // book schema
  const schema = Joi.object({
    author: Joi.string().min(3).required(),
    title: Joi.string().min(3).required(),
    pagecount: Joi.number().integer().required(),
    isbn: Joi.string().required(),
  })

  return schema.validate(request)
}

// get all books
app.get('/api/get-all-books', cors(corsOptions), async (req, res) => {
  const {data, error} = await supabase.from('books-express').select('*')

  if (error) return res.status(400).json({message: 'Error getting all books'})

  if (data) return res.json(data)
})

// get book by ID
app.get('/api/get-book/:id', cors(corsOptions), async (req, res) => {
  const {data, error} = await supabase
    .from('books-express')
    .select('*')
    .match({id: req.params.id})

  if (error || data.length === 0) {
    return res
      .status(404)
      .json({message: `ERROR: No book found with ID ${req.params.id}`})
  }

  if (data) return res.json(data)
})

// add a book
app.post('/api/add-book', cors(corsOptions), async (req, res) => {
  // check for validation against book schema
  const {error} = validateSchema(req.body)

  // check for validation if no validation return 400
  if (error) {
    return res.status(400).json({message: `${error.details[0].message}`})
  }

  // insert book object into supabase db
  const {data} = await supabase.from('books-express').insert([
    {
      author: req.body.author,
      title: req.body.title,
      pagecount: parseInt(req.body.pagecount),
      isbn: req.body.isbn,
    },
  ])

  // return valid book object back to client
  if (data) res.json(data)
})

// modify a book entry
app.put('/api/mod-book/:id', cors(corsOptions), async (req, res) => {
  // check for validation against book schema
  const {error} = validateSchema(req.body)

  // check for validation if no validation return 400
  if (error) {
    return res.status(400).json({message: `${error.details[0].message}`})
  }

  const {data} = await supabase
    .from('books-express')
    .update({
      author: req.body.author,
      title: req.body.title,
      pagecount: parseInt(req.body.pagecount),
      isbn: req.body.isbn,
    })
    .match({id: req.params.id})

  if (data) return res.json(data)
})

// delete a book from the database
app.delete('/api/delete-book/:id', cors(corsOptions), async (req, res) => {
  const {data, error} = await supabase
    .from('books-express')
    .delete()
    .match({id: req.params.id})

  if (error || data.length === 0) {
    return res
      .status(400)
      .json({message: `ERROR: No book found with ID ${req.params.id}`})
  }

  if (data)
    return res.json({
      message: `Book ID ${req.params.id} has been deleted from the database`,
    })
})

app.listen(port, () => {
  console.log(`Express books is now running on http://localhost:${port}`)
})
