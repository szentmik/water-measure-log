<script>
    let data = $state(null);
    let isLoading = $state(false);

    let userData = $state(null);

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
    <div>
        {#if isLoading}
            <p>Loading files...</p>
        {:else if data}
            <div class="my-card">
                <img src={data.imageUrl} alt="avatar" />

                <div class="content">
                    <h2>{data.name}</h2>
                    <p>
                        {data.role}
                    </p>
                    <p>
                        {data.email}
                    </p>
                </div>

                <button><a href="/measurements/byuser">My measurements</a></button>
            </div>
        {:else}
            <p>{message.text}</p>
        {/if}
    </div>
</div>

<style>
    @reference "tailwindcss";
    .my-card {
        @apply relative flex flex-col bg-slate-500 shadow-md border-4 border-slate-800 shadow-slate-600 rounded-2xl w-60 my-8;
    }

    img {
        @apply border-4 border-slate-800 rounded-full self-center relative -top-12 h-24 w-24;
    }

    .content {
        @apply text-center;
    }

    h2 {
        @apply font-bold text-xl;
    }

    button {
        @apply px-4 py-2 bg-emerald-800 text-emerald-200 self-center font-bold rounded-4xl border-2 border-emerald-100 hover:bg-emerald-900 cursor-pointer relative -bottom-6 w-10/12;
    }

    .my-container {
        @apply flex justify-center;
    }
</style>
