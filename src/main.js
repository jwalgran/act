React = require('react');
window.React = React; // Expose as a global so the dev tools can pick it up

var App = require('./App.jsx');
React.renderComponent(App(), document.getElementsByTagName('body')[0]);
