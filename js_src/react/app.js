var Parse = require('parse');
var React = require('react');
var ReactDOM = require('react-dom');
var ParseReact = require('parse-react');
var validator = require('validator');
var Auth = require('./auth');
var Authenticated = require('./authenticated');

/*1*/
module.exports = React.createClass({
  mixins: [ParseReact.Mixin],

  observe: function() {
    return {
      user: ParseReact.currentUser
    };
  },

  render: function() {
    if (this.data.user) {
      return <Authenticated />;
    } else {
      return <Auth />;
    }
  },

});
