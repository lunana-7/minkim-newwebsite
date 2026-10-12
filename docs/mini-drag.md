# Picking up Mini

Drag the companion at the bottom of any page with a mouse, pen or touch pointer. A five-pixel movement threshold distinguishes dragging from a click. Ordinary clicks keep opening the activity menu. During dragging the menu closes, walking pauses and Mini follows the captured pointer within viewport boundaries. Her legs alternate kicks and her body rocks slightly without changing her face or hairstyle. Activity and emote props are temporarily hidden on the held companion; activity timers continue as before.

Release, pointer cancellation, losing capture, window blur or Escape puts her down. A short gravity animation returns her to the bottom and offsets the walking route to resume from the dropped horizontal location. A resize keeps the held position inside the viewport. Picking her up during a landing first finishes that landing so the character cannot get stuck suspended. Holding coordinates are temporary and do not change the saved game position or profile. Reduced-motion preferences disable the struggle animation.

`min-drag.js` handles the pointer interaction and landing. `min-appearance.js` draws the kicking legs from the same shared character art. Scoped styles live in `world-theme.css`. The pointer module is included in the MIT game source bundle; the host supplies the companion renderer and menu callbacks.
