const express = require('express');
const { v4: uuidv4 } = require('uuid')
const fs = require('fs');
const server = express();
const router = express.Router();

server.use(express.json({ extended: true }));
server.use(router);

const readFile = () => {
    const content = fs.readFileSync('./data/items.json', 'utf-8')
    return JSON.parse(content)
}

router.get('/', (req, res) => {
    const { id } = req.query;
    if (id) {
        const content = readFile()
        const selectedItem = content.findIndex((item) => item.id === id)
        res.send(content[selectedItem])
    } else {
        const content = readFile()
        res.send(content)
    }
})
router.post('/', (req, res) => {
    const { name, email, phone } = req.body
    // const id = Math.random().toString(32).substr(2, 9)
    const currentContent = readFile()
    const id = uuidv4()
    currentContent.push({ id, name, email, phone })
    fs.writeFileSync('./data/items.json', JSON.stringify(currentContent), 'utf-8')
    res.send({ id, name, email, phone })
})
router.put('/', (req, res) => {
    const { id } = req.query
    const { name, email, phone } = req.body
    const currentContent = readFile()
    const selectedItem = currentContent.findIndex((item) => item.id === id)
    const { name: cName, email: cEmail, phone: cPhone } = currentContent[selectedItem]
    const newObj = {
        id: id,
        name: name ? name : cName,
        email: email ? email : cEmail,
        phone: phone ? phone : cPhone
    }
    currentContent[selectedItem] = newObj
    fs.writeFileSync('./data/items.json', JSON.stringify(currentContent), 'utf-8')
    res.send(newObj)
})
router.delete('/', (req, res) => {
    const { id } = req.query
    const currentContent = readFile()
    const selectedItem = currentContent.findIndex((item) => item.id === id)
    currentContent.splice(selectedItem, 1)
    fs.writeFileSync('./data/items.json', JSON.stringify(currentContent), 'utf-8')
    res.send('Deletado: ' + id)
})

server.listen(3000, () => {
    console.log('Rodando Servidor')
})