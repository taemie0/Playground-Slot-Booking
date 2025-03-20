<script>
	import { page } from '$app/state';
	import Navbar from '../../components/navbar.svelte';
	  // Access the session data reactively using $page
	//   const session = $page.data?.session || {};
</script>

<!-- Render the navbar -->
<!-- Render the navbar -->
<Navbar
    email={page.data.session?.user?.email || "guest@example.com"}
    name={page.data.session?.user?.name || "Guest"}
    image={page.data.session?.user?.image || "https://via.placeholder.com/40"}
	accessToken={page.data.session?.accessToken}
/>

<!-- Render the child page content -->
<main class="p-4">
	<slot />
</main>
