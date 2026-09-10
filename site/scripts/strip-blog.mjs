/**
 * FilePress always prerenders /posts, /writing, /topics, /tags.
 * This product site does not use them — drop the files and sitemap rows.
 */
import { existsSync, readFileSync, rmSync, writeFileSync } from 'node:fs';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';

const root = dirname(fileURLToPath(import.meta.url));
const build = join(root, '..', 'build');

const drop = [
	'posts',
	'posts.html',
	'writing',
	'writing.html',
	'topics',
	'topics.html',
	'tags',
	'tags.html',
	'page',
	'rss.xml',
];

for (const name of drop) {
	const target = join(build, name);
	if (existsSync(target)) {
		rmSync(target, { recursive: true, force: true });
	}
}

const sitemap = join(build, 'sitemap.xml');
if (existsSync(sitemap)) {
	const next = readFileSync(sitemap, 'utf8').replace(
		/\s*<url><loc>[^<]*(?:\/posts|\/writing|\/topics|\/tags|\/page\/)[^<]*<\/loc><\/url>/g,
		'',
	);
	writeFileSync(sitemap, next);
	console.log('strip-blog: removed FilePress blog routes from build + sitemap');
} else {
	console.log('strip-blog: removed FilePress blog routes from build');
}
