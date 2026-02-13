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
   <div class="flex justify-between">
    <label class="text-2xl">Filter Backwash</label>
     <input
        type="checkbox"
        bind:checked={sysFilterBackwash}
        class="checkbox checkbox-xl border border-slate-300"
    />
   </div>

    <button
        onclick={(e) => {
            e.preventDefault();
            handleSystemData();
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
    @reference "tailwindcss";

    h1 {
        @apply text-5xl py-8 text-center font-bold font-stretch-75%;
    }

    .form-container {
        @apply p-6 max-w-sm mx-auto flex flex-col gap-4;
    }

    .measure-input {
        @apply w-full p-3 border border-slate-300 rounded-lg outline-none focus:ring-2 focus:ring-blue-500/20 text-center;
    }

    .measure-btn {
        @apply w-full py-3 bg-emerald-600 hover:bg-emerald-900 text-slate-200 font-bold uppercase rounded-xl transition-all active:scale-95 disabled:opacity-50 cursor-pointer;
    }

    .status-msg {
        @apply mt-2 text-sm font-medium text-center text-green-600;
    }

    /* Ha a hiba osztály is rajta van, felülbíráljuk a színt */
    .status-msg.error {
        @apply text-red-600;
    }
</style>
