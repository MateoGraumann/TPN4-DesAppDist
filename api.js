const apiKey = '05f21d56957ddcf557d886e7d6dd3884'; // API key de OpenWeatherMap

const outputEl = document.getElementById('weather-output'); // Elemento HTML donde se mostrará el clima

function formatLocalTime(unixUtc, offsetSec) { // Función para formatear la hora local
  if (typeof unixUtc !== 'number' || typeof offsetSec !== 'number') return '—'; // Si los parámetros no son números, retorna '—'
  return new Date((unixUtc + offsetSec) * 1000).toLocaleTimeString('es', { // Convierte la fecha a la hora local
    hour: '2-digit',
    minute: '2-digit',
    timeZone: 'UTC',
  });
}

function windDirection(deg) { // Función para formatear la dirección del viento
  if (typeof deg !== 'number') return '';
  const dirs = ['N', 'NE', 'E', 'SE', 'S', 'SO', 'O', 'NO']; // Array de direcciones del viento
  return dirs[Math.round(deg / 45) % 8]; // Dividir el grado de la dirección del viento por 45 y obtener el resto de la división
}

function renderDashboard(data) { // Función para renderizar el dashboard
  const w = data?.weather?.[0]; // Clima
  const m = data?.main; // Datos principales
  const sys = data?.sys; // Datos del sistema
  const wind = data?.wind; // Velocidad del viento
  const icon = w?.icon ? `https://openweathermap.org/img/wn/${w.icon}@2x.png` : ''; // Icono del clima
  const tz = typeof data?.timezone === 'number' ? data.timezone : 0; // Zona horaria
  const visKm = typeof data?.visibility === 'number' ? (data.visibility / 1000).toFixed(1) : null; // Visibilidad en kilómetros
  const temp = typeof m?.temp === 'number' ? `${Math.round(m.temp * 10) / 10} °C` : '—'; // Temperatura en grados Celsius
  const feels = typeof m?.feels_like === 'number' ? `${Math.round(m.feels_like * 10) / 10} °C` : '—'; // Sensación térmica en grados Celsius
  const tMin = typeof m?.temp_min === 'number' ? `${Math.round(m.temp_min * 10) / 10} °C` : '—'; // Temperatura mínima en grados Celsius
  const tMax = typeof m?.temp_max === 'number' ? `${Math.round(m.temp_max * 10) / 10} °C` : '—'; // Temperatura máxima en grados Celsius
  const windDeg = typeof wind?.deg === 'number' ? `${windDirection(wind.deg)} (${wind.deg}°)` : '—'; // Dirección del viento
  return `
    <div class="dashboard__hero">
      <div class="dashboard__hero-main">
        ${
          icon ? `<img class="dashboard__icon" src="${icon}" alt="Icono del clima" width="72" height="72">` : ''
        }

        <div>
          <p class="dashboard__city">${data?.name ?? 'Ubicación desconocida'}</p>
          <p class="dashboard__country">${sys?.country ? `País: ${sys.country}` : ''}</p>
          <p class="dashboard__desc">${w?.description ?? 'Sin descripción'}</p>
        </div>

      </div>

      <div class="dashboard__temp-block">
        <p class="dashboard__temp">${temp}</p>
        <p class="dashboard__feels">Sensación térmica: ${feels}</p>
      </div>

    </div>
    <div class="dashboard__grid">
      <div class="dashboard__tile">
        <p class="dashboard__tile-label">Mín / Máx</p>
        <p class="dashboard__tile-value">${tMin} / ${tMax}</p>
      </div>

      <div class="dashboard__tile">
        <p class="dashboard__tile-label">Humedad</p>
        <p class="dashboard__tile-value">${m?.humidity != null ? `${m.humidity} %` : '—'}</p>
      </div>

      <div class="dashboard__tile">
        <p class="dashboard__tile-label">Presión</p>
        <p class="dashboard__tile-value">${m?.pressure != null ? `${m.pressure} hPa` : '—'}</p>
        ${
          m?.sea_level != null ? `<p class="dashboard__tile-sub">Nivel mar: ${m.sea_level} hPa</p>` : ''
        }
      </div>

      <div class="dashboard__tile">
        <p class="dashboard__tile-label">Viento</p>
        <p class="dashboard__tile-value">${wind?.speed != null ? `${wind.speed} m/s` : '—'}</p>
        ${
          wind?.gust != null ? `<p class="dashboard__tile-sub">Ráfagas: ${wind.gust} m/s</p>` : ''
        }
        <p class="dashboard__tile-sub">Dirección: ${windDeg}</p>
      </div>

      <div class="dashboard__tile">
        <p class="dashboard__tile-label">Nubosidad</p>
        <p class="dashboard__tile-value">${data?.clouds?.all != null ? `${data.clouds.all} %` : '—'}</p>
      </div>

      <div class="dashboard__tile">
        <p class="dashboard__tile-label">Visibilidad</p>
        <p class="dashboard__tile-value">${visKm != null ? `${visKm} km` : '—'}</p>
      </div>

      <div class="dashboard__tile">
        <p class="dashboard__tile-label">Amanecer</p>
        <p class="dashboard__tile-value">${formatLocalTime(sys?.sunrise, tz)}</p>
      </div>

      <div class="dashboard__tile">
        <p class="dashboard__tile-label">Atardecer</p>
        <p class="dashboard__tile-value">${formatLocalTime(sys?.sunset, tz)}</p>
      </div>
    </div>
  `;
}

fetch(`https://api.openweathermap.org/data/2.5/weather?q=concepcion del uruguay,3260&appid=${apiKey}&units=metric&lang=es`)
.then(async (response) => {

  const data = await response.json();

  if (!response.ok) {throw new Error(data.message);}

  return data;
})
.then((data) => {
  if (outputEl) {
    outputEl.innerHTML = renderDashboard(data);
  }
})
.catch((error) => {
  const message = error?.message || 'Error al obtener el clima';
  if (outputEl) {outputEl.innerHTML = `<p class="dashboard__error" role="alert">${message}</p>`;}
});


