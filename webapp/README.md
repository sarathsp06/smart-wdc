## Use code
To use the code, first install the JavaScript dependencies by running  

```
npm install
```

Then start the local budo web server by running 

```
npm start
```

This will start a web server on [`localhost:9966`](http://localhost:9966). Try and allow permission to your webcam, and add some examples by holding down the buttons. 

## Quick Reference
A quick overview of the most important function calls in the deeplearn.js [KNN Image Classifier](https://github.com/PAIR-code/deeplearnjs/tree/master/models/knn_image_classifier)

- `KNNImageClassifier(numClasses, k)`: The constructor takes an argument of how many classes you want to train and recoginize, and a `k` value that is the number of neighbors looked at when doing the classification. A value of `10` can be a good starting point.

- `.load()`: Downloads the SqueezeNet model from the internet, and setups the model.

- `.addImage(image, classIndex)`: Adds an image to the specific class training set

- `.clearClass(classIndex)`: Clears a specific class for training data

- `.predictClass(image)`: Runs the prediction on the image, and returns (as a Promise) the class index and confidence score. 
