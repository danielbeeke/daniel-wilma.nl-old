window.addEventListener('scroll', function () {
  let addOrRemove = window.scrollY > 0 ? 'add' : 'remove';
  document.body.classList[addOrRemove]('has-scrolled');
});

let rsvpForm = document.querySelector('.rsvp-form');
rsvpForm.addEventListener('submit', function (event) {
  event.preventDefault();
  let formData = new FormData(rsvpForm);
  let data = {};
  formData.forEach(function(value, key){
    data[key] = value;
  });

  let json = JSON.stringify(data);

  rsvpForm.querySelector('button').classList.add('is-progressing');

  fetch('https://4403980yfa.execute-api.eu-west-1.amazonaws.com/prod/saveForm', {
    method: 'POST',
    body: json
  })
    .then(function (response) { return response.json(); })
    .then(function (response) {
      rsvpForm.querySelector('button').classList.remove('is-progressing');
      rsvpForm.classList.add('done');
    })
    .catch(function (response) {
      rsvpForm.querySelector('button').classList.remove('is-progressing');
    })
});
