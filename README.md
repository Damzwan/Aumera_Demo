# Damian + Aumera | Streaming Demo

## Getting Started

Create a .env file in the root directory and add your Google AI studio key:

```env
GEMINI_API_KEY=<YOUR_KEY>
```

Run the development server:

```bash
bun dev
```

## Key Technical Choices

### Security: Ephemeral Tokens via Server Actions

Instead of exposing the GEMINI_API_KEY to the client, the application uses a "Token Handshake" pattern.

### Architecture: The useGeminiLive Hook

Complex WebSocket logic is isolated from the UI using a custom hook (hooks/useGeminiLive.ts):

* Connection management
* Stream parsing

### UX Design: "Turn-Based" Interaction

To create something slightly more original :)

## Future Improvements

* API Route Protection: /api/token is public, maybe use something like NextAuth
* Bidirectional Audio: Should not be too difficult with the Gemini Live API
* Robust error recovery: Exponential backoff for reconnection attempts, clearer error handling in the UI (e.g. toasts)
* Component Modularity: The logic of the textbox is pretty big, can be decreased
* Chat history log: A modal or so with the previous turns (very easy)

## What I could have done better
* Use git from the get go and actually commit instead of a big commit at the end 😵‍💫
