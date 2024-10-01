const express = require('express');
const path = require('path');
const bodyParser = require('body-parser');
const qrRoutes = require('./routes/qrRoutes');

const app = express();

// Set EJS as templating engine
app.set('view engine', 'ejs');

// Middleware for parsing form data
app.use(bodyParser.urlencoded({ extended: true }));

// Set static folder for serving public files (images, css)
app.use(express.static(path.join(__dirname, 'public')));

// Use the QR code route
app.use('/', qrRoutes);

// Start the server
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});
