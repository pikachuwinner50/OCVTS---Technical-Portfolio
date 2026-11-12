function getCurrentYear() {
    return new Date().getFullYear();
}

function formatDate(date) {
    return date.toLocaleDateString(undefined, {
        year: "numeric",
        month: "long",
        day: "numeric"
    });
}

function getCurrentDate() {
    return formatDate(new Date());
}

function getLastUpdatedDate() {
    return formatDate(new Date(document.lastModified));
}
function SayHello() {
    alert("Thanks for visiting!");
}

function PrintStuff() {
    window.print();
}

function ClearStuff() {
    console.clear();
}

function HideContact() {
    var contactSection = document.getElementById("contact");
    if (contactSection.style.display === "none") {
        contactSection.style.display = "block";
    } else {
        contactSection.style.display = "none";
    }
}