const router = require('express').Router();
const {encrypt, decrypt} = require('../utils/encrypt');

// array to store snippets
const snippets = [
  {
    "id": 1,
    "language": "Python",
    "code":encrypt("print('Hello, World!')")
  },
  {
    "id": 2,
    "language": "Python",
    "code": encrypt("def add(a, b):\n    return a + b")
  },
  {
    "id": 3,
    "language": "Python",
    "code": encrypt("class Circle:\n    def __init__(self, radius):\n        self.radius = radius\n\n    def area(self):\n        return 3.14 * self.radius ** 2")
  },
  {
    "id": 4,
    "language": "JavaScript",
    "code": encrypt("console.log('Hello, World!');")
  },
  {
    "id": 5,
    "language": "JavaScript",
    "code": encrypt("function multiply(a, b) {\n    return a * b;\n}")
  },
  {
    "id": 6,
    "language": "JavaScript",
    "code": encrypt("const square = num => num * num;")
  },
  {
    "id": 7,
    "language": "Java",
    "code": encrypt("public class HelloWorld {\n    public static void main(String[] args) {\n        System.out.println(\"Hello, World!\");\n    }\n}")
  },
  {
    "id": 8,
    "language": "Java",
    "code": "public class Rectangle {\n    private int width;\n    private int height;\n\n    public Rectangle(int width, int height) {\n        this.width = width;\n        this.height = height;\n    }\n\n    public int getArea() {\n        return width * height;\n    }\n}"
  }
]

// generate a unique ID for each cupcake
let id = snippets.length

// create a new snippet
router.post('/', (req, res) => {
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
router.get('/', (req, res) => {

  // console.log(snippets)

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
router.get('/:id', (req, res) => {
  const snippetId = parseInt(req.params.id)
  let snippet = snippets.find(snippet => snippet.id === snippetId)
  
  if (!snippet) {
    return res.status(404).json({ error: 'code snippet not found' })
  }

  snippet = {...snippet, 'code': decrypt(snippet.code)}
  res.json(snippet)
})

module.exports = router;