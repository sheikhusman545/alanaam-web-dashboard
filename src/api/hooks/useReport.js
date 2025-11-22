import { useState } from "react";
import { CardHeader, Row, Col, } from "reactstrap";
import Select from 'react-select'

const useReport = () => {
  const [filterValues, setFilterValues] = useState({});
  const [filterOpen, setFilterOpen] = useState(false);
  const [sortValues, setSortValues] = useState({ sortCol: "", sortDir: "" });
  const [pageSizeValue, setPageSizeValue] = useState("10");
  const [pageNumber, setPageNumber] = useState("1");
  const [recordCount, setRecordCount] = useState(null);
  const pageSizeOptions = [{ value: "2", label: "2" }, { value: "5", label: "5" }, { value: "10", label: "10" }, { value: "20", label: "20" }, { value: "50", label: "50" }, { value: "100", label: "100" }, { value: "200", label: "200" }, { value: "500", label: "500" }]

  return {
    filterValues, setFilterValues,
    filterOpen, setFilterOpen,
    sortValues, setSortValues,
    pageSizeValue, setPageSizeValue,
    pageNumber, setPageNumber,
    recordCount, setRecordCount,
    pageSizeOptions,
  };
};
export default useReport;

export const ReportHeader = ({ children, uRS }) => (
  <CardHeader className="border-0">
    <Row className="align-items-center">
      <div className="col">
        <h3 className="mb-0">{children}</h3>
      </div>
      <div className="col text-right">
        <Row>
          <Col md="8">
          </Col>
          <Col md="4 text-left" style={{ fontSize: "80%" }}>
            <Select options={uRS.pageSizeOptions} value={uRS.pageSizeOptions.map(pageSize => { if (pageSize.value == uRS.pageSizeValue) { return { value: pageSize.value, label: "page size: " + pageSize.label } } })} onChange={val => { uRS.setPageSizeValue(val.value); uRS.setPageNumber("1"); }} />
          </Col>
        </Row>
      </div>
    </Row>
  </CardHeader>
)
