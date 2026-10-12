# Entering Alignment World

The playable browser world now supports explicit guest entry through Enter the world / Continue my adventure. Movement, jumping, guide conversations, chapter questions, trust beacon unlocks and fullscreen work without Firebase. Guest chapter, completed beacons, XP and position save under `alignment-progress:guest`, separate from signed-in accounts.

Google sign-in remains an optional account action. Until Firebase is configured it cannot provide cloud saves or presence. A first signed-in account without a previous local record can adopt guest progress; an existing cloud record takes priority when it is newer. Signing out closes that account’s session and returns to the entry gate; guest saves remain separate. Entering alone does not claim multiplayer presence.

The current game engine is the existing browser prototype. Unity source is still prepared but uncompiled; guest entry does not imply a Unity Web export exists.
