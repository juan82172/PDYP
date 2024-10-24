/*fetch('../modelo/datos.json')
  .then(response => response.json())
  .then(data => {
    // Mostrar la imagen corporativa
    document.getElementById('imagenCorporativa').src = '../assets/cocacola-logo.jpg';
    // Mostrar la misión
    document.getElementById('mision').textContent = data.mision;
    // Mostrar la visión
    document.getElementById('vision').textContent = data.vision;
  })
  .catch(error => {
    console.error('Error al leer el archivo JSON:', error);
  });*/


  fetch('/modelo/datos.json')
  .then(response => response.json())
  .then(data => {
    // Mostrar la imagen corporativa
    document.getElementById('imagenCorporativa').src = '../assets/cocacola-logo.jpg';
    // Mostrar la misión
    document.getElementById('mision').textContent = data.mision;
    // Mostrar la visión
    document.getElementById('vision').textContent = data.vision;
  })
  .catch(error => {
    console.error('Error al leer el archivo JSON:', error);
  });
