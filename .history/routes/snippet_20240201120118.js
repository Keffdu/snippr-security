const router = require('express').Router();
const authorize = require('../middleware/authorize');
const {encrypt, decrypt} = require('../utils/encrypt');

// array to store snippets
const snippets = require('./seedData.json')

// generate a unique ID for each cupcake
let id = snippets.length

// create a new snippet
router.post('/', authorize, (req, res) => {
  const { language, code } = req.body

  // basic validation
  if (!language || !code) {
    return res
      .status(400)
      .json({ error: 'A language and code are required fields' })
  }

  const snippet = {
    id: ++id,
    language,
    code
  }

  snippets.push({...snippet, code: encrypt(code)});
  res.status(201).json(snippet)
})

// get all snippets
router.get('/', authorize, (req, res) => {

  console.log(snippets)

  const { language } = req.query

  const decodedCode = snippets.map(snippet => ({
    ...snippet,
    code: decrypt(snippet.code)
  }))
  if (language) {
    const filteredCode = decodedCode.filter(
      snippet => snippet.language.toLowerCase() === language.toLowerCase()
    )
    return res.json(filteredCode)
  }

  res.json(decodedCode)
})

// get a snippet by ID
router.get('/:id', authorize, (req, res) => {
  const snippetId = parseInt(req.params.id)
  let snippet = snippets.find(snippet => snippet.id === snippetId)
  
  if (!snippet) {
    return res.status(404).json({ error: 'code snippet not found' })
  }

  snippet = {...snippet, 'code': decrypt(snippet.code)}
  res.json(snippet)
})

module.exports = router;