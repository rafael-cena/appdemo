// Client-side polling logic for auto-updating server time
// Fetches /api/time every 1000ms and updates the DOM element #server-time

(function() {
  'use strict';

  const TIME_ELEMENT_ID = 'server-time';
  const API_ENDPOINT = '/api/time';
  const POLL_INTERVAL_MS = 1000;

  let intervalId = null;

  function updateTimeDisplay(timeString) {
    const element = document.getElementById(TIME_ELEMENT_ID);
    if (element) {
      element.textContent = 'Hora Atual do Servidor: ' + timeString;
    }
  }

  async function fetchServerTime() {
    try {
      const response = await fetch(API_ENDPOINT, {
        method: 'GET',
        headers: {
          'Accept': 'application/json'
        }
      });

      if (!response.ok) {
        throw new Error('HTTP error! status: ' + response.status);
      }

      const data = await response.json();

      if (data && data.time) {
        updateTimeDisplay(data.time);
      } else {
        console.error('Invalid response format from /api/time:', data);
      }
    } catch (error) {
      console.error('Erro ao buscar hora do servidor:', error);
      stopPolling();
    }
  }

  function startPolling() {
    // Initial fetch
    fetchServerTime();

    // Set up interval for subsequent fetches
    intervalId = setInterval(fetchServerTime, POLL_INTERVAL_MS);
  }

  function stopPolling() {
    if (intervalId !== null) {
      clearInterval(intervalId);
      intervalId = null;
    }
  }

  // Start polling when DOM is ready
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', startPolling);
  } else {
    startPolling();
  }

  // Expose for potential testing/debugging
  window.__clockPolling = {
    start: startPolling,
    stop: stopPolling
  };
})();