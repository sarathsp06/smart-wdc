import { KNNImageClassifier } from 'deeplearn-knn-image-classifier';
import * as dl from 'deeplearn';

const items = [
  { name: "watch" },
  { name: "mouse" },
  { name: "bottle" },
  { name: "phone" },
  { name: "dominos" },
  { name: "nothing" },
]

// Webcam Image size. Must be 227. 
const IMAGE_SIZE = 227;
// K value for KNN
const TOPK = 10;

const threshold = 0.60;

class Main {
  constructor() {
    this.prediction = items.length - 1;
    this.view = "train"
    this.objects = 0;
    // Initiate variables
    this.infoTexts = [];
    this.training = -1; // -1 when no class is being trained
    this.videoPlaying = false;

    // Initiate deeplearn.js math and knn classifier objects
    this.knn = new KNNImageClassifier(items.length, TOPK);

    // Create video element that will contain the webcam image
    this.video = document.createElement('video');
    this.video.setAttribute('autoplay', '');
    this.video.setAttribute('playsinline', '');

    // Add video element to DOM
    document.getElementById('video-container').appendChild(this.video);
    console.log(document.getElementById('video-container'));
    // Create training buttons and info texts    
    for (let i = 0; i < items.length; i++) {
      const div = document.createElement('div');
      div.id = "item-" + i
      document.getElementById("training-container").appendChild(div);

      // Create training button
      const button = document.createElement('button')
      button.innerText = items[i].name;
      div.appendChild(button);

      // Listen for mouse events when clicking the button
      button.addEventListener('mousedown', () => this.training = i);
      button.addEventListener('mouseup', () => this.training = -1);

      // Create info text
      const infoText = document.createElement('span')
      infoText.innerText = " Noexamples added";
      div.appendChild(infoText);
      this.infoTexts.push(infoText);
    }

    // Setup webcam
    navigator.mediaDevices.getUserMedia({ video: true, audio: false })
      .then((stream) => {
        this.video.srcObject = stream;
        this.video.width = IMAGE_SIZE;
        this.video.height = IMAGE_SIZE;

        this.video.addEventListener('playing', () => this.videoPlaying = true);
        this.video.addEventListener('paused', () => this.videoPlaying = false);
      })
    this.setupToggleView();
    // Load knn model
    this.knn.load()
      .then(() => this.start());
  }

  setupToggleView() {
    document.getElementById('view-toggle').addEventListener("click", () => this.toggleView())
    this.toggleView()
  }

  toggleView() {
    this.view = this.view != "train" ? "train" : "result";
    document.getElementById('view-toggle').innerText = this.view + "- toggle";
    for (var i = 0; i < this.infoTexts.length; i++) {
      this.infoTexts[i].innerText = ""
    }

    console.log(this.view);
  }

  start() {
    console.log("start")
    if (this.timer) {
      this.stop();
    }
    this.video.play();
    this.timer = requestAnimationFrame(this.animate.bind(this));
  }

  stop() {
    console.log("start")
    this.video.pause();
    cancelAnimationFrame(this.timer);
  }

  animate() {
    if (this.videoPlaying) {
      // Get image data from video element
      const image = dl.fromPixels(this.video);
      const exampleCount = this.knn.getClassExampleCount();

      // Train class if one of the buttons is held down
      if (this.training != -1) {
        // Add current image to classifier
        this.knn.addImage(image, this.training)
        this.infoTexts[this.training].innerText = exampleCount[this.training]
      }

      if (this.view != "train") {
        // If any examples have been added, run predict
        if (Math.max(...exampleCount) > 0) {
          this.knn.predictClass(image)
            .then((res) => {
              for (let i = 0; i < items.length; i++) {
                // Make the predicted class bold
                if (res.classIndex == i) {
                  this.infoTexts[i].style.fontWeight = 'bold';
                } else {
                  this.infoTexts[i].style.fontWeight = 'normal';
                }
                // Update info text
                if (exampleCount[i] > 0 && res.confidences[i] > 0.5 && this.prediction != i) {
                  console.log(res, this.prediction);

                  this.infoTexts[i].innerText = `${res.confidences[i] * 100}%`
                  this.objects = this.objects + 1;

                  document.getElementById("item-" + i).style.backgroundColor = "cyan";
                  document.getElementById("item-" + this.prediction).style.backgroundColor = "transparent";
                  this.prediction = i;
                }
              }
            })
            // Dispose image when done
            .then(() => image.dispose())
        } else {
          image.dispose()
        }
      }
    }
    this.timer = requestAnimationFrame(this.animate.bind(this));
  }
}

window.addEventListener('load', () => new Main());
