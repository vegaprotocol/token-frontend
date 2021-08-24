const fs = require("fs");
const path = require("path");

const file = `${__dirname}/../src/api/vega-graphql/index.ts`;

try {
  // delete index.ts file if it doesnt exist
  if (fs.existsSync(file)) {
    fs.unlinkSync(file);
  }

  let content = `/*
  This file has been generated. You can regenerate by running
  node scripts/create-gql-exports.js
*/\n\n`;

  // get query files
  content += "\n// Queries\n";
  const queries = `${__dirname}/../src/api/vega-graphql/queries`;
  const queryFiles = fs.readdirSync(queries);

  for (const queryFile of queryFiles) {
    if (path.extname(queryFile) === ".ts") {
      content += `export * from './queries/${queryFile.replace(".ts", "")}'\n`;
    }
  }

  // get lib files
  content += "\n// Query types\n";
  const lib = `${__dirname}/../src/api/vega-graphql/lib`;
  const libFiles = fs.readdirSync(lib);

  for (const libFile of libFiles) {
    if (path.extname(libFile) === ".ts") {
      content += `export * from './lib/${libFile.replace(".ts", "")}'\n`;
    }
  }

  // append custom-types export
  content += "\n// Custom types\n";
  content += `export * from './custom-types'`;

  // write new file
  fs.writeFileSync(file, content);

  console.log("Exports successfully written");
} catch (err) {
  console.error(err);
}
