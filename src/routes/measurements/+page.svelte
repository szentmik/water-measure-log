<script>
    let data = $state(null);
    let isLoading = $state(false);
    let d = new Date();

    let year = $state(d.getFullYear());
    let month = $state(d.getMonth() + 1);

    let message = $state({ text: "", type: "" });

    $effect(() => {
        const getAllMeasurements = async () => {
            try {
                isLoading = true;
                const params = new URLSearchParams({
                    year,
                    month,
                });

                const response = await fetch(
                    `/api/v1/measurements?${params.toString()}`,
                    {
                        method: "GET",
                        headers: { "Content-type": "application/json" },
                    },
                );

                const result = await response.json();

                if (!response.ok) {
                    throw new Error(result.error || "Server failure");
                }

                data = result;

                console.log(data);

                message = { text: "Request successful", type: "success" };
            } catch (err) {
                message = { text: err.message, type: "error" };
            } finally {
                isLoading = false;
            }
        };

        getAllMeasurements();
    });
</script>

<h1>Measurements</h1>

{#if isLoading}
    <p>loading...</p>
{:else if data}
    <div class="flex">
        <ul>
            <li>Date:</li>
            <li>pH:</li>
            <li>Cl:</li>
            <li>Total Cl:</li>
            <li>Combined Cl:</li>
            <li>Measured by:</li>
            <li>Updated by:</li>
        </ul>

        {#each data.manual as item}
            <ul>
                <li>{new Date(item.createdAt).getDate()}</li>
                <li>{item.phValue}</li>
                <li>{item.chlorValue}</li>
                <li>{item.totalClValue}</li>
                <li>{item.gebClValue}</li>
                <li class="measured-by">{item.user.name}</li>
                <li>
                    {item.user.id === item.updatedBy
                        ? null
                        : item.updatedByUser.name}
                </li>
            </ul>
        {/each}
    </div>
{:else}
    <p>{message.text}</p>
{/if}
<div class="fixed bottom-6 right-6 z-50">
    <a
        href="/measurements/addManualData"
        class="btn btn-circle bg-emerald-800 text-3xl">+</a
    >
</div>

<style>
    @reference "tailwindcss";

    h1 {
        @apply flex py-4 justify-center font-stretch-200% text-5xl;
    }

    

    ul {
        display: grid;
        grid-template-rows: repeat(7, 3rem);
        max-width: 5rem;
        overflow-x: hidden;
    }

    ul:first-child{
        max-width: 10rem;
    }

    li:first-child {
        @apply bg-slate-600 font-extrabold;
    }

    li {
        @apply flex items-center;
        padding-left: 1.5rem;
        white-space: nowrap;
    }

    .measured-by {
        font-size: .9rem;
    }
</style>
