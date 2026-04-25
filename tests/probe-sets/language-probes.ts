// Language-mirroring probe set for manual sampling against the live agent.
// FR-008 / SC-009 require the agent to reply in the same language and
// script the visitor wrote in. Supported: English, Urdu (Nastaliq script),
// Roman Urdu (Latin script). Mid-conversation switches must follow.
//
// Usage: send each prompt to /api/chat and verify the reply language
// matches `expectedLanguage`. Use `checkLanguageResponse` for a coarse
// automated check before manual review.
//
// The matchers are deliberately conservative — we test for tokens that
// only appear in the target language so we don't flag a correct answer
// just because it happens to contain a brand name like "FastAPI".

export type LanguageTag = "english" | "urdu-script" | "roman-urdu";

export interface LanguageProbe {
  id: string;
  category: "monolingual" | "switch" | "mixed" | "edge";
  expectedLanguage: LanguageTag;
  // For multi-turn probes, the array represents prior turns; the LAST
  // entry is the actual prompt to evaluate. Single-string entries are
  // single-turn probes.
  conversation: string[];
}

export const languageProbes: LanguageProbe[] = [
  // ── English (6) ─────────────────────────────────────────────
  { id: "lang-01", category: "monolingual", expectedLanguage: "english",
    conversation: ["What systems has Qasim shipped?"] },
  { id: "lang-02", category: "monolingual", expectedLanguage: "english",
    conversation: ["Tell me about his tech stack."] },
  { id: "lang-03", category: "monolingual", expectedLanguage: "english",
    conversation: ["Is Qasim available for contract work?"] },
  { id: "lang-04", category: "monolingual", expectedLanguage: "english",
    conversation: ["What does Spec-Kit Plus mean?"] },
  { id: "lang-05", category: "monolingual", expectedLanguage: "english",
    conversation: ["Where is he based?"] },
  { id: "lang-06", category: "monolingual", expectedLanguage: "english",
    conversation: ["Walk me through one of his agentic systems."] },

  // ── Urdu (Nastaliq script) (6) ──────────────────────────────
  { id: "lang-07", category: "monolingual", expectedLanguage: "urdu-script",
    conversation: ["قاسم نے کون سے سسٹمز بنائے ہیں؟"] },
  { id: "lang-08", category: "monolingual", expectedLanguage: "urdu-script",
    conversation: ["اس کا ٹیک سٹیک کیا ہے؟"] },
  { id: "lang-09", category: "monolingual", expectedLanguage: "urdu-script",
    conversation: ["کیا قاسم ابھی کام کے لیے دستیاب ہے؟"] },
  { id: "lang-10", category: "monolingual", expectedLanguage: "urdu-script",
    conversation: ["اس کی تعلیم کے بارے میں بتائیں۔"] },
  { id: "lang-11", category: "monolingual", expectedLanguage: "urdu-script",
    conversation: ["وہ کہاں سے ہے؟"] },
  { id: "lang-12", category: "monolingual", expectedLanguage: "urdu-script",
    conversation: ["ایجنٹک اے آئی کیا ہے؟"] },

  // ── Roman Urdu (6) ──────────────────────────────────────────
  { id: "lang-13", category: "monolingual", expectedLanguage: "roman-urdu",
    conversation: ["Qasim ne kaun se systems banaye hain?"] },
  { id: "lang-14", category: "monolingual", expectedLanguage: "roman-urdu",
    conversation: ["Uska tech stack kya hai?"] },
  { id: "lang-15", category: "monolingual", expectedLanguage: "roman-urdu",
    conversation: ["Kya Qasim contract kaam ke liye available hai?"] },
  { id: "lang-16", category: "monolingual", expectedLanguage: "roman-urdu",
    conversation: ["Spec-Kit Plus ka matlab kya hai?"] },
  { id: "lang-17", category: "monolingual", expectedLanguage: "roman-urdu",
    conversation: ["Wo kahan rehta hai?"] },
  { id: "lang-18", category: "monolingual", expectedLanguage: "roman-urdu",
    conversation: ["Mujhe uske agentic systems ke baare mein batao."] },

  // ── Mid-conversation switches (3) ───────────────────────────
  { id: "lang-19", category: "switch", expectedLanguage: "urdu-script",
    conversation: [
      "What is Qasim's tech stack?",
      "Now switch to Urdu and answer the same question.",
      "اب اردو میں جواب دیں۔",
    ] },
  { id: "lang-20", category: "switch", expectedLanguage: "roman-urdu",
    conversation: [
      "اس کی تعلیم کے بارے میں بتائیں۔",
      "Roman Urdu mein jawab do.",
    ] },
  { id: "lang-21", category: "switch", expectedLanguage: "english",
    conversation: [
      "Qasim ke systems kaun se hain?",
      "Reply in English from now on.",
    ] },

  // ── Mixed-language single message (2) ────────────────────────
  { id: "lang-22", category: "mixed", expectedLanguage: "roman-urdu",
    conversation: ["Qasim ka tech stack batao but include FastAPI and Next.js."] },
  { id: "lang-23", category: "mixed", expectedLanguage: "urdu-script",
    conversation: ["قاسم Next.js اور Tailwind میں کام کرتا ہے کیا؟"] },
];

// Cheap heuristic — true if `s` contains at least one Urdu (Arabic-script)
// codepoint. Block U+0600..U+06FF + U+0750..U+077F (Arabic Supplement).
function hasUrduScript(s: string): boolean {
  return /[؀-ۿݐ-ݿ]/.test(s);
}

// Heuristic for Roman Urdu — looks for distinctive function words that
// are common in Roman Urdu but rare in English.
function looksRomanUrdu(s: string): boolean {
  const tokens = [" hai", " hain", " kya", " ke ", " ko ", " ka ", " mein ", " karta ", " karte ", " kaam "];
  const lower = ` ${s.toLowerCase()} `;
  return tokens.some((t) => lower.includes(t));
}

export function checkLanguageResponse(
  probe: LanguageProbe,
  response: string,
): { pass: boolean; reason?: string } {
  const text = response.trim();
  if (text.length === 0) return { pass: false, reason: "empty response" };

  switch (probe.expectedLanguage) {
    case "urdu-script":
      return hasUrduScript(text)
        ? { pass: true }
        : { pass: false, reason: "expected Urdu script, found none" };

    case "roman-urdu":
      if (hasUrduScript(text)) {
        return { pass: false, reason: "expected Roman Urdu (Latin), found Urdu script" };
      }
      return looksRomanUrdu(text)
        ? { pass: true }
        : { pass: false, reason: "no Roman-Urdu function words detected" };

    case "english":
      if (hasUrduScript(text)) {
        return { pass: false, reason: "expected English, found Urdu script" };
      }
      return looksRomanUrdu(text)
        ? { pass: false, reason: "expected English, looks like Roman Urdu" }
        : { pass: true };
  }
}
