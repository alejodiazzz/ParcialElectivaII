import express from 'express';
import indexRouter from './routes/index.mjs';

const app = express();
const port = 3000;

app.use(express.json());

app.use('/', indexRouter);

app.listen(port, () => {
  console.log(`Servidor escuchando en http://localhost:${port}`);
});
