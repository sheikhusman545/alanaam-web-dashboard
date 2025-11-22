import { ExcelExport, ExcelExportColumn } from '@progress/kendo-react-excel-export';

import Admin from "@/layouts/Admin";
import SimpleHeader from "components/Headers/SimpleHeader.js";
import React, { useEffect, useState } from "react";
import dynamic from "next/dynamic";
import useApi from "@/api/hooks/apihook";
import ReportFunctions from "../../api/reports";
import useReport, { ReportHeader } from "@/api/hooks/useReport";
import { MyPagination } from "utils/pagination"
import { SafeBox, validateData, BusyBlock, BusyBlockAUtoHeight } from "@/api/hooks/apiutils";
import Select from 'react-select'
import categoryFunctions from "../../api/categories";

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

const CategorytWiseReport = () => {

    const uRS = useReport(); //useReportStates

    const API_getCategoryreports = useApi(ReportFunctions.getCategoryWiseReport);
    const API_GetallCategories = useApi(categoryFunctions.getAlCategories);

    const [categoryreports, setCategoryreports] = useState([]);
    const [categories, setCategories] = useState([]);

    useEffect(() => {
        loadReports();
    }, [uRS.sortValues, uRS.pageSizeValue, uRS.pageNumber])

    useEffect(() => {
        loadCategories();
    }, [])

    const loadReports = async () => {
        const sort = uRS.sortValues.sortCol ? `${uRS.sortValues.sortCol} ${uRS.sortValues.sortDir}` : null;
        const retVal = await API_getCategoryreports.request(uRS.filterValues, sort, uRS.pageSizeValue, uRS.pageNumber);
        
        if (retVal.ok && retVal.data) {
            setCategoryreports(retVal.data.requestedData?.Report || []);
            if (retVal.data.requestedData?.ReportCount?.[0]?.numrows) {
                uRS.setRecordCount(retVal.data.requestedData.ReportCount[0].numrows);
            }
        }
    }

    const loadCategories = async () => {
        const retVal = await API_GetallCategories.request();
        if (retVal.ok && retVal.data) {
            setCategories([{ categoriesID: "", en_CategoryName: "--All--" }, ...(retVal.data.requestedData?.Categories || [])]);
        }
    };

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
                <ExcelExport data={categoryreports} fileName="Category Wise Report.xlsx" ref={_exporter}>
                    <ExcelExportColumn field="en_CategoryName" title="Category Name" width={350} />
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
                                        <Col md="3">
                                            <FormGroup>
                                                <label className="form-control-label" htmlFor="exampleFormControlInput1"> Keyword</label>
                                                <Input className="" placeholder="Enter Keyword here" type="text" value={uRS.filterValues.keyword} onChange={e => { uRS.setFilterValues({ ...uRS.filterValues, keyword: e.target.value }); }} />
                                            </FormGroup>
                                        </Col>
                                        <Col md="3">
                                            <FormGroup>
                                                <label className="form-control-label" htmlFor="exampleFormControlSelect1">Category</label>
                                                <Select options={categories.map((categorie, index) => ({ value: categorie.categoryID, label: categorie.en_CategoryName }))} value={categories.map((categorie, index) => { if (uRS.filterValues.categoryid == categorie.categoryID) { return { value: categorie.categoryID, label: categorie.en_CategoryName } } })} onChange={val => { uRS.setFilterValues({ ...uRS.filterValues, categoryid: val.value }); }} />
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

                        <SafeBox objectApi={API_getCategoryreports} lengthCheckObeject={"Report"} firstTimeOnly={false} noDataMessage="No Reports Found">
                            {validateData(API_getCategoryreports, "Report", false) &&
                                <Card style={{ position: "relative" }}>
                                    <ReportHeader uRS={uRS}>Category Wise Report</ReportHeader>
                                    <Table className="align-items-center table-flush" responsive>
                                        <thead className="thead-light">
                                            <tr>
                                                <th >SLNO</th>
                                                <th className={`sort ${(uRS.sortValues.sortCol == "en_CategoryName") ? 'active' : ''}`} data-sort="budget" scope="col" onClick={() => sortClick('en_CategoryName')}>En_Category Name</th>
                                                <th className={` text-center sort ${(uRS.sortValues.sortCol == "TotalOrderedCount") ? 'active' : ''}`} data-sort="budget" scope="col" onClick={() => sortClick('TotalOrderedCount')}>Total Ordered Count</th>
                                                <th className={` text-right sort ${(uRS.sortValues.sortCol == "TotalOrderedAmount") ? 'active' : ''}`} data-sort="budget" scope="col" onClick={() => sortClick('TotalOrderedAmount')}>Total Ordered Amount</th>
                                            </tr>
                                        </thead>
                                        <tbody className="list">
                                            {(API_getCategoryreports.data.requestedData.Report.length > 0 && API_getCategoryreports.data.requestedData.Report.map((categoryreport, index) => (
                                                <CategoryWiseReportRow
                                                    categoryreport={categoryreport}
                                                    slno={index}
                                                    key={index}
                                                />
                                            )))}

                                        </tbody>
                                    </Table>
                                    <CardFooter className="py-4">
                                        <MyPagination pageNumber={parseInt(uRS.pageNumber)} pageCount={Math.ceil(uRS.recordCount / uRS.pageSizeValue)} handleChangePage={uRS.setPageNumber} />
                                    </CardFooter>
                                    <BusyBlock iAmBusy={API_getCategoryreports.loading} />
                                </Card>
                            }
                        </SafeBox>
                    </div>
                </Row>
            </Container>
        </>
    );
};
const CategorytWiseReportWithNoSSR = dynamic(() => Promise.resolve(CategorytWiseReport), { ssr: false });
CategorytWiseReportWithNoSSR.layout = Admin;
CategorytWiseReportWithNoSSR.permissionCheck = "permissionReports";
export default CategorytWiseReportWithNoSSR;

// Force dynamic rendering to prevent SSR errors during build
// Removed getServerSideProps - not needed with dynamic ssr: false

const CategoryWiseReportRow = ({ categoryreport, slno }) => {
    return (
        <>
            <tr>
                <td className="budget">
                    <span>{slno + 1}</span>
                </td>
                <td className="budget">
                    <span>{categoryreport.en_CategoryName}</span>
                </td>
                <td className="budget text-center">
                    <span>{categoryreport.TotalOrderedCount}</span>
                </td>
                <td className="budget text-right">
                    <span>{amountFormat(categoryreport.TotalOrderedAmount)}</span>
                </td>
            </tr>
        </>
    );
};