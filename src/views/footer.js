import React, { Component } from "react";
import { Table, Menu, Icon } from "semantic-ui-react";
const { HeaderCell, Footer, Row } = Table;
import { CSVLink } from "react-csv";
export default class SemTableFooter extends Component {
  render() {
    var {
      columns,
      page,
      interalData,
      renderedRows,
      csvExport,
      tableModel
    } = this.props;
    return (
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
                  tableModel.setState({ page: page - 1 });
                }}
              >
                <Icon name="chevron left" />
              </Menu.Item>
              <Menu.Item
                as="a"
                icon
                title="Next Page"
                disabled={page >= interalData.length / renderedRows}
                onClick={() => {
                  tableModel.setState({ page: page + 1 });
                }}
              >
                <Icon name="chevron right" />
              </Menu.Item>
              {csvExport ? (
                <Menu.Item icon title="Excel Download">
                  <CSVLink data={interalData} filename={"data.csv"}>
                    <Icon name="file excel" />
                  </CSVLink>
                </Menu.Item>
              ) : null}
            </Menu>
            <b>
              {" "}
              &nbsp;{(page - 1) * renderedRows + 1} -{" "}
              {renderedRows * page > interalData.length
                ? interalData.length
                : renderedRows * page}{" "}
              of {interalData.length}
            </b>
          </HeaderCell>
        </Row>
      </Footer>
    );
  }
}
