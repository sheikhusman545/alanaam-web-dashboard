import React, { useEffect, useState } from "react";
import dynamic from "next/dynamic";
import Admin from "@/layouts/Admin";
import useApi from "../../api/hooks/apihook";
import customerFunctions from "../../api/customer";
import SimpleHeader from "components/Headers/SimpleHeader.js";
import useReport, { ReportHeader } from "@/api/hooks/useReport";
import Select from 'react-select'
import { MyPagination } from "utils/pagination"
// Using Font Awesome icons instead of Material-UI to avoid SSR issues
// import { Visibility } from "@mui/icons-material";
import { OrderRow, Modal_ViewOrderProducts } from "components/custom_components/orders";
import {
    Button,
    Card,
    CardFooter,
    CardHeader,
    CardTitle,
    CardSubtitle,
    Collapse,
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
    InputGroupText,
    Input,
    CardImg,
} from "reactstrap";

const Customers = () => {
    const uRS = useReport(); //useReportStates
    const customerTypeOptions = [
        { value: '', label: '--All--' },
        { value: 'customer', label: 'Registered customer' },
        { value: 'guest ', label: 'Guest customer' },
    ]
    const [customers, setCustomers] = useState([]);
    const [totalSales, setTotalSales] = useState("");

    const API_GetallCustomers = useApi(customerFunctions.getCustomers);
    const loadCustomers = async () => {
        const sort = uRS.sortValues.sortCol ? `${uRS.sortValues.sortCol} ${uRS.sortValues.sortDir}` : null;
        const retVal = await API_GetallCustomers.request(uRS.filterValues, sort, uRS.pageSizeValue, uRS.pageNumber);
        
        if (retVal.ok && retVal.data) {
            setCustomers(retVal.data.requestedData?.Customers || []);

            if (retVal.data.requestedData?.CustomersCount?.[0]) {
                uRS.setRecordCount(retVal.data.requestedData.CustomersCount[0].numrows);
                setTotalSales(retVal.data.requestedData.CustomersCount[0].TotalSales);
            }
        }
    }
    useEffect(() => {
        loadCustomers();
    }, [uRS.sortValues, uRS.pageSizeValue, uRS.pageNumber]);
    const sortClick = (column) => {
        uRS.setSortValues({ sortCol: column, sortDir: (uRS.sortValues.sortCol == column) ? "desc" : "asc" })
    }
    return (
        <>
            <SimpleHeader name="Customers" parentName="Masters" parentUrl="/">
                <Button className="btn-neutral" color="default" size="sm" onClick={() => { uRS.setFilterOpen(!uRS.filterOpen) }} > Filters </Button>
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
                                                <Input className="" placeholder="Enter keyword here" type="text" value={uRS.filterValues.keyword} onChange={e => { uRS.setFilterValues({ ...uRS.filterValues, keyword: e.target.value }); }} />
                                            </FormGroup>
                                        </Col>
                                        <Col md="3">
                                            <FormGroup>
                                                <label className="form-control-label" htmlFor="exampleFormControlSelect1"> Customer Type </label>
                                                <Select options={customerTypeOptions} value={customerTypeOptions.map(customerTypeOption => { if (customerTypeOption.value == uRS.filterValues.customertype) { return customerTypeOption } })} onChange={val => { uRS.setFilterValues({ ...uRS.filterValues, customertype: val.value }); }} />
                                            </FormGroup>
                                        </Col>

                                        <Col md="3">
                                            <FormGroup>
                                                <label className="form-control-label" htmlFor="exampleFormControlInput1">&nbsp;</label>
                                                <Button className="my-4 btn-md" color="dark" type="button" onClick={() => { (uRS.pageNumber == 1) && loadCustomers() || uRS.setPageNumber("1") }} > Filter </Button>
                                            </FormGroup>
                                        </Col>
                                    </Row>

                                </CardBody>
                            </Card>
                        </Collapse>

                        <Card>
                            <CardHeader className="border-0">
                                <ReportHeader uRS={uRS}>Customers</ReportHeader>
                            </CardHeader>

                            <Table className="align-items-center table-flush" responsive>
                                <thead className="thead-light">
                                    <tr>
                                        <th className="sort" data-sort="name" scope="col">
                                            SlNo
                                        </th>
                                        <th className="sort" data-sort="budget" scope="col">
                                            Customer type
                                        </th>
                                        <th className="sort" data-sort="status" scope="col">
                                            Customer name
                                        </th>

                                        <th className="sort" data-sort="name" scope="col">
                                            Customer Email & <br />
                                            Customer Mobile
                                        </th>

                                        <th className="sort" data-sort="name" scope="col">
                                            Full Address
                                        </th>
                                        <th className="sort" data-sort="name" scope="col">
                                            Registerd On
                                        </th>
                                        <th className="sort" data-sort="name" scope="col">
                                            Sales Value
                                        </th>
                                        <th scope="col">
                                            order
                                        </th>
                                    </tr>
                                </thead>
                                <tbody className="list">
                                    {(customers.length > 0 && customers.map((customer, index) =>
                                    (
                                        <CustomerRow
                                            customer={customer}
                                            key={index}
                                            slNo={((uRS.pageNumber - 1) * uRS.pageSizeValue) + index + 1}
                                        />))) || (
                                            <tr>
                                                <td>
                                                    <span>no data found</span>
                                                </td>
                                            </tr>
                                        )}
                                </tbody>
                                <tfoot>
                                    <tr>
                                        <td colSpan="5"></td>
                                        <td >Total Sales :</td>
                                        <td className="text-right"><strong>  {totalSales} </strong></td>
                                        <td ></td>
                                    </tr>
                                </tfoot>




                                {/* Total Sales */}


                            </Table>
                            <CardFooter className="py-4">
                                <MyPagination pageNumber={parseInt(uRS.pageNumber)} pageCount={Math.ceil(uRS.recordCount / uRS.pageSizeValue)} handleChangePage={uRS.setPageNumber} />
                            </CardFooter>
                        </Card>
                    </div>
                </Row>
            </Container>

        </>
    );
};
const CustomersWithNoSSR = dynamic(() => Promise.resolve(Customers), { ssr: false });
CustomersWithNoSSR.layout = Admin;
// Force dynamic rendering - prevent static generation during build
export async function getServerSideProps() {
  return {
    props: {},
  };
}

