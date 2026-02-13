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
        <ul class="manual-v rounded-tl-3xl">
            <li class="bg-slate-500">Date:</li>
            <li>pH:</li>
            <li>Cl:</li>
            <li>Total Cl:</li>
            <li>Combined Cl:</li>
            <li>Measured by:</li>
            <li>Updated by:</li>
        </ul>

        {#each data.manual as item}
            <ul class="manual-v">
                <li class="bg-slate-500">
                    {new Date(item.createdAt).getDate()}
                </li>
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
    <hr class=" border-slate-500 border-2" />
    <div class="flex">
        <ul class="system-v">
            <li class="text-s bg-slate-500">Measure Sys</li>
            <li>pH:</li>
            <li>Cl:</li>
            <li>Redox (mV):</li>
            <li>Temp. (°C):</li>
            <li>Flow (m&sup3;/h)</li>
            <li>Backwash</li>
            <li>Checked by:</li>
            
        </ul>
        {#each data.system as item}
            <ul class="system-v">
                <li></li>
                <li>{item.phValue}</li>
                <li>{item.chlorValue}</li>
                <li>{item.redoxValue}</li>
                <li>{item.waterTemp}</li>
                <li>{item.flow}</li>
                <li>{item.filterBackwash === false ? "" : "Yes"}</li>
                <li class="measured-by">{item.user.name}</li>
              
            </ul>
        {/each}
    </div>
{:else}
    <p>{message.text}</p>
{/if}

<ul class="add">
    <li>
        <a
            href="/measurements/addManualData"
            class="btn bg-emerald-800 text-emerald-200 hover:bg-emerald-200 hover:text-emerald-900 cursor-pointer"
            >+ Add manual data</a
        >
    </li>
    <li>
        <a
            href="/measurements/addSystemData"
            class="btn bg-emerald-300 text-emerald-950 hover:bg-emerald-900 hover:text-emerald-300 cursor-pointer"
            >+ Add system data</a
        >
    </li>
</ul>

<style>
    @reference "tailwindcss";

    h1 {
        @apply text-center font-stretch-200% text-4xl;
    }

    ul {
        @apply grid-rows-7 max-w-20 overflow-hidden;
    }

    ul.manual-v:first-child, ul.system-v:first-child {
        @apply max-w-32 min-w-32;
    }

    ul.manual-v li,
    ul.system-v li {
        @apply flex items-center pl-6 whitespace-nowrap min-h-12 min-w-32 max-w-32;
    }

    ul.manual-v:nth-of-type(2),
    ul.system-v:nth-of-type(2){
        @apply border-l-2 border-l-slate-500;
    }

     ul.add {
        @apply flex justify-center mt-6 gap-2 max-w-full;
    }

    ul.add{
        @media (max-width: 764px) {
            @apply w-full; 
        }
    }

    .measured-by {
        font-size: 0.9rem;
    }
</style>
