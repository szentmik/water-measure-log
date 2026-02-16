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
        class="measure-btn">{isLoading ? "In progress..." : "Save"}</button
    >

    {#if message.text}
        <p class="status-msg" class:error={message.type === "error"}>
            {message.text}
        </p>
    {/if}
</div>

<style>

</style>
