const router = require('express').Router();
const {encrypt, decrypt} = require('../utils/encrypt');
const { requiresAuth } = require('express-openid-connect')

// array to store snippets
const snippets = require('./seedData.json')

// generate a unique ID for each cupcake
let id = snippets.length

// create a new cupcake
router.post('/', requiresAuth(), (req, res) => {
  const { language, code } = req.body

  // basic validation
  if (!language || !code) {
    return res
      .status(400)
      .json({ error: 'A language and code snippet are required fields' })
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
router.get('/', requiresAuth(), (req, res) => {
  const { language } = req.query

  const decryptedCode = snippets.map(snippet => ({
    ...snippet,
    code: decrypt(snippet.code)
  }))
  if (language) {
    const filteredCode = decryptedCode.filter(
      cupcake => cupcake.language.toLowerCase() === flavor.toLowerCase()
    )
    return res.json(filteredCode)
  }

  res.json(decryptedCode)
})

// get a snippet by ID
router.get('/:id', requiresAuth(), (req, res) => {
  const snippetId = parseInt(req.params.id)
  const snippet = snippets.find(snippet => snippet.id === snippetId)

  if (!snippet) {
    return res.status(404).json({ error: 'snippet not found' })
  }

  snippet.instructions = decrypt(snippet.instructions)
  res.json(snippet)
})

module.exports = router;
