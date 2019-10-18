const express = require ('express')

const app = express()
const PORT = 3030
let projects = []
let countCalls = 0

app.use(express.json())

//global middleware to count http calls 
app.use("/", (req, res, next) => {
    countCalls++
    console.log(`Rotina chamada ${countCalls} vezes`)
    return next()
})

//global middleware to validate project
function projectExists (req, res, next) {
    const { id } = req.params
    for (let i in projects) {
        if(projects[i].id !== id) {
            return res.status(400).json({ message: "Projeto nao existe" })
        }
        return next()
    }
}


app.get("/", (req, res) => {
    return res.json({message: 'Im HERE!!!'})
})


app.get("/projects", (req, res) => {
    return res.json(projects)
})

app.post("/projects", (req, res) => {
    const { id , title } = req.body
    projects.push({id: id, title: title, tasks: []})
    return res.json(projects)
})

app.post("/projects/:id/tasks", (req,res) => {
    const { id } = req.params
    const { title } = req.body
    for (let i in projects) {
        if(projects[i].id === id) {
            projects[i].tasks.push(title)
        }
    }
    return res.json(`Tarefa '${title}' inserida no projeto ${id}`)
})

app.put("/projects/:id", (req, res) => {
    const { id } = req.params
    const { title } = req.body
    for (let i in projects) {
        if (projects[i].id === id) {
            projects[i].title = title
        }
    }
    return res.json(`Titulo do projeto ${id} modificado para "${title}"`)
})

app.delete("/projects/:id", projectExists, (req, res) => {
    const { id } = req.params
    for (let i in projects) {
        if (projects[i].id === id) {
            projects.splice(i,1)
        }
    }
    return res.json(`Projeto id: ${id} removido`)
})

app.listen(PORT, () => console.log(`Server running on port: ${PORT}`))