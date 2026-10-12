# Reliable field controls

The adventure listens for keyboard shortcuts across its own section, including toolbar buttons, instead of only on the canvas. Field toolbar clicks return focus to the canvas. Form fields, links, modifier shortcuts and open in-game places retain their native keyboard behavior. Native Enter on a dialogue's action button continues to work.

Enter / Space starts or resumes a paused game. In the field Enter talks to a nearby resident or enters a shop door; G gathers a nearby resource, Up/W enters a portal or jumps away from portals, and Space always jumps. Passing portals never enters automatically. Held movement clears on key-up, blur and opening a place. Explicit movement and gathering dismiss temporary greeting/heart/ice cream emotes; cake carrying remains compatible with walking. Timed coffee/meal/study activities remain intact and display a message when they temporarily block controls.

A contextual badge in the game screen shows the nearby action, or Enter to continue when paused. Out-of-range requests report their distance requirements instead of silently ignoring the action. NPC selection chooses the closest resident within range.
