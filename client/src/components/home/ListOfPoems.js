import React, { Component } from "react";

import { PoemContext } from "./getPoemContext";

import ManyPoem from "../poems/poem/ManyPoem";
import Loader from "../layouts/Loading";

class ListOfPoems extends Component {
  static contextType = PoemContext;
  state = {
    poemIds: [],
    stop: false
  };

  componentDidMount() {
    this.context.fetchPoems(poemIds => {
      this.setState({ poemIds });
    });
  }

  increaseCount = () => {
    this.context.getIds((poemIds, stop) => {
      this.setState({
        poemIds,
        stop
      });
    });
  };

  render() {
    const { poemIds, stop } = this.state;

    if (poemIds.length > 0) {
      return (
        <React.Fragment>
          <div className="container u-lg-space">
            <div className="row">
              <div className="col-lg-1 col-md-1">&nbsp;</div>
              <>
                {stop ? (
                  <ManyPoem poemIds={poemIds} noSeeMore={true} sort={true} />
                ) : (
                  <ManyPoem
                    poemIds={poemIds}
                    seeMore={this.increaseCount}
                    sort={true}
                  />
                )}
              </>
              <div className="col-lg-1 col-md-1">&nbsp;</div>
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

export default ListOfPoems;
