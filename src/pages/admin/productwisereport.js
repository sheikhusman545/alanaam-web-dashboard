import Admin from "@/layouts/Admin";
import SimpleHeader from "components/Headers/SimpleHeader.js";
import React, { useEffect, useState } from "react";
import dynamic from "next/dynamic";
import { ExcelExport, ExcelExportColumn } from '@progress/kendo-react-excel-export';

import useApi from "@/api/hooks/apihook";
import ReportFunctions from "../../api/reports";
import useReport, { ReportHeader } from "@/api/hooks/useReport";
import { MyPagination } from "utils/pagination";
import { SafeBox, validateData, BusyBlock, BusyBlockAUtoHeight } from "@/api/hooks/apiutils";
import Select from 'react-select'
import productFunctions from "../../api/products";

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

const ProductWiseReports = () => {

    const uRS = useReport(); //useReportStates

    const API_getReport = useApi(ReportFunctions.getProductWiseReport);
    const API_GetallProducts = useApi(productFunctions.getAlProducts);

    const [reports, setReports] = useState([]);
    const [products, setProducts] = useState([]);

    useEffect(() => {
        loadReports();
    }, [uRS.sortValues, uRS.pageSizeValue, uRS.pageNumber])

    useEffect(() => {
        loadProduct();
    }, [])

    const loadReports = async () => {
        const sort = uRS.sortValues.sortCol ? `${uRS.sortValues.sortCol} ${uRS.sortValues.sortDir}` : null;
        const retVal = await API_getReport.request(uRS.filterValues, sort, uRS.pageSizeValue, uRS.pageNumber);
        
        if (retVal.ok && retVal.data) {
            setReports(retVal.data.requestedData?.Report || []);
            if (retVal.data.requestedData?.ReportCount?.[0]?.numrows) {
                uRS.setRecordCount(retVal.data.requestedData.ReportCount[0].numrows);
            }
        }
    }
    const loadProduct = async () => {
        const retVal = await API_GetallProducts.request();
        if (retVal.ok && retVal.data) {
            setProducts([{ productID: "", en_ProductName: "--All--" }, ...(retVal.data.requestedData?.Products || [])]);
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
                {/* <Button className="btn-neutral" color="default" size="sm" onClick={() => {
                }}> New </Button> */}

                <Button className="btn-neutral" color="default" size="sm" onClick={excelExport}> Export to Excel </Button>
                <ExcelExport data={reports} fileName="Product Wise Report.xlsx" ref={_exporter}>
                    <ExcelExportColumn field="en_ProductName" title="Product Name" width={350} />
                    <ExcelExportColumn field="productPrice" title="Product Price" />
                    <ExcelExportColumn field="productCode" title="Product Code"  /> 
                    {/* //hidden={true} */}
                    <ExcelExportColumn field="en_CategoryName" title="Category Name" />
                    <ExcelExportColumn field="TotalOrderedCount" title="Total OrderedCount" />
                    <ExcelExportColumn field="TotalOrderedAmount" title="Total Ordered Amount" />
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
                                        <Col md="2">
                                            <FormGroup>
                                                <label className="form-control-label" htmlFor="exampleFormControlInput1"> Keyword</label>
                                                <Input className="" placeholder="Enter Keyword here" type="text" value={uRS.filterValues.keyword} onChange={e => { uRS.setFilterValues({ ...uRS.filterValues, keyword: e.target.value }); }} />
                                            </FormGroup>
                                        </Col>
                                        <Col md="3">
                                            <FormGroup>
                                                <label className="form-control-label" htmlFor="exampleFormControlSelect1">Product</label>
                                                {/* <Input className="" placeholder="Enter Product id here" type="text" value={uRS.filterValues.productid} onChange={e => { uRS.setFilterValues({ ...uRS.filterValues, productid: e.target.value }); }} /> */}

                                                <Select options={products.map((product, index) => ({ value: product.productID, label: product.en_ProductName }))} value={products.map((product, index) => { if (uRS.filterValues.productid == product.productID) { return { value: product.productID, label: product.en_ProductName } } })} onChange={val => { uRS.setFilterValues({ ...uRS.filterValues, productid: val.value }); }} />
                                            </FormGroup>
                                        </Col>
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

                        <SafeBox objectApi={API_getReport} lengthCheckObeject={"Report"} firstTimeOnly={true} noDataMessage="No Reports Found">
                            {validateData(API_getReport, "Report", true) &&
                                <Card style={{ position: "relative" }}>
                                    <ReportHeader uRS={uRS}>Product Wise Report</ReportHeader>
                                    <Table className="align-items-center table-flush" responsive>
                                        <thead className="thead-light">
                                            <tr>
                                                <th className={`sort ${(uRS.sortValues.sortCol == "") ? 'active' : ''}`} data-sort="budget" scope="col" onClick={() => sortClick('')} >SLNO</th>
                                                <th className={`sort ${(uRS.sortValues.sortCol == "en_ProductName") ? 'active' : ''}`} data-sort="budget" scope="col" onClick={() => sortClick('en_ProductName')}>En_Product Name</th>
                                                <th className={`sort ${(uRS.sortValues.sortCol == "PRD.productPrice") ? 'active' : ''}`} data-sort="budget" scope="col" onClick={() => sortClick('PRD.productPrice')}>Product Price</th>
                                                <th className={`sort ${(uRS.sortValues.sortCol == "productCode") ? 'active' : ''}`} data-sort="budget" scope="col" onClick={() => sortClick('productCode')} >Product Code</th>
                                                <th >En_Category Name</th>
                                                <th className={`sort ${(uRS.sortValues.sortCol == "TotalOrderedCount") ? 'active' : ''}`} data-sort="budget" scope="col" onClick={() => sortClick('TotalOrderedCount')}>Total Ordered Count</th>
                                                <th className={`sort ${(uRS.sortValues.sortCol == "TotalOrderedAmount") ? 'active' : ''}`} data-sort="budget" scope="col" onClick={() => sortClick('TotalOrderedAmount')}>Total Ordered Amount</th>
                                            </tr>
                                        </thead>
                                        <tbody className="list">
                                            {(reports.length > 0 && reports.map((report, index) => (
                                                <ProductWiseReportRow
                                                    report={report}
                                                    slno={((uRS.pageNumber - 1) * uRS.pageSizeValue) + index + 1}
                                                    key={index}
                                                />
                                            )))}

                                        </tbody>
                                    </Table>
                                    <CardFooter className="py-4">
                                        <MyPagination pageNumber={parseInt(uRS.pageNumber)} pageCount={Math.ceil(uRS.recordCount / uRS.pageSizeValue)} handleChangePage={uRS.setPageNumber} />
                                    </CardFooter>
                                    <BusyBlock iAmBusy={API_getReport.loading} />
                                </Card>
                            }
                        </SafeBox>
                    </div>
                </Row>
            </Container>
        </>
    );
}
const ProductWiseReportRow = ({ report, slno }) => {
    return (
        <>
            <tr>
                <td className="budget">
                    <span>{slno}</span>
                </td>
                <td className="budget">
                    <span>{report.en_ProductName}</span>
                </td>
                <td className="budget text-right">
                    <span>{report.productPrice}</span>
                </td>
                <td className="budget">
                    <span>{report.productCode}</span>
                </td>
                <td className="budget">
                    <span>{report.en_CategoryName}</span>
                </td>
                <td className="budget">
                    <span>{report.TotalOrderedCount}</span>
                </td>
                <td className="budget text-right">
                    <span>{amountFormat(report.TotalOrderedAmount)}</span>
                </td>
            </tr>
        </>
    );
};

const ProductWiseReportsWithNoSSR = dynamic(() => Promise.resolve(ProductWiseReports), { ssr: false });
ProductWiseReportsWithNoSSR.layout = Admin;
ProductWiseReportsWithNoSSR.permissionCheck = "permissionReports";
export default ProductWiseReportsWithNoSSR;