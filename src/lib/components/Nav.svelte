<script>
    import { page } from "$app/stores";
    import {
        SignInButton,
        SignOutButton,
        SignUpButton,
        useClerkContext,
    } from "svelte-clerk/client";

    let isOpen = $state(false);

    let activeUrl = $state($page.url.pathname);

    const ctx = useClerkContext();
    const userStatus = $derived(ctx.auth?.sessionStatus);
    const role = $derived(ctx.user?.publicMetadata?.role);

    let navLinks = $derived([
        { name: "Home", path: "/" },
        // { name: "About", path: "/about" },
    ]);

    let userItems = $derived([
        { name: "My Profile", path: "/user" },
        { name: "Measurements", path: "/measurements" },
    ]);
</script>

<nav>
    <button
        class="mobile-menu"
        aria-label="menu-btn"
        onclick={() => (isOpen = !isOpen)}
        ><i class="fa-solid fa-bars"></i></button
    >
    <ul class="nav-items {isOpen === true ? 'translate-x-0' : 'opened-menu'}">
        <li class="mobile-menu-close">
            <button
                aria-label="close-menu-btn"
                onclick={() => (isOpen = !isOpen)}
                ><i class="fa-solid fa-xmark"></i></button
            >
        </li>
        {#each navLinks as link, i}
            <li>
                <a
                    href={link.path}
                    onclick={() => (isOpen = !isOpen)}
                    class="btn btn-ghost font-bold {link.path ===
                    $page.url.pathname
                        ? 'bg-slate-600 text-slate-100'
                        : ''}">{link.name}</a
                >
            </li>
        {/each}
        {#if userStatus === "active"}
            {#each userItems as item, i}
                <li>
                    <a
                        href={item.path}
                        onclick={() => (isOpen = !isOpen)}
                        class="btn btn-ghost text-slate-200 {item.path ===
                        $page.url.pathname
                            ? 'bg-slate-600 text-slate-100'
                            : ''}">{item.name}</a
                    >
                </li>
            {/each}
            <li class="sign-out-btn">
                <button onclick={() => (isOpen = !isOpen)}>
                    <SignOutButton class="btn btn-dash font-bold" />
                </button>
            </li>
        {:else}
            <li>
                <button onclick={() => (isOpen = !isOpen)}>
                    <SignInButton class="btn font-bold" mode="modal" />
                </button>
            </li>
            <li>
                <button onclick={() => (isOpen = !isOpen)}>
                    <SignUpButton
                        class="btn bg-primary text-primary-content"
                        mode="modal"
                    />
                </button>
            </li>
        {/if}
    </ul>
</nav>

<style>
    @reference "tailwindcss";

    .btn:hover {
        @apply bg-slate-600;
    }

    nav {
        @apply flex justify-end relative;
    }

    .nav-items {
        @apply flex flex-col md:flex-row md:relative md:my-2;
        @media (max-width: 764px) {
            @apply fixed gap-2 pt-24 pl-20 z-40 h-full w-full;
            background-image: linear-gradient(
                90deg,
                #62748d00 5%,
                #62748dfa 15%
            );
            transition: 1s ease-in-out;
        }
    }

    .mobile-menu,
    .mobile-menu-close {
        @apply hidden;
    }

    @media (max-width: 764px) {
        .mobile-menu {
            @apply block text-2xl py-4 px-4;
        }
        .mobile-menu-close {
            @apply block absolute top-4 right-4 text-3xl;
        }
        .sign-out-btn {
            @apply mt-12 self-center;
        }
        .opened-menu {
            @apply translate-x-full;
        }
    }
</style>
