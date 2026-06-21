import { createReadStream, existsSync, statSync } from 'node:fs';
import { createServer } from 'node:http';
import { extname, join, normalize, resolve } from 'node:path';

const rootDir = process.cwd();
const port = Number(process.env.PORT || '8000');

const contentTypes = new Map([
	['.css', 'text/css; charset=utf-8'],
	['.gif', 'image/gif'],
	['.html', 'text/html; charset=utf-8'],
	['.ico', 'image/x-icon'],
	['.jpg', 'image/jpeg'],
	['.jpeg', 'image/jpeg'],
	['.js', 'text/javascript; charset=utf-8'],
	['.json', 'application/json; charset=utf-8'],
	['.mjs', 'text/javascript; charset=utf-8'],
	['.png', 'image/png'],
	['.svg', 'image/svg+xml'],
	['.txt', 'text/plain; charset=utf-8'],
	['.ttf', 'font/ttf'],
	['.webmanifest', 'application/manifest+json; charset=utf-8'],
	['.webp', 'image/webp'],
	['.woff', 'font/woff'],
	['.woff2', 'font/woff2'],
]);

function sendError(response, statusCode, message) {
	response.writeHead(statusCode, { 'Content-Type': 'text/plain; charset=utf-8' });
	response.end(message);
}

function resolveRequestPath(urlPathname) {
	const pathname = decodeURIComponent(urlPathname || '/');
	const cleanedPath = normalize(pathname).replace(/^(\.\.[/\\])+/, '');
	const absolutePath = resolve(rootDir, `.${cleanedPath}`);

	if (!absolutePath.startsWith(rootDir)) return null;

	if (existsSync(absolutePath) && statSync(absolutePath).isDirectory()) {
		return join(absolutePath, 'index.html');
	}

	if (!extname(absolutePath) && existsSync(join(absolutePath, 'index.html'))) {
		return join(absolutePath, 'index.html');
	}

	return absolutePath;
}

const server = createServer((request, response) => {
	if (!request.url) {
		sendError(response, 400, 'Bad Request');
		return;
	}

	const url = new URL(request.url, `http://${request.headers.host || '127.0.0.1'}`);
	const filePath = resolveRequestPath(url.pathname);

	if (!filePath) {
		sendError(response, 403, 'Forbidden');
		return;
	}

	if (!existsSync(filePath) || !statSync(filePath).isFile()) {
		sendError(response, 404, 'Not Found');
		return;
	}

	const contentType = contentTypes.get(extname(filePath).toLowerCase()) || 'application/octet-stream';
	response.writeHead(200, { 'Content-Type': contentType });
	createReadStream(filePath).pipe(response);
});

server.listen(port, '127.0.0.1', () => {
	console.log(`Static server running at http://127.0.0.1:${port}/`);
});

for (const signal of ['SIGINT', 'SIGTERM']) {
	process.on(signal, () => {
		server.close(() => process.exit(0));
	});
}
