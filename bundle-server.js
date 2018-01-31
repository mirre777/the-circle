const express = require('express');
const app = express();

app.use(require('./build.js'));

app.listen(8081, () => console.log(`Ready to compile and serve bundle.js`));

////keeps on running and changes are instantly visible
/////index.js calls 8081. so redirected from 8080 to 8081
