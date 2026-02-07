import { useMemo, useState } from "react";

const API = "https://neongigs.onrender.com";

function Block({ title, subtitle, children }) {
  return (
    <div
      style={{
        border: "1px solid rgba(255,255,255,.10)",
        borderRadius: 16,
        padding: 16,
        background:
          "radial-gradient(800px 250px at 20% 0%, rgba(103,208,238,.10), transparent 60%), radial-gradient(700px 250px at 80% 0%, rgba(110,120,255,.10), transparent 60%), #0f1115",
        boxShadow: "0 10px 30px rgba(0,0,0,.25)",
      }}
    >
      <div style={{ display: "flex", alignItems: "baseline", justifyContent: "space-between", gap: 12 }}>
        <div>
          <div style={{ fontWeight: 900, fontSize: 16 }}>{title}</div>
          {subtitle ? <div style={{ opacity: 0.75, fontSize: 12, marginTop: 4 }}>{subtitle}</div> : null}
        </div>
      </div>
      <div style={{ marginTop: 12 }}>{children}</div>
    </div>
  );
}

function CodeBox({ value, maxHeight = 260 }) {
  return (
    <pre
      style={{
        background: "#0b0d10",
        padding: 12,
        borderRadius: 12,
        overflowX: "auto",
        border: "1px solid rgba(255,255,255,.10)",
        maxHeight,
        overflowY: "auto",
        whiteSpace: "pre-wrap",
        wordBreak: "break-word",
        lineHeight: 1.45,
        fontSize: 12.5,
      }}
    >
      {value || ""}
    </pre>
  );
}

function Btn({ children, onClick, disabled, variant = "primary" }) {
  const styles =
    variant === "primary"
      ? {
          background: disabled ? "#1b1f2a" : "#111827",
          border: "1px solid rgba(255,255,255,.10)",
          color: "#eaf2ff",
        }
      : variant === "ghost"
      ? {
          background: disabled ? "#0f1115" : "transparent",
          border: "1px solid rgba(255,255,255,.10)",
          color: "#eaf2ff",
        }
      : {
          background: disabled ? "#1b1f2a" : "#0b1220",
          border: "1px solid rgba(103,208,238,.35)",
          color: "#eaf2ff",
        };

  return (
    <button
      onClick={onClick}
      disabled={disabled}
      style={{
        ...styles,
        padding: "10px 12px",
        borderRadius: 12,
        fontWeight: 800,
        cursor: disabled ? "not-allowed" : "pointer",
        transition: "transform .06s ease",
      }}
      onMouseDown={(e) => {
        if (!disabled) e.currentTarget.style.transform = "scale(0.98)";
      }}
      onMouseUp={(e) => {
        e.currentTarget.style.transform = "scale(1)";
      }}
      onMouseLeave={(e) => {
        e.currentTarget.style.transform = "scale(1)";
      }}
    >
      {children}
    </button>
  );
}

