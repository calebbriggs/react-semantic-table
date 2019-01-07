Run

`npm install react-semantic-table`

example

```
import React, { Component } from "react";
import SemTable from "react-semantic-table";
<SemTable
    filterable={true}
    data={data}
    loading={loading}
    renderedRows={10}
    columns={[
        { Header: "name", accessor: "name" },
        { Header: "email", accessor: "email" },
        {
            Header: "date",
            accessor: ({ data }) => data.date,
            type: "date",
            Cell: row => ( <span> {row.value ? moment(row.value).format("MM/DD/YYYY") : ""} </span> )
        },
        { Header: "street", accessor: "street" },
        { Header: "city", accessor: "city" },
        { Header: "state", accessor: "state" },
        { Header: "zip", accessor: "zip" }
    ]}
/>
```
