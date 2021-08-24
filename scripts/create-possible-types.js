const fetch = require("node-fetch");
const fs = require("fs");
const path = require("path");

fetch(`https://n04.d.vega.xyz/query`, {
  method: "POST",
  headers: { "Content-Type": "application/json" },
  body: JSON.stringify({
    variables: {},
    query: `
      {
        __schema {
          types {
            kind
            name
            possibleTypes {
              name
            }a
          }
        }
      }
    `,
  }),
})
  .then((result) => result.json())
  .then((result) => {
    const possibleTypes = {};

    result.data.__schema.types.sort().forEach((supertype) => {
      if (supertype.possibleTypes) {
        possibleTypes[supertype.name] = supertype.possibleTypes
          .map((subtype) => subtype.name)
          .sort();
      }
    });

    // Sort in to alphabetical order to avoid large diffs every time this is regenerated
    const sortedPossibleTypes = Object.keys(possibleTypes)
      .sort()
      .reduce(
        (acc, key) => ({
          ...acc,
          [key]: possibleTypes[key],
        }),
        {}
      );
    const formattedPossibleTypes = JSON.stringify(sortedPossibleTypes, null, 2);

    const file = path.resolve(__dirname, "..", "src", "possible-types.ts");

    fs.writeFile(
      file,
      `export const possibleTypes = ${formattedPossibleTypes}`,
      (err) => {
        if (err) {
          console.error("Error writing possibleTypes.json", err);
        } else {
          console.log("Fragment types successfully extracted!");
        }
      }
    );
  });
