const express = require('express');
const mongoose = require('mongoose');

const app = express();
const PORT = process.env.port || 3001;

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static('public'));

// if MONGODB_URI exists, connect
// else re-route to local MongoDB server
// MongoDB finds/connects to DB if exists, creates new if not
mongoose.connect(process.env.MONGODB_URI || "mongodb://localhost/social-network-api", {
    useNewUrlParser: true,
    useUnifiedTopology: true,
});

//log Mongo queries

mongoose.set("debug", true);

app.use(require('./routes'));

app.listen(PORT, () => console.log(`Connected on localhost:${PORT}`));