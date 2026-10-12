# Maple Cup Café

Enter from the meadow café at x=650 with E, Visit café, or Map → Maple Cup Café. Leaving returns Mini to the door and resumes the meadow. A seated version of the selected modular character is composited behind the original desk in the generated room.

The map displays Mini's position and four landmarks: start, café, Pippin and the cloud gate. Travel does not collect stars or complete quests. The gate still requires Pippin's quest.

## Focus tracking

Default modes: 25-minute focus, 5-minute short break, 15-minute long break. Durations can be adjusted when paused. Start, pause and reset work on the selected cycle. Absolute deadlines survive reloads and background tabs. A completed focus cycle credits its full duration once; a break credits no focus time. Further cycles start explicitly. Interrupted/reset cycles do not count toward completed-session totals.

Aggregate completed sessions and focus seconds live in profile schema 5. The current timer and last 30 dated focus records are saved separately in browser storage per player. The UI displays the latest five. Browser storage failures prevent durable local saves. Existing Firebase provisioning remains pending; cloud saving is not active until setup finishes. Firestore rules include validated study aggregates but have not been deployed.

## Audio and art

Load Spotify player inserts the official lofi beats embed only after the visitor clicks. Playback requires pressing Play and depends on Spotify's account and playback rules. No music files are copied. Direct playlist: https://open.spotify.com/playlist/37i9dQZF1DWWQRwui0ExPn

Original pixel café art: `public/game-art/maple-cafe.png` and optimized `.webp`. Built-in image generation prompt: `artwork/mini/cafe-background.json`. No copyrighted game scenery is used.

Code is included in the updated scoped MIT game-source bundle. Website and image assets have separate scope.
