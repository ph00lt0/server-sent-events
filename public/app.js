document.addEventListener("DOMContentLoaded", function(event) {
    document.querySelectorAll("[data-subscribe]").forEach( (button) => {
        button.addEventListener("click", (event) => {
            const channelID = event.currentTarget.getAttribute("data-subscribe");
            console.log(channelID);
            subscribe(channelID);
        })
    })
});

async function subscribe(id) {
    const connection = await fetch(`subscribe/${id}`);
    const response = await connection.json();
    console.log(response);
}

const eventSource = new EventSource("/sse");
eventSource.addEventListener("message", (e) => {
    try{
        console.log(e.data);
        const channels = JSON.parse(e.data);
        for (let channel in channels) {
            document.querySelector(`[data-subscribers=\"${channel}\"]`).textContent = channels[channel].subscribers;
        }
    }
    catch{}
});