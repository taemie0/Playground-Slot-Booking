<script>
    import { page } from "$app/stores"
    let message = "Welcome to the Dashboard!";
</script>


<nav>
    <img
      src={$page.data.session?.user?.image ?? "https://i.pravatar.cc/300"}
      alt="User Avatar"
    />
</nav>

<main>
    <h1>{message}</h1>
    <p>This is a dummy page for the Slot Booking System dashboard.</p>
</main>

<style>
    main {
        padding: 2rem;
        text-align: center;
    }

    h1 {
        color: #333;
    }

    p {
        color: #666;
    }
</style>