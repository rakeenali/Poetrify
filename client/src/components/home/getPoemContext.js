import React from "react";
import axios from "axios";

const poemValue = {
  skip: 0,
  limit: 4,
  poemIds: [],
  totalIds: [],

  fetchPoems: function(cb) {
    axios
      .get(`/api/recomendation`)
      .then(res => {
        this.totalIds = [...res.data.ids];
        this.getIds(cb);
        return;
      })
      .catch(err => {
        throw err;
      });
  },

  getIds: function(cb) {
    if (this.limit >= this.totalIds.length) {
      cb(this.poemIds, true);
      return;
    }
    this.poemIds = [
      ...this.poemIds,
      ...this.totalIds.slice(this.skip, this.limit)
    ];
    this.skip += 4;
    this.limit += 4;
    cb(this.poemIds, false);
    return;
  }
};

export const PoemContext = React.createContext(poemValue);
