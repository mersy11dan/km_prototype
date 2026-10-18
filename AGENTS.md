<!-- BEGIN:nextjs-agent-rules -->
# This is NOT the Next.js you know

This version has breaking changes — APIs, conventions, and file structure may all differ from your training data. Read the relevant guide in `node_modules/next/dist/docs/` before writing any code. Heed deprecation notices.
<!-- END:nextjs-agent-rules -->

## Cloud Agent

- Install dependencies with `npm ci`.
- Run the app with `npm run dev`. Next.js listens on port 3000.
- `api.js` is an unused mock module. Do not launch it as a server.
- Lint with `npm run lint`. Production build with `npm run build`.
- Do not execute files under `app/experts/[id]/public/fonts`.
