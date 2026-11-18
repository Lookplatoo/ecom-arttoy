/**
 * server.js - Front-End Web Server (Port 8080)
 * Art Toy Community Prototype Web Server
 */

const express = require('express');
const path = require('path');

const app = express();
const PORT = 8080;

// ให้บริการ Static Files (HTML, CSS, JS, Images, Icons) 
app.use(express.static(__dirname));

// Route หน้าหลัก 
app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'index.html'));
});

// เริ่มต้นเซิร์ฟเวอร์ Front-End
app.listen(PORT, () => {
  console.log(`Art Toy Front-End Server running at: http://localhost:${PORT}`);
});
