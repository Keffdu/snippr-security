const router = require('express').Router();
const {encrypt, decrypt} = require('../utils/encrypt');

// array to store snippets
const snippets = require('./seedData.json')

// generate a unique ID for each cupcake
let id = snippets.length

// create a new snippet
router.post('/', (req, res) => {
  const { flavor, instructions } = req.body

  // basic validation
  if (!flavor || !instructions) {
    return res
      .status(400)
      .json({ error: 'Flavor and instructions are required fields' })
  }

  const snippet = {
    id: ++id,
    flavor,
    instructions
  }

  snippets.push({...snippet, instructions: encrypt(instructions)});
  res.status(201).json(snippet)
})

// get all snippets
router.get('/', (req, res) => {
  const { flavor } = req.query

  const decodedCupcakes = snippets.map(snippet => ({
    ...snippet,
    instructions: decrypt(snippet.instructions)
  }))
  if (flavor) {
    const filteredCupcakes = decodedCupcakes.filter(
      snippet => snippet.flavor.toLowerCase() === flavor.toLowerCase()
    )
    return res.json(filteredCupcakes)
  }

  res.json(decodedCupcakes)
})

// get a snippet by ID
router.get('/:id', (req, res) => {
  const cupcakeId = parseInt(req.params.id)
  let snippet = snippets.find(snippet => snippet.id === cupcakeId)
  
  if (!snippet) {
    return res.status(404).json({ error: 'Cupcake not found' })
  }

  snippet = {...snippet, 'instructions': decrypt(snippet.instructions)}
  res.json(snippet)
})

module.exports = router;