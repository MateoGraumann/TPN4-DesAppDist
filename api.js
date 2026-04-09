const apiKey = '05f21d56957ddcf557d886e7d6dd3884';
const lat = 33.44;
const lon = -94.04;

const outputEl = document.getElementById('weather-output');

fetch(`http://api.openweathermap.org/data/3.0/onecall?lat=${lat}&lon=${lon}&appid=${apiKey}`)
  .then(async (response) => {
    const data = await response.json();
    if (!response.ok) {
      throw data;
    }
    return data;
  })
  .then((data) => {
    const name = data?.name ?? 'Ubicación desconocida';
    const description = data?.weather?.[0]?.description ?? 'Sin descripción';
    const temp = data?.main?.temp;

    if (outputEl) {
      outputEl.innerHTML = `
        <div><strong>${name}</strong></div>
        <div>${description}</div>
        <div>${typeof temp === 'number' ? `${temp} °C` : ''}</div>
      `;
    }

    console.log(data);
  })
  .catch((error) => {
    console.error(error);
    const message = error?.message || error?.cod ? `${error.cod}: ${error.message}` : 'Error al obtener el clima';

    if (outputEl) {
      outputEl.textContent = message;
    }
  });