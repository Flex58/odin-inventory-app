require("dotenv").config();
const { Client } = require("pg");

const tableGeneration = `CREATE TABLE IF NOT EXISTS 
generations (id INTEGER PRIMARY KEY GENERATED ALWAYS AS IDENTITY, generation INT);`;

const tableTypes = `CREATE TABLE IF NOT EXISTS 
types (id INT PRIMARY KEY GENERATED ALWAYS AS IDENTITY, type VARCHAR(50));`;

const tableTrainer = `
CREATE TYPE gender AS ENUM ('male', 'female', 'other');
CREATE TABLE IF NOT EXISTS
trainers (id INT PRIMARY KEY GENERATED ALWAYS AS IDENTITY, name VARCHAR(50),
        gender gender, generation INT REFERENCES generations(id), pos INT);`;

const tablePokemon = `CREATE TABLE IF NOT EXISTS 
pokemon(dexnr INT PRIMARY KEY, name VARCHAR(50), primary_type INT REFERENCES types(id), 
        secondary_type INT REFERENCES types(id), generation INT REFERENCES generations(id), mega_evolution BOOL);`;

const main = async () => {
  console.log("Seeding....");
  const client = new Client();
  await client.connect();
  await client.query(tableGeneration);
  await client.query(tableTypes);
  await client.query(tablePokemon);
  await client.query(tableTrainer);
  await client.end();
  console.log("Done");
};

main();
