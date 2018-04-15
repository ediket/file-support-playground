import express from 'express';
import session from 'express-session';
import uppy from 'uppy-server';
import bodyParser from 'body-parser';
import cors from 'cors';
import multer from 'multer';
import textract from 'textract';

const app = express();
const upload = multer({ storage: multer.memoryStorage() });

app.use(bodyParser.json());
app.use(cors());
app.use(session({
  secret: 'some-secret',
  resave: true,
  saveUninitialized: true,
}));

app.use((req, res, next) => {
  res.setHeader('Access-Control-Allow-Origin', req.headers.origin || '*');
  res.setHeader(
    'Access-Control-Allow-Methods',
    'GET, POST, OPTIONS, PUT, PATCH, DELETE',
  );
  res.setHeader(
    'Access-Control-Allow-Headers',
    'Authorization, Origin, Content-Type, Accept',
  );
  res.setHeader('Access-Control-Allow-Credentials', 'true');
  next();
});

// Routes
app.get('/', (req, res) => {
  res.setHeader('Content-Type', 'text/plain');
  res.send('Welcome to my uppy server');
});

app.post('/upload', upload.single('file'), (req, res) => {
  const { file } = req;

  textract.fromBufferWithMime(file.mimetype, file.buffer, (error, text) => {
    res.json({ text });
  });
});

// initialize uppy
const uppyOptions = {
  providerOptions: {
    google: {
      key: 'your google key',
      secret: 'your google secret',
    },
  },
  server: {
    host: 'localhost:3020',
    protocol: 'http',
  },
  filePath: './output',
  secret: 'some-secret',
  debug: true,
};

app.use(uppy.app(uppyOptions));

// handle 404
app.use((req, res) => res.status(404).json({ message: 'Not Found' }));

// handle server errors
app.use((err, req, res) => {
  console.error('\x1b[31m', err.stack, '\x1b[0m');
  res.status(err.status || 500).json({ message: err.message, error: err });
});

uppy.socket(app.listen(3020), uppyOptions);

// app.listen(3020);
console.log('Welcome to Uppy Server!');
console.log(`Listening on http://0.0.0.0:${3020}`);
