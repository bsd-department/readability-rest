import express from 'express'
import DOMPurify from 'dompurify'

const port = 12221;
const app = express();
app.set('query parser', 'simple');

app.get('/parse', (req, res) => {
    const url = req.query.url
    if(typeof(url) !== 'string') {
        res.status(400)
           .send({status: 'error', message: 'URL missing or invalid'});
        return
    }
    res.send({status: 'success', response: url});
})

app.listen(port, () => {
    console.log(`Listening on port ${port}`);
})
