if ("Notification" in window) {
    Notification.requestPermission().then(function (permission) {
      if (Notification.permission !== "granted") {
        alert("Please allow notification access!");
        location.reload();
      }
    });
  }

  var timeoutIds = [];

  function scheduleReminder() {
    var title = document.getElementById("title").value;
    var description = document.getElementById("description").value;
    var date = document.getElementById("date").value;
    var time = document.getElementById("time").value;

    var dateTimeString = date + " " + time;
    var scheduledTime = new Date(dateTimeString);
    var currentTime = new Date();
    var timeDifference = scheduledTime - currentTime;

    if (timeDifference > 0) {
      addReminder(title, description, dateTimeString);

      var exactTimeoutId = setTimeout(function () {
        document.getElementById("notificationSound").play();

        var notification = new Notification(title +" due now", {
          body: description,
          requireInteraction: true,
        });
      }, timeDifference);

      var twentyFourHoursBeforeTimeDifference = timeDifference - 86400000; 
      var twentyFourHourTimeoutId;
      if (twentyFourHoursBeforeTimeDifference > 0) {
        twentyFourHourTimeoutId = setTimeout(function () {
          document.getElementById("notificationSound").play();

          var notification = new Notification("24 Hour Reminder: " + title, {
            body: "This is a reminder for: " + description,
            requireInteraction: true,
          });
        }, twentyFourHoursBeforeTimeDifference);
      }

      var oneHourBeforeTimeDifference = timeDifference - 3600000; 
      var oneHourTimeoutId;
      if (oneHourBeforeTimeDifference > 0) {
        oneHourTimeoutId = setTimeout(function () {
          document.getElementById("notificationSound").play();

          var notification = new Notification("1 Hour Reminder: " + title, {
            body: "This is a reminder for: " + description,
            requireInteraction: true,
          });
        }, oneHourBeforeTimeDifference);
      }

      timeoutIds.push({ exactTimeoutId, twentyFourHourTimeoutId, oneHourTimeoutId });
    } else {
      alert("The scheduled time is in the past!");
    }
  }

  function addReminder(title, description, dateTimeString) {
    var tableBody = document.getElementById("reminderTableBody");

    var row = tableBody.insertRow();

    var titleCell = row.insertCell(0);
    var descriptionCell = row.insertCell(1);
    var dateTimeCell = row.insertCell(2);
    var actionCell = row.insertCell(3);

    titleCell.innerHTML = title;
    descriptionCell.innerHTML = description;
    dateTimeCell.innerHTML = dateTimeString;
    actionCell.innerHTML =
      '<button onclick="deleteReminder(this)">Delete</button>';
  }

  function deleteReminder(button) {
    var row = button.closest("tr");
    var index = row.rowIndex;

    if (timeoutIds[index - 1]) {
      clearTimeout(timeoutIds[index - 1].exactTimeoutId);
      clearTimeout(timeoutIds[index - 1].twentyFourHourTimeoutId);
      clearTimeout(timeoutIds[index - 1].oneHourTimeoutId);
      timeoutIds.splice(index - 1, 1);
    }

    row.remove();
  }