const express = require('express')
const path = require('path')
const {v4} = require('uuid')
const app = express()

let TASKS = [
    {id: v4(), name: "Buy a bread", value: "tomorrow", marked: false}
]

app.use(express.json())

//GET
app.get('/api/tasks', (req, res)=>{
        res.status(200).json(TASKS)
})


//POST
app.post('/api/tasks', (req, res) =>{
    const task = {...req.body, id: v4(), marked: false}
    TASKS.push(task)
    res.status(201).json(task)
})

//DELETE
app.delete('/api/tasks/:id', (req, res) =>{
    TASKS = TASKS.filter(t => t.id !== req.params.id)
    res.status(200).json({message: "Task has been deleted"})
})

//PUT
app.put('/api/tasks/:id', (req, res)=>{
    const idx = TASKS.findIndex(t => t.id === req.params.id)
    TASKS[idx] = req.body
    res.json(TASKS[idx])
})


app.use(express.static(path.resolve(__dirname, 'public')))

app.get('*', (req, res) => {
    res.sendFile(path.resolve(__dirname, "public", "index.html"))
})

app.listen(3000, ()=> console.log("Server has been started on port 3000..."))