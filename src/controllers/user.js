var User = require('../models/user');

exports.user_create = function(req, res) {
  var user = new User({
    username: req.body.username,
    password: req.body.password,
  });

  user
    .save()
    .then(doc => {
      res.status(201).send(doc.toJSON());
    })
    .catch(err => {
      res.status(500).send({error: err});
    });
};

exports.user_list = function(req, res) {
  User.find({}, function(err, users) {
    var usersList = [];

    users.forEach(function(user) {
      usersList.push(user);
    });

    res.json(usersList);
  });
};

exports.user_details = function(req, res) {
  User.findById(req.params.id, function(err, user) {
    if (err) {
      res.status(404).send({error: err});
      return;
    }
    res.send(user);
  });
};

exports.user_update = function(req, res) {
  User.findOneAndReplace(req.params.id, {$set: req.body}, function(
    err,
    user
  ) {})
    .then(user => {
      if (!user) return res.status(404).send({error: 'not found'});
      return res.send(user);
    })
    .catch(err => {
      return res.status(400).send({error: err});
    });
};

exports.user_delete = function(req, res) {
  User.findOneAndDelete(req.params.id, function(err, car) {
    res.status(204).send();
  });
};
