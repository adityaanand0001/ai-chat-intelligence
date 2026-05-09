"""Intent classification and sentiment analysis. Uses Gemini when available."""

import json
import re
from responses import _get_gemini

# ── Gemini Extraction ───────────────────────────────────────────

EXTRACTION_PROMPT = """Classify the user's intent and sentiment for the following message.
Provide the result as a raw JSON object with "intent" and "sentiment" keys.

Available Intents: 
- greeting: Hello, hi, etc.
- farewell: Goodbye, see ya, etc.
- complaint: User is unhappy or reporting a bug.
- request: User wants you to perform an action (code, write, create).
- thanks: User is expressing gratitude.
- feedback: User is giving an opinion on something.
- query: User is asking a general question for information.
- unknown: Use this if it doesn't fit any category.

Available Sentiments: positive, neutral, negative.

Message: "{text}"

JSON Output:"""


async def extract_with_gemini(text: str, api_key: str | None = None) -> tuple[str, str] | None:
    """Use Gemini to extract intent and sentiment. Returns (intent, sentiment) or None."""
    model = _get_gemini(api_key)
    if model is None:
        return None
    try:
        resp = await model.generate_content_async(EXTRACTION_PROMPT.format(text=text))
        raw = resp.text.strip()
        
        # Clean up common Gemini output quirks (like markdown code blocks)
        if "```" in raw:
            match = re.search(r"\{.*\}", raw, re.DOTALL)
            if match:
                raw = match.group(0)
        
        data = json.loads(raw)
        intent = data.get("intent", "unknown").lower()
        sentiment = data.get("sentiment", "neutral").lower()
        
        # Validation
        valid_intents = ["greeting", "farewell", "complaint", "request", "thanks", "feedback", "query", "unknown"]
        if intent not in valid_intents:
            intent = "unknown"
            
        return intent, sentiment
    except Exception:
        return None


# ── Intent Keywords ──────────────────────────────────────────────

INTENT_KEYWORDS = {
    "greeting": ["hello", "hi", "hey", "good morning", "good evening", "greetings", "yo", "sup", "howdy", "morning", "afternoon", "evening"],
    "farewell": ["bye", "goodbye", "see you", "later", "cya", "take care", "have a good", "night", "exit", "stop", "quit"],
    "complaint": ["bad", "terrible", "awful", "horrible", "worst", "broken", "not working", "issue", "problem",
                  "frustrated", "unhappy", "dissatisfied", "annoying", "hate", "disappointed", "error", "bug", "crash",
                  "fail", "useless", "slow", "lag", "stupid", "wrong", "fix this"],
    "request": ["please", "can you", "could you", "would you", "i need", "i want", "help me", "do this",
                "make", "create", "generate", "write", "build", "show me", "tell me", "give me",
                "design", "plan", "fix", "implement", "add", "update", "change", "refactor", "code", "draft"],
    "thanks": ["thanks", "thank you", "appreciate", "grateful", "thx", "awesome", "perfect", "good job", "nice work"],
    "feedback": ["feedback", "opinion", "suggestion", "think about", "what do you", "how about", "recommend", "advice", "thoughts"],
    "query": ["what", "how", "why", "when", "where", "who", "which", "?", "explain", "meaning", "define",
              "difference", "purpose", "reason", "tell about", "info", "information", "details", "describe"],
}

SENTIMENT_POSITIVE = ["good", "great", "awesome", "amazing", "excellent", "fantastic", "wonderful",
                      "love", "beautiful", "perfect", "nice", "happy", "glad", "delighted", "pleased",
                      "thanks", "thank you", "appreciate", "best", "brilliant", "cool", "helpful"]
SENTIMENT_NEGATIVE = ["bad", "terrible", "awful", "horrible", "worst", "hate", "ugly", "sad",
                      "angry", "frustrated", "disappointed", "annoying", "broken", "stupid", "wrong",
                      "poor", "useless", "sucks", "disgusting", "useless", "nonsense"]


def _word_match(keyword: str, text: str) -> bool:
    """Check if keyword appears as a whole word (not as substring)."""
    pattern = re.escape(keyword.lower())
    return bool(re.search(rf"\b{pattern}\b", text.lower()))


def extract_intent(text: str) -> str:
    """Classify user message intent using keyword matching with priority scoring."""
    scores = {}
    for intent, keywords in INTENT_KEYWORDS.items():
        score = sum(1 for kw in keywords if _word_match(kw, text))
        if score > 0:
            scores[intent] = score
    if not scores:
        return "unknown"
    return max(scores, key=scores.get)


def extract_sentiment(text: str) -> str:
    """Classify user message sentiment using keyword matching."""
    pos_count = sum(1 for w in SENTIMENT_POSITIVE if _word_match(w, text))
    neg_count = sum(1 for w in SENTIMENT_NEGATIVE if _word_match(w, text))
    if pos_count > neg_count:
        return "positive"
    elif neg_count > pos_count:
        return "negative"
    return "neutral"
