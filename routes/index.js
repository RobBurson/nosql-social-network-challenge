const router = require('express').Router();
// import all API routes
const routes = require("./api");

router.use("/api", routes);

router.use((req, res) => {
    res.status(404).send('<h1>💀 404 Error! What you are looking for is in another castle!💀</h1>');
});

module.exports = router;