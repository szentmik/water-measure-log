<script>
    let data = $state(null);
    let message = $state({ text: "", type: "" });

    let isLoading = $state(false);

    $effect(() => {
        const getData = async () => {
            try {
                isLoading = true;
                message = { text: "Loading...", type: " info" };

                const response = await fetch("/api/v1/measurements/byuser", {
                    method: "GET",
                    headers: { "Content-type": "application/json" },
                });

                const result = await response.json();
                if (!response.ok)
                    throw new Error(result.error || "Server failure");

                data = result;

                message = { text: "Request successful", type: "success" };
            } catch (err) {
                message = { text: err.message, type: "error" };
            } finally {
                isLoading = false;
            }
        };
        getData();
    });
</script>

{#if isLoading}
    <p>{message.text}</p>
{:else if data}
    {#each data.manual as item}
        <pre>
            {JSON.stringify(item, null, 2)}
        </pre>
    {/each}
{:else}
    <p>{message.text}</p>
{/if}

<style>
    @reference "tailwindcss";
    pre {
        @apply overflow-hidden text-xs;
    }
</style>
