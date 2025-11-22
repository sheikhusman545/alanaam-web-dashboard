import React, { useEffect, useState } from "react";
// Using Font Awesome icons instead of Material-UI to avoid SSR issues
// import { Visibility } from "@mui/icons-material";
import Select from 'react-select';

import {
    Badge,
    Button,
    Card,
    CardHeader,
    Media,
    Modal,
    Table,
    Row,
    Col,
    CardBody,
    UncontrolledDropdown, DropdownToggle, DropdownMenu, DropdownItem
} from "reactstrap";
// core components 

import { imagePath } from "@/api/config/config";
import { BusyBlockAUtoHeight } from "@/api/hooks/apiutils";

import bookingFunctions from "@/api/bookings";
import useApi from "@/api/hooks/apihook";
import { amountFormat } from "utils/utils";


export const BookingRow = ({ setQuantityUpdate, booking, statusValues, bookings, setBookings }) => {
    const [modalShow_ViewBooking, setmodalShow_ViewBooking] = useState(false);
    const [status, setStatus] = useState(null);
    const [choosenBookingId, setChoosenBookingId] = useState(null);
    const [newquantity, setNewquantity] = useState(booking.quantity);

    const API_ChangeStatus = useApi(bookingFunctions.statusChange);

    const changeStatusstatusValues = async (newStatus) => {
        const retVal = await API_ChangeStatus.request(booking.bookID, newStatus);
        if (retVal.ok) {
            setBookings(bookings.map(booking_ => { if (booking_.bookID != booking.bookID) { return booking_; } else { return ({ ...booking, status: newStatus }) } }))
        }
    }


    // const  = [{ value: "Pending", status: "1" }, { value: "Approved", status: "2" }, { value: "Rejected", status: "3" }, { value: "Processed", status: "4" }, { value: "Shipped", status: "5" }, { value: "Delivered", status: "6" },];


    return (
        <>
            <tr>
                <td className="budget">
                    <span>{booking.bookID}</span>
                </td>
                <td className="budget">
                    <span>{booking.bookedOn}</span>
                </td>
                <td className="budget">
                    <span> {booking.customerName == null || booking.customerName == "" ? "Guest" : booking.customerName} </span>
                </td>
                <td className="budget">
                    <span>{newquantity}</span>
                </td>
                <td className="budget">
                    <span>{amountFormat(booking.orderTotal)}</span>
                </td>
                <td className="budget">
                    <UncontrolledDropdown >
                        <DropdownToggle caret color={statusValues[booking.status].color}                        >
                            {statusValues[booking.status].caption}
                        </DropdownToggle>
                        <DropdownMenu >
                            {(statusValues.map((statusValue, index) => (<DropdownItem onClick={() => { changeStatusstatusValues(index) }} key={statusValue.caption} >{statusValue.caption}</DropdownItem>)))}
                        </DropdownMenu>
                    </UncontrolledDropdown>
                </td>
                <td className="budget">
                    <span>{booking.statusOn}</span>
                </td>

                <td className="text-right">
                    <Button className="btn-icon-only" color="secondary" type="button">
                        <span
                            className="btn-inner--icon"
                            onClick={() => {
                                setmodalShow_ViewBooking(true);
                                setChoosenBookingId(booking.bookID);
                            }}
                        >
                            <i className="fas fa-eye" />
                        </span>
                    </Button>
                </td>
            </tr>
            {modalShow_ViewBooking && (
                <Modal_ViewBookingProducts
                    setQuantityUpdate={setQuantityUpdate}
                    modalIsOpen={modalShow_ViewBooking}
                    setModalIsOpen={setmodalShow_ViewBooking}
                    choosenBookingId={choosenBookingId}
                    statusValues={statusValues}
                    newquantity={newquantity}
                    setNewquantity={setNewquantity}
                />
            )}
        </>
    );
};

