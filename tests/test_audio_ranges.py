import sys
from pathlib import Path
import unittest
sys.path.insert(0, str(Path(__file__).resolve().parents[1]/'scripts'))
from serve_preview import byte_range


class AudioRangeTests(unittest.TestCase):
    def test_explicit_open_and_suffix_ranges(self):
        self.assertEqual(byte_range('bytes=0-99',1000),(0,99))
        self.assertEqual(byte_range('bytes=500-',1000),(500,999))
        self.assertEqual(byte_range('bytes=-100',1000),(900,999))
        self.assertEqual(byte_range('bytes=0-9999',1000),(0,999))
        self.assertEqual(byte_range('bytes=-9999',1000),(0,999))

    def test_invalid_or_unsatisfiable_ranges(self):
        for value in ['bytes=-','bytes=-0','bytes=1000-','bytes=50-20','bytes=0-1,8-9','wrong=0-1']:
            with self.subTest(value=value), self.assertRaises(ValueError):
                byte_range(value,1000)
        with self.assertRaises(ValueError): byte_range('bytes=0-',0)
