<script>
    import { useClerkContext } from "svelte-clerk";

    const ctx = useClerkContext();
    let user = $derived(ctx.user);
    let userStatus = $derived(ctx.auth?.sessionStatus);
    let hasSynced = false;

    $effect(() => {
        if (userStatus === "active" && user && !hasSynced) {
            hasSynced = true;
            userSync();
        }
    });

    const userSync = async () => {
        await fetch("/api/v1/syncuser", {
            method: "POST",
            headers: {
                "Content-type": "application/json",
            },
            body: JSON.stringify({
                name: user.fullName || user.username,
                email: user.primaryEmailAddress?.emailAddress,
                imageUrl: user.imageUrl,
            }),
        });
    };
</script>
