import React, { Component } from "react";
import { connect } from "react-redux";

import getImage from "../../utils/getImage";
import { getSearch } from "../../actions/search";

import "./SearchWindow.css";

const styles = {
  position: "fixed",
  width: "35vw",
  height: "57vh",
  borderRadius: "5px",
  zIndex: "10000",
  transition: `all .3s`,
  backgroundColor: "#fff",
  boxShadow: `0px 4px 14px 1px rgba(0,0,0,0.75)`
};

class SearchWindow extends Component {
  state = {
    dimensions: styles,
    initialSearch: [],
    selectedResult: []
  };

  componentDidMount() {
    this.props.getSearch();

    const dims = document.getElementById("search-input").getClientRects();
    const { top } = dims[0];
    let negTop = top - 5;
    this.setState({
      dimensions: {
        ...this.state.dimensions,
        left: `18%`,
        top: `${top}%`,
        transform: `translateY(-${negTop}%)`
      }
    });
  }

  componentWillReceiveProps(nextProps) {
    if (this.state.initialSearch.length <= 0) {
      this.setState({ initialSearch: nextProps.search });
    }

    if (nextProps.searchTerm !== "") {
      const results = this.state.initialSearch.filter(data => {
        return data.name
          .toLowerCase()
          .includes(nextProps.searchTerm.toLowerCase());
      });
      this.setState({ selectedResult: results });
    } else {
      this.setState({ selectedResult: [] });
    }
  }

  // FUNCTIONS
  showSearch = () => {
    if (this.state.selectedResult.length > 0) {
      return this.state.selectedResult.slice(0, 5).map((data, i) => {
        return (
          <a href={data.link} key={i}>
            <li className="list-group-item list-search">
              <div className="search-img">
                {data.image && (
                  <img src={getImage(data.image)} alt="Search result" />
                )}{" "}
                <h6>{data.name}</h6>
              </div>
              <span className="badge badge-primary">{data.is}</span>
            </li>
          </a>
        );
      });
    }
    if (this.state.initialSearch.length > 0) {
      return this.state.initialSearch.slice(0, 5).map((data, i) => {
        return (
          <a href={data.link} key={i}>
            <li className="list-group-item list-search">
              <div className="search-img">
                {data.image && (
                  <img src={getImage(data.image)} alt="Search result" />
                )}{" "}
                <h6>{data.name}</h6>
              </div>
              <span className="badge badge-primary">{data.is}</span>
            </li>
          </a>
        );
      });
    } else {
      return (
        <li className="list-group-item list-search">
          <h6>No current result</h6>
        </li>
      );
    }
  };

  render() {
    const { dimensions } = this.state;
    return (
      <div style={dimensions}>
        <div>
          <h4 className="px-2 pt-2">Recent Searches</h4>
        </div>
        <div>
          <ul className="list-group">{this.showSearch()}</ul>
        </div>
      </div>
    );
  }
}

const mapStateToProps = state => ({
  search: state.SEARCH.search
});

export default connect(
  mapStateToProps,
  { getSearch }
)(SearchWindow);
