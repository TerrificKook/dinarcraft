"""Check search coverage before publishing. No network or extra dependencies."""
import argparse
from collections import Counter
from html import unescape
import json
from pathlib import Path
import re
from urllib.parse import unquote, urlsplit
import xml.etree.ElementTree as ET


def normalize(value):
    return re.sub(r'[^a-zа-я0-9]+', ' ', str(value or '').lower().replace('ё', 'е')).strip()


def text(value):
    return unescape(re.sub(r'<[^>]+>', ' ', value)).strip()


def check(root):
    root = Path(root).resolve()
    entries = json.loads((root / 'assets/search-index.json').read_text('utf-8-sig'))
    if not isinstance(entries, list):
        raise ValueError('Search index must be an array')
    errors = []
    urls = Counter(e['url'] for e in entries)
    errors.extend('Duplicate search URL: ' + u for u, count in urls.items() if count > 1)
    by_url = {e['url']: e for e in entries}
    skus = Counter(str(e.get('sku', '')) for e in entries if e.get('type') == 'product')
    errors.extend('Missing/duplicate product SKU: ' + sku for sku, count in skus.items() if not sku or count > 1)
    for entry in entries:
        url = urlsplit(entry['url'])
        target = (root / unquote(url.path).lstrip('/')).resolve()
        if url.scheme or url.netloc or not url.path.startswith('/') or not target.is_relative_to(root):
            errors.append('Invalid search URL: ' + entry['url'])
            continue
        if target.is_dir():
            target = target / 'index.html'
        if not target.is_file():
            errors.append('Missing search target: ' + entry['url'])
        elif url.fragment and not re.search(r'\bid=["\x27]' + re.escape(unquote(url.fragment)) + r'["\x27]', target.read_text('utf-8-sig')):
            errors.append('Missing search anchor: ' + entry['url'])
        if not entry.get('title'):
            errors.append('Missing search title: ' + entry['url'])
    sitemap = ET.parse(root / 'sitemap.xml')
    pages = [urlsplit(n.text).path for n in sitemap.iter() if n.tag.endswith('}loc')]
    for url in pages:
        if url not in by_url:
            errors.append('Page absent from search: ' + url)
    catalog = (root / 'catalog/index.html').read_text('utf-8-sig')
    cards = re.findall(r'<article\b[^>]*class="[^"]*\bcatalog-product-card\b[^"]*"[^>]*>(.*?)</article>', catalog, re.S)
    if not cards:
        errors.append('No catalog cards found; check catalog markup')
    for card in cards:
        links = re.findall(r'href="(/catalog/[^"#]+/)"', card)
        sku = re.search(r'Артикул:\s*([^<]+)', card)
        title = re.search(r'<h3[^>]*>(.*?)</h3>', card, re.S)
        if not links or not sku or not title:
            errors.append('Catalog card missing URL, SKU or title')
            continue
        url = links[0]
        entry = by_url.get(url)
        if not entry:
            errors.append('Product absent from search: ' + url)
            continue
        if entry.get('type') != 'product' or str(entry.get('sku')) != text(sku[1]):
            errors.append('Product type/SKU mismatch: ' + url)
        searchable = ' '.join(normalize(entry.get(k)) for k in ('title', 'sku', 'category', 'description', 'keywords'))
        if not all(word in searchable for word in normalize(text(title[1])).split()):
            errors.append('Catalog title not searchable: ' + url)
    return {'pages': len(pages), 'products': len(cards), 'search_entries': len(entries), 'errors': errors}


if __name__ == '__main__':
    parser = argparse.ArgumentParser(description=__doc__)
    parser.add_argument('--root', type=Path, default=Path(__file__).resolve().parents[1])
    args = parser.parse_args()
    try:
        result = check(args.root)
    except (OSError, ValueError, KeyError, TypeError, ET.ParseError) as error:
        raise SystemExit('Search validation failed: ' + str(error))
    print(json.dumps(result, ensure_ascii=False))
    raise SystemExit(bool(result['errors']))
