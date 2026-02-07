import { useState } from "react";

const API = "https://neongigs.onrender.com";

function Block({ title, children }) {
  return (
    <div style={{ border: "1px solid #2b2b2b", borderRadius: 12, padding: 16, background: "#0f1115" }}>
      <div style={{ fontWeight: 700, marginBottom: 10 }}>{title}</div>
      {children}
    </div>
  );
}

function CodeBox({ value }) {
  return (
    <pre style={{ background: "#0b0d10", padding: 12, borderRadius: 10, overflowX: "auto", border: "1px solid #232323" }}>
      {value || ""}
    </pre>
  );
}

export default function OpenSSLLab() {
  const [keyId, setKeyId] = useState("");
  const [message, setMessage] = useState("Hello OpenSSL from NeonGigs");
  const [signatureB64, setSignatureB64] = useState("");
  const [encryptedB64, setEncryptedB64] = useState("");
  const [sha256, setSha256] = useState("");
  const [certPem, setCertPem] = useState("");
  const [certText, setCertText] = useState("");
  const [verified, setVerified] = useState(null);
  const [lastPing, setLastPing] = useState(null);
  const [commandLog, setCommandLog] = useState([]);

  async function call(path, method = "GET", body = null) {
    const res = await fetch(`${API}${path}`, {
      method,
      headers: body ? { "Content-Type": "application/json" } : undefined,
      body: body ? JSON.stringify(body) : undefined,
    });

    const data = await res.json();

    if (data?.ping) setLastPing(data.ping);
    if (data?.commands) setCommandLog(data.commands);

    return data;
  }

  async function checkVersion() {
    await call("/api/openssl/version");
  }

  async function genKeys() {
    const data = await call("/api/openssl/keys", "POST");
    if (data.ok) setKeyId(data.keyId);
  }

  async function doEncrypt() {
    const data = await call("/api/openssl/encrypt", "POST", { keyId, message });
    if (data.ok) setEncryptedB64(data.encryptedB64);
  }

  async function doHash() {
    const data = await call("/api/openssl/hash", "POST", { message });
    if (data.ok) setSha256(data.sha256);
  }

  async function doSign() {
    const data = await call("/api/openssl/sign", "POST", { keyId, message });
    if (data.ok) setSignatureB64(data.signatureB64);
  }

  async function doVerify() {
    const data = await call("/api/openssl/verify", "POST", { keyId, message, signatureB64 });
    if (data.ok) setVerified(!!data.verified);
  }

  async function doCert() {
    const data = await call("/api/openssl/cert", "POST", { keyId });
    if (data.ok) {
      setCertPem(data.certPem);
      setCertText(data.certText);
    }
  }

  return (
    <div style={{ minHeight: "100vh", background: "#070a12", color: "#eaf2ff", padding: 24, fontFamily: "Inter, system-ui, Arial" }}>
      <div style={{ maxWidth: 1100, margin: "0 auto" }}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 18 }}>
          <div>
            <div style={{ fontSize: 28, fontWeight: 800 }}>OpenSSL Security Lab</div>
            <div style={{ opacity: 0.8, marginTop: 4 }}>
              RSA (keys, encryption, hash, signature, verify, certificate). Backend runs OpenSSL on Render and returns outputs + command log.
            </div>
          </div>
          <button onClick={checkVersion} style={{ padding: "10px 14px", borderRadius: 10, border: "1px solid #2a2a2a", background: "#111827", color: "#eaf2ff" }}>
            Check OpenSSL Version
          </button>
        </div>

        {lastPing && (
          <div style={{ marginBottom: 16, padding: 12, borderRadius: 12, border: "1px solid #233", background: "#0b1220" }}>
            <b>PING ACKNOWLEDGED</b> — requestId: {lastPing.requestId} — at: {lastPing.at}
          </div>
        )}

        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 14 }}>
          <Block title="1) Generate Public/Private Key Pair">
            <button onClick={genKeys} style={{ padding: "10px 14px", borderRadius: 10, border: "1px solid #2a2a2a", background: "#111827", color: "#eaf2ff" }}>
              Generate RSA Keys
            </button>
            <div style={{ marginTop: 10, opacity: 0.85 }}>keyId: {keyId || "(none yet)"}</div>
          </Block>

          <Block title="Input Message">
            <textarea
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              rows={4}
              style={{ width: "100%", padding: 10, borderRadius: 10, border: "1px solid #2a2a2a", background: "#0b0d10", color: "#eaf2ff" }}
            />
          </Block>

          <Block title="2) Public Key Encryption (Confidentiality)">
            <button disabled={!keyId} onClick={doEncrypt} style={{ padding: "10px 14px", borderRadius: 10, border: "1px solid #2a2a2a", background: keyId ? "#111827" : "#1b1f2a", color: "#eaf2ff" }}>
              Encrypt
            </button>
            <div style={{ marginTop: 10 }}>
              <CodeBox value={encryptedB64} />
            </div>
          </Block>

          <Block title="3) Hash Function SHA-256 (Integrity)">
            <button onClick={doHash} style={{ padding: "10px 14px", borderRadius: 10, border: "1px solid #2a2a2a", background: "#111827", color: "#eaf2ff" }}>
              Hash
            </button>
            <div style={{ marginTop: 10 }}>
              <CodeBox value={sha256} />
            </div>
          </Block>

          <Block title="4) Digital Signature (Authentication + Non-repudiation)">
            <button disabled={!keyId} onClick={doSign} style={{ padding: "10px 14px", borderRadius: 10, border: "1px solid #2a2a2a", background: keyId ? "#111827" : "#1b1f2a", color: "#eaf2ff" }}>
              Sign
            </button>
            <div style={{ marginTop: 10 }}>
              <CodeBox value={signatureB64} />
            </div>
          </Block>

          <Block title="5) Verify Signature">
            <button disabled={!keyId || !signatureB64} onClick={doVerify} style={{ padding: "10px 14px", borderRadius: 10, border: "1px solid #2a2a2a", background: keyId && signatureB64 ? "#111827" : "#1b1f2a", color: "#eaf2ff" }}>
              Verify
            </button>
            <div style={{ marginTop: 10, fontWeight: 700 }}>
              {verified === null ? "Not verified yet" : verified ? "Verified OK ✅" : "Verification FAILED ❌"}
            </div>
          </Block>

          <Block title="6) Certificate Creation (Self-signed X.509)">
            <button disabled={!keyId} onClick={doCert} style={{ padding: "10px 14px", borderRadius: 10, border: "1px solid #2a2a2a", background: keyId ? "#111827" : "#1b1f2a", color: "#eaf2ff" }}>
              Create Certificate
            </button>
            <div style={{ marginTop: 10 }}>
              <div style={{ opacity: 0.85, marginBottom: 6 }}>certificate.pem</div>
              <CodeBox value={certPem} />
              <div style={{ opacity: 0.85, margin: "10px 0 6px" }}>openssl x509 -text output</div>
              <CodeBox value={certText} />
            </div>
          </Block>
        </div>

        <div style={{ marginTop: 14 }}>
          <Block title="Command Log (what the server executed / equivalent CLI)">
            <CodeBox value={(commandLog || []).join("\n")} />
          </Block>
        </div>
      </div>
    </div>
  );
}
