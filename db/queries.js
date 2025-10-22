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

exports.getGeneration = async () => {
  const { rows } = await pool.query("SELECT generation FROM generations;");
  return rows;
};

exports.addPokemon = async (data) => {
  const  generation  = await getGenerationId(data.generation);
  const  type1  = await getTypeId(data.type1);
  const  type2  = await getTypeId(data.type2);
  await pool.query(
    `INSERT INTO pokemon(dexnr, name, primary_type, secondary_type, generation, mega_evolution)
                    VALUES ($1, $2, $3, $4, $5, $6)`,
    [data.dexnr, data.name, type1.id, type2.id, generation.id, data.mega]
  );
};
