exports.generationsQuery = `INSERT INTO generations(generation)
                            VALUES ($1), ($2), ($3), ($4), ($5),
                            ($6), ($7), ($8), ($9);`;

exports.generationsData = [
  "I",
  "II",
  "III",
  "IV",
  "V",
  "VI",
  "VII",
  "VIII",
  "IX",
];

exports.typeQuery = `INSERT INTO types(type)
                    VALUES ($1), ($2), ($3), ($4), ($5), ($6), ($7), ($8),
                            ($9), ($10), ($11), ($12), ($13), ($14), ($15), ($16),
                            ($17), ($18), ($19);`;

exports.typeData = [
  "Normal",
  "Fighting",
  "Flying",
  "Poison",
  "Ground",
  "Rock",
  "Bug",
  "Ghost",
  "Steel",
  "Fire",
  "Water",
  "Grass",
  "Electric",
  "Psychic",
  "Ice",
  "Dragon",
  "Dark",
  "Fairy",
  "-",
];
