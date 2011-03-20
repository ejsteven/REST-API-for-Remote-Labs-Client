// ==========================================================================
// Project:   App.profileController
// Copyright: ©2010 My Company, Inc.
// ==========================================================================
/*globals App */

/** @class

  (Document Your Controller Here)

  @extends SC.ArrayController
*/
App.profileController = SC.ArrayController.create(
/** @scope App.profileController.prototype */ {

  firstName: '',
  lastName: '',
  uni: '',
  course: '',
  type: '',
  profileTitle: '',
  profileUpdated: false,

  nowShowing: 'userProfileContainer',

  // Function will show the profile container instead of the login container
  // and obtain profile information from the server
  showUserProfileContainer: function() {
    var userCredential=SC.Cookie.find('userCredential');
    var user = userCredential.value;
    var profileTitle = user + "'s Profile";
    var authCookie = SC.Cookie.find('SESS');
    SC.Request.getUrl('/rest/userinfo/' + user)
      .header({
        'Cookie': authCookie.name
      })
      .set('isJSON',YES)
      .notify(this, this.readProfile)
      .send();
    this.set('profileTitle', profileTitle);
  },

  // Function to read the profile data obtained and set the appropriate
  // fields within the profile view
  readProfile: function(response) {
    if (SC.ok(response)) {
      var data = response.get('body');
      var profileRequest = App.store.find(App.Profile);

      App.store.loadRecords(App.Profile, data.isEnumerable ? data : [data]);
      this.set('firstName',profileRequest.getEach('first'));
      this.set('lastName',profileRequest.getEach('last'));
      this.set('uni',profileRequest.getEach('uni'));
      this.set('course', profileRequest.getEach('course'));

      if (this.get('profileUpdated') === true) {
        alert("Your information have been updated..");
        this.set('profileUpdated', false);
      }
    }
  },

  // Function to send a PUT request to the server with updated profile
  updateProfile: function() {
    var fName = this.get('firstName');
    var lName = this.get('lastName');
    var uni = this.get('uni');
    var course = this.get('course');

    var sendMessage= [{
      "first": fName,
      "last" : lName,
      "uni": uni,
      "course": course
    }];

    var userCredential=SC.Cookie.find('userCredential');
    var user = userCredential.value;
    var authCookie = SC.Cookie.find('SESS');

    SC.Request.putUrl('/rest/userinfo/' + user)
      .header({
        'Accept': 'application/json',
        'Cookie': authCookie.name
      })
      .json()
      .notify(this, this.readProfile)
      .send(sendMessage);

    this.set('profileUpdated', true);
  }
});