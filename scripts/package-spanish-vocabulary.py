"""Build a frequency-ordered, attributed Spanish/English study lexicon."""

from pathlib import Path
import hashlib
import json
import re
import xml.etree.ElementTree as ET

ROOT = Path(__file__).resolve().parents[1]
SOURCE = ROOT / 'artwork/languages/wikdict-spa-eng.tei'
SEEDS = ROOT / 'src/lib/spanish-vocabulary.js'
OUTPUT = ROOT / 'public/languages/spanish.json'
from wordfreq import zipf_frequency  # type: ignore

namespace = {'t': 'http://www.tei-c.org/ns/1.0'}
root = ET.parse(SOURCE).getroot()
seed_pairs = re.findall(r"'([^'\n|]+)\|([^'\n]+)'", SEEDS.read_text())
if len(seed_pairs) != 99:
    raise RuntimeError(f'Expected 99 original beginner words, found {len(seed_pairs)}')

selected = []
used = set()
for word, meaning in seed_pairs:
    selected.append({'word': word, 'pinyin': '', 'meanings': [meaning.replace('; ', '; ')]})
    used.add(word.casefold())

candidates = {}
for entry in root.findall('.//t:body/t:entry', namespace):
    word = entry.findtext('./t:form/t:orth', default='', namespaces=namespace).strip()
    part = entry.findtext('./t:gramGrp/t:pos', default='', namespaces=namespace)
    if not re.fullmatch(r'[A-Za-zÁÉÍÓÚÜÑáéíóúüñ]{2,30}', word) or word != word.lower() or part in {'pn', 'suffix', 'prefix', 'symbol', 'proverb'}:
        continue
    key = word.casefold()
    if key in used:
        continue
    translations = []
    for quote in entry.findall('.//t:cit[@type="trans"]/t:quote', namespace):
        text = ' '.join(''.join(quote.itertext()).split()).strip()
        if text and len(text) <= 65 and text not in translations:
            translations.append(text)
    if not translations:
        continue
    frequency = zipf_frequency(word, 'es')
    if frequency < 1.5:
        continue
    row = {'word': word, 'pinyin': '', 'meanings': translations[:3]}
    previous = candidates.get(key)
    if previous is None or (part in {'n', 'v', 'adj', 'adv'} and previous[1] not in {'n', 'v', 'adj', 'adv'}):
        candidates[key] = (row, part, frequency)

ordered = sorted(candidates.values(), key=lambda item: (-item[2], item[0]['word'].casefold()))
for row, _, _ in ordered:
    selected.append(row)
    if len(selected) == 10000:
        break
common_glosses = {
    'de': 'of; from', 'la': 'the (feminine singular)', 'el': 'the (masculine singular)',
    'los': 'the (masculine plural)', 'las': 'the (feminine plural)', 'lo': 'it; the (neuter)',
    'mi': 'my', 'me': 'me', 'le': 'to him; to her; to you', 'su': 'his; her; your; their',
    'que': 'that; which', 'en': 'in; on', 'por': 'for; through; because of',
    'con': 'with', 'un': 'a; an (masculine)', 'una': 'a; an (feminine)',
    'al': 'to the', 'del': 'of the; from the', 'se': 'himself; herself; itself',
    'como': 'like; as', 'pero': 'but', 'para': 'for; in order to',
    'ya': 'already; now', 'muy': 'very', 'más': 'more', 'si': 'if',
}
for row in selected[99:]:
    if row['word'] in common_glosses:
        row['meanings'] = [common_glosses[row['word']]]
if len(selected) != 10000 or len({row['word'].casefold() for row in selected}) != 10000:
    raise RuntimeError(f'Expected 10,000 unique words, found {len(selected)}')
for index, row in enumerate(selected):
    row['id'] = f'es-{index:05d}'
OUTPUT.write_text(json.dumps(selected, ensure_ascii=False, separators=(',', ':')) + '\n')
meta = {
    'count': len(selected),
    'source': 'WikDict Spanish-English TEI, based on Wiktionary via DBnary',
    'sourceUrl': 'https://download.wikdict.com/dictionaries/tei/recommended/spa-eng.tei',
    'sourceEdition': '2025.11.21',
    'license': 'Creative Commons Attribution-ShareAlike 3.0 Unported',
    'licenseUrl': 'https://creativecommons.org/licenses/by-sa/3.0/',
    'sourceSha256': hashlib.sha256(SOURCE.read_bytes()).hexdigest(),
    'modifications': 'Retained the original 99 beginner selections and English meanings; selected 9,901 unique single-word entries, limited to three short English translations each, ranked by Spanish word frequency using wordfreq. Added stable ids. This is not an official Duolingo course.'
}
(ROOT / 'public/languages/spanish-source.json').write_text(json.dumps(meta, indent=2) + '\n')
print('Prepared exactly 10,000 Spanish words with English meanings.')
