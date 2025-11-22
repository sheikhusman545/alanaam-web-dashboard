import React, { createRef, useEffect, useState } from "react";
import dynamic from "next/dynamic";
// PDF components need to be loaded client-side only
const PDFDownloadLink = dynamic(() => import('@react-pdf/renderer').then(mod => mod.PDFDownloadLink), { ssr: false });
const PDFViewer = dynamic(() => import('@react-pdf/renderer').then(mod => mod.PDFViewer), { ssr: false });
import { Page, Text, View, Document, StyleSheet, Image } from '@react-pdf/renderer';
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
  FormGroup,
  InputGroup,
  Input,
  Collapse,
} from "reactstrap";
// core components
import Select from 'react-select'

import Admin from "@/layouts/Admin";


import SimpleHeader from "components/Headers/SimpleHeader.js";
import { OrderRow } from "components/custom_components/orders";
import { OrderExcelExport } from "components/custom_components/excelexport";
import {OrdersPDFDownload} from "components/custom_components/pdfdownload";
import { MyPagination } from "utils/pagination"
import { getStoreStatusText } from "utils/constantArrays";

import useApi from "@/api/hooks/apihook";
import { SafeBox, validateData, BusyBlock, BusyBlockAUtoHeight } from "@/api/hooks/apiutils";
import useReport, { ReportHeader } from "@/api/hooks/useReport";
import orderFunctions from "@/api/orders";

