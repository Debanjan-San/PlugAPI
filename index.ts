import express, { Request, Response } from 'express';
import expressLayout from 'express-ejs-layouts';
import loadAllRoutesHandler from './src/router/loadAllRoutesHandler';
import path from 'path';

const app = express();
const PORT = process.env.PORT || 3000;

// Load the router and APIs from the loadAllRoutesHandler
const { apis, router } = loadAllRoutesHandler();

// Middleware and settings
app.set('json spaces', 4); // Pretty print JSON output with 4 spaces
app.set('view engine', 'ejs'); // Set EJS as the view engine
app.use(express.urlencoded({ extended: true })); // Parse URL-encoded bodies
app.use(express.json()); // Parse JSON bodies
app.use(expressLayout); // Use EJS layouts
app.use(express.static(path.join(__dirname, 'public'))); // Serve static files

// API Routes
app.use('/api', router);

// Routes
app.get('/', (_: Request, res: Response) => {
  res.render('index', { layout: 'layouts/main' });
});

app.get('/docs', (_: Request, res: Response) => {
  res.render('docs', { apis, layout: 'layouts/main' });
});

// Start the server
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
