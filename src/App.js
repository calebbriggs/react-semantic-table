import React, { Component } from "react";

import "./App.css";

import SemTable from "./SemanticTable";
import data from "./data";
import moment from "moment";
const timeout = ms => new Promise(res => setTimeout(res, ms));
class App extends Component {
  state = {
    data: [{ id: "" }],
    loading: true
  };
  componentDidMount() {
    this.resolveData();
  }
  async resolveData() {
    await timeout(500);
    this.setState({ data: data, loading: false });
  }
  render() {
    var { data, loading } = this.state;

    return (
      <div className="App">
        <header className="App-header">
          <h1 className="App-title">Fake Data Test</h1>
        </header>
        <SemTable
          filterable={true}
          data={data}
          loading={loading}
          renderedRows={10}
          columns={[
            { Header: "name", accessor: "name", minWidth: 150 },
            { Header: "email", accessor: "email", minWidth: 150 },
            {
              Header: "date",
              accessor: ({ data }) => data.date,
              type: "date",
              Cell: row => (
                <span>
                  {row.value ? moment(row.value).format("MM/DD/YYYY") : ""}
                </span>
              )
            },
            { Header: "street", accessor: "street" },
            { Header: "city", accessor: "city" },
            { Header: "state", accessor: "state" },
            { Header: "zip", accessor: "zip" }
          ]}
        />
      </div>
    );
  }
}

export default App;
