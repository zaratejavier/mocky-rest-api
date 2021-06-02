const express = require('express');
const bodyParser = require('body-parser');

let app = express();

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: false}));

let server = app.listen(3000, () => {
 console.log('server is running on port', server.address().port);
});

let items = [];

app.get('/items', (req, res) => {
   res.send(items.map((i, id) => ({id, ...i})));
});

app.get('/items/:id', (req, res) => {
   const id = req.params.id;
   if (!items[id]) return res.sendStatus(404);
   res.send({id, ...items[id]});
});

app.post('/items', (req, res) => {
   const {title, body, date} = req.body;
   if (!title || !body || !date) return res.sendStatus(404);
   const item = {title, body, date};
   items.push(item);
   res.send(item);
});

app.put('/items/:id', (req, res) => {
   const id = req.params.id;
   if (!items[id]) return res.sendStatus(404);
   const {title, body, date} = req.body;
   if (!title || !body || !date) return res.sendStatus(404);
   items[id] = {title, body, date};
   res.send({id, ...items[id]});
});

app.delete('/items/:id', (req, res) => {
   const id = req.params.id;
   if (!items[id]) return res.sendStatus(404);
   delete items[id];
   res.send();
});
