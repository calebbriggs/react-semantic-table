import _ from "lodash";
import React, { Component } from "react";
import {
  Table,
  Menu,
  Icon,
  Input,
  Form,
  Loader,
  Dimmer
} from "semantic-ui-react";
import moment from "moment";
import { CSVLink } from "react-csv";
const { Header, HeaderCell, Row, Cell, Body, Footer } = Table;

function contains(string, value) {
  string = string || "";
  value = value || "";
  return string.toLowerCase().indexOf(value.toLowerCase()) != -1;
}

export default class SemTable extends Component {
  state = {
    column: null,
    data: [],
    interalData: [],
    direction: null,
    page: 1,
    loading: false,
    filters: []
  };
  getData({ data, column }) {
    if (typeof column.accessor === typeof "") {
      return data[column.accessor];
    }
    return column.accessor({ data, column });
  }
  handleSort = clickedColumn => {
    const { column, direction, interalData } = this.state;

    if (column !== clickedColumn) {
      console.log(clickedColumn);
      this.setState({
        column: clickedColumn,
        interalData: _.sortBy(interalData, [clickedColumn]),
        direction: "ascending"
      });

      return;
    }

    this.setState({
      data: interalData.reverse(),
      direction: direction === "ascending" ? "descending" : "ascending"
    });
  };
  handleFilter({ column, filter }) {
    var { filters, data } = this.state;
    var hasFilter = _.find(filters, { column });
    if (hasFilter) {
      filters.splice(filters.indexOf(hasFilter));
    }
    if (filter) filters.push({ column, filter });
    var interalData = _.filter(data, d => {
      return _.every(filters, ({ column, filter }) => {
        if (column.type == "date") {
          var date = new Date(this.getData({ column, data: d }));

          var start = moment(filter, "YYYY-MM-DD");
          var end = start
            .clone()
            .endOf("day")
            .toDate();
          start = start.toDate();
          var inRange = date >= start && date <= end;

          return inRange;
        } else {
          return contains(this.getData({ column, data: d }), filter);
        }
      });
    });
    this.setState({ filters, interalData, page: 1 });
  }
  componentDidUpdate() {
    var { data } = this.props;
    if (this.state.data.length != data.length) {
      this.setState({ data, interalData: data });
    }
  }

  render() {
    var { column, data, direction, interalData, page } = this.state;
    var { renderedRows, columns, loading, filterable } = this.props;

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
        <Header>
          <Row>
            {_.map(columns, (c, i) => (
              <HeaderCell
                key={i}
                onClick={e => {
                  if (e.target.tagName !== "INPUT") this.handleSort(c.accessor);
                }}
              >
                <div style={{ paddingBottom: 8 }}>
                  {c.Header}{" "}
                  {column === c.accessor ? (
                    <Icon
                      name={direction == "ascending" ? "sort down" : "sort up"}
                    />
                  ) : null}
                </div>
                {filterable ? (
                  <Form autoComplete="off">
                    <Input
                      placeholder={c.Header}
                      onChange={e => {
                        this.handleFilter({
                          column: c,
                          filter: e.target.value
                        });
                      }}
                      type={c.type || "text"}
                    />
                  </Form>
                ) : null}
              </HeaderCell>
            ))}
          </Row>
        </Header>

        <Body>
          {_.map(renderedData, (r, i) => (
            <Row key={i + "row"}>
              {_.map(columns, (c, i) => (
                <Cell key={i + "cell"}>
                  {c.Cell
                    ? c.Cell({ value: this.getData({ column: c, data: r }) })
                    : this.getData({ column: c, data: r })}
                </Cell>
              ))}
            </Row>
          ))}
        </Body>
        <Footer>
          <Row>
            <HeaderCell colSpan={columns.length}>
              <Menu pagination>
                <Menu.Item
                  as="a"
                  icon
                  title="Previous Page"
                  disabled={page == 1}
                  onClick={() => {
                    this.setState({ page: page - 1 });
                  }}
                >
                  <Icon name="chevron left" />
                </Menu.Item>
                <Menu.Item
                  as="a"
                  icon
                  title="Next Page"
                  disabled={page == interalData.length / renderedRows}
                  onClick={() => {
                    this.setState({ page: page + 1 });
                  }}
                >
                  <Icon name="chevron right" />
                </Menu.Item>
                <Menu.Item as="a" icon title="Excel Download">
                  <CSVLink data={interalData} filename={"data.csv"}>
                    <Icon name="file excel" />
                  </CSVLink>
                </Menu.Item>
              </Menu>
              <b>
                {" "}
                &nbsp;{(page - 1) * renderedRows + 1} - {renderedRows * page} of{" "}
                {interalData.length}
              </b>
            </HeaderCell>
          </Row>
        </Footer>
      </Table>
    );
  }
}
