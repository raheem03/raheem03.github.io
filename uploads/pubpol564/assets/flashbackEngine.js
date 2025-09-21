// flashbackEngine.js
// This file holds the shared logic for building and running the quiz.

// Optional: You can export or attach a global function depending on your setup.
// Here, we'll attach it to `window.` so you can do <script src="flashbackEngine.js"></script>.

window.initFlashbackQuiz = function(containerId, quizData) {
  // containerId is the ID of some <div> or <section> in your HTML
  // quizData is an array of event objects like:
  //   [{ id: 1, text: "Some event", year: "B.C.E.", order: 1 }, ...]

  const container = document.getElementById(containerId);
  if (!container) {
    console.error(`Cannot find container with ID: ${containerId}`);
    return;
  }

  // We'll create any markup we need inside that container.
  container.innerHTML = `
  <h2 style="text-align: center;">Timeline Quiz</h2>
  <span class="sidenote">
    <p id="scoreCounter"><strong>Score:</strong> 0 / 0</p>
    <div id="scoreCircles"></div>
    </span>
  <h3>Can you place all events in the correct chronological order?</h3>
  <p style="width:100%">We've placed one item on the timeline for you. Drag each event onto the timeline below.</p>
    <div class="quiz-pending" style="text-align: center;"></div>
    <hr style="width:75%; margin: auto; color: #85754d" />
    <center><p style="color: #b7a57a; opacity: 0.7;font-size: 1.5rem">Earlier</p></center>
    <div class="timeline-container">
    <center><ul class="quiz-placed"></ul></center>
    </div>
    <center><p style="color: #b7a57a; opacity: 0.7;font-size: 1.5rem">Later</p></center>
  `;

  // Grab references to these new elements
  const pendingSlot = container.querySelector(".quiz-pending");
  const placedList = container.querySelector(".quiz-placed");

  // We'll store our placedEvents, etc.
  let placedEvents = [];
  let remaining = [];
  let currentPending = null;

  let firstDrag = true;
  let totalPlaced = 0;
  let numCorrect = 0;

function initCircles(count) {
  const container = document.getElementById("scoreCircles");
  container.innerHTML = ""; // clear any old ones
  for (let i = 0; i < count; i++) {
    const circle = document.createElement("span");
    circle.classList.add("score-circle");
    container.appendChild(circle);
  }
}


  // Shuffle logic
  function shuffle(array) {
    for (let i = array.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [array[i], array[j]] = [array[j], array[i]];
    }
  }

  function initGame() {
    const temp = quizData.slice();
    shuffle(temp);

    // Take one event for initial auto-placement
    const firstEvent = temp.shift();
    placedEvents.push(firstEvent);

    remaining = temp;
    
    initCircles(remaining.length); // <–– Add this here
    
    renderPlaced();
    showNextPending();
  }

  function renderPlaced() {
    placedList.innerHTML = "";
    placedEvents.forEach((evt) => {
      const li = document.createElement("li");
      li.classList.add("placed-item", "event-box");

      // Example: place a year button absolutely
      const yearBtn = document.createElement("button");
      yearBtn.classList.add("year-button", "feedback-button");
      if (evt.correctness) {
        yearBtn.classList.add(evt.correctness);
      }
      yearBtn.textContent = evt.year;
      li.appendChild(yearBtn);

      // Then the text
      const textSpan = document.createElement("span");
      textSpan.textContent = `  ${evt.text}`;
      li.appendChild(textSpan);

      placedList.appendChild(li);
    });
  }

  function showNextPending() {
    pendingSlot.innerHTML = "";

    if (remaining.length === 0) {
      pendingSlot.innerHTML = "<strong>All events placed! Nice job.</strong>";
      return;
    }

    currentPending = remaining.shift();

    const dragItem = document.createElement("div");
    dragItem.classList.add("drag-item", "event-box");
    dragItem.draggable = true;
    dragItem.textContent = `${currentPending.text}`;
    dragItem.addEventListener("dragstart", onDragStart);
    
  if (firstDrag) {
    dragItem.classList.add("first-drag");
  }
    
    /*
    const dragLabel = document.createElement("span");
    dragLabel.classList.add("drag-label");
    dragLabel.textContent = "Drag here";
    dragItem.appendChild(dragLabel);

    const ping = document.createElement("div");
    ping.classList.add("draggable-ping");
    dragItem.appendChild(ping);
    */
    pendingSlot.appendChild(dragItem);

    const feedbackButton = document.createElement("button");
    feedbackButton.className = "feedback-button";
    feedbackButton.textContent = "?";
    pendingSlot.appendChild(feedbackButton);

    rebuildDropZones();
  }

  function rebuildDropZones() {
    renderPlaced();

    const items = Array.from(placedList.children);
    // items should be only .placed-item, but we can filter out drop zones if used
    // or just ensure we only get .placed-item via a querySelectorAll, etc.

    // Insert a drop zone above each item
    items.forEach((item, idx) => {
      if (!item.classList.contains("placed-item")) return;

      const zone = document.createElement("li");
      zone.classList.add("drop-zone", "event-box");
      zone.dataset.zoneIndex = idx;
      zone.addEventListener("dragover", onDragOver);
      zone.addEventListener("dragleave", onDragLeave);
      zone.addEventListener("drop", onDrop);

      placedList.insertBefore(zone, item);
    });

    // final zone at the bottom
    const endZone = document.createElement("li");
    endZone.classList.add("drop-zone", "event-box");
    endZone.dataset.zoneIndex = items.length;
    endZone.addEventListener("dragover", onDragOver);
    endZone.addEventListener("dragleave", onDragLeave);
    endZone.addEventListener("drop", onDrop);
    placedList.appendChild(endZone);
  }

  function removeDropZones() {
    const zones = placedList.querySelectorAll(".drop-zone");
    zones.forEach((z) => z.remove());
  }

  let draggedEl = null;
  function onDragStart(e) {
    draggedEl = this;
    e.dataTransfer.effectAllowed = "move";
  }

  function onDragOver(e) {
    e.preventDefault();
    this.classList.add("hover");
  }

  function onDragLeave(e) {
    this.classList.remove("hover");
  }

function animateMoveToCorrectSpot(itemNode, correctIndex) {
  // 1. FIRST: measure the element’s current position (wrong spot)
  const firstRect = itemNode.getBoundingClientRect();

  // 2. Update your data model to remove the event from the wrong index and 
  //    re-insert at the correct index
  const wrongIndex = placedEvents.findIndex(evt => evt === currentPending);
  placedEvents.splice(wrongIndex, 1);
  placedEvents.splice(correctIndex, 0, currentPending);

  // 3. Re-render so that itemNode is physically in the correct place in the DOM
  renderPlaced();

  // 4. LAST: measure the element’s new position
  //    We need the brand-new DOM node for the same event in its correct spot
  /*removeDropZones(); // remove extra drop zones if needed*/
  const placedItems = placedList.querySelectorAll(".placed-item");
  const correctNode = placedItems[correctIndex];
  const lastRect = correctNode.getBoundingClientRect();

  // 5. INVERT: set a transform so the item appears to still be at the old (wrong) position
  const deltaX = firstRect.left - lastRect.left;
  const deltaY = firstRect.top - lastRect.top;
  correctNode.style.transform = `translate(${deltaX}px, ${deltaY}px)`;

  // Force the browser to re-read the current transform, so it can animate from that position
  // This is a common trick to kick in layout before we remove the transform
  correctNode.offsetHeight; // or correctNode.getBoundingClientRect()

  // 6. PLAY: transition the transform back to none (which glides it to the correct spot)
  correctNode.style.transition = "transform 0.5s ease"; // pick any duration you want
  requestAnimationFrame(() => {
    correctNode.style.transform = "";
  });

  // 7. Cleanup after transition ends
  correctNode.addEventListener("transitionend", function handler() {
    correctNode.style.transition = "";
    correctNode.removeEventListener("transitionend", handler);
    // Now it’s in the correct spot with no leftover inline styling
    showNextPending();
  });
}


  function onDrop(e) {
    e.preventDefault();
    this.classList.remove("hover");

    const zoneIndex = parseInt(this.dataset.zoneIndex, 10);
    const feedbackBtn = pendingSlot.querySelector(".feedback-button");

    const correctIndex = findCorrectIndex(currentPending.order);
    const isCorrect = (zoneIndex === correctIndex);

    currentPending.correctness = isCorrect ? "correct" : "incorrect";
    

    if (isCorrect) {
      feedbackBtn.textContent = "✓";
      feedbackBtn.classList.remove("incorrect");
      feedbackBtn.classList.add("correct");
    } else {
      feedbackBtn.textContent = "✗";
      feedbackBtn.classList.remove("correct");
      feedbackBtn.classList.add("incorrect");
    }

    totalPlaced++;
    if (isCorrect) numCorrect++;
    
    // Update the score display
    const scoreDisplay = document.getElementById("scoreCounter");
    scoreDisplay.textContent = `Score: ${numCorrect} / ${totalPlaced}`;
    
    const allCircles = document.querySelectorAll(".score-circle");
    if (allCircles[totalPlaced - 1]) {
      allCircles[totalPlaced - 1].classList.add(isCorrect ? "correct" : "incorrect");
    }

    placedEvents.splice(zoneIndex, 0, currentPending);

    renderPlaced();
    /*removeDropZones();*/

    /*setTimeout(() => {
      showNextPending();
    }, 1000);
    */
    
    firstDrag = false;
    
    const placedItems = placedList.querySelectorAll(".placed-item");
    const droppedItemNode = placedItems[zoneIndex];
    
    if (isCorrect) {
      // If correct, no animation needed. Move on.
      showNextPending();
    } else {
      // If incorrect, let the user briefly see it in the wrong spot...
      setTimeout(() => {
        // ...then animate from old location to new location:
        animateMoveToCorrectSpot(droppedItemNode, correctIndex);
      }, 800); // short delay so they actually see the wrong spot for ~0.8s
    }
    
  }

  function findCorrectIndex(orderValue) {
    for (let i = 0; i < placedEvents.length; i++) {
      if (orderValue < placedEvents[i].order) {
        return i;
      }
    }
    return placedEvents.length;
  }

  // Finally, actually start the game
  initGame();
};

