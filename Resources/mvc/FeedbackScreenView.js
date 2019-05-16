// Feedback screen view
// Throw it on top of MapView
exports.createfeedbackScreenView = function (win) {
  var textAlign = Ti.UI.TEXT_ALIGNMENT_CENTER;
  var clientHeight = Ti.Platform.displayCaps.platformHeight;
  var clientWidth = Ti.Platform.displayCaps.platformWidth;
  if (Ti.UI.Android) {
    clientHeight = Ti.Platform.displayCaps.platformHeight / (Ti.Platform.displayCaps.dpi / 160);
  }

  var infoButton = Ti.UI.createButton({
    title: 'Comments'
  });
  infoButton.addEventListener('click', function () {
    Ti.App.fireEvent('ShowFeedbackScreen');
  });

  var feedbackScreenView = Ti.UI.createView({
    top: 0,
    bottom: 0,
    left: 0,
    right: 0,
    backgroundColor: '#a051be',
    zIndex: 1,
    layout: 'vertical',
    visible: false
  });
  win.rightNavButton = infoButton;

  var caryConnectsLogo = Ti.UI.createImageView({
    image: '/assets/icons/DefaultIcon_white_inside.png',
    width: 340 + 'dp',
    height: 190 + 'dp'
  });

  feedbackScreenView.add(caryConnectsLogo);


  var feedbackScreenTextbox = Ti.UI.createTextArea({
    width: '80%',
    top: '5%',
    height: 'auto',
    color: '#000000',
    hintTextColor: '#666666',
    backgroundColor: '#ffffff',
    hintText: 'Your comments',
    verticalAlign: 1

  });
  feedbackScreenView.add(feedbackScreenTextbox);


  var continueButton = Ti.UI.createButton({
    textAlign: textAlign,
    top: "5%",
    height: '35dp',
    width: '200dp',
    title: 'Send Feedback / Close',
    fontWeight: 'bold',
    borderRadius: '10dp',
    borderColor: '#ffffff',
    color: '#ffffff',
    backgroundColor: '#a051be'

  });
  feedbackScreenView.add(continueButton);

  continueButton.addEventListener('touchstart', function () {
    continueButton.backgroundColor = '#ffffff';
    continueButton.color = '#a051be';
  });
  continueButton.addEventListener('endstart', function () {
    continueButton.backgroundColor = '#a051be';
    continueButton.color = '#ffffff';
  });

  var feedbackScreenLabel = Ti.UI.createLabel({
    top: '5%',
    width: '80%',
    height: 'auto',
    color: '#ffffff',
    font: {},
    textAlign: 'center',
    text: 'Thank you for your comments on the app.',
    verticalAlign: 1
  });

  feedbackScreenView.add(feedbackScreenLabel);

  continueButton.addEventListener('click', function () {
    Ti.App.fireEvent('CloseFeedbackScreen');

  });

  Ti.App.addEventListener('CloseFeedbackScreen', function () {
    if (Ti.UI.Android) {
      Ti.UI.Android.hideSoftKeyboard();
    }
    if (feedbackScreenTextbox.hasText()) {
      var url = "http://cary-dtcparking.herokuapp.com/api/send/";
      var client = Ti.Network.createHTTPClient({
        // function called when the response data is available
        onload: function (e) {
          Ti.API.info("Received text: " + this.responseText);
          alert('Your feedback was submitted');
        },
        // function called when an error occurs, including a timeout
        onerror: function (e) {
          Ti.API.debug(e.error);
          alert('error' + e.error);
        },
        timeout: 5000  // in milliseconds
      });
      // Prepare the connection.
      client.open("POST", url);
      // Send the request.
      client.send("message=" + feedbackScreenTextbox.value);
    }
    feedbackScreenView.animate({
      opacity: 0,
      duration: 200
    }, function () {
      feedbackScreenView.visible = false;
      win.rightNavButton = infoButton;
    });
    Ti.App.Properties.setBool('feedback.shown', true);
  });

  Ti.App.addEventListener('ShowFeedbackScreen', function () {
    win.rightNavButton = null;
    feedbackScreenView.visible = true;
    feedbackScreenTextbox.value = "";
    feedbackScreenView.animate({
      opacity: 1,
      duration: 200
    });
  });
  win.add(feedbackScreenView);
  return feedbackScreenView;
};
