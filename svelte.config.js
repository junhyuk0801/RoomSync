import sveltePreprocess from 'svelte-preprocess';
import adapter from '@sveltejs/adapter-static';

/** @type {import('@sveltejs/kit').Config} */
const config = {
	preprocess: sveltePreprocess(),
	kit: {
		adapter: adapter(),

		// // Comment the paths if wants to run in dev mode.
		// paths: {
		// 	base: './junhyuk0801.github.io',
		// 	assets: './junhyuk0801.github.io'
		// },		

		// hydrate the <div id="svelte"> element in src/app.html
		target: '#svelte'
	}
};

export default config;
