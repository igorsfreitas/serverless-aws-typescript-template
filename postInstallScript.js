const fs = require('node:fs');

// tratando erro do pg-native
try {
  const PATH = 'node_modules/pg/lib/native/client.js';
  const pgNativeClientFile = fs.readFileSync(PATH, 'utf-8');

  const newPgNativeClientFile = pgNativeClientFile.replace(
    `var Native = require('pg-native')`,
    `try { var Native = require('pg-native') } catch (error) {}`,
  );

  fs.writeFileSync(PATH, newPgNativeClientFile, 'utf-8');
} catch (error) {
  console.log(error);
}
