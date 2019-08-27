import React, { Component } from 'react';
import { CSVLink } from 'react-csv';
export default class SemTableFooter extends Component {
  render() {
    var { columns, page, interalData, renderedRows, csvExport, tableModel } = this.props;
    let exportData = interalData.map(d => {
      var data = {};
      columns = columns || [];
      columns.forEach(col => {
        var name = col.Header || col.accessor;
        if (typeof col.accessor === 'function') {
          data[name] = col.accessor({ data: d });
        } else {
          data[name] = d[col.accessor];
        }
      });
      return data;
    });
    return (
      <tfoot>
        <tr>
          <th colSpan={columns.length}>
            <div className="ui pagination menu">
              <a
                className={`item icon ${page == 1 ? 'disabled' : ''}`}
                title="Previous Page"
                onClick={() => {
                  if (page == 1) return;
                  tableModel.setState({ page: page - 1 });
                }}
              >
                <i className="chevron left icon" aria-hidden="true" />
              </a>
              <a
                className={`item icon ${page >= interalData.length / renderedRows ? 'disabled' : ''}`}
                title="Next Page"
                onClick={() => {
                  if (page >= interalData.length / renderedRows) return;
                  tableModel.setState({ page: page + 1 });
                }}
              >
                <i className="chevron right icon" aria-hidden="true" />
              </a>
              {csvExport ? (
                <div className="item icon" title="Excel Download">
                  <CSVLink data={exportData} filename={'data.csv'}>
                    <i className="file excel icon" aria-hidden="true" />
                  </CSVLink>
                </div>
              ) : null}
            </div>
            <b>
              {' '}
              &nbsp;{interalData.length ? (page - 1) * renderedRows + 1 : 0} -{' '}
              {renderedRows * page > interalData.length ? interalData.length : renderedRows * page} of{' '}
              {interalData.length}
            </b>
          </th>
        </tr>
      </tfoot>
    );
  }
}
