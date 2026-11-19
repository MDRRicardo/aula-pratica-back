// =============================================================
//  Uma API REST que guarda tarefas num ficheiro JSON (db.json).
//
//  Rotas (endpoints):
//    GET    /tarefas        -> lista todas as tarefas
//    POST   /tarefas        -> cria uma tarefa   { titulo }
//    PATCH  /tarefas/:id    -> atualiza uma tarefa { concluida }
//    DELETE /tarefas/:id    -> apaga uma tarefa
// =============================================================
import express from 'express'
import cors from 'cors'
import { readFileSync, writeFileSync, existsSync } from 'node:fs'

const app = express()
const PORTA = 3001
const FICHEIRO_DB = './db.json'

// Middlewares
app.use(cors())          // permite que o frontend (outra porta) chame esta API
app.use(express.json())  // converte o corpo do pedido (JSON) num objeto JS

// "Base de dados" muito simples: um ficheiro JSON
function lerTarefas() {
  if (!existsSync(FICHEIRO_DB)) return []
  return JSON.parse(readFileSync(FICHEIRO_DB, 'utf-8'))
}
function guardarTarefas(tarefas) {
  writeFileSync(FICHEIRO_DB, JSON.stringify(tarefas, null, 2))
}

// GET -> ler
app.get('/tarefas', (req, res) => {
  res.json(lerTarefas())
})

// POST -> criar
app.post('/tarefas', (req, res) => {
  const { titulo } = req.body
  console.log("Aula", req)
  
  if (!titulo) return res.status(400).json({ erro: 'O título é obrigatório' })

  const tarefas = lerTarefas()
  tarefas.push(nova)
  guardarTarefas(tarefas)
  res.status(201).json(nova)
})

// PATCH -> atualizar
app.patch('/tarefas/:id', (req, res) => {
  const id = Number(req.params.id)
  const tarefas = lerTarefas()
  const tarefa = tarefas.find((t) => t.id === id)
  if (!tarefa) return res.status(404).json({ erro: 'Tarefa não encontrada' })

  Object.assign(tarefa, req.body)
  guardarTarefas(tarefas)
  res.json(tarefa)
})

// DELETE -> apagar
app.delete('/tarefas/:id', (req, res) => {
  const id = Number(req.params.id)
  guardarTarefas(lerTarefas().filter((t) => t.id !== id))
  res.status(204).end()
})

app.listen(PORTA, () => {
  console.log(`✅ API a correr em http://localhost:${PORTA}/tarefas`)
})
