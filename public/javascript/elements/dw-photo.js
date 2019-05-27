customElements.define('dw-photo', class DwPhoto extends HTMLElement {

  connectedCallback () {
    this.innerHTML = `
      <div class="camera">
        <canvas class="sensor"></canvas>
        <video class="view" autoplay playsinline></video>
        <img src="//:0" alt="" class="output">
        
        <footer class="actions">
          <button class="trigger">Maak foto</button>
          <button class="remove">Verwijderen</button>        
        </footer>
      </div>
    `;

    this.constraints = { video: true, audio: false };
    this.view = this.querySelector('.view');
    this.output = this.querySelector('.output');
    this.sensor = this.querySelector('.sensor');
    this.trigger = this.querySelector('.trigger');
    this.remove = this.querySelector('.remove');

    this.trigger.addEventListener('click', () => {
      this.takePhoto();
    });

    this.remove.addEventListener('click', () => {
      this.classList.remove('photo-taken');
      this.removePhoto();
    });

    this.cameraStart();
  }

  removePhoto () {
    this.output.src = '';
  }

  takePhoto () {
    this.sensor.width = this.view.videoWidth;
    this.sensor.height = this.view.videoHeight;
    this.sensor.getContext('2d').drawImage(this.view, 0, 0);
    this.output.src = this.sensor.toDataURL('image/webp');
    this.classList.add('photo-taken');
  }

  cameraStart() {
    navigator.mediaDevices
      .getUserMedia(this.constraints)
      .then((stream) => {
        this.track = stream.getTracks()[0];
        this.view.srcObject = stream;
      })
      .catch((error) => {
        console.error('Woops', error);
      });
  }
});