const pool = require("./pool");

async function getTypeId(type) {
  const { rows } = await pool.query(`SELECT id FROM types WHERE type = $1`, [
    type,
  ]);
  if (!rows) {
    return 19;
  }
  return rows[0];
}

exports.getAllPokemon = async () => {
  const { rows } = await pool.query(`SELECT dexnr, name, mega_evolution, 
    generations.generation, t1.type as primary_type, t2.type as secondary_type 
    FROM pokemon
    JOIN types as t1
    ON t1.id = primary_type
    JOIN types as t2
    ON t2.id = secondary_type
    JOIN generations
    ON generations.id = pokemon.generation;`);
  return rows;
};

async function getGenerationId(gen) {
  const { rows } = await pool.query(
    `SELECT id FROM generations WHERE generation = $1`,
    [gen]
  );
  return rows[0];
}

exports.getTypes = async () => {
  const { rows } = await pool.query("SELECT type FROM types;");
  return rows;
};

exports.getTeams = async () => {
  const { rows } = await pool.query("SELECT id FROM teams");
  return rows;
};

exports.getGeneration = async () => {
  const { rows } = await pool.query("SELECT generation, id FROM generations;");
  return rows;
};

exports.getPokemon = async () => {
  const { rows } = await pool.query("SELECT dexnr, name FROM pokemon");
  return rows;
};

exports.addTeam = async (data) => {
  await pool.query(
    `INSERT INTO teams(name, pokemon_one, pokemon_two, pokemon_three,
                    pokemon_four, pokemon_five, pokemon_six)
                    VALUES ($1, $2, $3, $4, $5, $6, $7);`,
    [
      data.name,
      data.poke1,
      data.poke2,
      data.poke3,
      data.poke4,
      data.poke5,
      data.poke6,
    ]
  );
};

exports.addPokemon = async (data) => {
  const generation = await getGenerationId(data.generation);
  const type1 = await getTypeId(data.type1);
  const type2 = await getTypeId(data.type2);
  await pool.query(
    `INSERT INTO pokemon(dexnr, name, primary_type, secondary_type, generation, mega_evolution)
                    VALUES ($1, $2, $3, $4, $5, $6)`,
    [data.dexnr, data.name, type1.id, type2.id, generation.id, data.mega]
  );
};

exports.addTrainer = async (data) => {
  await pool.query(
    `INSERT INTO trainers(name, gender, pos, generation, team)
     VALUES ($1, $2, $3, $4, $5)`,
    [data.name, data.gender, data.pos, data.generation, data.team]
  );
};
