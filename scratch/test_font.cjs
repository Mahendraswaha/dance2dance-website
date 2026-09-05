const fs = require('fs');

// We can inspect the font glyph bounding boxes if opentype.js is available or fetch the svg/ttf,
// Or we can see how Playfair Display behaves.
// In Playfair Display:
// 'D': cap-height is ~710 units (out of 1000 units em).
// In Playfair Display regular, digits (0-9) are oldstyle:
// '2' has height ~505 units (aligning with x-height ~505 units).
// So 'D' is ~710 units high, while '2' is ~505 units high!
// 710 / 505 = 1.405 (about 40% taller).
// Wait! If the user says:
// "como o '2' nessa fonte é menor, ele deve ter tamanho 3 números maior para ficar na altura do D"
// Wait, what does the user mean by "3 números maior"?
// In pt-BR, people often say:
// "tamanho 3 números maior" -> for example:
// in Word / typography: "aumente 3 números", e.g. se a fonte é 24, aumentar para 27 (ou 3 tamanhos da escala: 24 -> 26 -> 28 -> 30, etc.)
// BUT notice the explicit goal: "para ficar na altura do D"!
console.log('Testing font calculation');
