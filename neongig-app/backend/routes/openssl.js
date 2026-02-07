import express from "express";
import fs from "fs";
import path from "path";
import crypto from "crypto";
import { execFile } from "child_process";

const router = express.Router();
const BASE = "/tmp/openssl-lab";
fs.mkdirSync(BASE, { recursive: true });

function run(cmd, args, input = null) {
  return new Promise((resolve, reject) => {
    const p = execFile(cmd, args, { timeout: 15000 }, (err, stdout, stderr) => {
      if (err) return reject(new Error((stderr || err.message).trim()));
      resolve((stdout || "").toString());
    });
    if (input !== null) {
      p.stdin.write(input);
      p.stdin.end();
    }
  });
}

function id() {
  return crypto.randomBytes(8).toString("hex");
}

function keyPaths(keyId) {
  return {
    dir: path.join(BASE, keyId),
    priv: path.join(BASE, keyId, "private.pem"),
    pub: path.join(BASE, keyId, "public.pem"),
    cert: path.join(BASE, keyId, "cert.pem"),
  };
}

function safeKeyId(keyId) {
  return typeof keyId === "string" && /^[a-f0-9]{16,64}$/i.test(keyId);
}

router.get("/version", async (req, res) => {
  try {
    const out = await run("openssl", ["version"]);
    res.json({ ok: true, output: out.trim() });
  } catch (e) {
    res.status(500).json({ ok: false, error: e.message });
  }
});

router.post("/keys", async (req, res) => {
  const keyId = id();
  const p = keyPaths(keyId);
  fs.mkdirSync(p.dir, { recursive: true });

  const commands = [
    `openssl genpkey -algorithm RSA -out ${p.priv} -pkeyopt rsa_keygen_bits:2048`,
    `openssl rsa -pubout -in ${p.priv} -out ${p.pub}`,
  ];

  try {
    await run("openssl", ["genpkey", "-algorithm", "RSA", "-out", p.priv, "-pkeyopt", "rsa_keygen_bits:2048"]);
    await run("openssl", ["rsa", "-pubout", "-in", p.priv, "-out", p.pub]);

    const publicKey = fs.readFileSync(p.pub, "utf8");
    res.json({
      ok: true,
      keyId,
      publicKey,
      ping: { ack: true, requestId: id(), at: new Date().toISOString() },
      commands,
    });
  } catch (e) {
    res.status(500).json({ ok: false, error: e.message, commands });
  }
});

router.post("/encrypt", async (req, res) => {
  const { keyId, message } = req.body || {};
  if (!safeKeyId(keyId) || typeof message !== "string")
    return res.status(400).json({ ok: false, error: "keyId + message required" });

  const p = keyPaths(keyId);
  const msgPath = path.join(p.dir, "message.txt");
  const encPath = path.join(p.dir, "encrypted.bin");
  fs.writeFileSync(msgPath, message, "utf8");

  const commands = [
    `echo "${message.replaceAll('"', '\\"')}" > ${msgPath}`,
    `openssl pkeyutl -encrypt -inkey ${p.pub} -pubin -in ${msgPath} -out ${encPath}`,
  ];

  try {
    await run("openssl", ["pkeyutl", "-encrypt", "-inkey", p.pub, "-pubin", "-in", msgPath, "-out", encPath]);
    const encryptedB64 = fs.readFileSync(encPath).toString("base64");
    res.json({ ok: true, encryptedB64, ping: { ack: true, requestId: id(), at: new Date().toISOString() }, commands });
  } catch (e) {
    res.status(500).json({ ok: false, error: e.message, commands });
  }
});

router.post("/hash", async (req, res) => {
  const { message } = req.body || {};
  if (typeof message !== "string") return res.status(400).json({ ok: false, error: "message required" });

  const sha256 = crypto.createHash("sha256").update(message, "utf8").digest("hex");
  const commands = [`echo "${message.replaceAll('"', '\\"')}" > message.txt`, `openssl dgst -sha256 message.txt`];

  res.json({ ok: true, sha256, ping: { ack: true, requestId: id(), at: new Date().toISOString() }, commands });
});

