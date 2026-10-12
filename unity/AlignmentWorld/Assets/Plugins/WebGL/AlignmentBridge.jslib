mergeInto(LibraryManager.library, {
 AlignmentProgress: function(jsonPtr) {
  try { window.dispatchEvent(new CustomEvent('alignment-unity-progress', {detail:JSON.parse(UTF8ToString(jsonPtr))})); } catch(e) { console.error('Could not read Unity story progress.'); }
 }
});
