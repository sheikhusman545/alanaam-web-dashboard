import React, { createRef, useEffect, useState } from "react";
// Using Font Awesome icons instead of Material-UI to avoid SSR issues
// import { Visibility, GetApp } from "@mui/icons-material";
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
  UncontrolledDropdown,
  DropdownToggle,
  DropdownMenu,
  DropdownItem,
} from "reactstrap";
import {
  PDFDownloadLink,
  Page,
  Text,
  View,
  Document,
  StyleSheet,
  PDFViewer,
  Image,
} from "@react-pdf/renderer";
// core components

import { amountFormat } from "utils/utils";
import { SingleOrderExcelExport } from "./excelexport";
import { getStoreStatusText } from "utils/constantArrays";

import { imagePath } from "@/api/config/config";
import { SafeBox, validateData, BusyBlockAUtoHeight } from "@/api/hooks/apiutils";
import orderFunctions from "@/api/orders";
import useApi from "@/api/hooks/apihook";
import { SingleOrdersDetailsPDFDownload } from "./pdfdownload";
import { paymentStatusValues } from "../../utils/constantArrays";

export const OrderRow = ({ order, statusValues, orders, setOrders }) => {
  const _exporter = createRef();

  const [modalShow_Vieworder, setmodalShow_Vieworder] = useState(false);
  const [status, setStatus] = useState(null);
  const [excelModal, setExcelModal] = useState(false);
  const [choosenOrderId, setChoosenOrderId] = useState(null);

  const API_ChangeStatus = useApi(orderFunctions.statusChange);

  const changeStatusstatusValues = async (newStatus) => {
    const retVal = await API_ChangeStatus.request(order.orderID, newStatus);
    if (retVal.ok) {
      setOrders(
        orders.map((order_) => {
          if (order_.orderID != order.orderID) {
            return order_;
          } else {
            return { ...order, cartStatus: newStatus };
          }
        })
      );
    }
  };

  // const  = [{ value: "Pending", status: "1" }, { value: "Approved", status: "2" }, { value: "Rejected", status: "3" }, { value: "Processed", status: "4" }, { value: "Shipped", status: "5" }, { value: "Delivered", status: "6" },];

  const excelExport = () => {
    if (_exporter.current) {
      _exporter.current.save();
    }
  };

  return (
    <>
      <tr>
        <td className="budget">
          <span>{order.orderID}</span>
        </td>
        <td className="budget">
          <span>{order.orderDate}</span>
        </td>
        <td className="budget">
          <span>
            {" "}
            {order.customerName == null || order.customerName == ""
              ? "Guest"
              : order.customerName}{" "}
          </span>
        </td>
        <td className="budget">
          <span>{order.totalProductsQuantity}</span>
        </td>
        <td className="budget">
          <span>{amountFormat(order.grantTotal)}</span>
        </td>
        <td className="budget">
          <UncontrolledDropdown>
            <DropdownToggle caret color={statusValues[order.cartStatus].color}>
              {statusValues[order.cartStatus].caption}
            </DropdownToggle>
            <DropdownMenu positionFixed={true}>
              {statusValues.map((statusValue, index) => (
                <DropdownItem
                  onClick={() => {
                    changeStatusstatusValues(index);
                  }}
                  key={statusValue.caption}
                >
                  {statusValue.caption}
                </DropdownItem>
              ))}
            </DropdownMenu>
          </UncontrolledDropdown>
        </td>
        <td className="budget">
          <span>{order.cartStatusOn}</span>
        </td>

        <td className="text-right">
          {/* <Button className="btn-icon-only" color="secondary" type="button" onClick={() => { excelExport() }}>

                        <i className="fas fa-download" />

                    </Button> */}
          <Button className="btn-icon-only" color="secondary" type="button">
            <span
              className="btn-inner--icon"
              onClick={() => {
                setExcelModal(true);
                setChoosenOrderId(order.orderID);
              }}
            >
              <i className="fas fa-download" />
            </span>
          </Button>
          {/* <SingleOrderExcelExport data={[order]} exportRef={_exporter} /> */}

          <Button className="btn-icon-only" color="secondary" type="button">
            <span
              className="btn-inner--icon"
              onClick={() => {
                setmodalShow_Vieworder(true);
                setChoosenOrderId(order.orderID);
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
      {excelModal && (
        <PDF_ExcelExport_Modal
          _exporter={_exporter}
          modalIsOpen={excelModal}
          setModalIsOpen={setExcelModal}
          choosenOrderId={choosenOrderId}
          statusValues={statusValues}
        />
      )}
    </>
  );
};

export const Modal_ViewOrderProducts = ({
  modalIsOpen,
  setModalIsOpen,
  choosenOrderId,
  statusValues,
}) => {
  const [order, setOrder] = useState({});
  const [orderProducts, setOrderProducts] = useState([]);
  const [orderDeliveryAddress, setOrderDeliveryAddress] = useState({});

  const API_GetOrdersByID = useApi(orderFunctions.getOrderByID);
  const loadOrderByID = async () => {
    if (!choosenOrderId) {
      console.error("No order ID provided");
      return;
    }
    try {
      let retVal = await API_GetOrdersByID.request(choosenOrderId);
      console.log("Order API Response:", retVal);
      
      if (!retVal) {
        console.error("No response from API");
        return;
      }
      
      if (!retVal.ok) {
        console.error("API request failed:", retVal);
        return;
      }
      
      if (!retVal.data) {
        console.error("No data in response:", retVal);
        return;
      }
      
      // The useApi hook returns: { ok: true, data: { respondStatus: "SUCCESS", requestedData: {...} } }
      const responseData = retVal.data;
      console.log("Response data:", responseData);
      
      // Try to find the order data in various possible locations
      let orderData = null;
      
      // Check structure: responseData.requestedData.Order[0]
      if (responseData?.requestedData?.Order && Array.isArray(responseData.requestedData.Order) && responseData.requestedData.Order.length > 0) {
        orderData = responseData.requestedData.Order[0];
        console.log("Found order data in requestedData.Order[0]");
      }
      // Check structure: responseData.Order[0]
      else if (responseData?.Order && Array.isArray(responseData.Order) && responseData.Order.length > 0) {
        orderData = responseData.Order[0];
        console.log("Found order data in Order[0]");
      }
      // Check if requestedData itself is the order object
      else if (responseData?.requestedData && typeof responseData.requestedData === 'object' && responseData.requestedData.orderID) {
        orderData = responseData.requestedData;
        console.log("Found order data in requestedData");
      }
      // Check if responseData itself is the order
      else if (responseData?.orderID) {
        orderData = responseData;
        console.log("Found order data in responseData");
      }
      
      if (orderData) {
        console.log("Setting order data:", orderData);
        setOrder(orderData);
        setOrderProducts(orderData.orderProducts || []);
        setOrderDeliveryAddress(
          orderData.OrderDeliveryAddresses?.[0] || orderData.orderDeliveryAddresses?.[0] || {}
        );
      } else {
        console.error("Order data not found in response. Full response:", retVal);
        console.error("Response data structure:", responseData);
        console.error("responseData.requestedData:", responseData?.requestedData);
      }
    } catch (error) {
      console.error("Error loading order:", error);
      console.error("Error stack:", error.stack);
    }
  };

  useEffect(() => {
    if (choosenOrderId && modalIsOpen) {
      loadOrderByID();
    }
  }, [choosenOrderId, modalIsOpen]);

  return (
    <Modal
      className="modal-dialog-centered"
      size="lg"
      isOpen={modalIsOpen}
      toggle={() => {
        setModalIsOpen(!modalIsOpen);
      }}
    >
      <div className="modal-body p-0">
        <Card className="bg-secondary border-0 mb-0 relative">
          <CardHeader className="bg-light">
            <div className="h2 text-center mt-2 mb-3">Order Details</div>
          </CardHeader>
          <CardBody className="px-lg-5">
            <Row>
              <Col>
                <Table>
                  <tbody>
                    <tr>
                      <th>
                        {" "}
                        <h3>Order Details</h3>
                      </th>
                    </tr>
                    <tr>
                      <th>Payment Type</th>
                      <td>{order.paymentType}</td>
                    </tr>
                    <tr>
                      <th>Payment Status</th>
                      <td>{paymentStatusValues[order.paymentStatus]?.caption}</td>
                    </tr>
                    <tr>
                      <th>customerName</th>
                      <td>
                        {order.customerName == null || order.customerName == ""
                          ? "Guest"
                          : order.customerName}
                      </td>
                    </tr>
                    <tr>
                      <th>customerEmail</th>
                      <td>{order.customerEmail}</td>
                    </tr>
                    <tr>
                      <th>customerMobile</th>
                      <td>{order.customerMobile}</td>
                    </tr>
                    <tr>
                      <th>orderDate</th>
                      <td>{order.orderDate}</td>
                    </tr>
                    <tr>
                      <th>DeliveryMethod</th>
                      <td>{order.DeliveryMethod}</td>
                    </tr>
                    <tr>
                      <th> DeliveryDate</th>
                      <td>{order.DeliveryDate}</td>
                    </tr>
                    <tr>
                      <th>DeliveryTime</th>
                      <td>{order.DeliveryTime}</td>
                    </tr>
                    <tr>
                      <th> Order Status</th>
                      <td>
                        {order.cartStatus &&
                          statusValues[order.cartStatus].caption}
                      </td>
                    </tr>
                    <tr>
                      <th>Order Status On</th>
                      <td>{order.cartStatusOn}</td>
                    </tr>
                  </tbody>
                </Table>
              </Col>
              <Col>
                <Table>
                  <tbody>
                    <tr>
                      <th>
                        {" "}
                        <h3>Order Summary</h3>
                      </th>
                    </tr>

                    <tr>
                      <th>totalProductsQuantity</th>
                      <td>{order.totalProductsQuantity}</td>
                    </tr>
                    <tr>
                      <th>totalProductPrice</th>
                      <td>{order.totalProductPrice}</td>
                    </tr>
                    <tr>
                      <th>shippingCharge</th>
                      <td>{order.shippingCharge}</td>
                    </tr>
                    <tr>
                      <th>shippingDiscount</th>
                      <td>{order.shippingDiscount}</td>
                    </tr>
                    <tr>
                      <th>couponDiscount</th>
                      <td>{order.couponDiscount}</td>
                    </tr>
                    <tr>
                      <th>otherDiscount</th>
                      <td>{order.otherDiscount}</td>
                    </tr>
                    <tr>
                      <th>grandTotal</th>
                      <td>{order.grantTotal}</td>
                    </tr>
                  </tbody>
                </Table>
              </Col>
            </Row>
          </CardBody>
          <BusyBlockAUtoHeight iAmBusy={API_GetOrdersByID.loading} />
        </Card>

        <Card className=" relative">
          <CardBody>
            <Row>
              <div className="col">
                <Card>
                  <CardHeader className="bg-light border-0">
                    <h3 className="mb-0">Product List</h3>
                  </CardHeader>
                  <Table className="align-items-center table-flush" responsive>
                    <thead className="thead-dark">
                      <tr>
                        <th> Image </th>
                        <th> ProductName </th>
                        <th> Quantity </th>
                        <th> Price </th>
                        <th> Sl.Charge </th>
                        <th> Amount </th>
                      </tr>
                    </thead>
                    <tbody className="list">
                      {orderProducts.length > 0 &&
                        orderProducts.map((product, index) => (
                          <ViewProductList
                            product={product}
                            key={index + product.productID}
                          />
                        ))}
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
                                <td>{orderDeliveryAddress.name}</td>
                              </tr>
                              <tr>
                                <th>emailID</th>
                                <td>{orderDeliveryAddress.emailID}</td>
                              </tr>
                              <tr>
                                <th>mobileNumber</th>
                                <td>{orderDeliveryAddress.mobileNumber}</td>
                              </tr>
                            </tbody>
                          </Table>
                        </Col>
                        <Col>
                          <Table>
                            <tbody>
                              <tr>
                                <th>AddressTypeName</th>
                                <td>{orderDeliveryAddress.AddressTypeName}</td>
                              </tr>
                              <tr>
                                <th>addressType</th>
                                <td>{orderDeliveryAddress.AddressTypeName}</td>
                              </tr>
                              <tr>
                                <th>buildingName_No</th>
                                <td>{orderDeliveryAddress.addressType}</td>
                              </tr>
                              <tr>
                                <th>zoneNo</th>
                                <td>{orderDeliveryAddress.zoneNo}</td>
                              </tr>
                              <tr>
                                <th>streetName_No</th>
                                <td>{orderDeliveryAddress.streetName_No}</td>
                              </tr>
                              <tr>
                                <th>landMark</th>
                                <td>{orderDeliveryAddress.landMark}</td>
                              </tr>
                              <tr>
                                <th>city</th>
                                <td>{orderDeliveryAddress.city}</td>
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
                <Button
                  color="default"
                  type="button"
                  onClick={() => setModalIsOpen(false)}
                >
                  {" "}
                  Close{" "}
                </Button>
              </Col>
            </Row>
          </CardBody>
          <BusyBlockAUtoHeight iAmBusy={API_GetOrdersByID.loading} />
        </Card>
      </div>
    </Modal>
  );
};
const ViewProductList = ({ product }) => {
  const attributes = JSON.parse(product.productAttributes);
  return (
    <tr>
      <td>
        <Media className="align-items-center">
          <a
            className="avatar rounded-circle mr-3"
            href="#pablo"
            onClick={(e) => e.preventDefault()}
          >
            <img alt="..." src={imagePath + product.mainImageUrl} />
          </a>
        </Media>
      </td>
      <td>
        <span>{product.en_ProductName}</span>
        <br />
        {attributes &&
          Array.isArray(attributes) &&
          attributes.length > 0 &&
          attributes.map((attribute) => (
            <span>
              {attribute.en_atributeName} : {attribute.items.en_itemName}
            </span>
          ))}
      </td>
      <td>
        <span>{product.productQuantity}</span>
      </td>
      <td>
        <span>{product.productPrice}</span>
      </td>
      <td>
        <span>{product.SlaughterCharge}</span>
      </td>
      <td>
        <span>{product.productAmount}</span>
      </td>
    </tr>
  );
};

const PDF_ExcelExport_Modal = ({
  modalIsOpen,
  setModalIsOpen,
  choosenOrderId,
}) => {
  const [singleOrderToExcel, setSingleOrderToExcel] = useState([]);

  const API_GetOrdersByID = useApi(orderFunctions.getOrderByID);
  const loadOrderByID = async () => {
    if (!choosenOrderId) {
      console.error("No order ID provided");
      return;
    }
    try {
      let retVal = await API_GetOrdersByID.request(choosenOrderId);
      console.log("PDF Export - Order API Response:", retVal);
      
      if (!retVal || !retVal.ok || !retVal.data) {
        console.error("PDF Export - Invalid API response:", retVal);
        return;
      }
      
      // The useApi hook returns: { ok: true, data: { respondStatus: "SUCCESS", requestedData: {...} } }
      const responseData = retVal.data;
      
      // Try to find OrdersWithProducts in various possible locations
      let ordersWithProducts = null;
      
      // Check structure: responseData.requestedData.OrdersWithProducts
      if (responseData?.requestedData?.OrdersWithProducts && Array.isArray(responseData.requestedData.OrdersWithProducts)) {
        ordersWithProducts = responseData.requestedData.OrdersWithProducts;
        console.log("PDF Export - Found OrdersWithProducts in requestedData.OrdersWithProducts");
      }
      // Check structure: responseData.OrdersWithProducts
      else if (responseData?.OrdersWithProducts && Array.isArray(responseData.OrdersWithProducts)) {
        ordersWithProducts = responseData.OrdersWithProducts;
        console.log("PDF Export - Found OrdersWithProducts in OrdersWithProducts");
      }
      // Fallback: try to use Order array if OrdersWithProducts doesn't exist
      else if (responseData?.requestedData?.Order && Array.isArray(responseData.requestedData.Order) && responseData.requestedData.Order.length > 0) {
        ordersWithProducts = responseData.requestedData.Order;
        console.log("PDF Export - Using Order array as fallback");
      }
      
      if (ordersWithProducts && ordersWithProducts.length > 0) {
        setSingleOrderToExcel(
          ordersWithProducts.map(
            (order) => ({
              ...order,
              OrderStatus: getStoreStatusText(order.cartStatus),
              customerName:
                order.customerName == null || order.customerName == ""
                  ? "Guest"
                  : order.customerName,
            })
          )
        );
      } else {
        console.error("PDF Export - OrdersWithProducts not found in response. Full response:", retVal);
        setSingleOrderToExcel([]);
      }
    } catch (error) {
      console.error("PDF Export - Error loading order:", error);
      setSingleOrderToExcel([]);
    }
  };

  useEffect(() => {
    if (choosenOrderId && modalIsOpen) {
      loadOrderByID();
    }
  }, [choosenOrderId, modalIsOpen]);

  const _exporter = createRef();

  const excelExport = () => {
    if (_exporter.current) {
      _exporter.current.save();
    }
  };

  return (
    <Modal
      className="modal-dialog-centered"
      size="sm"
      isOpen={modalIsOpen}
      toggle={() => {
        setModalIsOpen(!modalIsOpen);
      }}
    >
      <div className="modal-body p-0">
        <Card className="bg-secondary border-0 mb-0 relative">
          <CardHeader className="bg-light">
            <div className="h2 text-center mt-2 mb-3"> Excel Export</div>
          </CardHeader>
          <SafeBox
            objectApi={API_GetOrdersByID}
            lengthCheckObject={"Order"}
            firstTimeOnly={true}
            noDataMessage="No Order found!"
          >
            {validateData(API_GetOrdersByID, "Order", true) && (
              <CardBody className="px-lg-5">
                {/* <Button className="btn-icon-only" color="secondary" type="button" >
                                    <i className="fas fa-download" />
                                </Button> */}
                <Button
                  className="btn-neutral"
                  color="default"
                  size="sm"
                  style={{ marginRight: "1rem" }}
                  onClick={excelExport}
                >
                  Excel Export{" "}
                </Button>
                <SingleOrderExcelExport
                  data={singleOrderToExcel}
                  exportRef={_exporter}
                />
                {/* <PDFViewer>
                  <SingleOrdersDetailsPDFDownload orderData={singleOrderToExcel} />
                </PDFViewer> */}
                <PDFDownloadLink
                  document={
                    <SingleOrdersDetailsPDFDownload
                      orderData={singleOrderToExcel}
                    />
                  }
                  fileName="Orders.pdf"
                >
                  {({ blob, url, loading, error }) =>
                    loading ? (
                      <Button className="btn-neutral" color="default" size="sm">
                        {" "}
                        Loading document...
                      </Button>
                    ) : (
                      <Button
                        className="btn-neutral"
                        color="default"
                        size="sm"
                        style={{ marginRight: "1rem" }}
                      >
                        Download PDF{" "}
                      </Button>
                    )
                  }
                </PDFDownloadLink>
              </CardBody>
            )}
          </SafeBox>
        </Card>
        <Row>
          <Col md="12" className="text-right">
            <Button
              color="default"
              type="button"
              onClick={() => setModalIsOpen(false)}
            >
              {" "}
              Close{" "}
            </Button>
          </Col>
        </Row>
      </div>
    </Modal>
  );
};
