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
        { name: "Measurements", path: "/measurements" },
        { name: "About", path: "/about" },
    ]);

    let userItems = $derived([
        { name: "My Profile", path: "/user" },
    ]);
</script>

<nav class="navbar bg-base-300 px-8 flex justify-between">
    <ul class="flex gap-3">
        {#each navLinks as link, i}
            <li>
                <a
                    href={link.path}
                    class="btn btn-ghost font-bold {link.path ===
                    $page.url.pathname
                        ? 'bg-base-100 text-primary'
                        : ''}">{link.name}</a
                >
            </li>
        {/each}
    </ul>
    <ul class="flex gap-3 justify-end w-lvh">
       {#each userItems as item, i}
        <li><a href={item.path} class="btn btn-info">My Profile</a></li>        
       {/each}
    </ul>

    <ul class="flex gap-2">
        {#if userStatus === "active"}
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
</style>
