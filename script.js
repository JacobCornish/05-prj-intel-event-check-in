// ─── Track Attendance ───────────────────────────────────────────────────────
let count = parseInt(localStorage.getItem("totalCount")) || 0;
const maxCount = 50;

// ─── Team Counts ─────────────────────────────────────────────────────────────
let teamCounts = JSON.parse(localStorage.getItem("teamCounts")) || {
  water: 0,
  zero: 0,
  power: 0,
};

// ─── Attendee List ────────────────────────────────────────────────────────────
let attendeeList = JSON.parse(localStorage.getItem("attendeeList")) || [];

// ─── Grab Elements ───────────────────────────────────────────────────────────
const form = document.getElementById("checkInForm");
const nameInput = document.getElementById("attendeeName");
const teamSelect = document.getElementById("teamSelect");
const attendeeCount = document.getElementById("attendeeCount");
const progressBar = document.getElementById("progressBar");
const greeting = document.getElementById("greeting");

// ─── Initialize Page on Load ─────────────────────────────────────────────────
function initPage() {
  attendeeCount.textContent = count;
  updateProgressBar();
  document.getElementById("waterCount").textContent = teamCounts.water;
  document.getElementById("zeroCount").textContent = teamCounts.zero;
  document.getElementById("powerCount").textContent = teamCounts.power;
  renderAttendeeList();
}

// ─── Update Progress Bar ─────────────────────────────────────────────────────
function updateProgressBar() {
  const percentage = Math.round((count / maxCount) * 100);
  progressBar.style.width = percentage + "%";
}

// ─── Render Attendee List ─────────────────────────────────────────────────────
function renderAttendeeList() {
  // Remove existing list if present
  const existing = document.getElementById("attendeeListSection");
  if (existing) existing.remove();

  if (attendeeList.length === 0) return;

  const container = document.querySelector(".container");

  const section = document.createElement("div");
  section.id = "attendeeListSection";
  section.style.cssText = `
    margin-top: 30px;
    padding-top: 30px;
    border-top: 2px solid #f1f5f9;
    text-align: left;
  `;

  const title = document.createElement("h3");
  title.textContent = "Attendee List";
  title.style.cssText = `
    color: #64748b;
    font-size: 16px;
    margin-bottom: 15px;
    text-align: center;
  `;
  section.appendChild(title);

  const list = document.createElement("ul");
  list.style.cssText = `
    list-style: none;
    padding: 0;
    margin: 0;
    display: flex;
    flex-direction: column;
    gap: 8px;
  `;

  attendeeList.forEach((attendee) => {
    const item = document.createElement("li");
    item.style.cssText = `
      display: flex;
      justify-content: space-between;
      align-items: center;
      padding: 10px 16px;
      background: #f8fafc;
      border-radius: 10px;
      font-size: 15px;
    `;

    const teamColors = {
      water: "#e8f7fc",
      zero: "#ecfdf3",
      power: "#fff7ed",
    };

    const teamLabels = {
      water: "🌊 Team Water Wise",
      zero: "🌿 Team Net Zero",
      power: "⚡ Team Renewables",
    };

    item.innerHTML = `
      <span style="font-weight:600; color:#2c3e50;">${attendee.name}</span>
      <span style="
        background:${teamColors[attendee.team]};
        color:#475569;
        padding: 4px 12px;
        border-radius: 20px;
        font-size: 13px;
        font-weight: 500;
      ">${teamLabels[attendee.team]}</span>
    `;
    list.appendChild(item);
  });

  section.appendChild(list);
  container.appendChild(section);
}

// ─── Check if Goal Reached ────────────────────────────────────────────────────
function checkGoalReached() {
  if (count === maxCount) {
    // Find winning team
    const max = Math.max(teamCounts.water, teamCounts.zero, teamCounts.power);
    const winnerKey = Object.keys(teamCounts).find(
      (k) => teamCounts[k] === max
    );
    const teamLabels = {
      water: "Team Water Wise",
      zero: "Team Net Zero",
      power: "Team Renewables",
    };
    greeting.textContent = `🎉 Goal reached! Congratulations to ${teamLabels[winnerKey]} for leading the charge!`;
    greeting.className = "success-message";
    greeting.style.display = "block";
    greeting.style.backgroundColor = "#fff3cd";
    greeting.style.color = "#856404";
  }
}

// ─── Form Submit Handler ──────────────────────────────────────────────────────
form.addEventListener("submit", function (event) {
  event.preventDefault();

  // Get values
  const name = nameInput.value.trim();
  const team = teamSelect.value;
  const teamName = teamSelect.selectedOptions[0].text;

  if (!name || !team) return;

  // Increment total count
  count++;

  // Update team count
  teamCounts[team]++;

  // Add to attendee list
  attendeeList.push({ name, team });

  // Save to localStorage
  localStorage.setItem("totalCount", count);
  localStorage.setItem("teamCounts", JSON.stringify(teamCounts));
  localStorage.setItem("attendeeList", JSON.stringify(attendeeList));

  // Update attendee count on page
  attendeeCount.textContent = count;

  // Update progress bar
  updateProgressBar();

  // Update team counter on page
  document.getElementById(team + "Count").textContent = teamCounts[team];

  // Display greeting message
  if (count < maxCount) {
    greeting.textContent = `🎉 Welcome, ${name} from ${teamName}!`;
    greeting.className = "success-message";
    greeting.style.display = "block";
    greeting.style.backgroundColor = "";
    greeting.style.color = "";
  }

  // Check if goal reached
  checkGoalReached();

  // Re-render attendee list
  renderAttendeeList();

  // Reset form
  form.reset();
});

// ─── Init ─────────────────────────────────────────────────────────────────────
initPage();
