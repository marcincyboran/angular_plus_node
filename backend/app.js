const express = require('express');

const app = express();

require('./startup/config')(app);
require('./startup/router')(app);
require('./startup/connect')();

const PORT = process.env.PORT || 3200;
app.listen(PORT, () => {
    console.log(`Server listening on port: ${PORT}`);
})
