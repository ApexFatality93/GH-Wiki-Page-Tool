import { spawn } from 'node:child_process';
import { platform } from 'node:os';

const tscCommand = platform() === 'win32' ? 'tsc.cmd' : 'tsc';
const port = process.env.PORT || '8000';
const childProcesses = [];
let shuttingDown = false;

function spawnChild(command, args, label) {
	const child = spawn(command, args, {
		stdio: 'inherit',
		env: {
			...process.env,
			PORT: port,
		},
	});

	child.on('exit', (code, signal) => {
		if (shuttingDown) return;
		if (signal) {
			console.error(`${label} exited from signal ${signal}`);
		} else if (code !== 0) {
			console.error(`${label} exited with code ${code}`);
		}
		shutdown(code ?? 1);
	});

	childProcesses.push(child);
	return child;
}

function shutdown(exitCode = 0) {
	if (shuttingDown) return;
	shuttingDown = true;

	for (const child of childProcesses) {
		if (!child.killed) child.kill('SIGTERM');
	}

	setTimeout(() => process.exit(exitCode), 200);
}

console.log(`Starting dev workflow on http://127.0.0.1:${port}/`);
console.log('TypeScript will rebuild automatically on save.');

spawnChild(process.execPath, ['scripts/static-server.mjs'], 'static server');
spawnChild(tscCommand, ['--watch', '--preserveWatchOutput'], 'TypeScript watch');

for (const signal of ['SIGINT', 'SIGTERM']) {
	process.on(signal, () => shutdown(0));
}
