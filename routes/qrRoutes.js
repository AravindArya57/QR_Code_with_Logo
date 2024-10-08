const express = require('express');
const QRCode = require('qrcode');
const path = require('path');
const Jimp = require('jimp');

const router = express.Router();

// Serve the index page
router.get('/', (req, res) => {
  res.render('index', { qrCodeImage: null, text: null, filename: null });
});

// Handle QR code generation with logo and white background
router.post('/generate', async (req, res) => {
  const { text, filename } = req.body;  // Capture filename input
  const qrImagePath = path.join(__dirname, '../public/qrcodes', `${Date.now()}_qr.png`);
  const logoPath = path.join(__dirname, '../public/logo/loader.png');
  const outputImagePath = path.join(__dirname, '../public/qrcodes', `${Date.now()}_qr_with_logo.png`);

  try {
    // Generate QR code with larger size
    await QRCode.toFile(qrImagePath, text, {
      width: 400,  // Increase the size of the QR code (e.g., 600px)
    });

    // Load the generated QR code and logo images using Jimp
    const qrImage = await Jimp.read(qrImagePath);
    let logo = await Jimp.read(logoPath);

    // Resize the logo to fit in the center of the QR code
    logo.resize(qrImage.bitmap.width / 4, Jimp.AUTO);

    // Create a white background the same size as the logo
    const whiteBackground = new Jimp(logo.bitmap.width, logo.bitmap.height, 0xffffffff); // white background

    // Composite the logo on top of the white background
    whiteBackground.composite(logo, 0, 0);

    // Calculate the center position for the logo on the QR code
    const x = (qrImage.bitmap.width / 2) - (whiteBackground.bitmap.width / 2);
    const y = (qrImage.bitmap.height / 2) - (whiteBackground.bitmap.height / 2);

    // Overlay the logo (with white background) onto the QR code
    qrImage.composite(whiteBackground, x, y);

    // Save the final QR code with logo and white background
    await qrImage.writeAsync(outputImagePath);

    // Render the page with the generated QR code and filename
    res.render('index', { qrCodeImage: `/qrcodes/${path.basename(outputImagePath)}`, text, filename });
  } catch (err) {
    console.error(err);
    res.status(500).send('Failed to generate QR code with logo');
  }
});

module.exports = router;