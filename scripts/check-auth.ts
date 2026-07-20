import assert from "node:assert";
import bcrypt from "bcryptjs";
import { verifyPassword } from "../src/helpers/auth";

async function main() {
  const password = "test-password-123";
  process.env.PARTNER_PASSWORD = await bcrypt.hash(password, 10);

  assert.strictEqual(await verifyPassword(password), true, "correct password should verify");
  assert.strictEqual(await verifyPassword("wrong-password"), false, "wrong password should not verify");
  assert.strictEqual(await verifyPassword(""), false, "empty password should not verify");

  console.log("auth check passed");
}

main();
