var React = require('react');
var Navigation = require('navigation');
var Listing = require('./Listing');
var Details = require('./Details');
var StateInfoConfig = require('./StateInfoConfig');

StateInfoConfig.register();
var states = Navigation.StateInfoConfig.dialogs.masterDetails.states;
