var API_URL = 'http://apis.is/car?number=';
var container;

document.addEventListener('DOMContentLoaded', function () {
  container = document.querySelector('div');

  var button = document.querySelector('button');
  program.init();

});

/**
 * Bílaleit. Sækir gögn með Ajax á apis.is.
 */
var program = (function() {

  function submit(e) {
    e.preventDefault();// Stoppar síðuna að reloada

    var valid = validNumer(container.value); //Tékkum hvort að númerið sé bílnúmer

    if (valid == true) {
      var Data = fetchData(container.value); // Sækir gögnin
      show(Data); // Birtir gögnin á síðu
    } else {
      setError("Ekki gilt íslenskt bílnúmer");
    }
  }

  function validNumer(Numer) {
    return true;
  }

  function empty(el) {
    while (el.firstChild) {
      el.removeChild(el.firstChild);
    }
  }

  function fetchData(Numer) {
    empty(container); // Tæma div

    var img = document.createElement("IMG"); // Setja GIF í div
    img.src = "infinity.gif";
    container.appendChild(img);

    var request = new XMLHttpRequest();

    Numer = API_URL+Numer; // Set bílnúmerið inn í leitarslóðina
    request.open('GET', Numer, true);
    request.onload = function() {
      if (request.status >= 200 && request.status < 400) {
        var data = JSON.parse(request.response);

        show(data.results[0]);
      } else {
        console.error('Villa', request);
        empty(container);
        container.appendChild(document.createTextNode('Villa kom upp'));
      }
    };

    request.onerror = function() {
      console.error('Óþekkt villa');
      empty(container);
      container.appendChild(document.createTextNode('Villa kom upp'));
    }
  }

  function show(Data) {
    empty(container);

    container.appendChild(document.createTextNode('Litur ' + data.color));
    container.appendChild(document.createTextNode('Gerð ' + data.type));
    container.appendChild(document.createTextNode('Næsta skoðun ' + data.nextCheck));
    container.appendChild(document.createTextNode('Staða ' + data.status));
  }

  function setError(texti) {
    return true;
  }

  function init() {
    button.addEventListener('click', function(e){
      submit(e);
    });
  }

  return {
    init: init
  }
})();
