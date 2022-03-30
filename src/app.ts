import express from 'express';
import isURL from 'validator/lib/isURL.js';
import createDOMPurify from 'dompurify';
import { JSDOM } from 'jsdom';
import { Readability } from '@mozilla/readability';
import fetch, { Response } from 'node-fetch';

const port = 12221;
const ua = 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/99.0.4844.51 Safari/537.36';
const app = express();
app.set('query parser', 'simple');

const window = new JSDOM('').window as unknown as Window;
const DOMPurify = createDOMPurify(window);

const fetchHandleBadStatus = (r: Response) => {
  if(!r.ok) {
    throw Error(r.statusText);
  }
  return r;
};

const getErrorMessage = (e: unknown) => {
  if(e instanceof Error) return e.message;
  return String(e);
};

const errorResponse = (msg: string) => {
  return {status: 'error', message: msg};
};

app.get('/parse', async (req, res) => {
  try {
    const url = req.query.url;
    if(typeof(url) !== 'string' || !isURL(url)) {
      return res.status(400)
        .send(errorResponse('URL missing or invalid'));
    }

    const parsed = await fetch(url, {
      headers: {
        'User-Agent': ua
      }
    }).then(fetchHandleBadStatus)
      .then(r => r.text())
      .then(DOMPurify.sanitize)
      .then(h => new JSDOM(h as string, {
        url: url
      }))
      .then(d => new Readability(d.window.document).parse());
    res.send({ status: 'success', response: parsed });
  } catch(e) {
    const msg = getErrorMessage(e);
    return res.status(500)
      .send(errorResponse(msg));
  }
});

app.listen(port, () => {
  console.log(`Listening on port ${port}`);
});
