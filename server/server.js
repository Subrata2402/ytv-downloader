const express = require('express');
const app = express();
require('dotenv').config();
const cors = require('cors');
const routes = require('./routes');

app.use(cors({
    origin: '*', // allow to server to accept request from different origin
}));

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use('/api', routes);

app.get('/', (req, res) => {
    res.send('Youtube Video Downloader API');
});

app.listen(process.env.PORT, () => {
    console.log('Server is running on port ' + process.env.PORT);
});