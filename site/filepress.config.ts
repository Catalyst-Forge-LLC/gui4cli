import { defineFilepressConfig } from 'getfilepress';

export default defineFilepressConfig({
	title: 'GUI4CLI',
	description: "GUI4CLI reads a Commander or yargs script and builds a form from its flags. Choose inputs, inspect the command, and run the original script with live output in a desktop window.",
	tagline: 'An instant GUI for a CLI.',
	lede: "Desktop form for an existing Node.js CLI",
	url: 'https://gui4cli.dev',
	author: 'Catalyst Forge LLC',
	logo: '/logo.png',
	ogImage: '/og.png',
	homePage: 'about',
	nav: [
		{ label: 'Home', href: '/' },
		{ label: 'Docs', href: '/docs' },
		{ label: 'Install', href: '/docs/install' },
		{ label: 'npm', href: 'https://www.npmjs.com/package/gui4cli' },
		{ label: 'GitHub', href: 'https://github.com/Catalyst-Forge-LLC/gui4cli', icon: 'github' }
	],
	footerLinks: [
		{ label: 'See the rest of the Catalyst Forge shelf.', href: 'https://catalystforge.com/tools/' },
		{ label: 'Docs', href: '/docs' },
		{ label: 'Install', href: '/docs/install' },
		{ label: 'npm', href: 'https://www.npmjs.com/package/gui4cli' },
		{ label: 'GitHub', href: 'https://github.com/Catalyst-Forge-LLC/gui4cli', icon: 'github' }
	],
	redirects: [{ from: '/install', to: '/docs/install', status: 301 }],
	paths: [{ url: '/docs', dir: 'docs/dist' }]
});
