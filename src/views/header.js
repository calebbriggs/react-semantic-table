import React, { Component } from "react";
import { Table, Form, Input, Icon } from "semantic-ui-react";
const { Header, HeaderCell, Row } = Table;
export default class SemTableHeader extends Component {
  render() {
    var {
      internalColumns,
      column,
      filterable,
      tableModel,
      direction
    } = this.props;
    return (
      <Header>
        <Row>
          {_.map(internalColumns, (c, i) => (
            <HeaderCell
              key={i}
              onClick={e => {
                if (e.target.tagName !== "INPUT" && !c.blockSort)
                  tableModel.handleSort(c);
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
              {filterable && !c.hidefilter ? (
                <Form autoComplete="off">
                  <Input
                    placeholder={c.Header}
                    onChange={e => {
                      tableModel.handleFilter({
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
    );
  }
}
