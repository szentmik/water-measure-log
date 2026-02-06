<script>
	import "../app.css";
	import Nav from "$lib/components/Nav.svelte";
	import Footer from "$lib/components/Footer.svelte";
	import AuthHandler from "$lib/components/AuthHandler.svelte";
	import { ClerkProvider } from "svelte-clerk";

	let { children } = $props();
</script>

<ClerkProvider>
	<AuthHandler /><Nav />
	<main class="px-16">
		{@render children()}
	</main>
	<Footer />
</ClerkProvider>
