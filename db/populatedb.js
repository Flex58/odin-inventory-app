require("dotenv").config();
const { Client } = require("pg");
const dbData = require("./populateData");

const tableGeneration = `CREATE TABLE IF NOT EXISTS 
generations (id INTEGER PRIMARY KEY GENERATED ALWAYS AS IDENTITY, generation VARCHAR(4));`;

const tableTypes = `CREATE TABLE IF NOT EXISTS 
types (id INT PRIMARY KEY GENERATED ALWAYS AS IDENTITY, type VARCHAR(50));`;

const tablePokemon = `CREATE TABLE IF NOT EXISTS 
pokemon(dexnr INT PRIMARY KEY, name VARCHAR(50), primary_type INT REFERENCES types(id), 
        secondary_type INT REFERENCES types(id), generation INT REFERENCES generations(id), mega_evolution BOOL);`;

const tableTeam = `CREATE TABLE IF NOT EXISTS 
        teams (id INT PRIMARY KEY GENERATED ALWAYS AS IDENTITY, name VARCHAR(50), 
        pokemon_one INT REFERENCES pokemon(dexnr), pokemon_two INT REFERENCES pokemon(dexnr),
        pokemon_three INT REFERENCES pokemon(dexnr), pokemon_four INT REFERENCES pokemon(dexnr),
        pokemon_five INT REFERENCES pokemon(dexnr), pokemon_six INT REFERENCES pokemon(dexnr));`;

const tableTrainer = `
                DO $$ BEGIN
                CREATE TYPE gender AS ENUM ('male', 'female', 'other');
                EXCEPTION
                WHEN duplicate_object THEN null;
                END $$;
                CREATE TABLE IF NOT EXISTS
                trainers (id INT PRIMARY KEY GENERATED ALWAYS AS IDENTITY, name VARCHAR(50),
                gender gender, generation INT REFERENCES generations(id), pos INT, team INT REFERENCES teams(id) 
                );`;

const main = async () => {
  console.log("Seeding....");
  const client = new Client();
  await client.connect();
  await client.query(tableGeneration);
  await client.query(tableTypes);
  await client.query(tablePokemon);
  await client.query(tableTrainer);
  await client.query(tableTeam);
  await client.query(dbData.generationsQuery, dbData.generationsData);
  await client.query(dbData.typeQuery, dbData.typeData);
  await client.end();
  console.log("Done");
};

main();
