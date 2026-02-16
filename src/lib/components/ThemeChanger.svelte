<script>
    // let d = new Date();

    // const recommendedTheme =
    //     d.getHours() > 19 || d.getHours() < 7 ? "dark" : "light";
    // let theme = $state(recommendedTheme);

    const getInitialTheme = () => {
        if (typeof localStorage !== "undefined") {
            const stored = localStorage.getItem("theme");
            if (stored === "dark" || stored === "light") return stored;
        }
        const h = new Date().getHours();
        return h > 19 || h < 7 ? "dark" : "light";
    };
    let theme = $state(getInitialTheme());

    $effect(() => {
        document.documentElement.setAttribute("data-theme", theme);
        localStorage.setItem("theme", theme);
    });

    const toggleTheme = () => {
        theme = theme === "light" ? "dark" : "light";
    };
</script>

<div class="theme-switch">
    <p>{theme}</p>
    <button onclick={toggleTheme} class="switch" aria-label="Theme changer">
        <div class="circle {theme === 'dark' ? 'circle-on' : ''}"></div>
    </button>
</div>

<style>
    .theme-switch {
        display: flex;
        flex-direction: column;
        justify-content: center;

        p {
            font-size: 0.7rem;
            font-weight: bold;
            letter-spacing: 0.1rem;
            padding-left: 0.5rem;
        }
    }

    .switch {
        box-shadow: inset 0 0 0.2rem var(--bg);
        border: 0.1rem solid var(--border);
        cursor: pointer;
        display: flex;
        justify-items: start;
        align-items: center;
        background-color: var(--text);
        border-radius: 1rem;
        height: 1.25rem;
        margin-right: 0.5rem;
        padding: 0.25rem;
        width: 3rem;
    }

    .circle {
        border-radius: 100%;
        background-color: var(--bg);
        height: 0.75rem;
        width: 0.75rem;
        box-shadow: inset 0 0 0.2rem var(--text);
        transition: transform 0.3s cubic-bezier(0.4, 0, 0.2, 1);
    }

    .circle-on {
        transform: translateX(1.5rem);
    }
</style>
