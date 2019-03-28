import React from "react";
import axios from "axios";

const poemValue = {
  skip: 0,
  limit: 4,
  poemIds: [],

  fetchPoems: function(cb) {
    axios
      .get(`api/poem/ids?skip=${this.skip}&&limit=${this.limit}`)
      .then(res => {
        this.poemIds = [...this.poemIds, ...res.data.poemIds];
        this.skip += 4;
        cb();
      })
      .catch(err => {
        throw err;
      });
  }
};

export const PoemContext = React.createContext(poemValue);
