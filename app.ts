import db, { Database, RunResult } from "better-sqlite3";
import express, { Request, Response } from "express";
import { readdirSync } from "fs";
const app = express();

type Bindings = undefined | (Date | boolean | number)[];
type Connections = Record<string, Database>;
type FrappeRequest = Request<{ book: keyof Connections }, never, SQLObj, never>;
type SQLObj = {
  sql: string;
  bindings: Bindings;
  response: unknown[] | RunResult;
  context: {
    lastID: RunResult["lastInsertRowid"];
    changes: RunResult["changes"];
  };
};

function formatBindings(bindings: Bindings) {
  if (!bindings) return [];
  return bindings.map((binding) => {
    return binding instanceof Date
      ? binding.valueOf()
      : typeof binding === "boolean"
      ? Number(binding)
      : binding;
  });
}

const books = readdirSync("./books");
const connections = books.reduce((connections, file) => {
  connections[file as keyof Connections] = db(`./books/${file}`);
  return connections;
}, {} as Connections);

app.use(express.json());

app.post("/:book", async (req: FrappeRequest, res: Response) => {
  const obj = req.body;
  const statement = connections[req.params.book].prepare(obj.sql);
  const bindings = formatBindings(obj.bindings);

  if (statement.reader) {
    const response = statement.all(bindings);
    req.body.response = response;
    return res.json(obj);
  }

  const response = statement.run(bindings);
  obj.response = response;
  req.body.context = {
    lastID: response.lastInsertRowid,
    changes: response.changes,
  };

  res.json(req.body);
});

const { PORT } = process.env;
app.listen(PORT ?? 3000, () => {
  // prettier-ignore
  console.log( `server running on ${PORT ?? 3000}, detected books: \n - ${books.join( "\n - ")}`);
});
