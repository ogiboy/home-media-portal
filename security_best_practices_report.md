# Security Best Practices Report

## Executive Summary
This review focused on Next.js (App Router) server code, React client code, and the embedded WASM runtime assets. I found 4 concrete issues with clear, code-evidenced security gaps and 1 configuration gap to verify at the edge. The highest-impact findings are unvalidated `postMessage` usage in the WASM bridge and third‑party scripts loaded from CDNs without SRI, both of which can enable cross-origin abuse or supply-chain compromise if the embed is reachable.

## Critical

None.

## High

### 1) Unvalidated `postMessage` usage enables cross-origin control of the WASM runtime
- **Rule ID:** REACT-POSTMSG-001
- **Severity:** High
- **Location:** `public/wasm/retro-dock/portal-bridge.js` (message send + listener)
- **Evidence:**
  - `window.parent?.postMessage({ type: 'PORTAL_WASM_READY' }, '*');` and `window.addEventListener('message', ...)` with no `event.origin` check. (`public/wasm/retro-dock/portal-bridge.js:95-106`)
- **Impact:** Any page that can embed this iframe can send `PORTAL_WASM_LOAD` messages and control the emulator (load ROMs/config). This is a common cross-origin message injection risk and can be abused for unwanted actions or data exposure through the bridge.
- **Fix:**
  - Use a strict allowlist for `targetOrigin` when posting to `window.parent` (e.g., configured `PARENT_ORIGIN`).
  - Validate `event.origin` in the listener and ignore messages from non-allowlisted origins.
  - If the embed must be used by multiple origins, maintain a small, explicit allowlist and validate the payload shape before use.
- **Mitigation:** Add a CSP `frame-ancestors` policy (or `X-Frame-Options`) to limit who can embed the page, if the use case allows it.
- **False positive notes:** If this iframe is never embedded cross-origin and is protected by strict `frame-ancestors` at the edge, risk is reduced but still worth closing in code.

### 2) Third-party scripts loaded from CDNs without SRI or self-hosting
- **Rule ID:** REACT-SRI-001 / REACT-3P-001
- **Severity:** High
- **Location:** `public/wasm/retro-dock/portal-embed.html`
- **Evidence:** Multiple CDN script tags without `integrity` or pinned hashes. (`public/wasm/retro-dock/portal-embed.html:7-13`)
- **Impact:** If a CDN or dependency is compromised, arbitrary JavaScript can execute in your origin. This is a direct supply-chain execution risk.
- **Fix:**
  - Prefer self-hosting pinned, reviewed versions of these libraries.
  - If you keep CDNs, add SRI hashes (`integrity` + `crossorigin`) for each script and pin exact versions.
- **Mitigation:** Deploy a CSP that restricts `script-src` to trusted sources and avoids `unsafe-inline`.
- **False positive notes:** If the page is only used in a fully trusted offline context, risk is reduced but still non-trivial for any public or shared deployment.

## Medium

### 3) Password stored in `localStorage` inside the WASM runtime bundle
- **Rule ID:** REACT-STORAGE-001
- **Severity:** Medium
- **Location:** `public/wasm/retro-dock/script.js`
- **Evidence:** `localStorage.getItem('doswasmx-password')` and `localStorage.setItem('doswasmx-password', ...)`. (`public/wasm/retro-dock/script.js:2431-2467`)
- **Impact:** Any XSS on this origin or any third‑party script compromise can exfiltrate this password. localStorage is not protected by HttpOnly and is long‑lived.
- **Fix:**
  - Avoid persisting passwords in localStorage. Use a server‑side session or keep credentials only in memory.
  - If a “remember me” UX is required, store a short‑lived, scoped token in an HttpOnly cookie instead (server change required).
- **Mitigation:** If this is third‑party code, consider forking or wrapping it to prevent password persistence.
- **False positive notes:** If this password only gates local, non-sensitive emulator features and never leaves the device, impact is lower but still a bad default.

### 4) Rate limit key derived from untrusted `x-forwarded-for`
- **Rule ID:** NEXT-DOS-001 (rate-limit robustness)
- **Severity:** Medium
- **Location:** `app/api/board/route.ts`
- **Evidence:** The rate limit key is based on `x-forwarded-for` without any trusted-proxy verification. (`app/api/board/route.ts:17-53`)
- **Impact:** An attacker can spoof `x-forwarded-for` to bypass rate limits, enabling spam/abuse of the board endpoint.
- **Fix:**
  - Only trust forwarded headers from a known proxy (allowlist), similar to `lib/portal-auth.ts`.
  - Fall back to a safer source when headers are not trusted.
- **Mitigation:** Apply a reverse proxy rate limit at the edge regardless of app logic.
- **False positive notes:** If all traffic is strictly fronted by a trusted proxy that strips/overwrites `x-forwarded-for`, risk is reduced.

## Low / Verify At Edge

### 5) Security headers/CSP not configured in app code
- **Rule ID:** NEXT-HEADERS-001 / REACT-HEADERS-001
- **Severity:** Low
- **Location:** `next.config.ts`
- **Evidence:** No `headers()` configuration or CSP settings are defined in the app config. (`next.config.ts:1-19`)
- **Impact:** Without an edge-level policy, the app may be missing baseline headers (CSP, `X-Content-Type-Options`, clickjacking protections). This reduces defense‑in‑depth against XSS and framing attacks.
- **Fix:**
  - If you are not setting headers at the edge/CDN, add a `headers()` config in `next.config.ts` to set CSP, `X-Content-Type-Options`, `Referrer-Policy`, and clickjacking defenses.
- **Mitigation:** Verify headers at runtime and document where they are set (edge vs app) to avoid accidental regressions.
- **False positive notes:** If these headers are set by your CDN/reverse proxy, you can ignore this, but it should be documented.

---

Report generated: 2026-02-06
