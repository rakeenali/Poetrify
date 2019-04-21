const _ = require("lodash");
const TfIdf = require("node-tfidf");

const Poem = require("../models/Poem");
const User = require("../models/User");

// if dont have previous record of liking any poem or if not following anyone even if one of the above condition met then we cant recomend movies

module.exports = class Recomendation {
  constructor() {
    this.recomendedPoems = [];
    this.previouslyLikedPoems = [];
    this.knownUserIds = [];
    this.metaPoemsContent = []; // poems written by people related to me
    this.tfIdf = new TfIdf();
    this.canRecomend = true;
    this.done = false;
  }

  getMetaPoem(poemList) {
    if (_.isEmpty(poemList) || !this.canRecomend) {
      this.canRecomend = false;
      return;
    }
    Poem.find({
      _id: { $in: _.uniq(poemList) }
    })
      .lean()
      .exec()
      .then(poems => {
        poems.map(({ description, _id }) => {
          this.previouslyLikedPoems.push({ description, _id });
        });
      });
  }

  getKnownUser(ids) {
    if (_.isEmpty(ids) || !this.canRecomend) {
      this.canRecomend = false;
      return;
    }
    this.knownUserIds = _.uniq(ids);
  }

  getRecomendationData() {
    if (!this.canRecomend) {
      this.done = true;
      return;
    }
    User.find({
      _id: { $in: this.knownUserIds }
    })
      .populate("poems", "description")
      .lean()
      .exec()
      .then(users => {
        users.map(user => {
          if (_.isEmpty(user.poems)) {
            return;
          } else if (user.poems.length < 50) {
            user.poems.reverse().map(({ description, _id }) => {
              this.metaPoemsContent.push({ description, _id });
            });
          } else {
            user.poems
              .reverse()
              .slice(0, 50)
              .map(({ description, _id }) => {
                this.metaPoemsContent.push({ description, _id });
              });
          }
          return;
        });
        return this.calculateTfIdf();
      });
  }

  calculateTfIdf() {
    this.metaPoemsContent.map(({ description }) => {
      this.tfIdf.addDocument(description);
    });
    return this.generateRecomender();
  }

  generateRecomender() {
    const perPoemCount = Math.floor(
      this.metaPoemsContent.length / this.previouslyLikedPoems.length
    );

    this.previouslyLikedPoems.forEach(({ description }) => {
      let currentPoems = [];
      this.tfIdf.tfidfs(description, (i, measure) => {
        currentPoems.push({
          _id: this.metaPoemsContent[i]._id,
          measure: measure
        });
      });
      currentPoems.sort((a, b) => {
        return a.measure < b.measure ? 1 : -1;
      });
      this.recomendedPoems = [
        ...this.recomendedPoems,
        ...currentPoems.slice(0, perPoemCount).map(({ _id }) => _id)
      ];
    });
    this.done = true;
  }

  getPoems() {
    return new Promise((resolve, reject) => {
      let interval = setInterval(() => {
        if (this.done) {
          clearInterval(interval);
          let data = {};
          if (_.isEmpty(this.recomendedPoems)) {
            data = {
              canRecomend: false
            };
          } else {
            data = {
              canRecomend: true,
              ids: _.uniq(this.recomendedPoems)
            };
          }
          return resolve(data);
        }
      }, 100);
    });
  }
};
