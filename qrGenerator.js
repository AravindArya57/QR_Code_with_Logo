const fs = require('fs');
const QRCode = require('qrcode');

const generateQRCodeToFile = async (text, outputFile) => {
  try {
    await QRCode.toFile(outputFile, text);
    console.log(`QR Code generated and saved to ${outputFile}`);
  } catch (err) {
    console.error('Failed to generate and save QR code', err);
  }
};

// Text to be encoded
const textToEncode = 'https://www.duetvr.com';

// Output file path
const outputFile = './qrcode.png';

// Generate the QR code and save it to a file
generateQRCodeToFile(textToEncode, outputFile);
