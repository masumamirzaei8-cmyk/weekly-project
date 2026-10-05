document.addEventListener("DOMContentLoaded", function () {
    const sidebar = document.getElementById("sidebar");
    const hamburger = document.getElementById("hamburger-btn");
    const overlay = document.getElementById("sidebar-overlay");
    const dashboardNav = document.getElementById("dashboard-nav");
    const appointmentsNav = document.getElementById("appointments-nav");
    const dashboardGrid = document.querySelector(".dashboard-grid");
    const welcomeText = document.querySelector(".welcome-text");
    const appointmentsSection = document.getElementById("appointments-section");
    const formCard = document.getElementById("appointment-form-card");
    const form = document.getElementById("appointment-form");
    const list = document.getElementById("appointments-list");
    const count = document.getElementById("appointment-count");
    const detailsCard = document.getElementById("appointment-details-card");
    const detailsContent = document.getElementById("appointment-details-content");

    if (hamburger) hamburger.addEventListener("click", () => {
        sidebar.classList.toggle("open");
        overlay.classList.toggle("active");
    });
    if (overlay) overlay.addEventListener("click", () => {
        sidebar.classList.remove("open");
        overlay.classList.remove("active");
    });

    let appointments = [
        { id: 1, patient: "Sarah Ahmed", doctor: "Dr. Sarah Johnson", date: "2026-09-22", time: "10:00", type: "General Consultation", status: "Confirmed" },
        { id: 2, patient: "Sarah Ahmed", doctor: "Dr. Michael Lee", date: "2026-09-25", time: "14:30", type: "Follow-up", status: "Pending" },
        { id: 3, patient: "Sarah Ahmed", doctor: "Dr. Emily Williams", date: "2026-09-29", time: "09:30", type: "Health Checkup", status: "Confirmed" }
    ];

    const formatDate = value => new Date(value + "T00:00:00").toLocaleDateString("en-US", { year: "numeric", month: "short", day: "numeric" });
    const formatTime = value => {
        const [h, m] = value.split(":");
        const d = new Date(); d.setHours(+h, +m, 0, 0);
        return d.toLocaleTimeString("en-US", { hour: "numeric", minute: "2-digit" });
    };
    const statusClass = status => status === "Confirmed" ? "status-confirmed" : status === "Pending" ? "status-pending" : "status-cancelled";

    function closeDetails() {
        detailsCard.classList.remove("show");
        detailsContent.innerHTML = "";
    }

    function showDashboard() {
        dashboardGrid.style.display = "grid";
        welcomeText.style.display = "block";
        appointmentsSection.classList.remove("show");
        dashboardNav.classList.add("active");
        appointmentsNav.classList.remove("active");
        formCard.classList.remove("show");
        closeDetails();
    }

    function showAppointments() {
        dashboardGrid.style.display = "none";
        welcomeText.style.display = "none";
        appointmentsSection.classList.add("show");
        dashboardNav.classList.remove("active");
        appointmentsNav.classList.add("active");
        renderAppointments();
        sidebar.classList.remove("open");
        overlay.classList.remove("active");
    }

    document.querySelectorAll(".nav-item").forEach(item => item.addEventListener("click", function (e) {
        e.preventDefault();
        if (item.dataset.section === "appointments") showAppointments();
        else if (item.dataset.section === "dashboard") showDashboard();
        else {
            document.querySelectorAll(".nav-item").forEach(x => x.classList.remove("active"));
            item.classList.add("active");
        }
    }));

    function renderAppointments() {
        count.textContent = `${appointments.length} ${appointments.length === 1 ? "Appointment" : "Appointments"}`;
        if (!appointments.length) {
            list.innerHTML = `<div class="no-appointments"><i class="fas fa-calendar-times"></i><h4>No appointments found</h4><p>Click "Book New Appointment" to schedule one.</p></div>`;
            return;
        }
        list.innerHTML = appointments.map(a => `
            <div class="appointment-item">
                <div class="appointment-main">
                    <div class="appointment-avatar"><i class="fas fa-user-md"></i></div>
                    <div class="appointment-info"><h4>${a.patient}</h4><p><i class="fas fa-user-md"></i> ${a.doctor}</p></div>
                    <span class="appointment-status ${statusClass(a.status)}">${a.status}</span>
                </div>
                <div class="appointment-data">
                    <div class="appointment-data-item"><i class="fas fa-calendar"></i><div><span>Date</span><strong>${formatDate(a.date)}</strong></div></div>
                    <div class="appointment-data-item"><i class="fas fa-clock"></i><div><span>Time</span><strong>${formatTime(a.time)}</strong></div></div>
                    <div class="appointment-data-item"><i class="fas fa-stethoscope"></i><div><span>Type</span><strong>${a.type}</strong></div></div>
                    <div class="appointment-data-item"><i class="fas fa-user-md"></i><div><span>Doctor</span><strong>${a.doctor}</strong></div></div>
                </div>
                <div class="appointment-actions">
                    <button class="view-details-btn" data-action="details" data-id="${a.id}"><i class="fas fa-eye"></i> View Details</button>
                    <button class="reschedule-btn" data-action="reschedule" data-id="${a.id}"><i class="fas fa-calendar-alt"></i> Reschedule</button>
                    <button class="cancel-appointment-btn" data-action="cancel" data-id="${a.id}" ${a.status === "Cancelled" ? "disabled" : ""}><i class="fas fa-times"></i> Cancel Appointment</button>
                </div>
            </div>`).join("");
    }

    list.addEventListener("click", function (e) {
        const button = e.target.closest("button[data-action]");
        if (!button) return;
        const appointment = appointments.find(a => a.id === Number(button.dataset.id));
        if (!appointment) return;

        if (button.dataset.action === "details") {
            detailsContent.innerHTML = `<div class="details-grid">
                <div class="detail-box"><span>Patient Name</span><strong>${appointment.patient}</strong></div>
                <div class="detail-box"><span>Doctor</span><strong>${appointment.doctor}</strong></div>
                <div class="detail-box"><span>Date</span><strong>${formatDate(appointment.date)}</strong></div>
                <div class="detail-box"><span>Time</span><strong>${formatTime(appointment.time)}</strong></div>
                <div class="detail-box"><span>Appointment Type</span><strong>${appointment.type}</strong></div>
                <div class="detail-box"><span>Status</span><strong>${appointment.status}</strong></div>
            </div>`;
            detailsCard.classList.add("show");
            detailsCard.scrollIntoView({ behavior: "smooth", block: "nearest" });
        } else if (button.dataset.action === "cancel") {
            if (confirm("Are you sure you want to cancel this appointment?")) {
                appointment.status = "Cancelled";
                renderAppointments();
                closeDetails();
            }
        } else if (button.dataset.action === "reschedule") {
            const date = prompt("Enter the new date (YYYY-MM-DD):", appointment.date);
            if (!date) return;
            const time = prompt("Enter the new time (HH:MM):", appointment.time);
            if (!time) return;
            appointment.date = date;
            appointment.time = time;
            appointment.status = "Pending";
            renderAppointments();
            closeDetails();
            alert("Appointment rescheduled successfully.");
        }
    });

    document.getElementById("book-appointment-btn").addEventListener("click", () => {
        formCard.classList.add("show");
        closeDetails();
        formCard.scrollIntoView({ behavior: "smooth", block: "start" });
    });
    document.getElementById("close-appointment-form").addEventListener("click", () => { formCard.classList.remove("show"); form.reset(); });
    document.getElementById("cancel-appointment-form").addEventListener("click", () => { formCard.classList.remove("show"); form.reset(); });
    document.getElementById("close-details-btn").addEventListener("click", closeDetails);

    form.addEventListener("submit", function (e) {
        e.preventDefault();
        const doctor = document.getElementById("appointment-doctor").value;
        const date = document.getElementById("appointment-date").value;
        const time = document.getElementById("appointment-time").value;
        const type = document.getElementById("appointment-type").value;
        if (!doctor || !date || !time || !type) return alert("Please complete all appointment fields.");
        appointments.unshift({ id: Date.now(), patient: "Sarah Ahmed", doctor, date, time, type, status: "Pending" });
        renderAppointments();
        form.reset();
        formCard.classList.remove("show");
        alert("Your new appointment has been booked successfully.");
    });

    document.querySelectorAll(".more-details-btn").forEach(button => button.addEventListener("click", () => alert("More details will be available soon.")));

    if (typeof Chart !== "undefined") {
        const common = { responsive: true, maintainAspectRatio: false, cutout: "64%", plugins: { legend: { display: false } } };
        const clinic = document.getElementById("clinicChart");
        if (clinic) new Chart(clinic, { type: "doughnut", data: { labels: ["Klinik Lee Healthcare","Klinik Bandar Baru Nilai","Klinik Mediviron Giant Nilai","KLINIK NILAI IMPIAN","Klinik Mediviron","Others"], datasets: [{ data: [19,4,10,21,2,44], backgroundColor: ["#1e88e5","#43a047","#fb8c00","#e53935","#8e24aa","#dce1e8"], borderColor: "#fff", borderWidth: 2 }] }, options: common });
        const pharmacy = document.getElementById("pharmacyChart");
        if (pharmacy) new Chart(pharmacy, { type: "doughnut", data: { labels: ["ALPRO PHARMACY NILAI","ALPRO PHARMACY PEKAN NILAI","OK PHARMACY","PHARMART PHARMACY NILAI","Health Lane Family Pharmacy","Others"], datasets: [{ data: [15,12,5,9,14,45], backgroundColor: ["#00acc1","#7cb342","#f4511e","#5e35b1","#ffb300","#dce1e8"], borderColor: "#fff", borderWidth: 2 }] }, options: common });
        const app = document.getElementById("appUsageChart");
        if (app) new Chart(app, { type: "doughnut", data: { labels: ["Food Panda","Grab Food","Other apps"], datasets: [{ data: [25,3,72], backgroundColor: ["#e91e63","#ffc107","#607d8b"], borderColor: "#fff", borderWidth: 2 }] }, options: common });
        const health = document.getElementById("healthIndexChart");
        if (health) new Chart(health, { type: "line", data: { labels: ["Jan","Feb","Mar","Apr","May","Jun","Jul","Aug","Sep","Oct","Nov","Dec"], datasets: [{ label: "Health Index", data: [55,58,60,62,59,63,65,67,66,68,69,70], borderColor: "#526b94", backgroundColor: "rgba(82,107,148,.10)", borderWidth: 2, fill: true, tension: .4, pointRadius: 2, pointHoverRadius: 5 }] }, options: { responsive: true, maintainAspectRatio: false, plugins: { legend: { display: false } }, scales: { x: { grid: { display: false }, ticks: { display: false } }, y: { min: 40, max: 80, grid: { color: "#eef0f3" }, ticks: { stepSize: 10, color: "#9aa2ae" } } } } });
    }

    showDashboard();
});
