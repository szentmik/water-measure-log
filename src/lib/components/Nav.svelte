<script>
    import { page } from "$app/stores";
    import {
        SignInButton,
        SignOutButton,
        SignUpButton,
        useClerkContext,
    } from "svelte-clerk/client";
    import ThemeChanger from "./ThemeChanger.svelte";

    let isOpen = $state(false);

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
    <a href={navLinks[0].path} class="logo">
        <i class="fa-solid fa-glass-water-droplet"></i> Water-App</a
    >
    <div class="nav">
        <ThemeChanger />
        <button
            class="btn mobile-btn mobile-menu"
            aria-label="menu-btn"
            onclick={() => (isOpen = !isOpen)}
            ><i class="fa-solid fa-bars"></i></button
        >
        <ul class="nav-items {isOpen ? 'menu-open' : ''}">
            <li class="mobile-menu-close">
                <button
                    class="btn mobile-btn"
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
                        class="btn {link.path === $page.url.pathname
                            ? 'active-page'
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
                            class="btn {item.path === $page.url.pathname
                                ? 'active-page'
                                : ''}">{item.name}</a
                        >
                    </li>
                {/each}
                <li class="clerk-btn signout">
                    <SignOutButton onclick={() => (isOpen = !isOpen)}
                    ></SignOutButton>
                </li>
            {:else}
                <li class="clerk-btn">
                    <SignInButton
                        mode="modal"
                        onclick={() => (isOpen = !isOpen)}
                    />
                </li>
                <li class="clerk-btn">
                    <SignUpButton
                        mode="modal"
                        onclick={() => (isOpen = !isOpen)}
                    />
                </li>
            {/if}
        </ul>
    </div>
</nav>

<style>
    nav {
        background-color: var(--bg);
        display: flex;
        justify-content: space-between;
        align-items: center;
        padding-block: 0.5rem;
        padding-inline: 2rem;
    }
    .nav {
        display: flex;
        align-items: center;
        overflow-x: hidden;
    }

    .logo {
        font-family: "Ubuntu Sans Mono", monospace;
        font-weight: 700;
        letter-spacing: -0.1rem;
        text-transform: uppercase;
    }

    .nav-items {
        list-style-type: none;
        display: flex;
        align-items: center;
        gap: 1rem;
    }

    a {
        color: var(--text-muted);
        text-decoration: none;
    }

    .btn,
    .clerk-btn :global(button) {
        background-color: var(--bg-light);
        color: var(--text-muted);
        border-style: none;
        cursor: pointer;
        display: flex;
        justify-content: center;
        align-items: center;
        font-size: 1.25rem;
        font-weight: bolder;
        height: 2.5rem;
        padding: 0.5rem 1rem;
        transition: 0.3s;
    }

    .btn:hover,
    .clerk-btn :global(button):hover {
        background-color: var(--bg-dark);
        color: var(--text);
    }

    .signout :global(button) {
        border: solid 0.2rem var(--info);
    }

    .mobile-btn {
        display: none;
    }

    .active-page {
        background-color: var(--info);
        color: white;
        text-transform: uppercase;
    }

    @media (max-width: 764px) {
        nav {
            padding-right: 0.5rem;
        }
        .mobile-btn {
            display: block;
            justify-content: end;
        }
        .nav-items {
            background-color: var(--bg);
            position: fixed;
            top: 0;
            right: 0;
            flex-direction: column;
            align-items: start;
            padding: 0.5rem 1rem 0 2rem;
            height: 100vh;
            width: 100%;
            transform: translateX(100%);
            transition: 0.3s;
            z-index: 10;
        }

        .mobile-menu-close {
            align-self: flex-end;
            margin-bottom: 2rem;
        }

        .menu-open {
            transform: translateX(0);
        }
    }
</style>
