const express = require('express');
const App = express();

App.get('/', (req, res) => {
    res.send('<h1>Hello World!</h1>')
})

App.listen(3000, () => {
    console.log('Server is running on port 3000')
})