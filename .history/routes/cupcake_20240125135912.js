const router = require('express').Router();
const {encrypt, decrypt} = require('../utils/encrypt');

// array to store snippets
const snippets = require('./seedData.json')

// generate a unique ID for each cupcake
let id = snippets.length

// create a new cupcake
router.post('/', (req, res) => {
  const { flavor, instructions } = req.body

  // basic validation
  if (!flavor || !instructions) {
    return res
      .status(400)
      .json({ error: 'Flavor and instructions are required fields' })
  }

  const cupcake = {
    id: ++id,
    flavor,
    instructions
  }

  snippets.push({...cupcake, instructions: encrypt(instructions)});
  res.status(201).json(cupcake)
})

// get all snippets
router.get('/', (req, res) => {
  const { flavor } = req.query

  const decodedCupcakes = snippets.map(cupcake => ({
    ...cupcake,
    instructions: decrypt(cupcake.instructions)
  }))
  if (flavor) {
    const filteredCupcakes = decodedCupcakes.filter(
      cupcake => cupcake.flavor.toLowerCase() === flavor.toLowerCase()
    )
    return res.json(filteredCupcakes)
  }

  res.json(decodedCupcakes)
})

// get a cupcake by ID
router.get('/:id', (req, res) => {
  const cupcakeId = parseInt(req.params.id)
  let cupcake = snippets.find(cupcake => cupcake.id === cupcakeId)
  
  if (!cupcake) {
    return res.status(404).json({ error: 'Cupcake not found' })
  }

  cupcake = {...cupcake, 'instructions': decrypt(cupcake.instructions)}
  res.json(cupcake)
})

module.exports = router;