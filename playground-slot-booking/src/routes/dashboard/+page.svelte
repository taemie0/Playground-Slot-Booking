<script>
	import { page } from '$app/state';
</script>

{#if page.data.session}
	<div>
		<p>ID: {page.data.session.user.id}</p>
		<p>Email: {page.data.session.user.email}</p>
		<p>Name: {page.data.session.user.name}</p>
		<img src={page.data.session.user.image} alt="Profile" />
		<p>Access Token: {page.data.session.accessToken}</p>
	</div>
{:else}
	<p>Loading...</p>
{/if}
