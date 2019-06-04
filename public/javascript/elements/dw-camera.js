customElements.define('dw-camera', class DwCamera extends HTMLElement {

  constructor () {
    super();
    this.message = '';
    this.status = 'filming';

  }

  createForm () {
    if (this.form) {
      this.form.remove();
    }
    this.form = document.createElement('dw-form');

    this.form.schema = [
      {
        name: 'message',
        required: true,
        label: 'Bericht',
        placeholder: 'Jouw bericht...',
        rows: 6,
        nodeType: 'textarea',
      },
      {
        name: 'submit',
        nodeType: 'button',
        innerHTML: 'Insturen',
      }
    ];

    this.form.addEventListener('submit', () => {
      this.uploadPhoto();
    });

    this.form.data = this;
    this.appendChild(this.form);
    this.button = this.form.querySelector('button');
  }

  connectedCallback () {
    this.innerHTML = `
      <canvas class="sensor"></canvas>
      <video class="view" autoplay playsinline></video>
      <img src="//:0" alt="" class="output">
      
      <button class="trigger"></button>
      <button class="save"><iframe class="svg" src="/images/send.svg" onload="svger(this)"></iframe></button>        
    `;

    this.createForm();
    this.constraints = { video: true, audio: false };

    this.view = this.querySelector('.view');
    this.output = this.querySelector('.output');
    this.sensor = this.querySelector('.sensor');
    this.trigger = this.querySelector('.trigger');
    this.remove = this.querySelector('.remove');
    this.save = this.querySelector('.save');

    this.trigger.addEventListener('click', () => {
      if (this.status === 'filming') {
        this.takePhoto();
      }
      else if (this.status === 'photo-taken') {
        this.removePhoto();
      }
      else if (this.status === 'pre-save') {
        this.removePhoto();
      }
    });

    this.save.addEventListener('click', () => {
      this.status = 'pre-save';
    });

    this.cameraStart();
  }

  get status () {
    return this._status;
  }

  set status (status) {
    this._status = status;
    this.dataset.status = status;

    if (status === 'uploading') {
      this.button.innerText = 'Even bezig...';
      this.button.classList.add('is-progressing');
      this.button.classList.add('not-clickable');
    }

    if (status === 'uploaded') {
      this.button.innerText = 'Insturen';
      this.button.classList.remove('is-progressing');
      this.button.classList.remove('not-clickable');
      this.message = '';
      this.createForm();
    }
  }

  removePhoto () {
    this.output.src = '';
    this.message = '';
    this.createForm();
    this.status = 'filming';
  }

  takePhoto () {
    this.sensor.width = this.view.videoWidth;
    this.sensor.height = this.view.videoHeight;
    this.sensor.getContext('2d').drawImage(this.view, 0, 0);
    this.output.src = this.sensor.toDataURL('image/webp');
    this.status = 'photo-taken';
  }

  disconnectedCallback () {
    this.track.stop();
  }

  cameraStart() {
    navigator.mediaDevices
      .getUserMedia(this.constraints)
      .then((stream) => {
        this.track = stream.getVideoTracks()[0];
        this.view.srcObject = stream;
      })
      .catch((error) => {
        console.error('Woops', error);
      });
  }

  async uploadPhoto () {
    this.status = 'uploading';

    let imageString = this.output.src;
    let mail = localStorage.getItem('mail');
    let oneTimeLogin = localStorage.getItem('one-time-login');

    try {
      let response = await fetch(`${app.apiUrl}uploadPhoto?mail=${mail}&one-time-login=${oneTimeLogin}`, {
        method: 'POST',
        headers: {
          'Accept': 'application/json',
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ photo: imageString, message: this.message })
      });

      response = await response.json();

      console.log(response)
    }
    catch (error) {
      console.log(error)
    }



    setTimeout(() => {
      this.status = 'uploaded';

      setTimeout(() => {
        this.status = 'filming';
      }, 2000)
    }, 3000);
  }
});