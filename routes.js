'use strict';
// == Requirements ================================================================= //
	var	express	= require('express'),
		Router	= express.Router();
// ================================================================= Requirements == //

// == Routes ================================================================= //
	Router
		.get('/char', function(req, res){res.status(200).json({'bla': 'bleh', 'bli': 'blo'})})
		.get('/nodes', function(req, res){res.status(200).json({'node1': true, 'node2': false})})
		  //.post('/', function(req, res){res.status(200).json(req.user)});
// ================================================================= Routes == //

module.exports = Router;