# Mini’s Language Garden

Route `/language` lives underneath Game in the sidebar. The Game page has a matching invitation. The learner uses the same Mini appearance and Google player account as the cozy game. Dressing Mini in the game changes the study portrait too.

## Learning experience

Chinese: exactly 10,000 unique simplified entries, with traditional forms, numbered-pinyin source data (tone marks in the UI) and English dictionary senses. Spanish: exactly 10,000 unique single-word entries with English meanings, beginning with the original beginner selection. Both courses have 500 open units of twenty entries each. The main **Learn next 10** action pulls fresh words in order and blends in at most two reviews when due, so learners can continue without opening or paging through units. The lesson opens directly as a quick recall question; revealing the meaning is optional. A completion button continues immediately to the next round. The unit display follows the next unseen word automatically, while manual page and jump controls remain available. Progress saves on each answer; closing a lesson preserves answered words. Search covers words, pronunciation where available, and English. Both datasets are downloadable.

Word levels 0–5 support spaced recall. Correct answers increase the level and add ten learning XP; three levels count as familiar. Wrong answers lower the level and schedule a short revisit. Intervals are 2 minutes, 10 minutes, 1 day, 3 days, 7 days and 21 days. Due words appear gradually in new rounds as well as in Review. Two game points are awarded for a correct answer below word level five. The learner's overall level continues upward every 100 learning XP; a pixel progress bar shows explored words out of 10,000 and XP toward the next level. Learning XP is separate from game points. These are vocabulary drills, not a complete grammar curriculum or a formal language proficiency assessment.

Speech playback uses a suitable installed browser/device voice; it displays a clear message if none is available. No microphone is requested.

## Data and licensing

`public/languages/chinese.json` is a selected, reformatted derivative of CC-CEDICT. MDBG and community contributors are credited. The Chinese data stays CC BY-SA 4.0; NOTICE.txt and chinese-source.json state the source and changes. Selection seeds basic everyday vocabulary, then orders eligible terms by Jieba frequencies. Jieba MIT licensing is retained in artwork/languages/JIEBA-LICENSE. The input archive, frequencies and extraction script are retained so the dataset is reproducible.

`public/languages/spanish.json` retains the original 99 beginner selections with their stable ids, then selects and reorders 9,901 Spanish–English entries from WikDict, which is based on Wiktionary via DBnary. The Spanish data stays CC BY-SA 3.0; NOTICE.txt and spanish-source.json state source and changes. The WikDict TEI source is retained in `artwork/languages/`, and `scripts/package-spanish-vocabulary.py` reproduces the selection with `wordfreq==3.1.1`. It is not an official Duolingo course.

## Accounts and saves

Browser saves use `mini-language:<uid-or-guest>`. A new account can adopt guest progress only if it has no existing cloud/local learning record. Account changes close the current lesson. Per-word records `[level,dueAt,lastAnsweredAt]` are merged by latest answer time; aggregate counters use the larger value, so simultaneous devices can undercount aggregate XP. Cloud writes debounce to one second. Initial cloud read failure never overwrites an unread cloud record. Cloud totals live in `languageProgress/{uid}` and the two word maps live in `languageProgress/{uid}/courses/{zh|es}` so 20,000 words do not share one Firestore document. Owner-only rules for these paths have been published.

Google sign-in and cross-device cloud saving remain unavailable until the Google provider and hosting environment are configured. The page states this clearly. Guest practice, game and wardrobe remain available with browser saves. No new provider account or legal agreement was accepted for this feature.
