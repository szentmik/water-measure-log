<script>
    import { SignInButton, SignUpButton } from "svelte-clerk";
</script>

<div>
    <h1>Welcome to Water-App</h1>
    <p>
        The swimming pool watermeasurement log application for Hotels and
        wellness.
    </p>
    <div class="clerk-btn">
        <SignInButton />
        <SignUpButton />
    </div>
</div>

<style>
    div {
        background-color: var(--bg-light);
        border-radius: 1rem;
        margin: 3rem auto;
        padding: 1rem;
        text-align: center;
        width: min(40rem, 100%);
        p {
            margin-bottom: 2rem;
        }
    }

    .clerk-btn{
        display: flex;
        justify-content: center;
        gap:.75rem;
    }

    .clerk-btn :global(button) {
        background-color: var(--primary);
        color: var(--bg);
        cursor: pointer;
        border-style: none;
        border-radius: .75rem;
        box-shadow: .1rem .1rem 1rem var(--text-muted);
        font-size: 1.25rem;
        font-weight: bolder;
        padding: 0.5rem 1rem;
        text-shadow: 0.2rem var(--text);
    }

    .clerk-btn :global(button):nth-of-type(2) {
        background-color: var(--secondary);
    }

    .clerk-btn :global(button):hover {
        background-color: var(--info);
    }
</style>
