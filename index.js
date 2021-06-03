const express = require('express');
const bodyParser = require('body-parser');
const moment = require('moment');

const V1 = '/api/v1';

let app = express();

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: false}));

let server = app.listen(9090, () => {
 console.log('server is running on port', server.address().port);
});

const users = [
   {
      email: 'johnd@example.com',
      password: 'asdf123!',
      role: 'admin'
   },
   {
      email: 'janed@example.com',
      password: 'qwer1234!',
      role: 'user'
   }
];
let items = [];

app.post(V1 + '/auth', (req, res) => {
   const {email, password} = req.body;
   if (!email || !password) return res.sendStatus(401);
   let user = users.find(u => u.email === email);
   if (!user) return res.sendStatus(401);
   if (user.password !== password) return res.sendStatus(401);
   delete user.password;
   res.send({ token: escape(JSON.stringify(user)) });
});

app.get(V1 + '/users', authenticate, authorize, (req, res) => {
   res.send(users.map((u, id) => ({id, ...u})));
});

app.get(V1 + '/users/:id', authenticate, authorize, (req, res) => {
   const id = req.params.id;
   if (!users[id]) return res.sendStatus(404);
   res.send({id, ...users[id]});
});

app.get(V1 + '/items', authenticate, (req, res) => {
   res.send(items.map((i, id) => ({id, ...i})));
});

app.get(V1 + '/items/:id', authenticate, (req, res) => {
   const id = req.params.id;
   if (!items[id]) return res.sendStatus(404);
   res.send({id, ...items[id]});
});

app.post(V1 + '/items', authenticate, (req, res) => {
   const {title, text, date} = req.body;
   if (!validateItem(req.body)) return res.sendStatus(400);
   const item = {title, text, date};
   items.push(item);
   res.send(item);
});

app.put(V1 + '/items/:id', authenticate, (req, res) => {
   const id = req.params.id;
   if (!items[id]) return res.sendStatus(404);
   const {title, text, date} = req.body;
   if (!validateItem(req.body)) return res.sendStatus(400);
   items[id] = {title, text, date};
   res.send({id, ...items[id]});
});

app.delete(V1 + '/items/:id', authenticate, (req, res) => {
   const id = req.params.id;
   if (!items[id]) return res.sendStatus(404);
   delete items[id];
   res.send();
});

function validateItem(data = {}) {
   if (!data.title || !data.text || !data.date) return false;
   const date = moment(data.date, 'YYYY-MM-DD', true);
   return date.isValid();
}

function authenticate(req, res, next) {
   const token = req.headers['authorization'];
   if (!token) return res.send(401);
   try {
      req.user = JSON.parse(unescape(token));
   } catch (err) {
      console.error(err);
      return res.send(401);
   }
   next();
}

function authorize(req, res, next) {
   if (req.user.role !== 'admin') return res.send(403);
   next();
}
