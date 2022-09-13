# Supabase Express Books

I wanted to learn a little about [express.js](https://expressjs.com/) I
generally use [FastAPI](https://fastapi.tiangolo.com/) for all my API needs. But
I thought I would give Express a go. There was a little bit of a learning curve
as things as handled slightly differently in express. Having said that I did
enjoy using it. Especially with modules just as [Joi](https://joi.dev/) for easy
of use validation and of course [Supabase](https://supabase.com/) for all my
lovely database needs.

## The Endpoints

```
/api/get-all-books
```

A Simple endpoint that retrieves all the books from the database

```
/api/get-book-by-id/:id
```

This endpoint allows the user to get a books data back by its id. This is made
easy by allowing the user to pass a param into the url via `:id`

```
/api/add-book
```

This endpoint allows a user to add a book into the database, the book object
only requires four datapoints which consist of:

- Author
- Title
- Page count
- ISBN

```
/api/mod-book/:id
```

This endpoint allows for the user to modify a book entry

```
/api/delete-book/:id
```

This endpoint allows the user to delete a book from the database via an ID

## ToDo:

- [x] Add a `PUT` endpoint to allow for modification of entries.
- [x] Add better error handling
