const payload = {
    type: "enrollment_confirmed",
    userEmail: "renas.mac@gmail.com",
    userName: "Renas",
    workshopName: "Test Workshop",
    workshopDate: "2026-10-10",
    workshopTime: "18:00",
    workshopLink: "https://www.dance2dance.no",
    locationName: "Dance2Dance Studio",
    locationMapLink: "https://maps.google.com",
    userLang: "pt"
};

fetch("https://www.dance2dance.no/api/agenda-notify", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(payload)
})
.then(async res => {
    const text = await res.text();
    console.log("STATUS:", res.status);
    console.log("RESPONSE:", text);
})
.catch(err => console.error(err));
