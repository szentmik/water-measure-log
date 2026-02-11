<script>
    let data = $state(null);
    let isLoading = $state(false);

    let message = $state({ text: "", type: "" });

    $effect(() => {
        const loadUser = async () => {
            try {
                isLoading = true;
                message = { text: "Data is fetching", type: "info" };

                const response = await fetch("/api/v1/user", {
                    method: "GET",
                    headers: { "Content-type": "application/json" },
                });

                const result = await response.json();

                if (!response.ok) {
                    throw new Error(data.error || "Server failure");
                }

                data = result;

                message = { text: "Request successful", type: "success" };
            } catch (err) {
                message = { text: "Request failed", type: "error" };
            } finally {
                isLoading = false;
            }
        };
        loadUser();
    });
</script>

<div class="my-container">
    {#if isLoading}
        <p>Loading files...</p>
    {:else if data}
        <div class="card bg-base-100 w-60 shadow-sm">
            <figure class="px-10 pt-10">
                <img src={data.imageUrl} alt="avatar" class="rounded-xl" />
            </figure>
            <div class="card-body items-center text-center">
                <h2 class="card-title">{data.role_type}</h2>
                <p>
                   {data.name}
                </p>
                <p>
                    {data.role}
                </p>
                <p>
                    {data.email}
                </p>
                <div class="card-actions">
                    <button class="btn btn-primary">My measurements</button>
                </div>
            </div>
        </div>
    {:else}
        <p>{message.text}</p>
    {/if}
</div>

<style>
    @reference "tailwindcss";

    .my-container {
        @apply flex justify-center w-screen;
    }
</style>
