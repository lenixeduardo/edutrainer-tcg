# Vira à Noite — 3D MCP prototype

Isolated, unpublished proof of concept for the existing EduTrainer TCG codebase. No existing catalog routes or database tables are changed.

## Setup
Node.js 20+; run `npm install` in this folder, then `npm test`.
Configure `TRIPO_API_KEY` only in a secure local/server environment. Run `npm start` to expose the MCP server via stdio.

## MCP tools
- `generate_3d_model`: Tripo v3 image-to-model. Requires explicit `confirmPaidGeneration=true` to consume credits.
- `get_3d_task`: poll asynchronous generation.
- `validate_product`: manual fidelity checklist (not an automated approval).
- `render_product`: creates 3:4 four-angle shot manifest; does **not** generate PNGs until a renderer worker is integrated.
- `publish_product`: intentionally blocked.

The viewer is planned for the Next.js catalog after obtaining a reviewed GLB. The original Barbie design must be checked against the physical product before use. Do not deploy this branch to production.