router.post("/sign", async (req, res) => {
  const { keyId, message } = req.body || {};
  if (!safeKeyId(keyId) || typeof message !== "string")
    return res.status(400).json({ ok: false, error: "keyId + message required" });

  const p = keyPaths(keyId);
  const msgPath = path.join(p.dir, "sign.txt");
  const sigPath = path.join(p.dir, "signature.sig");
  fs.writeFileSync(msgPath, message, "utf8");

  const commands = [
    `echo "${message.replaceAll('"', '\\"')}" > ${msgPath}`,
    `openssl dgst -sha256 -sign ${p.priv} -out ${sigPath} ${msgPath}`,
  ];

  try {
    await run("openssl", ["dgst", "-sha256", "-sign", p.priv, "-out", sigPath, msgPath]);
    const signatureB64 = fs.readFileSync(sigPath).toString("base64");
    res.json({ ok: true, signatureB64, ping: { ack: true, requestId: id(), at: new Date().toISOString() }, commands });
  } catch (e) {
    res.status(500).json({ ok: false, error: e.message, commands });
  }
});

router.post("/verify", async (req, res) => {
  const { keyId, message, signatureB64 } = req.body || {};
  if (!safeKeyId(keyId) || typeof message !== "string" || typeof signatureB64 !== "string")
    return res.status(400).json({ ok: false, error: "keyId + message + signatureB64 required" });

  const p = keyPaths(keyId);
  const msgPath = path.join(p.dir, "verify.txt");
  const sigPath = path.join(p.dir, "verify.sig");
  fs.writeFileSync(msgPath, message, "utf8");
  fs.writeFileSync(sigPath, Buffer.from(signatureB64, "base64"));

  const commands = [
    `echo "${message.replaceAll('"', '\\"')}" > ${msgPath}`,
    `openssl dgst -sha256 -verify ${p.pub} -signature ${sigPath} ${msgPath}`,
  ];

  try {
    const out = await run("openssl", ["dgst", "-sha256", "-verify", p.pub, "-signature", sigPath, msgPath]);
    res.json({
      ok: true,
      verified: out.toLowerCase().includes("verified ok"),
      output: out.trim(),
      ping: { ack: true, requestId: id(), at: new Date().toISOString() },
      commands,
    });
  } catch (e) {
    res.status(200).json({
      ok: true,
      verified: false,
      output: e.message,
      ping: { ack: true, requestId: id(), at: new Date().toISOString() },
      commands,
    });
  }
});

router.post("/cert", async (req, res) => {
  const { keyId, subject } = req.body || {};
  if (!safeKeyId(keyId)) return res.status(400).json({ ok: false, error: "keyId required" });

  const p = keyPaths(keyId);
  const subj =
    subject && typeof subject === "string"
      ? subject
      : "/C=IN/ST=Maharashtra/L=Mumbai/O=NeonGigs/OU=IT/CN=neongigs.onrender.com";

  const commands = [
    `openssl req -new -x509 -key ${p.priv} -out ${p.cert} -days 365 -subj "${subj}"`,
    `openssl x509 -in ${p.cert} -noout -text`,
  ];

  try {
    await run("openssl", ["req", "-new", "-x509", "-key", p.priv, "-out", p.cert, "-days", "365", "-subj", subj]);
    const certPem = fs.readFileSync(p.cert, "utf8");
    const text = await run("openssl", ["x509", "-in", p.cert, "-noout", "-text"]);
    res.json({ ok: true, certPem, certText: text, ping: { ack: true, requestId: id(), at: new Date().toISOString() }, commands });
  } catch (e) {
    res.status(500).json({ ok: false, error: e.message, commands });
  }
});

/**
 * DOWNLOADS
 * GET /api/openssl/download/:keyId/:type
 * type = public | private | cert
 */
router.get("/download/:keyId/:type", (req, res) => {
  const { keyId, type } = req.params;
  if (!safeKeyId(keyId)) return res.status(400).send("Invalid keyId");

  const p = keyPaths(keyId);
  const map = {
    public: { file: p.pub, name: "public.pem", mime: "application/x-pem-file" },
    private: { file: p.priv, name: "private.pem", mime: "application/x-pem-file" },
    cert: { file: p.cert, name: "cert.pem", mime: "application/x-pem-file" },
  };

  const pick = map[type];
  if (!pick) return res.status(400).send("Invalid type");

  if (!fs.existsSync(pick.file)) return res.status(404).send("Not found");

  res.setHeader("Content-Type", pick.mime);
  res.setHeader("Content-Disposition", `attachment; filename="${pick.name}"`);
  fs.createReadStream(pick.file).pipe(res);
});

export default router;
