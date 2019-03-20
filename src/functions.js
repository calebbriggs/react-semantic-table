import { contains } from "./helpers";
import moment from "moment";
//Handles the sorting of the table
function handleSort(clickedColumn) {
  const { column, direction, interalData } = this.state;

  if (column !== clickedColumn) {
    this.setState({
      column: clickedColumn,
      interalData: _.sortBy(interalData, d => {
        return getData({ data: d, column: clickedColumn });
      }),
      direction: "ascending"
    });

    return;
  }

  this.setState({
    data: interalData.reverse(),
    direction: direction === "ascending" ? "descending" : "ascending"
  });
}

// abstraction to get the data from the column accessor
function getData({ data, column }) {
  if (typeof column.accessor === typeof "") {
    return data[column.accessor];
  }
  return column.accessor({ data, column });
}

//handles an array of filters for the table
function handleFilter({ column, filter }) {
  var { filters } = this.state;
  var hasFilter = _.find(filters, { column: { Header: column.Header } });
  if (hasFilter) {
    filters.splice(filters.indexOf(hasFilter));
  }
  if (filter) filters.push({ column, filter });

  this.state.filters = filters;
  filterUpdated.bind(this)();
}
function filterUpdated() {
  var { filters, data } = this.state;
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
export { handleSort, getData, handleFilter, filterUpdated };
