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

exports.getAllTeams = async () => {
  const { rows } = await pool.query(`
    SELECT teams.*, p1.name as poke1, p2.name as poke2, p3.name as poke3, 
    p4.name as poke4, p5.name as poke5, p6.name as poke6 FROM teams
    JOIN pokemon as p1
    ON teams.pokemon_one = p1.dexnr
    LEFT JOIN pokemon as p2
    ON teams.pokemon_two = p2.dexnr
    LEFT JOIN pokemon as p3
    ON teams.pokemon_three = p3.dexnr
    LEFT JOIN pokemon as p4
    ON teams.pokemon_four = p4.dexnr
    LEFT JOIN pokemon as p5
    ON teams.pokemon_five = p5.dexnr
    LEFT JOIN pokemon as p6
    ON teams.pokemon_six = p6.dexnr;`);
  return rows;
};

exports.getAllTrainers = async () => {
  const { rows } = await pool.query(`
    SELECT trainers.*, teams.name AS teamname, generations.generation AS generationname
    FROM trainers
    LEFT JOIN teams
    ON trainers.team = teams.id
    JOIN generations
    ON trainers.generation = generations.id
    ;
    `);
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

exports.getSinglePokemon = async (dexnr) => {
  const { rows } = await pool.query(
    `SELECT name, dexnr, mega_evolution, generations.generation, t1.type as primary_type, t2.type as secondary_type 
    FROM pokemon
    JOIN types as t1
    ON t1.id = primary_type
    JOIN types as t2
    ON t2.id = secondary_type
    JOIN generations
    ON generations.id = pokemon.generation
    WHERE dexnr = $1;`,
    [dexnr]
  );
  return rows;
};

exports.editPokemon = async (data, dexnr) => {
  const generation = await getGenerationId(data.generation);
  const type1 = await getTypeId(data.type1);
  const type2 = await getTypeId(data.type2);
  await pool.query(
    `
   UPDATE pokemon SET dexnr = $1, name = $2, primary_type = $3, 
                      secondary_type = $4, generation = $5, mega_evolution = $6
   WHERE dexnr = $7 
    `,
    [dexnr, data.name, type1.id, type2.id, generation.id, data.mega, data.dexnr]
  );
};

exports.deletePokemon = async (dexnr) => {
  await pool.query(
    `DELETE FROM teams
                  WHERE pokemon_one = $1
                  AND COALESCE(pokemon_two, pokemon_three, pokemon_four, pokemon_five, pokemon_six) IS NULL;`,
    [dexnr]
  );

  await pool.query(
    `
   UPDATE teams
   SET
    pokemon_two = CASE WHEN pokemon_one IS NOT NULL AND pokemon_two = $1 THEN NULL ELSE pokemon_two END, 
    pokemon_three = CASE WHEN pokemon_one IS NOT NULL AND pokemon_three = $1 THEN NULL ELSE pokemon_three END, 
    pokemon_four = CASE WHEN pokemon_one IS NOT NULL AND pokemon_four = $1 THEN NULL ELSE pokemon_four END, 
    pokemon_five = CASE WHEN pokemon_one IS NOT NULL AND pokemon_five = $1 THEN NULL ELSE pokemon_five END, 
    pokemon_six = CASE WHEN pokemon_one IS NOT NULL AND pokemon_six = $1 THEN NULL ELSE pokemon_six END, 
    pokemon_one = CASE
                WHEN pokemon_one = $1
                AND (pokemon_two IS NOT NULL OR pokemon_three IS NOT NULL 
                OR pokemon_four IS NOT NULL OR pokemon_five IS NOT NULL OR pokemon_six IS NOT NULL)
                THEN NULL
                ELSE pokemon_one
              END;
    `,
    [dexnr]
  );

  await pool.query(`DELETE FROM pokemon WHERE dexnr = $1`, [dexnr]);
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

exports.getSingleTeam = async (id) => {
  const { rows } = await pool.query(`SELECT * FROM teams WHERE id = $1`, [id]);
  return rows[0];
};

exports.editTeam = async(data, id) => {
  await pool.query(`
   UPDATE teams
   SET name = $2, pokemon_one = $3, pokemon_two = $4, pokemon_three = $5,
        pokemon_four = $6, pokemon_five = $7, pokemon_six = $8
        WHERE id = $1;
    `, [id, data.name, data.poke1, data.poke2, data.poke3, data.poke4, data.poke5, data.poke6])
}

exports.deleteTeams = async (id) => {
  await pool.query(`
   UPDATE trainers
   SET team = NULL
   WHERE team = $1 
    `, [id])

  await pool.query(`
   DELETE FROM teams WHERE id = $1 
    `, [id])
}