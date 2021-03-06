import _ from 'lodash';
import React, { Component } from 'react';
import SemTableHeader from './views/header';
import SemTableFooter from './views/footer';
import { handleSort, getData, handleFilter, filterUpdated } from './functions';

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
      internalColumns: [],
    };
    this.handleSort = handleSort;
    this.getData = getData;
    this.handleFilter = handleFilter;
    this.filterUpdated = filterUpdated;
  }
  updateData() {
    var { data, columns } = this.props;
    var internalColumns = _.map(columns, c => {
      if (typeof c === typeof '') {
        var c = { Header: c, accessor: c };
      }
      c.accessor = c.accessor || c.Header;
      return c;
    });
    this.setState({ data, interalData: data, internalColumns });
    this.filterUpdated();
  }
  componentDidMount() {
    this.updateData();
  }

  render() {
    var { column, data, direction, interalData, page, internalColumns } = this.state;
    var { renderedRows, columns, loading, filterable, csvExport, aggregateRow } = this.props;

    renderedRows = renderedRows || 10;
    var renderedData = interalData.slice((page - 1) * renderedRows, renderedRows * page);

    return loading ? (
      <div className="ui active transition visible dimmer" style={{ display: 'flex !important' }}>
        <div className="content">
          <div className="ui text loader">Loading</div>
        </div>
      </div>
    ) : (
      <div style={{ overflowX: 'auto', marginTop: 8 }}>
        <table className="ui celled sortable striped table">
          <SemTableHeader
            internalColumns={internalColumns}
            column={column}
            direction={direction}
            filterable={filterable}
            tableModel={this}
          />

          <tbody>
            {_.map(renderedData, (r, i) => (
              <tr key={i + 'row'}>
                {_.map(internalColumns, (c, i) => (
                  <td key={i + 'cell'}>
                    {c.Cell
                      ? c.Cell({
                          value: this.getData({ column: c, data: r }),
                          column: c,
                          row: r,
                        })
                      : this.getData({ column: c, data: r })}
                  </td>
                ))}
              </tr>
            ))}
            {aggregateRow ? (
              <tr>
                {_.map(internalColumns, (c, i) => (
                  <td key={i + 'cell-aggregate'}>
                    {' '}
                    {c.type == 'number' ? (
                      <div>
                        <span>{c.aggregateLabel ? c.aggregateLabel : ''}</span>{' '}
                        <span>
                          {c.Cell
                            ? c.Cell({
                                value: _.reduce(
                                  interalData,
                                  (sum, row) => sum + +this.getData({ column: c, data: row }),
                                  0,
                                ),
                              })
                            : _.reduce(interalData, (sum, row) => sum + +this.getData({ column: c, data: row }), 0)}
                        </span>
                      </div>
                    ) : null}
                    {}
                  </td>
                ))}
              </tr>
            ) : null}
          </tbody>
          <SemTableFooter
            interalData={interalData}
            columns={columns}
            renderedRows={renderedRows}
            page={page}
            csvExport={csvExport}
            tableModel={this}
          />
        </table>
      </div>
    );
  }
}
