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
            </div>
        {:else}
            <p>{message.text}</p>
        {/if}
    </div>
</div>

<style>
    .my-container {
      display: flex;
      justify-content: center;
    }

    .my-card {
        position: relative;
        background-color: var(--bg-light);
        border-radius: 1rem;
        border: solid var(--bg) 0.2rem;
        padding: 6rem 1rem 1rem;
        margin-top: 7rem;
        display: flex;
        align-items: center;
        flex-direction: column;
        text-align: center;
        width:min(40rem, 100%);
    }

    img {
        position: absolute;
        top: -5rem;
        border-radius: 100%;
        object-fit: cover;
        height: auto;
        width: 10rem;
    }
</style>
