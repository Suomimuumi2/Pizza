function startTimer(timerKey, duration) {
    const startTime = Date.now();
    localStorage.setItem(timerKey, startTime);
    localStorage.setItem(`${timerKey}_duration`, duration);
    updateTimer(timerKey);
}

let deferredPrompt;

window.addEventListener("beforeinstallprompt", (e) => {
    // Prevent the default mini-infobar from appearing
    e.preventDefault();
    deferredPrompt = e;
    console.log("beforeinstallprompt fired");

    // Show your custom install prompt (e.g., a button)
    const installButton = document.getElementById("installButton");
    installButton.style.display = "block";

    // Ensure that the button click only triggers the prompt once
    installButton.addEventListener("click", () => {
        // Show the prompt
        deferredPrompt.prompt();
        console.log("Prompt triggered");

        // Wait for the user to respond to the prompt
        deferredPrompt.userChoice.then((choiceResult) => {
            if (choiceResult.outcome === "accepted") {
                console.log("User accepted the A2HS prompt");
            } else {
                console.log("User dismissed the A2HS prompt");
            }

            // Clear the deferredPrompt variable to prevent multiple triggers
            deferredPrompt = null;
        });
    });
});



function updateTimer(timerKey) {
    const startTime = localStorage.getItem(timerKey);
    const duration = localStorage.getItem(`${timerKey}_duration`);
    
    if (!startTime || !duration) return;

    function refresh() {
        const elapsed = Math.floor((Date.now() - startTime) / 1000);
        const remaining = duration - elapsed;
        
        if (remaining <= 0) {
            document.getElementById(timerKey === "rise1" ? "timer1" : "timer2").textContent = "Time's up!";
            return;
        }

        const hours = Math.floor(remaining / 3600);
        const minutes = Math.floor((remaining % 3600) / 60);
        const seconds = remaining % 60;

        document.getElementById(timerKey === "rise1" ? "timer1" : "timer2").textContent = 
            `${hours}h ${minutes}m ${seconds}s`;

        requestAnimationFrame(refresh);
    }

    refresh();
}

// Restart timers when page loads
updateTimer("rise1");
updateTimer("rise2");
const ingredients = {
    napolitana: {
        "00 Flour": 154,
        "Water": 90,
        "Fresh Yeast": 0.09,
        "Salt": 4.54,
        "Olive Oil": 0
    },
    new_york: {
        "Flour": 300,
        "Water": 180,
        "Yeast": 6,
        "Salt": 4,
        "Olive Oil": 15
    },
    pan_pizza: {
        "Flour": 320,
        "Water": 200,
        "Yeast": 7,
        "Salt": 5,
        "Olive Oil": 20
    }
};

document.getElementById("pizzaType").addEventListener("change", () => {
    document.getElementById("pizzaTypeTXT").innerHTML = (document.getElementById("pizzaType").value).replace("_", " ");
});


function calculateIngredients() {
    const pizzaType = document.getElementById("pizzaType").value;
    const pizzaCount = parseInt(document.getElementById("pizzaCount").value);
    const selectedIngredients = ingredients[pizzaType];
    let output = "";

    for (let ingredient in selectedIngredients) {
        output += `<strong>${ingredient}</strong>: ${(selectedIngredients[ingredient] * pizzaCount).toFixed(2)}g<br>`;
    }

    document.getElementById("ingredientsOutput").innerHTML = output;
}
