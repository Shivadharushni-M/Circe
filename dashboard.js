const currentUser = JSON.parse(localStorage.getItem("currentUser"));
if (!currentUser) {
    window.location.href = "login.html";
}


document.getElementById("username").textContent = `Welcome, ${currentUser.userName}`;


document.getElementById("logoutBtn").addEventListener("click", () => {
    localStorage.removeItem("currentUser");
    window.location.href = "login.html";
});


let selectedMood = null;
const moodButtons = document.querySelectorAll(".mood-btn");
const moodNote = document.getElementById("moodNote");
const submitMoodBtn = document.getElementById("submitMood");


moodButtons.forEach(btn => {
    btn.addEventListener("click", () => {
        moodButtons.forEach(b => b.classList.remove("selected"));
        btn.classList.add("selected");
        selectedMood = btn.dataset.mood;
    });
});


submitMoodBtn.addEventListener("click", () => {
    if (!selectedMood) {
        alert("Please select a mood!");
        return;
    }

    const moodEntry = {
        mood: selectedMood,
        note: moodNote.value.trim(),
        timestamp: new Date().toISOString(),
        userId: currentUser.email
    };

    const moodEntries = JSON.parse(localStorage.getItem("moodEntries")) || [];
    moodEntries.push(moodEntry);
    localStorage.setItem("moodEntries", JSON.stringify(moodEntries));

  
    moodButtons.forEach(btn => btn.classList.remove("selected"));
    moodNote.value = "";
    selectedMood = null;

    
    updateMoodHistory();
    updateMoodStats();
    alert("Mood logged successfully!");
});

function updateMoodHistory() {
    const moodEntries = JSON.parse(localStorage.getItem("moodEntries")) || [];
    const userEntries = moodEntries
        .filter(entry => entry.userId === currentUser.email)
        .sort((a, b) => new Date(b.timestamp) - new Date(a.timestamp))
        .slice(0, 10);

    const entriesContainer = document.getElementById("moodEntries");
    entriesContainer.innerHTML = userEntries.map(entry => `
        <div class="mood-entry">
            <div>
                <strong>${getMoodEmoji(entry.mood)} ${entry.mood}</strong>
                <p>${entry.note || "No note"}</p>
            </div>
            <div>${formatDate(new Date(entry.timestamp))}</div>
        </div>
    `).join("");
}

function formatDate(date) {
    return new Intl.DateTimeFormat('en-US', {
        month: 'short',
        day: 'numeric',
        hour: '2-digit',
        minute: '2-digit',
        hour12: true
    }).format(date);
}


function getMoodEmoji(mood) {
    const emojis = {
        happy: "😊",
        sad: "😢",
        angry: "😠",
        anxious: "😰",
        neutral: "😐"
    };
    return emojis[mood] || "😐";
}

function updateMoodStats() {
    const moodEntries = JSON.parse(localStorage.getItem("moodEntries")) || [];
    const userEntries = moodEntries.filter(entry => entry.userId === currentUser.email);
    
  
    const moodCounts = userEntries.reduce((acc, entry) => {
        acc[entry.mood] = (acc[entry.mood] || 0) + 1;
        return acc;
    }, {});

    const statsContainer = document.querySelector('.stats-container');
    statsContainer.innerHTML = `
        <div class="stat-card">
            <h3>Total Entries</h3>
            <p>${userEntries.length}</p>
        </div>
        <div class="stat-card">
            <h3>Happy Entries</h3>
            <p>${moodCounts.happy || 0}</p>
        </div>
        <div class="stat-card">
            <h3>Sad Entries</h3>
            <p>${moodCounts.sad || 0}</p>
        </div>
    `;
}


updateMoodHistory();
updateMoodStats();
