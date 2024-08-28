const express = require('express');
const router = express.Router();
const Campground = require('../models/campground');
const campgrounds = require('../controllers/campgrounds')
const AsyncErrors = require('../ErrorClass/AsyncErrors');
const {campgroundSchema} = require('../schemas');
const {isloggedin,validateCampground,validateuser} = require('../middleware');

router.get('/', AsyncErrors(campgrounds.index));

router.get('/new',isloggedin,AsyncErrors(campgrounds.renderNewForm));

router.post('/', isloggedin,validateCampground,AsyncErrors(campgrounds.createNewCampground));

router.get('/:id/edit',isloggedin, validateuser, AsyncErrors(campgrounds.renderEditForm));

router.put('/:id',isloggedin,validateCampground,validateuser,AsyncErrors(campgrounds.updateCampground));

router.delete('/:id',isloggedin,validateuser,AsyncErrors(campgrounds.deleteCampground));

router.get('/:id',AsyncErrors(campgrounds.showCampground));

module.exports= router;