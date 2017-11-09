var API_URL = 'http://apis.is/car?number=';

// Hlustum eftir því að síðunni hafi verið hlaðið
document.addEventListener('DOMContentLoaded', function () {
  var results = document.querySelector('.results');
  var form = document.querySelector('form');

  // Keyrum init þegar að síðunni hefur verið hlaðið, þar er hlustað eftir "submit"
  program.init(results, form);
});

// Bílaleit. Sækir gögn með Ajax á apis.is.
var program = (function() {
  // skilgreina "private" breytur sem við notum í forriti
  var formid; // Allt formið
  var input; // Glugginn sem tekur við bílnúmeri
  var button; // Takkinn
  var resultsContainer; // Div sem birtir niðurstöðu úr leitinni

  // Fall til að tæma div-ið
  function empty(el) {
    while (el.firstChild) {
      el.removeChild(el.firstChild);
    }
  }

  /* Fallið með aðal virkninni, hefur samband
  ** við apis.is og gefur skipanir til annara falla um að birta
  ** gögnin, tæma input, tæma resultsContainer og svo framvegis */
  function submit(e) {
    // Stoppar síðuna að fara annað eða endurhlaða sér
    e.preventDefault();
    // Tæmir divið sem við ætlum að nota
    empty(resultsContainer);

    // Byrjar á að skoða hvort að við höfum sett eitthvað inn
    if (input.value == '') {
      resultsContainer.appendChild(document.createTextNode('Vantar bílnúmer'));
    } else {
      // Ef við höfum sett eitthvað inn, þá fáum við GIF meðan við bíðum
      var img = document.createElement("IMG"); // Setja GIF í div
      img.src = "loading.gif";
      resultsContainer.appendChild(img);

      // Geymum input ef að við þurfum það í 500 villunni
      var haldaInput = input.value;
      // Bætum bílnúmerinu í URL
      API_URL_NUMBER = API_URL+ input.value;

      var request = new XMLHttpRequest();

      request.open('GET', API_URL_NUMBER, true);
      request.onload = function() {
        if (request.status >= 200 && request.status < 400) {
          // Ef statusinn er eðlilegur, þá pörsum við gögnin til að geta unnið með þau
          var data = JSON.parse(request.response);
          show(data.results[0]);

        } else if (request.status == 500) {
          /* Ef við fáum 500 villuna, þá er bínúmerið ekki skráð,
          ** eða við settum eitthvað inn sem var ekki bílnúmer*/
          empty(resultsContainer);
          // Pörsum til að geta skilað í villunni því sem síðan segir okkur
          var data = JSON.parse(request.response);
          resultsContainer.appendChild(document.createTextNode('Villa kom upp: '+ data.error));
        } else {
          console.error('Villa', request);
          empty(resultsContainer);
          resultsContainer.appendChild(document.createTextNode('Villa kom upp'));
        }
      };

      request.onerror = function() {
        console.error('Óþekkt villa');
        empty(container);
        resultsContainer.appendChild(document.createTextNode('Villa kom upp'));
      };

      // Þessi lína er mjög mikilvæg, það tók mig tvo daga að fatta
      request.send();
    }
    /* Tæmum input gluggan til að notandi geti flett upp nýju númeri,
    ** án þess að stroka út */
    emptyInput();
  }

  // Fall sem tæmir input glugga
  function emptyInput() {
    input.value = '';
  }

  // Fall sem birtir gögnin í resultsContainer
  function show(data) {
    // Tæmum loading.gif úr div
    empty(resultsContainer);
    var eigindi = ['Litur', 'Gerð', 'Næsta skoðun', 'Staða'];
    var parsadData = [data.color, data.type, data.nextCheck, data.status];
    for (i=0; i<4; i++) {
      // Búum til dl, dt og dd element til að birta
      var dlElement = document.createElement('dl');
      var dtElement = document.createElement('dt');
      var ddElement = document.createElement('dd');

      // Setjum réttan texta í hvert eigindi
      dtElement.textContent = eigindi[i];
      ddElement.textContent = parsadData[i];

      // Segjum HTML hvar þessi element eiga að vera
      dlElement.appendChild(dtElement);
      dlElement.appendChild(ddElement);
      resultsContainer.appendChild(dlElement);
    }
  }

  //
  function init(results, form) {
    formid = form;
    input = form.querySelector('input');
    button = form.querySelector('button');
    resultsContainer = results;
    form.addEventListener('submit', submit);
  }

  return {
    init: init
  }
})();
