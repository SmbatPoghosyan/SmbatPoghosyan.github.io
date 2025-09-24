const express = require('express');
const router = express.Router();

const authorController = require('../controllers/author.controller');
const aboutController = require('../controllers/about.controller');
const contactController = require('../controllers/contact.controller');
const workHistoryController = require('../controllers/work-history.controller');
const educationController = require('../controllers/education.controller');
const skillsController = require('../controllers/skills.controller');
const projectController = require('../controllers/project.controller');

router.get('/author', authorController.getAuthor);
router.get('/about', aboutController.getAboutMe);
router.get('/contact', contactController.getContact);
router.get('/work-history', workHistoryController.getWorkHistory);
router.get('/education', educationController.getEducation);
router.get('/skills', skillsController.getSkills);
router.get('/projects', projectController.getProjects);

module.exports = router;
