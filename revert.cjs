const fs = require('fs');

const currentCode = fs.readFileSync('/home/pro/Downloads/Genshin Impact TCG (Community)/src/app/components/CardGame.tsx', 'utf8');
const oldReturn = fs.readFileSync('old_return.txt', 'utf8');

// The original file was modified by replacing everything from "return (" to the end of the file.
// Let's find "return (" in currentCode.
const returnIndex = currentCode.indexOf('  return (');

if (returnIndex !== -1) {
  const newCode = currentCode.substring(0, returnIndex) + oldReturn;
  fs.writeFileSync('/home/pro/Downloads/Genshin Impact TCG (Community)/src/app/components/CardGame.tsx', newCode);
  console.log('Reverted successfully!');
} else {
  console.error('Could not find return block');
}
