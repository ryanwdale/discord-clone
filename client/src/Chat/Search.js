import { Component } from "react";
import "./search.css";

class Search extends Component {
  render() {
    return (
        <div className="searchInput">
            <form onSubmit={(e) => this.props.handleSubmitSearchMessage(e)} >
                <input
                    placeholder={"Search for..."}
                    onChange={(event) => this.props.handleSearchChange(event.target.value)}
                    value={this.props.activeSearchMessage}
                />
                <button type="submit" className="searchInputSubmit">
                    search
                </button>
            </form>
        </div>
    );
  }
}
export default Search;
