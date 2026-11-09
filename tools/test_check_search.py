"""Regression checks for missing products and damaged search entries."""
import json
from pathlib import Path
import tempfile
import unittest

from check_search import check


class SearchCoverageTests(unittest.TestCase):
    def setUp(self):
        self.temp = tempfile.TemporaryDirectory()
        self.addCleanup(self.temp.cleanup)
        self.root = Path(self.temp.name)
        for folder in ('assets', 'catalog/078-test'):
            (self.root / folder).mkdir(parents=True)
        (self.root / 'catalog/078-test/index.html').write_text('<h1>Переноска</h1>', encoding='utf-8')
        (self.root / 'catalog/index.html').write_text(
            '<article class="catalog-product-card"><span>Артикул: 078</span>'
            '<h3>Переноска для пледа</h3><a href="/catalog/078-test/">Подробнее</a></article>', encoding='utf-8')
        (self.root / 'sitemap.xml').write_text(
            '<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9"><url>'
            '<loc>https://dinarcraft.ru/catalog/078-test/</loc></url></urlset>', encoding='utf-8')
        self.entries = [{'type': 'product', 'sku': '078', 'title': 'Переноска для пледа', 'url': '/catalog/078-test/'}]

    def errors(self):
        (self.root / 'assets/search-index.json').write_text(json.dumps(self.entries), encoding='utf-8')
        return check(self.root)['errors']

    def test_complete_catalog_passes(self):
        self.assertEqual(self.errors(), [])

    def test_missing_product_fails_even_without_sitemap_entry(self):
        self.entries = []
        (self.root / 'sitemap.xml').write_text('<urlset/>', encoding='utf-8')
        self.assertTrue(any('Product absent' in e for e in self.errors()))

    def test_wrong_sku_fails(self):
        self.entries[0]['sku'] = '077'
        self.assertTrue(any('SKU mismatch' in e for e in self.errors()))

    def test_missing_page_fails(self):
        self.entries[0]['url'] = '/catalog/missing/'
        self.assertTrue(any('Missing search target' in e for e in self.errors()))

    def test_duplicate_fails(self):
        self.entries.append(dict(self.entries[0]))
        self.assertTrue(any('Duplicate search URL' in e for e in self.errors()))

    def test_unsearchable_title_fails(self):
        self.entries[0]['title'] = 'Очечник'
        self.assertTrue(any('title not searchable' in e for e in self.errors()))


if __name__ == '__main__':
    unittest.main()
