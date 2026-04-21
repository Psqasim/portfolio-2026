# Contract: Web3Forms submission

**Endpoint**: `POST https://api.web3forms.com/submit`
**Auth**: access key in request body; no header auth.
**Referenced by**: FR-026, FR-027, FR-028, SC-005.

## Request

Content-Type: `multipart/form-data` (preferred — what the client component
uses via `new FormData(form)`) or `application/json`.

### Required fields

| Field | Source | Constraint |
|-------|--------|------------|
| `access_key` | `process.env.NEXT_PUBLIC_WEB3FORMS_KEY` | Non-empty; public-safe. |
| `name` | User input | 1 ≤ len ≤ 100. Trim whitespace. |
| `email` | User input | Matches RFC-lite regex `/^[^\s@]+@[^\s@]+\.[^\s@]+$/`. |
| `message` | User input | 1 ≤ len ≤ 4000. |

### Recommended fields (send but not required)

| Field | Value | Why |
|-------|-------|-----|
| `from_name` | `"portfolio-2026"` | Distinguishes this form from others on the same Web3Forms key. |
| `subject` | `"Portfolio contact: ${name}"` | Human-readable inbox subject. |
| `honeypot` | `""` (hidden `<input name="honeypot" tabindex="-1">`) | Spam mitigation. Reject submissions where value is non-empty on the client before POST. |

### Example

```http
POST /submit HTTP/1.1
Host: api.web3forms.com
Content-Type: multipart/form-data; boundary=----x

------x
Content-Disposition: form-data; name="access_key"

00000000-0000-0000-0000-000000000000
------x
Content-Disposition: form-data; name="name"

Jane Doe
------x
Content-Disposition: form-data; name="email"

jane@example.com
------x
Content-Disposition: form-data; name="message"

Hi Qasim — let's talk.
------x--
```

## Response

Content-Type: `application/json`.

### Success

```json
{
  "success": true,
  "message": "Email sent successfully",
  "data": { ... }
}
```

→ Show success toast (FR-027). Clear form fields. Auto-dismiss after 6 s.

### Failure (service or validation error)

```json
{
  "success": false,
  "message": "Invalid access key"
}
```

HTTP status may be `200` with `success: false`, or `4xx`/`5xx`. Client
MUST treat `success !== true` as an error regardless of HTTP status.

→ Show error toast with `message` (fall back to generic copy if absent).
Retain form values so the visitor can retry. Log `message` to `console.warn`
for developer diagnostics.

### Network error / timeout

→ `fetch` rejects or `AbortController` fires (8 s timeout recommended).
Show generic "Network trouble — please retry" toast. Retain form values.

## Failure-mode SLO

SC-005: ≥ 99 % of submissions on a stable network receive a toast
(success or error) within 5 seconds of pressing Send. Implementation
note: set the `AbortController` timeout to 8 s (to absorb slow hops)
but expect well under 5 s for the median.

## Security notes

- `NEXT_PUBLIC_WEB3FORMS_KEY` is intentionally public (inlined at build).
  Web3Forms enforces per-key rate limits and abuse detection; no secret
  material needed on our side.
- No file uploads accepted in Sprint 1 (Name / Email / Message only).
- CSRF: not applicable (no session, no cookies); origin checks happen
  at Web3Forms based on dashboard-allowed domains.
- Honeypot field blocks naive bots; Web3Forms additionally provides
  hCaptcha if abuse escalates (out of scope for Sprint 1).
