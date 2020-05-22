/**
 * Create DNS Record Action for GitHub
 * https://github.com/marketplace/actions/create-dns-record
 */

const path = require("path");
const cp = require("child_process");

// https://api.cloudflare.com/#dns-records-for-a-zone-create-dns-record
const res = cp.spawnSync("curl", [
  ...["--request", "POST"],
  ...["--header", `Authorization: Bearer ${process.env.INPUT_TOKEN}`],
  ...["--header", "Content-Type: application/json"],
  ...["--silent", "--data"],
  JSON.stringify({
    type: process.env.INPUT_TYPE,
    name: process.env.INPUT_NAME,
    content: process.env.INPUT_CONTENT,
    ttl: Number(process.env.INPUT_TTL),
    proxied: Boolean(process.env.INPUT_PROXIED),
  }),
  `https://api.cloudflare.com/client/v4/zones/${process.env.INPUT_ZONE}/dns_records`,
]);

if (res.status !== 0) {
  process.exit(res.status);
}

const { success, result, errors } = JSON.parse(res.stdout.toString());

if (!success) {
  console.dir(errors[0]);
  console.log(`::error ::${errors[0].message}`);
  process.exit(1);
}

console.dir(result);
console.log(`::set-output name=id::${result.id}`);
console.log(`::set-output name=name::${result.name}`);
