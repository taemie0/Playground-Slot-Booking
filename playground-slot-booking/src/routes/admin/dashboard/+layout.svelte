<script>
	import { page } from '$app/state';
	import Navbar from '../../../components/navbar.svelte';
    import Footer from '../../../components/footer.svelte';
	// Access the session data reactively using $page
	//   const session = $page.data?.session || {};
	// In your root layout (e.g., __layout.svelte)
</script>

<!-- Render the navbar -->
<div class="fixed left-0 right-0 top-0 z-50">
	<Navbar
		email={page.data.session?.user?.email || 'guest@example.com'}
		name={page.data.session?.user?.name || 'Guest'}
		image={page.data.session?.user?.image || 'https://via.placeholder.com/40'}
		accessToken={page.data.session?.accessToken}
	/>
</div>

<!-- Main content wrapper -->
<div class="pt-30 flex min-h-screen flex-col">
	<!-- Main content area -->
	<main class="bg-base-100 hide-scrollbar container mx-auto flex-grow px-4 pb-8 mb-20">
		<slot />
	</main>
    <!-- Footer -->
    <Footer />
</div>

<style>
	.hide-scrollbar {
		scrollbar-width: none; /* Firefox */
		-ms-overflow-style: none; /* IE/Edge */
	}

	.hide-scrollbar::-webkit-scrollbar {
		display: none; /* Chrome/Safari/Edge */
	}
</style>
