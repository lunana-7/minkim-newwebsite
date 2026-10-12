# Mini’s Room and guestbook

`/room` is a separate personal mini-room under Home. The footer cupcake link formerly labeled Say hi now opens `/room#guestbook`. The portfolio Home remains available and links to the room.

## Room

The generated cutaway dessert room has six independent transparent furniture assets: strawberry cake sofa, cupcake table, cookie armchair, macaron bookshelf, strawberry teacup plant and afternoon tea cart. Original PNGs and built-in image generation prompts are retained in artwork/mini/room. package-mini-room.py isolates the furniture and exports web assets to public/room-art.

Mini uses the same saved look, full walking cycle, pets, emotes, effects and activities as the site game. Click open floor space to follow a short grid path; arrow keys/WASD and touch buttons move Mini. Furniture footprints block the path, and artwork is sorted by depth. Click Mini to greet. Coffee and reading activities use the shared activity rewards. This is an original personal-room interaction, not an integration with Cyworld or another service.

Decorate mode enables pointer dragging, furniture selection, directional nudges and hide/show controls. Name, three mood colors, four rug settings and the six furniture placements save under `mini-room:<player-or-guest>` in browser storage. Room decor currently stays in this browser; it is not cloud-synced or published as someone else’s layout. Restoring the default only resets room decoration.

## Guestbook storage

Local development uses `/api/guestbook` with append-only JSONL in ignored `.local/guestbook.jsonl`. Notes are shared among visitors to this local preview, not published to the live domain. GET returns the latest 100. POST requires same-origin submission, trimmed name 1–30 and message 1–500 characters, an allowlisted stamp, empty honeypot, a 4KB request limit and a 15-second browser cookie cooldown. This is a development service, not a production anti-spam system. Do not commit visitor content.

On live hosting with Firebase configured, guestbook reads use the Firestore `guestbook` collection; posting requires Google sign-in and server timestamp. Public-read/authenticated-create rules are prepared in firestore.rules but remain undeployed. Entries cannot be edited or deleted by the browser client. The account owner can manage content in the Firebase console after provisioning. Failure keeps the draft and never shows a false success.

If live Firebase is unavailable, the page explicitly offers private browser notes rather than publishing. Names and messages render via textContent. Forms state whether a note is shared or private before submission. The site does not automatically post fabricated visitor notes. Google provider setup and legal acceptance remain pending from the earlier setup request.
