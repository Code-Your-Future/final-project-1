import express from 'express';
import mongoose from 'mongoose';
import bodyParser from 'body-parser';
import path from 'path';
import routes from './controller/routes';

if (process.env.MONGODB_URI) {
  console.log('Connecting to remote mongo instance');
  mongoose.connect(process.env.MONGODB_URI);
} else {
  console.log('Connecting to local mongo instance');
  mongoose.connect('mongodb://localhost/rams_projects');
}

console.log('Connected to mongo');

const app = express();

app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

app.set('views', path.join(process.cwd(), 'views'));
app.set('view engine', 'hbs');

app.get('/api/migrate', routes.getImport);
app.get('/api/all/organisation', routes.getAllOrganisation);
app.get('/api/organisation/category', routes.getCategory);
app.get('/api/organisation/:category', routes.getOrganisation);
app.get('/api/all/users', routes.getUsers);
app.post('/api/organisation/postcode', routes.getPostcode);
app.post('/api/organisation/search', routes.getSearchedOrganisation);
// ********************************************************
// ********************Production**************************
// ********************************************************
// setup the server to serve the React bundle in production
app.use(express.static(path.resolve(__dirname, '..', 'build')));

// Always return the main index.html, so react-router render the route in the client
app.get('*', (req, res) => {
  res.sendFile(path.resolve(__dirname, '..', 'build', 'index.html'));
});

const port = process.env.PORT ? process.env.PORT : 3001;

app.listen(port);

console.log(`Server has started on port ${port}`);

export default app;
