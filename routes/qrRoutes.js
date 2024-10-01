const express = require('express');
const QRCode = require('qrcode');
const path = require('path');
const Jimp = require('jimp'); // Correct Jimp import

const router = express.Router();

// Serve the index page
router.get('/', (req, res) => {
  res.render('index', { qrCodeImage: null, text: null });
});

// Handle QR code generation with logo
router.post('/generate', async (req, res) => {
  const { text } = req.body;
  const qrImagePath = path.join(__dirname, '../public/qrcodes', `${Date.now()}_qr.png`);
  const logoPath = path.join(__dirname, '../public/logo/logo.png');
  const outputImagePath = path.join(__dirname, '../public/qrcodes', `${Date.now()}_qr_with_logo.png`);

  try {
    // Generate QR code and save it as an image file
    await QRCode.toFile(qrImagePath, text);

    // Load the generated QR code and logo images using Jimp
    const qrImage = await Jimp.read(qrImagePath); // Jimp.read should work now
    const logo = await Jimp.read(logoPath);

    // Resize the logo to fit in the center of the QR code
    logo.resize(qrImage.bitmap.width / 4, Jimp.AUTO);

    // Calculate the center position for the logo
    const x = (qrImage.bitmap.width / 2) - (logo.bitmap.width / 2);
    const y = (qrImage.bitmap.height / 2) - (logo.bitmap.height / 2);

    // Overlay the logo on the QR code
    qrImage.composite(logo, x, y);

    // Save the final QR code with logo
    await qrImage.writeAsync(outputImagePath);

    // Render the page with the generated QR code
    res.render('index', { qrCodeImage: `/qrcodes/${path.basename(outputImagePath)}`, text });
  } catch (err) {
    console.error(err);
    res.status(500).send('Failed to generate QR code with logo');
  }
});

module.exports = router;
