import React, { Component } from 'react';
export default class SemTableHeader extends Component {
  render() {
    var { internalColumns, column, filterable, tableModel, direction } = this.props;
    var { filters } = tableModel.state;
    filters = filters || [];
    return (
      <thead>
        <tr>
          {_.map(internalColumns, (c, i) => {
            var filter = _.find(filters, { column: { Header: c.Header } });
            return (
              <th
                key={i}
                onClick={e => {
                  if (e.target.tagName !== 'INPUT' && !c.blockSort) tableModel.handleSort(c);
                }}
              >
                <div style={{ paddingBottom: 8 }}>
                  {c.Header}{' '}
                  {column && column.accessor === c.accessor ? (
                    <i aria-hidden="true" className={`${direction == 'ascending' ? 'sort down' : 'sort up'} icon`} />
                  ) : null}
                </div>
                {filterable && !c.hidefilter ? (
                  <form autoComplete="off" className="ui form">
                    <div className="ui input">
                      <input
                        placeholder={c.Header}
                        onChange={e => {
                          var val = e.target.value;

                          tableModel.handleFilter({
                            column: c,
                            filter: val,
                          });
                        }}
                        type={c.type || 'text'}
                        defaultValue={filter ? filter.filter : ''}
                      />
                    </div>
                  </form>
                ) : null}
              </th>
            );
          })}
        </tr>
      </thead>
    );
  }
}
