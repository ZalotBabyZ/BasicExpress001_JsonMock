// เริ่มproject npm init -y
// npm i express
const express = require('express');
const app = express();
const port = 8000;
const fs = require('fs');

app.use(express.json());

const productList = JSON.parse(fs.readFileSync("./mocks/product.json"))

app.get('/products', (req, res) => {
    const searchById = +req.query.id;
    const searChByName = req.query.name ? req.query.name.toLowerCase() : undefined;
    if (searChByName || searchById) {
        const filterProductList = productList.filter(item => (item.id === searchById || item.name.toLowerCase() === searChByName));
        res.status(200).send({ listOfProduct: filterProductList });
    }
    res.status(200).send({ listOfProduct: productList });
})

app.post('/products', (req, res) => {
    const newProductId = productList.length ? productList[productList.length - 1].id + 1 : 1;
    const newProduct = {
        "id": newProductId,
        "name": req.body.name,
        "price": req.body.price,
        "category": req.body.category,
        "image": req.body.image,
        "totalSale": req.body.totalSale
    };
    productList.push(newProduct)
    fs.writeFileSync('./mocks/product.json', JSON.stringify(productList));
    res.status(201).send({
        productList: productList,
        newProduct: newProduct
    })
})

app.patch('/products/:id', (req, res) => {
    const productId = +req.params.id;
    const index=productList.findIndex(item=>item.id===productId);
    productList[index] = {
        "id": productId,
        "name": req.body.name,
        "price": req.body.price,
        "category": req.body.category,
        "image": req.body.image,
        "totalSale": req.body.totalSale
    }
    fs.writeFileSync('./mocks/product.json', JSON.stringify(productList));
    res.status(201).send({
        productList: productList,
    })
})

app.delete('/products/:id', (req, res) => {
    const productId = +req.params.id;
    const newProductList = productList.filter(item => item.id !== productId);
    fs.writeFileSync('./mocks/product.json', JSON.stringify(newProductList));
    res.status(204).send()
})



app.listen(port, () => console.log(`server starting on port ${port}`))