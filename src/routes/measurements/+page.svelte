<script>
    let data = $state(null);
    let isLoading = $state(false);
    let d = new Date();

    let year = $state(d.getFullYear());
    let month = $state(d.getMonth() + 1);

    let message = $state({ text: "", type: "" });

    const changeMonth = (n) => {
        month += n;
        month < 0 ? (month = 11) : month;
        month > 11 ? (month = 0) : month;
        return month;
    };

    const changeYear = (n) => {
        year += n;
        return year;
    };

    const monthNames = [
        "Dec.",
        "Jan.",
        "Feb.",
        "Mar.",
        "Apr.",
        "May",
        "Jun.",
        "Jul.",
        "Aug.",
        "Sep.",
        "Oct.",
        "Nov.",
    ];

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

    const monthDays = $derived.by(() => {
        const daysInMonth = new Date(year, month, 0).getDate();
        const daysArray = [];

        for (let i = 1; i <= daysInMonth; i++) {
            const manualEntry = data?.manual?.find(
                (m) => new Date(m.createdAt).getDate() === i,
            );
            const systemEntry = data?.system?.find(
                (s) => new Date(s.createdAt).getDate() === i,
            );

            daysArray.push({
                day: i,
                manual: manualEntry || null,
                system: systemEntry || null,
            });
        }
        return daysArray;
    });
</script>

<h1>Measurements</h1>
<div class="date-changer">
    <div>
        <button onclick={() => changeMonth(-1)} aria-label="Previous month"><i class="fa-solid fa-chevron-left"></i></button>
        <h3>{monthNames[month]}</h3>
        <button onclick={() => changeMonth(1)} aria-label="Next month"><i class="fa-solid fa-chevron-right"></i></button>
    </div>
    <div>
        <button onclick={() => changeYear(-1)} aria-label="Previous year"><i class="fa-solid fa-chevron-left"></i></button>
        <h3>{year}</h3>
        <button onclick={() => changeYear(1)} aria-label="Next year"><i class="fa-solid fa-chevron-right"></i></button>
    </div>
</div>
{#if isLoading}
    <p>loading...</p>
{:else if data}
    <div class="main-content">
        <div class="content">
            <ul class="content-manual first-grid">
                <li class="">Date:</li>
                <li>pH:</li>
                <li>Cl:</li>
                <li>Total Cl:</li>
                <li>Combined Cl:</li>
                <li>Measured by:</li>
                <li>Updated by:</li>
            </ul>
            <div class="wrapper">
                {#each monthDays as item}
                    <ul class="content-manual slider">
                        <li>{item.day}</li>
                        {#if item.manual}
                            <li>{item.manual.phValue}</li>
                            <li>{item.manual.chlorValue}</li>
                            <li>{item.manual.totalClValue}</li>
                            <li>{item.manual.gebClValue}</li>
                            <li class="measured-by">{item.manual.user.name}</li>
                            <li>
                                {item.manual.user.id === item.manual.updatedBy
                                    ? null
                                    : item.manual.updatedByUser?.name}
                            </li>
                        {:else}
                            <li></li>
                        {/if}
                    </ul>
                {/each}
            </div>
        </div>
        <div class="content">
            <ul class="content-system first-grid">
                <li class="">Date</li>
                <li>pH:</li>
                <li>Cl:</li>
                <li>Redox (mV):</li>
                <li>Temp. (°C):</li>
                <li>Flow (m&sup3;/h)</li>
                <li>Backwash</li>
                <li>Checked by:</li>
            </ul>
            <div class="wrapper">
                {#each monthDays as item}
                    <ul class="content-system slider">
                        <li>{item.day}</li>
                        {#if item.system}
                            <li>{item.system.phValue}</li>
                            <li>{item.system.chlorValue}</li>
                            <li>{item.system.redoxValue}</li>
                            <li>{item.system.waterTemp}</li>
                            <li>{item.system.flow}</li>
                            <li>
                                {item.system.filterBackwash === false
                                    ? ""
                                    : "Yes"}
                            </li>
                            <li class="measured-by">{item.system.user.name}</li>
                        {:else}
                            <li></li>
                        {/if}
                    </ul>
                {/each}
            </div>
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

    .date-changer {
        display: flex;
        justify-content: space-between;
        margin-block: 1rem;

        div {
            display: flex;
            justify-content: center;
            align-items: center;
            gap: .75rem;

            button{
                background-color: transparent;
                border:none;
                font-size: 1.1rem;
            }
        }
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

    .first-grid {
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
            letter-spacing: -0.01rem;
            padding: 0.5rem 1rem;
            transition: 0.3s ease-in-out;
        }
        li a:hover {
            background-color: var(--text-muted);
            color: var(--bg-light);
        }
    }

    .wrapper {
        display: flex;
        overflow-x: scroll;
        scroll-snap-type: x mandatory;
        scrollbar-width: thin;

        .slider {
            scroll-snap-align: center;
        }
    }
</style>
