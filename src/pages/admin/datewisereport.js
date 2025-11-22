import { ExcelExport, ExcelExportColumn } from '@progress/kendo-react-excel-export';

import Admin from "@/layouts/Admin";
import SimpleHeader from "components/Headers/SimpleHeader.js";
import React, { useEffect, useState } from "react";
import dynamic from "next/dynamic";
import useApi from "@/api/hooks/apihook";

import ReportFunctions from "../../api/reports";
import useReport, { ReportHeader } from "@/api/hooks/useReport";
import { MyPagination } from "utils/pagination";
import { SafeBox, validateData, BusyBlock, BusyBlockAUtoHeight } from "@/api/hooks/apiutils";

import {
    Badge,
    Button,
    Card,
    CardHeader,
    CardFooter,
    Media,
    Modal,
    Table,
    Container,
    Row,
    Col,
    CardBody,
    Form,
    FormGroup,
    InputGroup,
    Input,
    Collapse,
} from "reactstrap";
import { amountFormat } from "utils/utils";

const DateWiseReport = () => {

    const uRS = useReport(); //useReportStates

    const API_getDatereports = useApi(ReportFunctions.getDateWiseReport);
    const [datereports, setDatereports] = useState([]);

    useEffect(() => {
        loadReports();
    }, [uRS.sortValues, uRS.pageSizeValue, uRS.pageNumber])

    const loadReports = async () => {
        const sort = uRS.sortValues.sortCol ? `${uRS.sortValues.sortCol} ${uRS.sortValues.sortDir}` : null;
        const retVal = await API_getDatereports.request(uRS.filterValues, sort, uRS.pageSizeValue, uRS.pageNumber);
        
        if (retVal.ok && retVal.data) {
            setDatereports(retVal.data.requestedData?.Report || []);
            if (retVal.data.requestedData?.ReportCount?.[0]?.numrows) {
                uRS.setRecordCount(retVal.data.requestedData.ReportCount[0].numrows);
            }
        }
    }
    const sortClick = (column) => {
        uRS.setSortValues({ sortCol: column, sortDir: (uRS.sortValues.sortCol == column) ? "desc" : "asc" })
    }

    const _exporter = React.createRef();
    const excelExport = () => {
        if (_exporter.current) {
            _exporter.current.save();
        }
    };

    return (
        <>
            <SimpleHeader name="Report" parentName="Masters" parentUrl="/">
                <Button className="btn-neutral" color="default" size="sm" onClick={excelExport}> Export to Excel </Button>
                <ExcelExport data={datereports} fileName="Date Wise Report.xlsx" ref={_exporter}>
                    <ExcelExportColumn field="orderDate" title="Order Date" width={350} />
                    <ExcelExportColumn field="TotalOrderedCount" title="Total Ordered Count" />
                    <ExcelExportColumn field="TotalOrderedAmount" title="Total Ordered Amount" />
                    {/* //hidden={true} */}
                </ExcelExport>
                <Button className="btn-neutral" color="default" size="sm" onClick={() => { uRS.setFilterOpen(!uRS.filterOpen) }}> Filters </Button>
            </SimpleHeader>
            <Container className="mt--6" fluid>
                <Row>
                    <div className="col">
                        <Collapse isOpen={uRS.filterOpen}>
                            <Card>
                                <CardHeader className="border-0"> <h3 className="mb-0">Filter</h3> </CardHeader>
                                <CardBody>
                                    <Row>
                                        <Col md="4">
                                            <FormGroup>
                                                <label className="form-control-label" htmlFor="exampleFormControlInput1"> Order Date</label>
                                                <InputGroup>
                                                    <Input type="date" value={uRS.filterValues.datefrom} onChange={e => { uRS.setFilterValues({ ...uRS.filterValues, datefrom: e.target.value }); }} />
                                                    <Input type="date" value={uRS.filterValues.dateto} onChange={e => { uRS.setFilterValues({ ...uRS.filterValues, dateto: e.target.value }); }} />
                                                </InputGroup>
                                            </FormGroup>
                                        </Col>
                                        <Col md="3">
                                            <FormGroup>
                                                <label className="form-control-label" htmlFor="exampleFormControlInput1">&nbsp;</label>
                                                <Button className="my-4 btn-md" color="dark" type="button" onClick={() => { (uRS.pageNumber == 1) && loadReports() || uRS.setPageNumber("1") }}> Filter </Button>
                                            </FormGroup>
                                        </Col>
                                    </Row>

                                </CardBody>
                            </Card>
                        </Collapse>

                        <SafeBox objectApi={API_getDatereports} lengthCheckObeject={"Report"} firstTimeOnly={true} noDataMessage="No Reports Found">
                            {validateData(API_getDatereports, "Report", true) &&
                                <Card style={{ position: "relative" }}>
                                    <ReportHeader uRS={uRS}>Date Wise Report</ReportHeader>
                                    <Table className="align-items-center table-flush" responsive>
                                        <thead className="thead-light">
                                            <tr>
                                                <th >SLNO</th>
                                                <th className={`${(uRS.sortValues.sortCol == "orderDate") ? 'active' : ''}`} scope="col" onClick={() => sortClick('orderDate')}>Order Date</th>
                                                <th className={`text-center ${(uRS.sortValues.sortCol == "TotalOrderedCount") ? 'active' : ''}`} scope="col" onClick={() => sortClick('TotalOrderedCount')}>Total Ordered Count</th>
                                                <th className={`text-right ${(uRS.sortValues.sortCol == "TotalOrderedAmount") ? 'active' : ''}`} scope="col" onClick={() => sortClick('TotalOrderedAmount')}>Total Ordered Amount</th>
                                                <th></th>
                                            </tr>
                                        </thead>
                                        <tbody className="list">
                                            {(datereports.length > 0 && datereports.map((datereport, index) => (
                                                <DateWiseReportRow
                                                    datereport={datereport}
                                                    slno={((uRS.pageNumber - 1) * uRS.pageSizeValue) + index + 1}
                                                    key={index}
                                                />
                                            )))}

                                        </tbody>
                                    </Table>
                                    <CardFooter className="py-4">
                                        <MyPagination pageNumber={parseInt(uRS.pageNumber)} pageCount={Math.ceil(uRS.recordCount / uRS.pageSizeValue)} handleChangePage={uRS.setPageNumber} />
                                    </CardFooter>
                                    <BusyBlock iAmBusy={API_getDatereports.loading} />
                                </Card>
                            }
                        </SafeBox>
                    </div>
                </Row>
            </Container>
        </>
    )

}
const DateWiseReportWithNoSSR = dynamic(() => Promise.resolve(DateWiseReport), { ssr: false });
DateWiseReportWithNoSSR.layout = Admin;
DateWiseReportWithNoSSR.permissionCheck = "permissionReports";
export default DateWiseReportWithNoSSR;

// Force dynamic rendering to prevent SSR errors during build
// Removed getServerSideProps - not needed with dynamic ssr: false

const DateWiseReportRow = ({ datereport, slno }) => {
    return (
        <>
            <tr>
                <td className="budget">
                    <span>{slno}</span>
                </td>
                <td className="budget ">
                    <span>{datereport.orderDate}</span>
                </td>
                <td className="budget text-center">
                    <span>{datereport.TotalOrderedCount}</span>
                </td>
                <td className="budget text-right">
                    <span>{amountFormat(datereport.TotalOrderedAmount)}</span>
                </td>
                <td></td>
            </tr>
        </>
    );
};