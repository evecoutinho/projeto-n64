const fs = require("fs");
const dotenv = require("dotenv");
const { Schema, model, connect } = require("mongoose");
dotenv.config();

const GameSchema = new Schema({ title: String }, { strict: false });
const Game = model("Game", GameSchema);

const parseJSON = (data) => {
  try {
    return JSON.parse(data);
  } catch (error) {
    return null;
  }
};
const connectToDB = () => {
  const options = {
    useUnifiedTopology: true,
    useNewUrlParser: true,
    useCreateIndex: true,
    userFindAndModify: false,
  };
  return connect(process.env.DATABASE, options);
};

const readGamesFromFile = (fileName) => {
  const promiseCallback = (resolve, reject) => {
    fs.readFile(fileName, (err, data) => {
      if (err) return reject(err);
      const json = parseJSON(data);
      if (!json) return reject(`Not able to parse JSON file ${fileName}`);
      return resolve(json);
    });
  };
  return new Promise(promiseCallback);
};

const storeGame = (data) => {
  const game = new Game(data);
  return game.save();
};

const importGames = async () => {
  await connectToDB();
  const games = await readGamesFromFile("games.json");
  for (let i = 0; i < games.length; i++) {
    const game = games[i];
    await storeGame(game);
    console.log(game.title);
  }
  process.exit();
};

importGames();

// Ler o arquivo JSON
// Fazer um loop entre cada um dos items
// Salvare cada um dos items no banco
