import React, { Component } from "react";

import { PoemContext } from "./getPoemContext";

import ManyPoem from "../poems/poem/ManyPoem";
import Loader from "../layouts/Loading";

class ListOfPoems extends Component {
  static contextType = PoemContext;
  state = {
    poemIds: []
  };

  componentDidMount() {
    this.context.fetchPoems(() => {
      this.setState({
        poemIds: this.context.poemIds
      });
    });
  }

  increaseCount = () => {
    this.context.fetchPoems(() => {
      this.setState({
        poemIds: this.context.poemIds
      });
    });
  };

  render() {
    const { poemIds } = this.state;

    if (poemIds.length > 0) {
      return (
        <React.Fragment>
          <div className="container">
            <div className="row">
              <div className="col-lg-2 col-md-2" />
              <>
                <ManyPoem poemIds={poemIds} />
                <span onClick={this.increaseCount}>See More</span>
              </>
              <div className="col-lg-2 col-md-2" />
            </div>
          </div>
        </React.Fragment>
      );
    }

    return (
      <React.Fragment>
        <Loader message="loading poems..." />
      </React.Fragment>
    );
  }
}

// ListOfPoems.contextType = PoemContext;

export default ListOfPoems;
