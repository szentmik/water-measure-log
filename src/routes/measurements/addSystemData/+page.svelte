<script>
    import { goto } from "$app/navigation";

    let sysPhValue = $state(null);
    let sysChlorValue = $state(null);
    let sysRedoxValue = $state(null);
    let sysWaterTemp = $state(null);
    let sysFlow = $state(null);
    let sysFilterBackwash = $state(false);

    let isLoading = $state(false);
    let message = $state({ text: "", type: "" });

    const handleSystemData = async (e) => {
        try {
            isLoading = true;
            message = { text: "Save...", type: "info" };

            const response = await fetch("/api/v1/measurements/addsystem", {
                method: "POST",
                headers: { "Content-type": "application/json" },
                body: JSON.stringify({
                    sysPhValue,
                    sysChlorValue,
                    sysRedoxValue,
                    sysWaterTemp,
                    sysFlow,
                    sysFilterBackwash,
                }),
            });

            const result = await response.json();
            if (!response.ok) {
                throw new Error(result.error || "Server failure");
            }

            message = { text: "Successfully saved", type: "success" };

            sysPhValue = null;
            sysChlorValue = null;
            sysRedoxValue = null;
            sysWaterTemp = null;
            sysFlow = null;
            sysFilterBackwash = false;
        } catch (err) {
            message = { text: err.message, type: "error" };
        } finally {
            isLoading = false;
        }
    };
</script>

<h1>Add system's data</h1>
<div class="form-container">
    <input
        type="number"
        step="0.05"
        bind:value={sysPhValue}
        class="measure-input"
        placeholder="pH (eg. 7.20)"
    />
    <input
        type="number"
        step="0.05"
        bind:value={sysChlorValue}
        class="measure-input"
        placeholder="Cl (eg. 0.60)"
    />
    <input
        type="number"
        step="10"
        bind:value={sysRedoxValue}
        class="measure-input"
        placeholder="mV (eg. 850)"
    />
    <input
        type="number"
        step="0.05"
        bind:value={sysWaterTemp}
        class="measure-input"
        placeholder="°C (eg. 25°C)"
    />
    <input
        type="number"
        step="1"
        bind:value={sysFlow}
        class="measure-input"
        placeholder="m3/h (eg. 40 m3/h)"
    />
    <div class="filter-backwash">
        <label for="filter" class="text-2xl">Filter Backwash</label>
        <input
            type="checkbox"
            id="filter"
            bind:checked={sysFilterBackwash}
            class=""
        />
    </div>

    <button
        onclick={(e) => {
            e.preventDefault();
            handleSystemData();
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

    .filter-backwash {
        display: flex;
        justify-content: space-between;
        align-items: center;
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

    input[type="checkbox"] {
        appearance: none; /* Remove default styling */
        border-radius: .5rem;
        width: 2rem; /* Set width */
        height: 2rem; /* Set height */
        background-color: var(--bg-light); /* Background color */
        cursor: pointer; /* Pointer on hover */
    }

    input[type="checkbox"]:checked {
        background-color: var(--success); /* Background color when checked */
        border-color: var(--border); /* Border color when checked */
        position: relative; /* Position for pseudo-elements */
    }

    input[type="checkbox"]:checked::after {
        content: ""; /* Create a checkmark */
        position: absolute;
        left: .6rem; /* Positioning */
        top: .05rem; /* Positioning */
        width: 10px; /* Checkmark width */
        height: 20px; /* Checkmark height */
        border: solid white; /* Checkmark color */
        border-width: 0 .3rem .3rem 0; /* Checkmark shape */
        transform: rotate(45deg); /* Rotate to form a checkmark */
    }
</style>
