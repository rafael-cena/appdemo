// Client-side clock logic for auto-updating server time
// Uses local increments based on initial server-rendered time (no repeated server requests)

(function() {
  'use strict';

  const TIME_ELEMENT_ID = 'server-time';
  const UPDATE_INTERVAL_MS = 1000;

  let intervalId = null;
  let currentTime = null;

  /**
   * Updates the DOM element with the formatted time string
   * @param {Date} date - The date object to display
   */
  function updateTimeDisplay(date) {
    const element = document.getElementById(TIME_ELEMENT_ID);
    if (element) {
      // Format as YYYY-MM-DD HH:mm:ss
      const year = date.getFullYear();
      const month = String(date.getMonth() + 1).padStart(2, '0');
      const day = String(date.getDate()).padStart(2, '0');
      const hours = String(date.getHours()).padStart(2, '0');
      const minutes = String(date.getMinutes()).padStart(2, '0');
      const seconds = String(date.getSeconds()).padStart(2, '0');
      element.textContent = 'Hora Atual do Servidor: ' + year + '-' + month + '-' + day + ' ' + hours + ':' + minutes + ':' + seconds;
    }
  }

  /**
   * Parses the initial server time from the DOM element
   * Expected format: "Hora Atual do Servidor: YYYY-MM-DD HH:mm:ss"
   * @returns {Date|null} Parsed Date object or null if parsing fails
   */
  function parseInitialTime() {
    const element = document.getElementById(TIME_ELEMENT_ID);
    if (!element) {
      console.error('Time element not found:', TIME_ELEMENT_ID);
      return null;
    }

    const text = element.textContent.trim();
    // Expected: "Hora Atual do Servidor: YYYY-MM-DD HH:mm:ss"
    const match = text.match(/(\d{4})-(\d{2})-(\d{2}) (\d{2}):(\d{2}):(\d{2})$/);
    if (!match) {
      console.error('Could not parse time from element text:', text);
      return null;
    }

    const year = parseInt(match[1], 10);
    const month = parseInt(match[2], 10) - 1; // Month is 0-indexed
    const day = parseInt(match[3], 10);
    const hours = parseInt(match[4], 10);
    const minutes = parseInt(match[5], 10);
    const seconds = parseInt(match[6], 10);

    const date = new Date(year, month, day, hours, minutes, seconds);

    // Validate the parsed time
    if (isNaN(date.getTime())) {
      console.error('Parsed time is invalid');
      return null;
    }

    return date;
  }

  /**
   * Increments the current time by one second and updates the display
   */
  function tick() {
    if (currentTime) {
      // Increment by 1 second
      currentTime = new Date(currentTime.getTime() + 1000);
      updateTimeDisplay(currentTime);
    }
  }

  /**
   * Starts the local time increment interval
   */
  function startClock() {
    // Parse initial time from server-rendered DOM
    currentTime = parseInitialTime();

    if (!currentTime) {
      console.error('Failed to initialize clock: could not parse initial server time');
      // Fallback: use client's current time
      currentTime = new Date();
      updateTimeDisplay(currentTime);
    }

    // Initial display update (in case parsing succeeded but we want to ensure display is correct)
    updateTimeDisplay(currentTime);

    // Set up interval for local increments
    intervalId = setInterval(tick, UPDATE_INTERVAL_MS);
  }

  /**
   * Stops the clock interval (cleanup)
   */
  function stopClock() {
    if (intervalId !== null) {
      clearInterval(intervalId);
      intervalId = null;
    }
  }

  // Clean up interval on page unload to prevent memory leaks
  window.addEventListener('beforeunload', stopClock);
  window.addEventListener('pagehide', stopClock);

  // Start clock when DOM is ready
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', startClock);
  } else {
    startClock();
  }

  // Expose for potential testing/debugging
  window.__clockPolling = {
    start: startClock,
    stop: stopClock
  };
})();