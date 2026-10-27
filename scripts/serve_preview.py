"""Serve an assembled public preview with byte ranges for HTML audio seeking."""
import argparse
from functools import partial
from http.server import SimpleHTTPRequestHandler, ThreadingHTTPServer
from pathlib import Path
import re


def byte_range(header, size):
    match = re.fullmatch(r'bytes=(\d*)-(\d*)', header)
    if not match or size <= 0:
        raise ValueError('Invalid range')
    first, last = match.groups()
    if not first and not last:
        raise ValueError('Empty range')
    if first:
        start = int(first)
        end = min(size-1, int(last)) if last else size-1
    else:
        length = int(last)
        if length <= 0:
            raise ValueError('Empty suffix')
        start, end = max(0, size-length), size-1
    if start >= size or start > end:
        raise ValueError('Unsatisfiable range')
    return start, end


class PreviewHandler(SimpleHTTPRequestHandler):
    def end_headers(self):
        self.send_header('Accept-Ranges', 'bytes')
        super().end_headers()

    def send_head(self):
        self.range_remaining = None
        path = Path(self.translate_path(self.path))
        if not self.headers.get('Range') or not path.is_file():
            return super().send_head()
        try:
            file = path.open('rb')
        except OSError:
            self.send_error(404)
            return None
        size = path.stat().st_size
        try:
            start, end = byte_range(self.headers['Range'], size)
        except ValueError:
            file.close()
            self.send_response(416)
            self.send_header('Content-Range', f'bytes */{size}')
            self.send_header('Content-Length', '0')
            self.end_headers()
            return None
        self.send_response(206)
        self.send_header('Content-Type', self.guess_type(str(path)))
        self.send_header('Content-Length', str(end-start+1))
        self.send_header('Content-Range', f'bytes {start}-{end}/{size}')
        self.send_header('Last-Modified', self.date_time_string(path.stat().st_mtime))
        self.end_headers()
        self.range_remaining = end-start+1
        file.seek(start)
        return file

    def copyfile(self, source, outputfile):
        if self.range_remaining is None:
            return super().copyfile(source, outputfile)
        remaining = self.range_remaining
        while remaining:
            data = source.read(min(65536, remaining))
            if not data:
                break
            outputfile.write(data)
            remaining -= len(data)


def main():
    parser = argparse.ArgumentParser(description=__doc__)
    parser.add_argument('--directory', type=Path, default=Path('/tmp/ashenfall-public-dev'))
    parser.add_argument('--port', type=int, default=8031)
    args = parser.parse_args()
    handler = partial(PreviewHandler, directory=str(args.directory.resolve()))
    ThreadingHTTPServer(('127.0.0.1', args.port), handler).serve_forever()


if __name__ == '__main__': main()
