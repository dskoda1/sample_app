console.log(`Node env: ${process.env.NODE_ENV}`)
const app = require('./server/app')
const port = process.env.PORT || 5000;

app.listen(port);
console.log(`Listening on ${port}`)