"""Prepare a licensed 10,000-entry Chinese study lexicon."""
from pathlib import Path
import gzip,json,re,hashlib
ROOT=Path(__file__).resolve().parents[1]
freq={}
for line in (ROOT/'artwork/languages/jieba-frequency.txt').read_text().splitlines():
 parts=line.split()
 if len(parts)>=2: freq[parts[0]]=int(parts[1])
core='你好 谢谢 再见 请 对不起 是 不 我 你 他 她 我们 他们 人 好 什么 谁 哪里 为什么 怎么 今天 明天 昨天 现在 早上 晚上 中国 中文 英语 学习 学生 老师 学校 书 看 听 说 读 写 吃 喝 水 茶 咖啡 米饭 面包 牛奶 水果 苹果 家 朋友 妈妈 爸爸 工作 钱 买 卖 喜欢 爱 有 没有 去 来 在 这里 那里 大 小 多 少 一 二 三 四 五 六 七 八 九 十 百 千'.split()
entries={}
raw=gzip.decompress((ROOT/'artwork/languages/cedict.txt.gz').read_bytes()).decode()
for line in raw.splitlines():
 m=re.match(r'^(\S+) (\S+) \[(.*?)\] /(.*)/$',line)
 if not m: continue
 trad,word,pinyin,definition=m.groups()
 if not re.fullmatch(r'[\u3400-\u9fff]{1,4}',word): continue
 if word not in core and (pinyin[0].isupper() or freq.get(word,0)<1): continue
 definitions=[d for d in definition.split('/') if d and not d.startswith(('CL:','variant of','old variant','see ','surname ','abbr.','used in '))]
 if not definitions: continue
 row={'word':word,'traditional':trad,'pinyin':pinyin,'meanings':definitions}
 if word not in entries: entries[word]=row
ordered=[entries[w] for w in core if w in entries]
used={x['word'] for x in ordered}
ordered += [v for k,v in sorted(entries.items(),key=lambda kv:(-freq.get(kv[0],0),kv[0])) if k not in used]
ordered=ordered[:10000]
if len(ordered)!=10000: raise RuntimeError(f'Only {len(ordered)} candidates')
for i,row in enumerate(ordered): row['id']=f'zh-{i:05d}'
(ROOT/'public/languages/chinese.json').write_text(json.dumps(ordered,ensure_ascii=False,separators=(',',':'))+'\n')
meta={'count':len(ordered),'source':'CC-CEDICT, published by MDBG and maintained by its contributors','license':'CC BY-SA 4.0','sourceUrl':'https://www.mdbg.net/chinese/dictionary?page=cc-cedict','licenseUrl':'https://creativecommons.org/licenses/by-sa/4.0/','modifications':'Selected 10,000 unique simplified entries; removed cross-reference-only senses; added stable ids; beginner seed list followed by Jieba frequency order. This is not a Duolingo or HSK syllabus.','ranking':'fxsjy/jieba dict.txt (MIT), https://github.com/fxsjy/jieba','sourceSha256':hashlib.sha256(raw.encode()).hexdigest()}
(ROOT/'public/languages/chinese-source.json').write_text(json.dumps(meta,indent=2)+'\n')
print('Prepared exactly 10,000 unique Chinese entries with pinyin and English senses.')
