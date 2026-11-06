"""Check rendered routes, identity graphs, local assets and editorial invariants."""
from pathlib import Path
from html.parser import HTMLParser
from urllib.parse import urlsplit, unquote
import json
root=Path('dist'); errors=[]; blocks=0
class Page(HTMLParser):
 def __init__(self): super().__init__();self.links=[];self.images=[];self.meta={};self.canonical=[];self.ld=[];self.capture=False;self.buf='';self.h1=0;self.lang=None
 def handle_starttag(self,t,a):
  d=dict(a)
  if t=='html': self.lang=d.get('lang')
  if t=='h1':self.h1+=1
  if t=='a' and 'href' in d:self.links.append(d['href'])
  if t=='img':self.images.append(d.get('src',''))
  if t=='link' and d.get('rel')=='canonical':self.canonical.append(d.get('href'))
  if t=='meta':self.meta[d.get('property',d.get('name'))]=d.get('content')
  if t=='script' and d.get('type')=='application/ld+json':self.capture=True;self.buf=''
 def handle_data(self,d):
  if self.capture:self.buf+=d
 def handle_endtag(self,t):
  if t=='script' and self.capture:self.capture=False;self.ld.append(json.loads(self.buf))
for file in root.rglob('*.html'):
 s=file.read_text();p=Page();p.feed(s);blocks+=len(p.ld)
 route='/'+str(file.relative_to(root)).replace('index.html','')
 if p.lang!='zh-CN' or p.h1!=1: errors.append(f'{route}: lang/H1')
 if p.canonical!=['https://oversea-observe.online'+route]: errors.append(f'{route}: canonical {p.canonical}')
 if not p.meta.get('og:image') or not p.meta.get('twitter:image'):errors.append(f'{route}: missing share image')
 if 'www.example.com' in s:errors.append(f'{route}: placeholder')
 for url in p.links+p.images+[p.meta['og:image']]:
  u=urlsplit(url)
  if u.scheme in ('mailto','tel') or u.netloc not in ('','oversea-observe.online'):continue
  if not u.path:continue
  path=root/unquote(u.path).lstrip('/')
  if not path.is_file() and not (path/'index.html').is_file():errors.append(f'{route}: missing {url}')
 org=[x for x in p.ld if x.get('@type')=='Organization'];web=[x for x in p.ld if x.get('@type')=='WebSite']
 if len(org)!=1 or org[0].get('@id')!='https://oversea-observe.online/#organization':errors.append(f'{route}: organization')
 if len(web)!=1 or web[0].get('publisher',{}).get('@id')!=org[0].get('@id'):errors.append(f'{route}: website')
 articles=[x for x in p.ld if x.get('@type')=='Article']
 for article in articles:
  if article['author']['name']!='nzw' or article['publisher']['@id']!=org[0]['@id']:errors.append(f'{route}: author/publisher')
  if '本文基于公开资料整理，不构成法律意见。' not in s:errors.append(f'{route}: disclaimer')
  if 'battery' in route or 'powerbank' in route:
   if article['datePublished'][:10]!='2026-08-26':errors.append(f'{route}: original date / review')
for name in ['robots.txt','llms.txt']:
 content=(root/name).read_text()
 if 'example.com' in content or content!=Path('public',name).read_text() or content!=Path(name).read_text():errors.append(f'{name}: placeholder or drift')
report={'pages':len(list(root.rglob('*.html'))),'jsonLdBlocks':blocks,'errors':errors}
Path('docs/review/build-validation.json').write_text(json.dumps(report,ensure_ascii=False,indent=2)+'\n')
print(json.dumps(report,ensure_ascii=False,indent=2));raise SystemExit(bool(errors))
