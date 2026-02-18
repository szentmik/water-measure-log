<script>
    import { goto } from "$app/navigation";
    import { preventDefault } from "svelte/legacy";

    let phValue = $state(null);
    let chlorValue = $state(null);
    let totalClValue = $state(null);

    let isLoading = $state(false);
    let message = $state({ text: "", type: "" });

    const handleSubmit = async () => {
        isLoading = true;
        message = { text: "Save...", type: "info" };

        try {
            const response = await fetch("/api/v1/measurements", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    phValue,
                    chlorValue,
                    totalClValue,
                }),
            });

            const result = await response.json();

            if (!response.ok) throw new Error(result.error || "Server failure");

            message = { text: "Successfully saved", type: "success" };
            phValue = null;
            chlorValue = null;
            totalClValue = null;

        } catch (err) {
            message = { text: err.message, type: "error" };
        } finally {
            isLoading = false;
        }
    };
</script>

<h1>Add your measured data</h1>
<div class="form-container">
    <input
        type="number"
        step="0.05"
        bind:value={phValue}
        class="measure-input"
        placeholder="pH (eg. 7.20)"
    />
    <input
        type="number"
        step="0.05"
        bind:value={chlorValue}
        class="measure-input"
        placeholder="Cl (eg. 0.60)"
    />
    <input
        type="number"
        step="0.05"
        bind:value={totalClValue}
        class="measure-input"
        placeholder="Total Cl (eg. 0.75)"
    />

    <button
        onclick={(e) => {
            e.preventDefault();
            handleSubmit();
        }}
        disabled={isLoading}
        class="btn">{isLoading ? "In progress..." : "Save"}</button
    >

    {#if message.text}
        <p class="status-msg" class:error={message.type === "error"}>
            {message.text}
        </p>
    {/if}
</div>

<style>
        .form-container {
        margin-inline: auto;
        display: flex;
        flex-direction: column;
        gap: 1rem;
        background-color: var(--bg);
        border-radius: 1rem;
        padding: 1rem;
        width: min(100%, 30rem);

        input {
            border: none;
            font-family: "Ubuntu Sans Mono", monospace;
            font-size: 1.25rem;
            height: 2rem;
            text-align: center;
        }
    }

    .btn {
        background-color: var(--primary);
        color: var(--border);
        border-style: none;
        cursor: pointer;
        display: flex;
        justify-content: center;
        align-items: center;
        font-size: 1.25rem;
        font-weight: 700;
        height: 2.5rem;
        padding: 0.5rem 1rem;
        text-transform: uppercase;
        transition: 0.3s;
    }

    .btn:hover {
        background-color: var(--bg-dark);
        color: var(--text);
        text-shadow: 0.1rem 0.1rem 0.05rem var(--bg-light);
    }

    input::placeholder {
        opacity: .4;
    }

    input[type="number"]{
        border-radius: .5rem;
    }
</style>
