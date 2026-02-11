<script>
    import { page } from "$app/stores";
    import {
        SignInButton,
        SignOutButton,
        SignUpButton,
        useClerkContext,
    } from "svelte-clerk/client";

    let activeUrl = $state($page.url.pathname);

    const ctx = useClerkContext();
    const userStatus = $derived(ctx.auth?.sessionStatus);
    const role = $derived(ctx.user?.publicMetadata?.role);

    let navLinks = $derived([
        { name: "Home", path: "/" },
        { name: "About", path: "/about" },
    ]);

    let userItems = $derived([
        { name: "My Profile", path: "/user" },
        { name: "Measurements", path: "/measurements" },
    ]);
</script>

<nav class="navbar bg-slate-900 px-8 flex justify-between font-mono">
    <ul class="flex gap-3">
        {#each navLinks as link, i}
            <li>
                <a
                    href={link.path}
                    class="btn btn-ghost font-bold {link.path ===
                    $page.url.pathname
                        ? 'bg-slate-600 text-slate-100'
                        : ''}">{link.name}</a
                >
            </li>
        {/each}
    </ul>

    <ul class="flex gap-3">
        {#if userStatus === "active"}
            <ul class="flex">
                {#each userItems as item, i}
                    <li>
                        <a
                            href={item.path}
                            class="btn btn-ghost text-slate-200 {item.path ===
                            $page.url.pathname
                                ? 'bg-slate-600 text-slate-100'
                                : ''}">{item.name}</a
                        >
                    </li>
                {/each}
            </ul>
            <li><SignOutButton class="btn btn-dash font-bold" /></li>
        {:else}
            <li><SignInButton class="btn font-bold" mode="modal" /></li>
            <li>
                <SignUpButton
                    class="btn bg-primary text-primary-content"
                    mode="modal"
                />
            </li>
        {/if}
    </ul>
</nav>

<style>
    @reference "tailwindcss";

    .btn:hover {
        @apply bg-slate-600;
    }
</style>