export const Modal_ViewBookingProducts = ({
    setQuantityUpdate,
    modalIsOpen,
    setModalIsOpen,
    choosenBookingId,
    statusValues,
    newquantity,
    setNewquantity,
}) => {
    const [booking, setBookings] = useState([]);
    const [editQuantity, setEditQuantity] = useState(false);

    const API_GetBookingsByID = useApi(bookingFunctions.getBookingByID);
    const API_updateBookingQuantity = useApi(bookingFunctions.updateBookingQuantity);

    const loadBookingByID = async () => {
        let retVal = await API_GetBookingsByID.request(choosenBookingId);
        if (retVal.ok) {
            setNewquantity(retVal.requestedData.Booking[0]?.quantity);
            setBookings(retVal.requestedData.Booking[0]);
        }
    };

    useEffect(() => {

        loadBookingByID();
    }, []);

    const handle_quantitySubmit = async () => {
        let retVal = await API_updateBookingQuantity.request(choosenBookingId, newquantity);
        if (retVal.ok) {
            setQuantityUpdate(true);
            setBookings(retVal.requestedData.Booking[0]);
            setEditQuantity(!editQuantity)
        }
    };
    // console.log('newquantity', booking.quantity);
    return (
        <Modal className="modal-dialog-centered" size="lg" isOpen={modalIsOpen} toggle={() => { setModalIsOpen(!modalIsOpen); }}    >
            <div className="modal-body p-0">
                <Card className="bg-secondary border-0 mb-0 relative">
                    <CardHeader className="bg-light">
                        <div className="h2 text-center mt-2 mb-3">Booking Details</div>
                    </CardHeader>
                    <CardBody className="px-lg-5">
                        <Row>
                            <Col>
                                <Table>
                                    <tbody>
                                        <tr>
                                            <th> <h3>Booking Details</h3></th>
                                        </tr>
                                        <tr>
                                            <th>customerName</th>
                                            <td>
                                                {booking.customerName == null || booking.customerName == "" ? "Guest" : booking.customerName}
                                            </td>
                                        </tr>
                                        <tr>
                                            <th>customerEmail</th>
                                            <td>{booking.customerEmail || booking.emailID}</td>
                                        </tr>
                                        <tr>
                                            <th>customerMobile</th>
                                            <td>
                                                <div className="">
                                                    <div className="">
                                                        {booking.phoneNo}
                                                    </div>
                                                    <div className="">
                                                        {booking.customerMobile}
                                                    </div>
                                                </div>
                                            </td>
                                        </tr>
                                        <tr>
                                            <th>Booked On</th>
                                            <td>{booking.bookedOn}</td>
                                        </tr>
                                        <tr>
                                            <th>DeliveryMethod</th>
                                            <td>{booking.deliveryMethod}</td>
                                        </tr>
                                        <tr>
                                            <th>DeliveryTime</th>
                                            <td>{booking.deliveryTime}</td>
                                        </tr>
                                        <tr>
                                            <th> booking Status</th>
                                            <td>{booking.status && statusValues[booking.status].caption}</td>
                                        </tr>
                                        <tr>
                                            <th>Booking Status On</th>
                                            <td>{booking.statusOn}</td>
                                        </tr>
                                    </tbody>
                                </Table>
                            </Col>
                            <Col>
                                <Table>
                                    <tbody>
                                        <tr>
                                            <th> <h3>Booking Summary</h3></th>
                                        </tr>
                                        <tr>
                                            <th>Quantity (KG)</th>
                                            <td>
                                                <div className="">
                                                    {!editQuantity &&
                                                        <div className="quantity-change">
                                                            {booking.quantity}
                                                            <div className="quantity-edit" onClick={() => setEditQuantity(!editQuantity)}>Edit</div>
                                                        </div>
                                                        ||
                                                        <div className="input-with-button-container" >
                                                            <input
                                                                type="number"
                                                                defaultValue={newquantity}
                                                                onChange={(event) => setNewquantity(event.target.value)}
                                                                placeholder="Enter new quantity"
                                                                autoFocus={Boolean(newquantity)}
                                                            />
                                                            <button className="cancel-button" onClick={() => setEditQuantity(!editQuantity)}>Cancel</button>
                                                            <button className="submit-button" onClick={handle_quantitySubmit}>Submit</button>
                                                        </div>
                                                    }
                                                </div>
                                            </td>
                                        </tr>
                                        <tr>
                                            <th>Shipping Charge</th>
                                            <td>{booking.shippingCharge}</td>
                                        </tr>
                                        <tr>
                                            <th>PayableAmount</th>
                                            <td>{booking.payableAmount}</td>
                                        </tr>
                                        <tr>
                                            <th>Order Total Amount</th>
                                            <td>{booking.orderTotal}</td>
                                        </tr>
                                    </tbody>
                                </Table>
                            </Col>
                        </Row>
                    </CardBody>
                    <BusyBlockAUtoHeight iAmBusy={API_GetBookingsByID.loading} />
                </Card>

                <Card className=" relative">
                    <CardBody>
                        <Row>
                            <div className="col">
                                <Card>
                                    <CardHeader className="bg-light border-0">
                                        <h3 className="mb-0">Product List</h3>
                                    </CardHeader>
                                    <Table className="align-items-center table-flush" responsive >
                                        <thead className="thead-dark">
                                            <tr>
                                                <th> Image </th>
                                                <th> ProductName </th>
                                                <th> Quantity(KG) </th>
                                                <th> Sl.Charge </th>
                                                <th>Total Amount </th>
                                                <th> Booking Total </th>
                                            </tr>
                                        </thead>
                                        <tbody className="list">
                                            <ViewProductList product={booking} />
                                        </tbody>
                                    </Table>
                                </Card>

                                <Card className="card-pricing border-0  mb-4">
                                    <CardHeader className="bg-light  border-0">
                                        <h3 className="mb-0"> Delivery Address</h3>
                                    </CardHeader>
                                    <CardBody>
                                        <div>
                                            <Row>
                                                <Col>
                                                    <Table>
                                                        <tbody>
                                                            <tr>
                                                                <th>Name</th>
                                                                <td>{booking.customerName}</td>
                                                            </tr>
                                                            <tr>
                                                                <th>Email ID</th>
                                                                <td>{booking.emailID}</td>
                                                            </tr>
                                                            <tr>
                                                                <th>Mobile Number</th>
                                                                <td>{booking.phoneNo}</td>
                                                            </tr>
                                                        </tbody>
                                                    </Table>
                                                </Col>
                                                <Col>
                                                    <Table>
                                                        <tbody>
                                                            <tr>
                                                                <th>Address Type</th>
                                                                <td>{booking.addressType}</td>
                                                            </tr>
                                                            <tr>
                                                                <th>Building Name_No</th>
                                                                <td>{booking.buildingName_No}</td>
                                                            </tr>
                                                            <tr>
                                                                <th>zoneNo</th>
                                                                <td>{booking.zoneNo}</td>
                                                            </tr>
                                                            <tr>
                                                                <th>StreetName No</th>
                                                                <td>{booking.streetName_No}</td>
                                                            </tr>
                                                            <tr>
                                                                <th>Land Mark</th>
                                                                <td>{booking.landMark}</td>
                                                            </tr>
                                                            <tr>
                                                                <th>city</th>
                                                                <td>{booking.city}</td>
                                                            </tr>
                                                        </tbody>
                                                    </Table>
                                                </Col>
                                            </Row>
                                        </div>
                                    </CardBody>
                                </Card>

                            </div>
                        </Row>
                        <Row>
                            <Col md="12" className="text-right">
                                <Button color="default" type="button" onClick={() => setModalIsOpen(false)}> Close </Button>
                            </Col>
                        </Row>
                    </CardBody>
                    <BusyBlockAUtoHeight iAmBusy={API_GetBookingsByID.loading} />
                </Card>
            </div>
        </Modal>
    );
};
const ViewProductList = ({ product }) => {

    return (
        <tr >
            <td>
                <Media className="align-items-center">
                    <a className="avatar rounded-circle mr-3" href="#pablo" onClick={(e) => e.preventDefault()} >
                        <img alt="..." src={imagePath + product.mainImageUrl} />
                    </a>
                </Media>
            </td>
            <td>
                <span>{product.en_ProductName}</span>
            </td>
            <td>
                <span>{product.quantity}</span>
            </td>

            <td>
                <span>{product.slaughterCharge}</span>
            </td>
            <td>
                <span>{product.payableAmount}</span>
            </td>
            <td>
                <span>{product.orderTotal}</span>
            </td>
        </tr>
    )
}
