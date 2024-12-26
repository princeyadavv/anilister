const fs = require('fs');
const path = require('path');
const { createCanvas } = require('canvas');

function generateRandomHexColor() {
  const randomColor = Math.floor(Math.random() * 0xffffff);
  return `#${randomColor.toString(16).padStart(6, '0')}`;
}

function saveImageWithLetter(firstName,username) {


  // Get the first letter of the user's name
  const firstLetter = firstName.charAt(0).toUpperCase();

  // Create the canvas
  const canvas = createCanvas(500, 500);
  const context = canvas.getContext('2d');

  // Fill the canvas with a random background color
  const randomColor = generateRandomHexColor();
  context.fillStyle = randomColor;
  context.fillRect(0, 0, 500, 500);

  // Add the first letter in the center of the canvas
  context.font = 'bold 200px Arial'; // Large bold font
  context.fillStyle = '#ffffff'; // White text color
  context.textAlign = 'center';
  context.textBaseline = 'middle';
  context.fillText(firstLetter, canvas.width / 2, canvas.height / 2);

  // Set the path to save the image in the parent directory's "public" folder
  const parentDirectory = path.join(__dirname, '..'); // Navigate one directory up
  const publicFolder = path.join(parentDirectory, 'public'); // "public" folder path
  const outputPath = path.join(publicFolder, `profileimg/${username}.png`); // File path

  // Ensure the "public" folder exists
  if (!fs.existsSync(publicFolder)) {
    fs.mkdirSync(publicFolder, { recursive: true }); // Create folder if it doesn't exist
  }

  // Save the canvas as an image
  const buffer = canvas.toBuffer('image/png');
  fs.writeFileSync(outputPath, buffer);
  return outputPath

}

for (let i = 'a'.charCodeAt(0); i <= 'z'.charCodeAt(0); i++) {
  console.log();
  saveImageWithLetter(String.fromCharCode(i),String.fromCharCode(i))
}
