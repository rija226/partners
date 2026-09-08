const bcrypt = require("bcryptjs");
const readline = require("readline");

async function generateHash(password) {
  return bcrypt.hash(password, 10);
}

async function main() {
  let password = process.argv[2];
  const envVarName = process.argv[3] || "PARTNER_PASSWORD";

  if (!password) {
    const rl = readline.createInterface({ input: process.stdin, output: process.stdout });
    password = await new Promise((resolve) => {
      rl.question("Enter password to hash: ", (answer) => {
        rl.close();
        resolve(answer);
      });
    });
  }

  if (!password) {
    console.error("Error: Password is required");
    process.exit(1);
  }

  const hash = await generateHash(password);
  // Next.js's env loader (dotenv-expand) treats "$" as variable interpolation,
  // which mangles bcrypt hashes like "$2b$10$..." — escape it so the printed
  // line can be pasted into .env.local as-is.
  const envSafeHash = hash.replace(/\$/g, "\\$");
  console.log("\nPassword hash generated:");
  console.log(hash);
  console.log("\nAdd this to your .env.local file (note the escaped $ signs — required):");
  console.log(`${envVarName}=${envSafeHash}\n`);
}

main();
