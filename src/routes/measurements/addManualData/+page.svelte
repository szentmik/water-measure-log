<script>
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
        } catch (err) {
            message = { text: err.message, type: "error" };
        } finally {
            isLoading = false;
        }
    };
</script>

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

    <button onclick={handleSubmit} disabled={isLoading} class="measure-btn"
        >{isLoading ? "In progress..." : "Save"}</button
    >

    {#if message.text}
        <p class="status-msg" class:error={message.type === "error"}>
            {message.text}
        </p>
    {/if}
</div>

<style>
    @reference "tailwindcss";

    .form-container {
        @apply p-6 max-w-sm mx-auto flex flex-col gap-4;
    }

    .measure-input {
        @apply w-full p-3 border border-slate-300 rounded-lg outline-none focus:ring-2 focus:ring-blue-500/20 text-center;
    }

    .measure-btn {
        @apply w-full py-3 bg-slate-600 hover:bg-slate-900 text-slate-200 font-bold uppercase rounded-xl transition-all active:scale-95 disabled:opacity-50;
    }

    .status-msg {
        @apply mt-2 text-sm font-medium text-center text-green-600;
    }

    /* Ha a hiba osztály is rajta van, felülbíráljuk a színt */
    .status-msg.error {
        @apply text-red-600;
    }
</style>
