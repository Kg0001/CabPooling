var rides = [];


window.onload = function() {
    var stored = localStorage.getItem("vitRides");
    if (stored != null) {
        rides = JSON.parse(stored);
    }
    displayRides(rides);
}

function postRide() {
    clearErrors();
    var hasError = false;

    function clearErrors() {
        document.getElementById("error-name").innerText = "";
        document.getElementById("error-phone").innerText = "";
        document.getElementById("error-date").innerText = "";
        document.getElementById("error-time").innerText = "";
        document.getElementById("error-from").innerText = "";
        document.getElementById("error-to").innerText = "";
        document.getElementById("error-seats").innerText = "";
        document.getElementById("error-price").innerText = "";
    }

    var name = document.getElementById("name").value.trim();
    var phone = document.getElementById("phone").value.trim();
    var date = document.getElementById("date").value;
    var time = document.getElementById("time").value;
    var from = document.getElementById("from").value;
    var to = document.getElementById("to").value;
    var seats = document.getElementById("seats").value;
    var price = document.getElementById("price").value.trim();

    if (name == "") {
        document.getElementById("error-name").innerText = "Name cannot be empty.";
        hasError = true;
    }

    if (phone == "") {
        document.getElementById("error-phone").innerText = "Phone cannot be empty.";
        hasError = true;
    } else if (isNaN(phone) || phone.length != 10) {
        document.getElementById("error-phone").innerText = "Enter a valid 10-digit phone number.";
        hasError = true;
    }

    if (date == "") {
        document.getElementById("error-date").innerText = "Date cannot be empty.";
        hasError = true;
    }

    if (time == "") {
        document.getElementById("error-time").innerText = "Time cannot be empty.";
        hasError = true;
    }

    if (from == "") {
        document.getElementById("error-from").innerText = "From cannot be empty.";
        hasError = true;
    }

    if (to == "") {
        document.getElementById("error-to").innerText = "To cannot be empty.";
        hasError = true;
    }

    if (from != "" && to != "" && from == to) {
        document.getElementById("error-to").innerText = "To and From cannot be the same.";
        hasError = true;
    }

    if (seats == "") {
        document.getElementById("error-seats").innerText = "Seats cannot be empty.";
        hasError = true;
    } else if (seats < 1 || seats > 5) {
        document.getElementById("error-seats").innerText = "Seats must be between 1 and 5.";
        hasError = true;
    }

    if (price == "") {
        document.getElementById("error-price").innerText = "Price cannot be empty.";
        hasError = true;
    } else if (isNaN(price) || price < 0) {
        document.getElementById("error-price").innerText = "Enter a valid price.";
        hasError = true;
    }

    if (hasError) {
        return;
    }

    var newRide = {
        id: Date.now(),
        name: name,
        phone: phone,
        date: date,
        time: time,
        from: from,
        to: to,
        seats: parseInt(seats),
        price: price
    };

    rides.push(newRide);
    saveToStorage();
    displayRides(rides);
    clearForm();
    alert("Ride posted successfully!");
}

function clearForm() {
    document.getElementById("name").value = "";
    document.getElementById("phone").value = "";
    document.getElementById("date").value = "";
    document.getElementById("time").value = "";
    document.getElementById("from").value = "";
    document.getElementById("to").value = "";
    document.getElementById("seats").value = "";
    document.getElementById("price").value = "";
}

function saveToStorage() {
    localStorage.setItem("vitRides", JSON.stringify(rides));
}

function displayRides(ridesToShow) {
    var container = document.getElementById("rides-container");
    var noMsg = document.getElementById("no-rides-msg");
    container.innerHTML = "";

    if (ridesToShow.length == 0) {
        noMsg.style.display = "block";
        return;
    }

    noMsg.style.display = "none";

    for (var i = 0; i < ridesToShow.length; i++) {
        var ride = ridesToShow[i];

        var card = document.createElement("article");
        card.className = "ride-card";
        card.id = "card-" + ride.id;

        var joinDisabled = "";
        var seatsText = ride.seats + " seat(s) left";
        if (ride.seats <= 0) {
            joinDisabled = "disabled";
            seatsText = "Full";
        }

        card.innerHTML = 
            "<h3>" + ride.from + " &rarr; " + ride.to + "</h3>" +
            "<p><span>Posted by:</span> " + ride.name + " &nbsp;|&nbsp; <span>Phone:</span> " + ride.phone + "</p>" +
            "<p><span>Date:</span> " + formatDate(ride.date) + " &nbsp;|&nbsp; <span>Time:</span> " + formatTime(ride.time) + "</p>" +
            "<p><span>Seats Available:</span> " + seatsText + "</p>" +
            "<p><span>Cab Price:</span> ₹" + ride.price + "</p>" +
            "<div class='card-buttons'>" +
                "<button class='join-btn' onclick='joinRide(" + ride.id + ")' " + joinDisabled + ">Join Ride</button>" +
                "<button class='delete-btn' onclick='deleteRide(" + ride.id + ")'>Delete</button>" +
            "</div>";

        container.appendChild(card);
    }
}

function joinRide(id) {
    for (var i = 0; i < rides.length; i++) {
        if (rides[i].id == id) {
            if (rides[i].seats > 0) {
                rides[i].seats = rides[i].seats - 1;
            }
            break;
        }
    }
    saveToStorage();

    // check if filter is active
    var filterDate = document.getElementById("filter-date").value;
    if (filterDate != "") {
        filterRides();
    } else {
        displayRides(rides);
    }
}

function deleteRide(id) {
    var confirm = window.confirm("Are you sure you want to delete this ride?");
    if (!confirm) {
        return;
    }

    var newRides = [];
    for (var i = 0; i < rides.length; i++) {
        if (rides[i].id != id) {
            newRides.push(rides[i]);
        }
    }
    rides = newRides;
    saveToStorage();

    var filterDate = document.getElementById("filter-date").value;
    if (filterDate != "") {
        filterRides();
    } else {
        displayRides(rides);
    }
}

function filterRides() {
    var filterDate = document.getElementById("filter-date").value;
    if (filterDate == "") {
        displayRides(rides);
        return;
    }

    var filtered = [];
    for (var i = 0; i < rides.length; i++) {
        if (rides[i].date == filterDate) {
            filtered.push(rides[i]);
        }
    }
    displayRides(filtered);
}

function clearFilter() {
    document.getElementById("filter-date").value = "";
    displayRides(rides);
}

function formatDate(dateStr) {
    if (!dateStr) return "";
    var parts = dateStr.split("-");
    return parts[2] + "/" + parts[1] + "/" + parts[0];
}

function formatTime(timeStr) {
    if (!timeStr) return "";
    var parts = timeStr.split(":");
    var hours = parseInt(parts[0]);
    var mins = parts[1];
    var ampm = "AM";
    if (hours >= 12) {
        ampm = "PM";
        if (hours > 12) hours = hours - 12;
    }
    if (hours == 0) hours = 12;
    return hours + ":" + mins + " " + ampm;
}

var canvas = document.getElementById("divider-canvas");
var ctx = canvas.getContext("2d");
canvas.width = window.innerWidth;
ctx.fillStyle = "#1a6fc4";
ctx.fillRect(0, 0, canvas.width, 6);
