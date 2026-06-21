import { readFileSync, readdirSync, statSync, existsSync } from 'node:fs';
import { join, dirname, resolve } from 'node:path';

const root = process.cwd();
const htmlFiles = [];

function walk(dir) {
	for (const entry of readdirSync(dir)) {
		const fullPath = join(dir, entry);
		const stats = statSync(fullPath);
		if (stats.isDirectory()) {
			if (entry === 'node_modules' || entry === '.git' || entry === 'archive') continue;
			walk(fullPath);
			continue;
		}
		if (entry.endsWith('.html')) htmlFiles.push(fullPath);
	}
}

walk(root);

const missing = [];
const scriptRegex = /<script[^>]+src="([^"]+)"[^>]*><\/script>/g;

for (const file of htmlFiles) {
	const content = readFileSync(file, 'utf8');
	for (const match of content.matchAll(scriptRegex)) {
		const src = match[1];
		if (/^(https?:)?\/\//.test(src)) continue;
		const resolved = resolve(dirname(file), src);
		if (!existsSync(resolved)) {
			missing.push({
				file,
				src,
				resolved,
			});
		}
	}
}

if (missing.length) {
	console.error('Missing script references found:\n');
	for (const item of missing) {
		console.error(`${item.file}\n  src: ${item.src}\n  resolved: ${item.resolved}\n`);
	}
	process.exit(1);
}

console.log(`Checked ${htmlFiles.length} HTML files. All local script references exist.`);
