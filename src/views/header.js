import React, { Component } from "react";
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
      <thead>
        <tr>
          {_.map(internalColumns, (c, i) => (
            <th
              key={i}
              onClick={e => {
                if (e.target.tagName !== "INPUT" && !c.blockSort)
                  tableModel.handleSort(c);
              }}
            >
              <div style={{ paddingBottom: 8 }}>
                {c.Header}{" "}
                {column && column.accessor === c.accessor ? (
                  <i
                    aria-hidden="true"
                    class={`${
                      direction == "ascending" ? "sort down" : "sort up"
                    } icon`}
                  />
                ) : null}
              </div>
              {filterable && !c.hidefilter ? (
                <form autoComplete="off" class="ui from">
                  <div class="ui input">
                    <input
                      placeholder={c.Header}
                      onChange={e => {
                        tableModel.handleFilter({
                          column: c,
                          filter: e.target.value
                        });
                      }}
                      type={c.type || "text"}
                    />
                  </div>
                </form>
              ) : null}
            </th>
          ))}
        </tr>
      </thead>
    );
  }
}
