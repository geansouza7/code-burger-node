const express = require('express');
const uuid = require('uuid');

const port = 3001;
const app = express();
app.use(express.json());

/*
    -Query params => meusite.com/burger?order=1-coca&name=gean  // FILTROS
    -Route params => /burger/2      // BUSCAR, DELETAR OU ATUALIZAR  ALGO ESPECIFICO
    -Request Body => { "order":"1-Coca", "name":"Gean Souza"}

    -GET          => Buscar informação no back-end
    -POST         => Criar informação no back-end
    -PUT / PATCH  => Alterar/Atualizar informação no back-end
    -DELETE       => Deletar informação no back-end

    -Middleware   => INTERCEPTADOR => Tem o poder de parar ou alterar dados da requisição 
*/

const burgers = []

const checkOrderId = (request, response, next) => {
    const { id } = request.params

    const index = burgers.findIndex( burger => burger.id === id )
    
    if(index < 0) {
        return response.status(404).json({ error: "Order not found"})
    }

    request.orderIndex = index
    request.orderId = id

    next()
}

app.get('/burgers', (request, response) => {
        return response.json(burgers)
})

app.post('/burgers', (request, response) => {
    const { order, name } = request.body

    const burger = { id: uuid.v4(), order, name }

    burgers.push(burger)

    return response.status(201).json(burger)
})
app.put('/burgers/:id', checkOrderId, (request, response) => {
    const { order, name } = request.body
    const index = request.orderIndex
    const id = request.orderId

    const updateOrder = { id, order, name }

    
    burgers[index] = updateOrder

    return response.json(updateOrder)


})
app.delete('/burgers/:id', checkOrderId, (request, response) => {
    const index = request.orderIndex

burgers.splice(index,1)

    return response.status(204).json()
})





app.listen(port, () =>{
    console.log(`Server started on port ${port}`)
})