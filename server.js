const app = require('./app')

const port = 4000;
app.listen(port, function () {
    console.log(`Server started on port ${port}`);
})