export default function OpenSSLLab() {
  const [keyId, setKeyId] = useState("");
  const [publicKey, setPublicKey] = useState("");
  const [message, setMessage] = useState("Hello OpenSSL from NeonGigs");
  const [signatureB64, setSignatureB64] = useState("");
  const [encryptedB64, setEncryptedB64] = useState("");
  const [sha256, setSha256] = useState("");
  const [certPem, setCertPem] = useState("");
  const [certText, setCertText] = useState("");
  const [verified, setVerified] = useState(null);
  const [lastPing, setLastPing] = useState(null);
  const [commandLog, setCommandLog] = useState([]);
  const [status, setStatus] = useState({ kind: "idle", text: "" });

  const nextStep = useMemo(() => {
    if (!keyId) return "Step 1: Generate RSA key pair";
    if (keyId && !encryptedB64 && !sha256 && !signatureB64) return "Step 2: Encrypt / Hash / Sign message";
    if (signatureB64 && verified === null) return "Step 3: Verify signature";
    if (!certPem) return "Step 4: Create self-signed X.509 certificate";
    return "Done: Download cert/key files + screenshot outputs for writeup";
  }, [keyId, encryptedB64, sha256, signatureB64, verified, certPem]);

  async function call(path, method = "GET", body = null) {
    setStatus({ kind: "loading", text: `${method} ${path}` });
    try {
      const res = await fetch(`${API}${path}`, {
        method,
        headers: body ? { "Content-Type": "application/json" } : undefined,
        body: body ? JSON.stringify(body) : undefined,
      });

      const ct = res.headers.get("content-type") || "";
      if (!ct.includes("application/json")) {
        const text = await res.text();
        throw new Error(`Non-JSON response (${res.status}). ${text.slice(0, 200)}`);
      }

      const data = await res.json();

      if (data?.ping) setLastPing(data.ping);
      if (data?.commands) setCommandLog(data.commands);

      if (!res.ok || data?.ok === false) {
        throw new Error(data?.error || `Request failed (${res.status})`);
      }

      setStatus({ kind: "ok", text: "OK" });
      return data;
    } catch (e) {
      setStatus({ kind: "err", text: e.message || "Error" });
      throw e;
    }
  }

  function downloadText(filename, text, mime = "text/plain") {
    const blob = new Blob([text], { type: mime });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = filename;
    document.body.appendChild(a);
    a.click();
    a.remove();
    URL.revokeObjectURL(url);
  }

  function downloadFromBackend(type) {
    // Requires backend endpoint:
    // GET /api/openssl/download/:keyId/:type where type = public | private | cert
    if (!keyId) return;
    window.open(`${API}/api/openssl/download/${keyId}/${type}`, "_blank");
  }

  async function checkVersion() {
    await call("/api/openssl/version");
  }

  async function genKeys() {
    const data = await call("/api/openssl/keys", "POST");
    setKeyId(data.keyId || "");
    setPublicKey(data.publicKey || "");
    setEncryptedB64("");
    setSha256("");
    setSignatureB64("");
    setVerified(null);
    setCertPem("");
    setCertText("");
  }

  async function doEncrypt() {
    const data = await call("/api/openssl/encrypt", "POST", { keyId, message });
    setEncryptedB64(data.encryptedB64 || "");
  }

  async function doHash() {
    const data = await call("/api/openssl/hash", "POST", { message });
    setSha256(data.sha256 || "");
  }

  async function doSign() {
    const data = await call("/api/openssl/sign", "POST", { keyId, message });
    setSignatureB64(data.signatureB64 || "");
    setVerified(null);
  }

  async function doVerify() {
    const data = await call("/api/openssl/verify", "POST", { keyId, message, signatureB64 });
    setVerified(!!data.verified);
  }

  async function doCert() {
    const data = await call("/api/openssl/cert", "POST", { keyId });
    setCertPem(data.certPem || "");
    setCertText(data.certText || "");
  }

  function copy(text) {
    if (!text) return;
    navigator.clipboard.writeText(text);
    setStatus({ kind: "ok", text: "Copied to clipboard" });
    setTimeout(() => setStatus({ kind: "idle", text: "" }), 900);
  }

  const bannerBg =
    status.kind === "err"
      ? "rgba(255,92,92,.12)"
      : status.kind === "loading"
      ? "rgba(110,120,255,.12)"
      : "rgba(103,208,238,.10)";

  const bannerBorder =
    status.kind === "err"
      ? "rgba(255,92,92,.35)"
      : status.kind === "loading"
      ? "rgba(110,120,255,.35)"
      : "rgba(103,208,238,.30)";

  return (
    <div
      style={{
        minHeight: "100vh",
        background:
          "radial-gradient(900px 500px at 50% -10%, rgba(103,208,238,.18), transparent 60%), radial-gradient(700px 500px at 80% 10%, rgba(110,120,255,.12), transparent 60%), #070a12",
        color: "#eaf2ff",
        padding: 22,
        fontFamily: "Inter, system-ui, Segoe UI, Arial",
      }}
    >
      <div style={{ maxWidth: 1150, margin: "0 auto" }}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", gap: 14, flexWrap: "wrap" }}>
          <div>
            <div style={{ fontSize: 30, fontWeight: 950, letterSpacing: 0.2 }}>OpenSSL Security Lab (RSA)</div>
            <div style={{ opacity: 0.78, marginTop: 6 }}>
              Demonstrates <b>confidentiality</b> (encryption), <b>integrity</b> (hash), <b>authentication</b> +{" "}
              <b>non-repudiation</b> (digital signatures), and <b>certificate creation</b>.
            </div>
            <div style={{ marginTop: 10, opacity: 0.9, fontWeight: 800 }}>Next: {nextStep}</div>
          </div>

          <div style={{ display: "flex", gap: 10, flexWrap: "wrap" }}>
            <Btn variant="ghost" onClick={checkVersion}>
              Check OpenSSL Version
            </Btn>
            <Btn variant="accent" onClick={genKeys}>
              Generate New Keys
            </Btn>
          </div>
        </div>

        <div
          style={{
            marginTop: 14,
            padding: 12,
            borderRadius: 14,
            border: `1px solid ${bannerBorder}`,
            background: bannerBg,
          }}
        >
          <div style={{ display: "flex", gap: 10, flexWrap: "wrap", alignItems: "center", justifyContent: "space-between" }}>
            <div style={{ fontWeight: 900 }}>
              {status.kind === "idle" ? "Ready" : status.kind === "loading" ? "Running..." : status.kind === "err" ? "Error" : "OK"}
              {status.text ? <span style={{ fontWeight: 650, opacity: 0.85 }}> — {status.text}</span> : null}
            </div>
            {lastPing ? (
              <div style={{ opacity: 0.85, fontSize: 13 }}>
                <b>PING ACK:</b> requestId {lastPing.requestId} — {new Date(lastPing.at).toLocaleString()}
              </div>
            ) : (
              <div style={{ opacity: 0.75, fontSize: 13 }}>No ping yet</div>
            )}
          </div>
        </div>

        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 14, marginTop: 14 }}>
          <Block
            title="1) Public / Private Key Pair Generation"
            subtitle="Creates 2048-bit RSA keypair on backend (Render). You receive keyId + public key."
          >
            <div style={{ display: "flex", gap: 10, flexWrap: "wrap" }}>
              <Btn onClick={genKeys}>Generate RSA Keys</Btn>
              <Btn variant="ghost" disabled={!publicKey} onClick={() => copy(publicKey)}>
                Copy Public Key
              </Btn>
              <Btn variant="ghost" disabled={!keyId} onClick={() => downloadFromBackend("public")}>
                Download Public Key
              </Btn>
              <Btn variant="ghost" disabled={!keyId} onClick={() => downloadFromBackend("private")}>
                Download Private Key
              </Btn>
            </div>

            <div style={{ marginTop: 10, opacity: 0.9 }}>
              <b>keyId:</b> {keyId || "(none yet)"}
            </div>

            <div style={{ marginTop: 10 }}>
              <div style={{ opacity: 0.8, marginBottom: 6, fontWeight: 800 }}>Public Key (PEM)</div>
              <CodeBox value={publicKey} maxHeight={220} />
            </div>
          </Block>

          <Block title="Message Input" subtitle="This message is used for Encrypt / Hash / Sign / Verify.">
            <textarea
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              rows={6}
              style={{
                width: "100%",
                padding: 12,
                borderRadius: 12,
                border: "1px solid rgba(255,255,255,.10)",
                background: "#0b0d10",
                color: "#eaf2ff",
                outline: "none",
                resize: "vertical",
              }}
            />
            <div style={{ display: "flex", gap: 10, marginTop: 10, flexWrap: "wrap" }}>
              <Btn variant="ghost" disabled={!message} onClick={() => copy(message)}>
                Copy Message
              </Btn>
              <Btn
                variant="ghost"
                onClick={() => {
                  setMessage("Hello OpenSSL from NeonGigs");
                  setEncryptedB64("");
                  setSha256("");
                  setSignatureB64("");
                  setVerified(null);
                }}
              >
                Reset Message
              </Btn>
            </div>
          </Block>

          <Block title="2) Confidentiality — Public Key Encryption" subtitle="Encrypts your message using the generated public key (RSA).">
            <div style={{ display: "flex", gap: 10, flexWrap: "wrap" }}>
              <Btn disabled={!keyId} onClick={doEncrypt}>
                Encrypt Message
              </Btn>
              <Btn variant="ghost" disabled={!encryptedB64} onClick={() => copy(encryptedB64)}>
                Copy Ciphertext (Base64)
              </Btn>
              <Btn
                variant="ghost"
                disabled={!encryptedB64}
                onClick={() => downloadText("ciphertext.base64.txt", encryptedB64, "text/plain")}
              >
                Download Ciphertext
              </Btn>
            </div>
            <div style={{ marginTop: 12 }}>
              <div style={{ opacity: 0.8, marginBottom: 6, fontWeight: 800 }}>Ciphertext (Base64)</div>
              <CodeBox value={encryptedB64} maxHeight={220} />
            </div>
          </Block>

          <Block title="3) Integrity — Hash Function (SHA-256)" subtitle="Computes SHA-256 hash of the message.">
            <div style={{ display: "flex", gap: 10, flexWrap: "wrap" }}>
              <Btn onClick={doHash}>Hash Message</Btn>
              <Btn variant="ghost" disabled={!sha256} onClick={() => copy(sha256)}>
                Copy Hash
              </Btn>
              <Btn variant="ghost" disabled={!sha256} onClick={() => downloadText("sha256.txt", sha256, "text/plain")}>
                Download Hash
              </Btn>
            </div>
            <div style={{ marginTop: 12 }}>
              <div style={{ opacity: 0.8, marginBottom: 6, fontWeight: 800 }}>SHA-256</div>
              <CodeBox value={sha256} maxHeight={160} />
            </div>
          </Block>

          <Block title="4) Authentication + Non-Repudiation — Digital Signature" subtitle="Signs SHA-256(message) using private key (RSA).">
            <div style={{ display: "flex", gap: 10, flexWrap: "wrap" }}>
              <Btn disabled={!keyId} onClick={doSign}>
                Sign Message
              </Btn>
              <Btn variant="ghost" disabled={!signatureB64} onClick={() => copy(signatureB64)}>
                Copy Signature (Base64)
              </Btn>
              <Btn
                variant="ghost"
                disabled={!signatureB64}
                onClick={() => downloadText("signature.base64.txt", signatureB64, "text/plain")}
              >
                Download Signature
              </Btn>
            </div>
            <div style={{ marginTop: 12 }}>
              <div style={{ opacity: 0.8, marginBottom: 6, fontWeight: 800 }}>Signature (Base64)</div>
              <CodeBox value={signatureB64} maxHeight={220} />
            </div>
          </Block>

          <Block title="5) Verify Signature" subtitle="Verifies signature using the public key. If message/signature changes → FAIL.">
            <div style={{ display: "flex", gap: 10, flexWrap: "wrap", alignItems: "center" }}>
              <Btn disabled={!keyId || !signatureB64} onClick={doVerify}>
                Verify Signature
              </Btn>
              <div style={{ fontWeight: 950, fontSize: 14, opacity: 0.95 }}>
                {verified === null ? (
                  <span style={{ opacity: 0.7 }}>Not verified yet</span>
                ) : verified ? (
                  <span>Verified OK ✅</span>
                ) : (
                  <span>Verification FAILED ❌</span>
                )}
              </div>
            </div>
            <div style={{ marginTop: 10, opacity: 0.78, fontSize: 12.5 }}>
              Tip: change one character in the message and run Verify again — it should fail (integrity check).
            </div>
          </Block>

          <Block title="6) Certificate Creation (Self-signed X.509)" subtitle="Creates cert.pem from your RSA private key and shows x509 -text output.">
            <div style={{ display: "flex", gap: 10, flexWrap: "wrap" }}>
              <Btn disabled={!keyId} onClick={doCert}>
                Create Certificate
              </Btn>
              <Btn variant="ghost" disabled={!certPem} onClick={() => copy(certPem)}>
                Copy cert.pem
              </Btn>
              <Btn variant="ghost" disabled={!keyId} onClick={() => downloadFromBackend("cert")}>
                Download cert.pem
              </Btn>
              <Btn variant="ghost" disabled={!certPem} onClick={() => downloadText("cert.pem", certPem, "application/x-pem-file")}>
                Download cert.pem (from page)
              </Btn>
            </div>

            <div style={{ marginTop: 12 }}>
              <div style={{ opacity: 0.8, marginBottom: 6, fontWeight: 800 }}>Certificate (PEM)</div>
              <CodeBox value={certPem} maxHeight={220} />
            </div>

            <div style={{ marginTop: 12 }}>
              <div style={{ opacity: 0.8, marginBottom: 6, fontWeight: 800 }}>openssl x509 -text output</div>
              <CodeBox value={certText} maxHeight={260} />
            </div>
          </Block>
        </div>

        <div style={{ marginTop: 14 }}>
          <Block title="Command Log (exact commands executed / CLI equivalent)" subtitle="Copy these into your writeup as ‘Study of OpenSSL commands’ proof.">
            <div style={{ display: "flex", gap: 10, flexWrap: "wrap", marginBottom: 10 }}>
              <Btn variant="ghost" disabled={!commandLog?.length} onClick={() => copy((commandLog || []).join("\n"))}>
                Copy Command Log
              </Btn>
              <Btn
                variant="ghost"
                disabled={!commandLog?.length}
                onClick={() => downloadText("openssl-command-log.txt", (commandLog || []).join("\n"), "text/plain")}
              >
                Download Command Log
              </Btn>
            </div>
            <CodeBox value={(commandLog || []).join("\n")} maxHeight={260} />
          </Block>
        </div>

        <div style={{ marginTop: 14, opacity: 0.75, fontSize: 12 }}>
          Backend: {API} — Endpoints used: /api/openssl/keys, /encrypt, /hash, /sign, /verify, /cert, /download/:keyId/:type
        </div>
      </div>
    </div>
  );
}