export default CustomersWithNoSSR;

const CustomerRow = ({ customer, slNo }) => {
    const [modalShow_Vieworder, setmodalShow_Vieworder] = useState(false);
    const [choosenOrderId, setChoosenOrderId] = useState(null);
    const statusValues = [{ caption: "--All--", color: "" }, { caption: "Pending", color: "danger" }, { caption: "Approved", color: "primary" }, { caption: "Rejected", color: "default" }, { caption: "Processed", color: "warning" }, { caption: "Shipped", color: "info" }, { caption: "Delivered", color: "success" },];

    return (<>

        <tr>
            <td>{slNo}</td>
            <td>{customer.customerID == null ? "Guest" : "Customer"}</td>
            <td>{customer.name}</td>
            <td>{customer.emailID == "undefined" ? "" : customer.emailID} <br />{customer.mobileNumber == "undefined" ? "" : customer.mobileNumber}</td>
            <td>BuildingName_No : {customer.buildingName_No == "undefined" ? "" : customer.buildingName_No}<br />StreetName_No : {customer.streetName_No == "undefined" ? "" : customer.streetName_No}<br />zoneNo : {customer.zoneNo == "undefined" ? "" : customer.zoneNo}<br />city : {customer.city == "undefined" ? "" : customer.city}<br />landMark : {customer.landMark == "undefined" ? "" : customer.landMark}</td>
            <td>{customer.orderDate}</td>
            <td className="text-right">{customer.TotalOrders}</td>
            <td className="text-right">
                <Button className="btn-icon-only" color="secondary" type="button">
                    <span
                        className="btn-inner--icon"
                        onClick={() => {
                            setChoosenOrderId(customer.orderID);
                            setmodalShow_Vieworder(true);

                        }}
                    >
                        <i className="fas fa-eye" />
                    </span>
                </Button>
            </td>

        </tr>
        {modalShow_Vieworder && (
            <Modal_ViewOrderProducts
                modalIsOpen={modalShow_Vieworder}
                setModalIsOpen={setmodalShow_Vieworder}
                choosenOrderId={choosenOrderId}
                statusValues={statusValues}
            />
        )}


    </>);
}