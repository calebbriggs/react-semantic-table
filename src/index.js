import _ from "lodash";
import React, { Component } from "react";
import { Table, Loader, Dimmer } from "semantic-ui-react";
import SemTableHeader from "./views/header";
import SemTableFooter from "./views/footer";
import { handleSort, getData, handleFilter } from "./functions";
const { Row, Cell, Body } = Table;

export default class SemTable extends Component {
  constructor(props) {
    super(props);
    this.state = {
      column: null,
      data: [],
      interalData: [],
      direction: null,
      page: 1,
      loading: false,
      filters: [],
      internalColumns: []
    };
    this.handleSort = handleSort;
    this.getData = getData;
    this.handleFilter = handleFilter;
  }

  componentDidUpdate() {
    var { data, columns } = this.props;
    if (this.state.data.length != data.length) {
      var internalColumns = _.map(columns, c => {
        if (typeof c === typeof "") {
          var c = { Header: c, accessor: c };
        }
        c.accessor = c.accessor || c.Header;
        return c;
      });
      this.setState({ data, interalData: data, internalColumns });
    }
  }

  render() {
    var {
      column,
      data,
      direction,
      interalData,
      page,
      internalColumns
    } = this.state;
    var {
      renderedRows,
      columns,
      loading,
      filterable,
      csvExport,
      aggregateRow
    } = this.props;

    renderedRows = renderedRows || 10;
    var renderedData = interalData.slice(
      (page - 1) * renderedRows,
      renderedRows * page
    );
    return loading ? (
      <Dimmer active>
        <Loader content="Loading" />
      </Dimmer>
    ) : (
      <Table sortable celled striped>
        <SemTableHeader
          internalColumns={internalColumns}
          column={column}
          direction={direction}
          filterable={filterable}
          tableModel={this}
        />

        <Body>
          {_.map(renderedData, (r, i) => (
            <Row key={i + "row"}>
              {_.map(internalColumns, (c, i) => (
                <Cell key={i + "cell"}>
                  {c.Cell
                    ? c.Cell({
                        value: this.getData({ column: c, data: r }),
                        column: c,
                        row: r
                      })
                    : this.getData({ column: c, data: r })}
                </Cell>
              ))}
            </Row>
          ))}
          {aggregateRow ? (
            <Row>
              {_.map(internalColumns, (c, i) => (
                <Cell key={i + "cell-aggregate"}>
                  {" "}
                  {c.type == "number" ? (
                    <div>
                      <span>{c.aggregateLabel ? c.aggregateLabel : ""}</span>{" "}
                      <span>
                        {c.Cell
                          ? c.Cell({
                              value: _.reduce(
                                interalData,
                                (sum, row) =>
                                  sum + +this.getData({ column: c, data: row }),
                                0
                              )
                            })
                          : _.reduce(
                              interalData,
                              (sum, row) =>
                                sum + +this.getData({ column: c, data: row }),
                              0
                            )}
                      </span>
                    </div>
                  ) : null}
                  {}
                </Cell>
              ))}
            </Row>
          ) : null}
        </Body>
        <SemTableFooter
          interalData={interalData}
          columns={columns}
          renderedRows={renderedRows}
          page={page}
          csvExport={csvExport}
          tableModel={this}
        />
      </Table>
    );
  }
}
