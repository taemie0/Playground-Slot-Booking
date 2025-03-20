import tailwindcss from '@tailwindcss/vite';
import { sveltekit } from '@sveltejs/kit/vite';
import { defineConfig } from 'vite';

export default defineConfig({
	plugins: [tailwindcss(), sveltekit()],
	server: {
		host: '127.0.0.1',
		port: 5500, // Custom post & hosting address
	  },
	  preview: {
		host: '127.0.0.1',
		port: 5500, // Ensure the preview server uses the same host and port
	  },
	//   build: {
	// 	outDir: 'dist', // Ensure this matches the output directory
	//   },
	//   base: '/',
});
