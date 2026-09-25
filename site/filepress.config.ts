import { defineFilepressConfig } from 'getfilepress';

export default defineFilepressConfig({
	title: 'GUI4CLI',
	description:
		'Turn a Node.js CLI script into a desktop form. Inputs, Run, live output. The original file is unchanged.',
	tagline: 'A desktop form for a Node CLI.',
	lede: 'Flags · window · same script',
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
