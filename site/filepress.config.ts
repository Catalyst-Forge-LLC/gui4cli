import { defineFilepressConfig } from 'getfilepress';

export default defineFilepressConfig({
	title: 'GUI4CLI',
	description:
		'Turn a Node.js CLI script into a desktop form — inputs, Run, and live output — without rewriting the script.',
	tagline: 'A desktop form for a Node CLI.',
	lede: 'Detect the flags. Open a window. Run the script you already have.',
	url: 'https://gui4cli.dev',
	author: 'Catalyst Forge LLC',
	logo: null,
	homePage: 'about',
	topics: [
		{ label: 'Notes', tag: 'notes' },
		{ label: 'Release notes', tag: 'releases' }
	],
	nav: [
		{ label: 'Home', href: '/' },
		{ label: 'Docs', href: '/docs' },
		{ label: 'Posts', href: '/writing' },
		{ label: 'Install', href: '/install' },
		{ label: 'npm', href: 'https://www.npmjs.com/package/gui4cli' }
	],
	footerLinks: [
		{ label: 'Docs', href: '/docs' },
		{ label: 'Install', href: '/install' },
		{ label: 'npm', href: 'https://www.npmjs.com/package/gui4cli' },
		{ label: 'GitHub', href: 'https://github.com/Catalyst-Forge-LLC/gui4cli', icon: 'github' }
	],
	paths: [{ url: '/docs', dir: 'docs/dist' }]
});