const Order = () => {
  const API_GetAllOrders = useApi(orderFunctions.getAllOrders);
  const [orders, setOrders] = useState([]);
  const uRS = useReport(); //useReportStates
  const statusValues = [{ caption: "--All--", color: "" }, { caption: "Pending", color: "danger" }, { caption: "Approved", color: "primary" }, { caption: "Rejected", color: "default" }, { caption: "Processed", color: "warning" }, { caption: "Shipped", color: "info" }, { caption: "Delivered", color: "success" },];

  useEffect(() => {
    loadOrders();
  }, [uRS.sortValues, uRS.pageSizeValue, uRS.pageNumber]);

  const loadOrders = async () => {
    const sort = uRS.sortValues.sortCol ? `${uRS.sortValues.sortCol} ${uRS.sortValues.sortDir}` : null;
    const retVal = await API_GetAllOrders.request(uRS.filterValues, sort, uRS.pageSizeValue, uRS.pageNumber);
    
    if (retVal.ok && retVal.data) {
      const ordersData = retVal.data.requestedData?.Orders || [];
      setOrders(
        ordersData.map((order) => ({
          ...order,
          OrderStatus: getStoreStatusText(order.cartStatus),
          customerName: order.customerName == null || order.customerName == "" ? "Guest" : order.customerName
        }))
      );
      
      if (retVal.data.requestedData?.OrdersCount?.[0]?.numrows) {
        uRS.setRecordCount(retVal.data.requestedData.OrdersCount[0].numrows);
      }
    }
  };

  const sortClick = (column) => {
    uRS.setSortValues({ sortCol: column, sortDir: (uRS.sortValues.sortCol == column) ? "desc" : "asc" })
  }

  const _exporter = createRef();

  const excelExport = () => {
    if (_exporter.current) {
      _exporter.current.save();
    }
  };

  return (
    <>
      <SimpleHeader name="Orders" parentName="Masters" parentUrl="/" >
        {orders && orders.length > 0 &&
          <>
            {/* <PDFViewer>
              <OrdersPDFDownload orders={orders} />
            </PDFViewer> */}
            <PDFDownloadLink document={<OrdersPDFDownload orders={orders} />} fileName="Orders.pdf">
              {({ blob, url, loading, error }) => (loading ? <Button className="btn-neutral" color="default" size="sm" > Loading document...</Button> : <Button className="btn-neutral" color="default" size="sm" style={{ marginRight: '1rem' }}>Download PDF </Button>)}
            </PDFDownloadLink>
          </>
        }

        <Button className="btn-neutral" color="default" size="sm" onClick={excelExport}> Export to Excel </Button>
        <OrderExcelExport data={orders} exportRef={_exporter} />
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
                        <label className="form-control-label" htmlFor="exampleFormControlSelect1"> Order Status </label>
                        <Select options={statusValues.map((statusValue, index) => ({ value: index, label: statusValue.caption }))} value={statusValues.map((statusValue, index) => { if (uRS.filterValues.status == index) { return { value: index, label: statusValue.caption } } })} onChange={val => { uRS.setFilterValues({ ...uRS.filterValues, status: val.value }); }} />
                      </FormGroup>
                    </Col>

                    <Col md="3">
                      <FormGroup>
                        <label className="form-control-label" htmlFor="exampleFormControlInput1">&nbsp;</label>
                        <Button className="my-4 btn-md" color="dark" type="button" onClick={() => { (uRS.pageNumber == 1) && loadOrders() || uRS.setPageNumber("1") }}> Filter </Button>
                      </FormGroup>
                    </Col>
                  </Row>

                </CardBody>
              </Card>
            </Collapse>

            <SafeBox objectApi={API_GetAllOrders} lengthCheckObject={"Orders"} firstTimeOnly={true} noDataMessage="No Orders found!"  >
              {validateData(API_GetAllOrders, "Orders", true) &&
                <Card style={{ position: "relative" }}>
                  <ReportHeader uRS={uRS}>Orders</ReportHeader>
                  <Table className="align-items-center table-flush" responsive>
                    <thead className="thead-light">
                      <tr>
                        <th className={`sort ${(uRS.sortValues.sortCol == "") ? 'active' : ''}`} data-sort="budget" scope="col" onClick={() => sortClick('')}> Order ID </th>
                        <th className={`sort ${(uRS.sortValues.sortCol == "OM.orderDate") ? 'active' : ''}`} data-sort="status" scope="col" onClick={() => sortClick('OM.orderDate')}> Order Date </th>
                        <th className={`sort ${(uRS.sortValues.sortCol == "CUS.customerName") ? 'active' : ''}`} data-sort="completion" scope="col" onClick={() => sortClick('CUS.customerName')}> Customer Name </th>
                        <th className={`sort ${(uRS.sortValues.sortCol == "OM.totalProductsQuantity") ? 'active' : ''}`} data-sort="completion" scope="col" onClick={() => sortClick('OM.totalProductsQuantity')}> Total Qty </th>
                        <th className={`sort ${(uRS.sortValues.sortCol == "OM.grantTotal") ? 'active' : ''}`} data-sort="completion" scope="col" onClick={() => sortClick('OM.grantTotal')}> Grand Total </th>
                        <th className={`sort ${(uRS.sortValues.sortCol == "OM.cartStatus") ? 'active' : ''}`} data-sort="completion" scope="col" onClick={() => sortClick('OM.cartStatus')}> Order Status </th>
                        <th className={`sort ${(uRS.sortValues.sortCol == "OM.cartStatusOn") ? 'active' : ''}`} data-sort="completion" scope="col" onClick={() => sortClick('OM.cartStatusOn')}> Order Status on </th>
                        <th scope="col" />
                      </tr>
                    </thead>
                    <tbody className="list">
                      {(orders.length > 0) &&
                        orders.map((order, index) => (
                          <OrderRow order={order} statusValues={statusValues} orders={orders} setOrders={setOrders} key={index} />
                        )) || (
                          <tr>
                            <td>
                              <span>no orders found</span>
                            </td>
                          </tr>
                        )}
                    </tbody>
                  </Table>
                  <CardFooter className="py-4">
                    <MyPagination pageNumber={parseInt(uRS.pageNumber)} pageCount={Math.ceil(uRS.recordCount / uRS.pageSizeValue)} handleChangePage={uRS.setPageNumber} />
                  </CardFooter>
                  <BusyBlock iAmBusy={API_GetAllOrders.loading} />
                </Card>
              }
            </SafeBox>
          </div>
        </Row>
      </Container>
    </>
  );
};
// Disable SSR for order page to avoid scheduler/performance.now() errors
const OrderWithNoSSR = dynamic(() => Promise.resolve(Order), { ssr: false });
OrderWithNoSSR.layout = Admin;
OrderWithNoSSR.permissionCheck = "permissionOrders";

export default OrderWithNoSSR;

