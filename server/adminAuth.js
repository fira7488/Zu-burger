const crypto = require("crypto");
const fs = require("fs/promises");
const path = require("path");

const adminFile = path.join(__dirname, "data", "admin.json");
const SCRYPT_KEYLEN = 64;

function hashPassword(password, salt = crypto.randomBytes(16).toString("hex")) {
  const hash = crypto.scryptSync(password, salt, SCRYPT_KEYLEN).toString("hex");
  return { salt, hash };
}

function verifyPassword(password, salt, hash) {
  const candidate = crypto.scryptSync(password, salt, SCRYPT_KEYLEN);
  const stored = Buffer.from(hash, "hex");
  if (candidate.length !== stored.length) return false;
  return crypto.timingSafeEqual(candidate, stored);
}

async function readAdminConfig() {
  try {
    return JSON.parse(await fs.readFile(adminFile, "utf8"));
  } catch (error) {
    if (error.code === "ENOENT") return null;
    throw error;
  }
}

async function writeAdminConfig(config) {
  await fs.mkdir(path.dirname(adminFile), { recursive: true });
  await fs.writeFile(adminFile, `${JSON.stringify(config, null, 2)}\n`);
}

async function ensureAdminConfig(fallbackPassword) {
  const existing = await readAdminConfig();
  if (existing?.passwordSalt && existing?.passwordHash) {
    return existing;
  }

  const { salt, hash } = hashPassword(fallbackPassword);
  const config = {
    passwordSalt: salt,
    passwordHash: hash,
    updatedAt: new Date().toISOString(),
  };
  await writeAdminConfig(config);
  return config;
}

async function verifyAdminPassword(password, fallbackPassword) {
  const config = await ensureAdminConfig(fallbackPassword);
  return verifyPassword(password, config.passwordSalt, config.passwordHash);
}

async function changeAdminPassword(currentPassword, newPassword, fallbackPassword) {
  const config = await ensureAdminConfig(fallbackPassword);

  if (!verifyPassword(currentPassword, config.passwordSalt, config.passwordHash)) {
    return { ok: false, error: "Current password is incorrect." };
  }

  if (newPassword === currentPassword) {
    return { ok: false, error: "New password must be different from the current password." };
  }

  if (String(newPassword).length < 8) {
    return { ok: false, error: "New password must be at least 8 characters." };
  }

  const { salt, hash } = hashPassword(newPassword);
  const updatedAt = new Date().toISOString();
  await writeAdminConfig({
    passwordSalt: salt,
    passwordHash: hash,
    updatedAt,
  });

  return { ok: true, updatedAt };
}

module.exports = {
  ensureAdminConfig,
  verifyAdminPassword,
  changeAdminPassword,
  readAdminConfig,
};
