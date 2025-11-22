import React, { useEffect, useState } from "react";
import dynamic from "next/dynamic";

import useApi from "@/api/hooks/apihook";
import Admin from "@/layouts/Admin";
import orderFunctions from "@/api/orders";
import bookingFunctions from "@/api/bookings";
// core components
import SimpleHeader from "components/Headers/SimpleHeader.js";
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

import { MyPagination } from "utils/pagination"
import { SafeBox, validateData, BusyBlock, BusyBlockAUtoHeight } from "@/api/hooks/apiutils";
import useReport, { ReportHeader } from "@/api/hooks/useReport";
import Select from 'react-select'

import { BookingRow } from "components/custom_components/bookings";

const Booking = () => {
  const API_GetAllBookings = useApi(bookingFunctions.getAllBookings);
  const [bookings, setBookings] = useState([]);
  const [quantityUpdate, setQuantityUpdate] = useState(false);
  
  const uRS = useReport(); //useReportStates
  const statusValues = [{ caption: "--All--", color: "" }, { caption: "Pending", color: "warning" }, { caption: "Contacted", color: "primary" }, { caption: "Rejected", color: "danger" }, { caption: "Paid", color: "success" }];

  useEffect(() => {
    loadBookings();
  }, [quantityUpdate, uRS.sortValues, uRS.pageSizeValue, uRS.pageNumber]);

  const loadBookings = async () => {
    const sort = uRS.sortValues.sortCol ? `${uRS.sortValues.sortCol} ${uRS.sortValues.sortDir}` : null;
    const retVal = await API_GetAllBookings.request(uRS.filterValues, sort, uRS.pageSizeValue, uRS.pageNumber);
    
    if (retVal.ok && retVal.data) {
      setQuantityUpdate(false);
      setBookings(retVal.data.requestedData?.Bookings || []);
      if (retVal.data.requestedData?.BookingsCount?.[0]?.numrows) {
        uRS.setRecordCount(retVal.data.requestedData.BookingsCount[0].numrows);
      }
    }
  };

  const sortClick = (column) => {
    uRS.setSortValues({ sortCol: column, sortDir: (uRS.sortValues.sortCol == column) ? "desc" : "asc" })
  }

  return (
    <>
      <SimpleHeader name="Bookings" parentName="Masters" parentUrl="/" >
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
                        <label className="form-control-label" htmlFor="exampleFormControlInput1"> Booking Date</label>
                        <InputGroup>
                          <Input type="date" value={uRS.filterValues.datefrom} onChange={e => { uRS.setFilterValues({ ...uRS.filterValues, datefrom: e.target.value }); }} />
                          <Input type="date" value={uRS.filterValues.dateto} onChange={e => { uRS.setFilterValues({ ...uRS.filterValues, dateto: e.target.value }); }} />
                        </InputGroup>
                      </FormGroup>
                    </Col>
                    <Col md="3">
                      <FormGroup>
                        <label className="form-control-label" htmlFor="exampleFormControlSelect1"> Booking Status </label>
                        <Select options={statusValues.map((statusValue, index) => ({ value: index, label: statusValue.caption }))} value={statusValues.map((statusValue, index) => { if (uRS.filterValues.status == index) { return { value: index, label: statusValue.caption } } })} onChange={val => { uRS.setFilterValues({ ...uRS.filterValues, status: val.value }); }} />
                      </FormGroup>
                    </Col>

                    <Col md="3">
                      <FormGroup>
                        <label className="form-control-label" htmlFor="exampleFormControlInput1">&nbsp;</label>
                        <Button className="my-4 btn-md" color="dark" type="button" onClick={() => { (uRS.pageNumber == 1) && loadBookings() || uRS.setPageNumber("1") }}> Filter </Button>
                      </FormGroup>
                    </Col>
                  </Row>

                </CardBody>
              </Card>
            </Collapse>

            <SafeBox objectApi={API_GetAllBookings} lengthCheckObject={"Bookings"} firstTimeOnly={true} noDataMessage="No Bookings found!"  >
              {validateData(API_GetAllBookings, "Bookings", true) &&
                <Card style={{ position: "relative" }}>
                  <ReportHeader uRS={uRS}>Bookings</ReportHeader>
                  <Table className="align-items-center table-flush" responsive>
                    <thead className="thead-light">
                      <tr>
                        <th className={`sort ${(uRS.sortValues.sortCol == "") ? 'active' : ''}`} data-sort="budget" scope="col" onClick={() => sortClick('')}> Book ID </th>
                        <th className={`sort ${(uRS.sortValues.sortCol == "BP.bookedOn") ? 'active' : ''}`} data-sort="status" scope="col" onClick={() => sortClick('BP.bookedOn')}> Book Date </th>
                        <th className={`sort ${(uRS.sortValues.sortCol == "CUS.customerName") ? 'active' : ''}`} data-sort="completion" scope="col" onClick={() => sortClick('CUS.customerName')}> Customer Name </th>
                        <th className={`sort ${(uRS.sortValues.sortCol == "BP.quantity") ? 'active' : ''}`} data-sort="completion" scope="col" onClick={() => sortClick('BP.quantity')}> Total Qty (KG)</th>
                        <th className={`sort ${(uRS.sortValues.sortCol == "BP.payableAmount") ? 'active' : ''}`} data-sort="completion" scope="col" onClick={() => sortClick('BP.payableAmount')}> Grand Total </th>
                        <th className={`sort ${(uRS.sortValues.sortCol == "BP.status") ? 'active' : ''}`} data-sort="completion" scope="col" onClick={() => sortClick('BP.status')}> Book Status </th>
                        <th className={`sort ${(uRS.sortValues.sortCol == "BP.statusOn") ? 'active' : ''}`} data-sort="completion" scope="col" onClick={() => sortClick('BP.statusOn')}> Book Status on </th>
                        <th scope="col" />
                      </tr>
                    </thead>
                    <tbody className="list">
                      {(bookings.length > 0) &&
                        bookings.map((booking, index) => (
                          <BookingRow setQuantityUpdate={setQuantityUpdate} booking={booking} statusValues={statusValues} bookings={bookings} setBookings={setBookings} key={index} />
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
                  <BusyBlock iAmBusy={API_GetAllBookings.loading} />
                </Card>
              }
            </SafeBox>
          </div>
        </Row>
      </Container>
    </>
  );
};
// Force dynamic rendering - prevent static generation during build
export async function getServerSideProps() {
  return {
    props: {},
  };
}

const BookingWithNoSSR = dynamic(() => Promise.resolve(Booking), { ssr: false });
BookingWithNoSSR.layout = Admin;
BookingWithNoSSR.permissionCheck = "permissionOrders";
export default BookingWithNoSSR;

