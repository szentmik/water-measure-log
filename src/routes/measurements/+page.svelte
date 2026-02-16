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
    <div class="main-content">
        <div class="content">
            <ul class="content-manual">
                <li class="">Date:</li>
                <li>pH:</li>
                <li>Cl:</li>
                <li>Total Cl:</li>
                <li>Combined Cl:</li>
                <li>Measured by:</li>
                <li>Updated by:</li>
            </ul>
            {#each data.manual as item}
                <ul class="content-manual">
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
        <div class="content">
            <ul class="content-system">
                <li class="">Measure Sys</li>
                <li>pH:</li>
                <li>Cl:</li>
                <li>Redox (mV):</li>
                <li>Temp. (°C):</li>
                <li>Flow (m&sup3;/h)</li>
                <li>Backwash</li>
                <li>Checked by:</li>
            </ul>
            {#each data.system as item}
                <ul class="content-system">
                    <li>{new Date(item.createdAt).getDate()}</li>
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
    </div>
{:else}
    <p>{message.text}</p>
{/if}

<ul class="add">
    <li>
        <a href="/measurements/addManualData" class="">+ Add manual data</a>
    </li>
    <li>
        <a href="/measurements/addSystemData" class="">+ Add system data</a>
    </li>
</ul>

<style>
    .main-content {
        display: flex;
        flex-direction: column;
        gap: 1rem;
    }
    ul {
        list-style-type: none;
    }
    .content {
        background-color: var(--bg-light);
        border-radius: 1rem;
        display: flex;
        flex-wrap: nowrap;
        padding: 1rem;
    }

    .content-manual,
    .content-system {
        display: grid;
        grid-template-columns: 4rem;
        li {
            height: 2rem;
            padding: 0.25rem 1rem;
            overflow: hidden;
            white-space: nowrap;
        }
        li:first-child {
            background-color: var(--bg-dark);
        }
    }

    .content-manual:first-child,
    .content-system:first-child {
        grid-template-columns: 7.5rem;
    }

    .add {
        display: flex;
        justify-content: center;
        align-items: center;
        gap: 1rem;
        margin-block: 1rem;
        li a {
            display: inline-block;
            text-decoration: none;
            background-color: var(--bg-light);
            border-radius: 0.5rem;
            color: var(--text-muted);
            font-family: "Courier New", Courier, monospace;
            font-size: 0.75rem;
            font-weight: bolder;
            letter-spacing: -.01rem;
            padding: 0.5rem 1rem;
            transition: .3s ease-in-out;
        }
        li a:hover {
            background-color: var(--text-muted);
            color: var(--bg-light);
        }
    }
</style>
