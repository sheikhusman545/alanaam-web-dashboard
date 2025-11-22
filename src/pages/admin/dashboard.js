/*!

=========================================================
* NextJS Argon Dashboard PRO - v1.0.0
=========================================================

* Product Page: https://www.creative-tim.com/product/nextjs-argon-dashboard-pro
* Copyright 2020 Creative Tim (https://www.creative-tim.com)

* Coded by Creative Tim

=========================================================

* The above copyright notice and this permission notice shall be included in all copies or substantial portions of the Software.

*/
import React, { useState, useEffect } from "react";
import dynamic from "next/dynamic";
// node.js library that concatenates classes (strings)
import classnames from "classnames";
// Modern chart library - will be loaded dynamically in useEffect to avoid SSR issues
// reactstrap components
import {
  Badge,
  Card,
  CardHeader,
  CardBody,
  DropdownMenu,
  DropdownItem,
  DropdownToggle,
  UncontrolledDropdown,
  Media,
  NavItem,
  NavLink,
  Nav,
  Progress,
  Table,
  Container,
  Row,
  Col,
} from "reactstrap";

// layout for this page
import Admin from "@/layouts/Admin";
// core components
import CardsHeader from "components/Headers/CardsHeader.js";

import orderFunctions from "@/api/orders";
import useApi from "@/api/hooks/apihook";
import { SafeBox, validateData, BusyBlock, BusyBlockAUtoHeight } from "@/api/hooks/apiutils";
import { OrderRow } from "components/custom_components/orders";

// Chart data
const monthlyData = [
  { month: "May", sales: 0 },
  { month: "Jun", sales: 20 },
  { month: "Jul", sales: 10 },
  { month: "Aug", sales: 30 },
  { month: "Sep", sales: 15 },
  { month: "Oct", sales: 40 },
  { month: "Nov", sales: 20 },
  { month: "Dec", sales: 60 },
];

const weeklyData = [
  { month: "May", sales: 0 },
  { month: "Jun", sales: 20 },
  { month: "Jul", sales: 5 },
  { month: "Aug", sales: 25 },
  { month: "Sep", sales: 10 },
  { month: "Oct", sales: 30 },
  { month: "Nov", sales: 15 },
  { month: "Dec", sales: 40 },
];

const ordersData = [
  { month: "Jan", orders: 20 },
  { month: "Feb", orders: 30 },
  { month: "Mar", orders: 25 },
  { month: "Apr", orders: 35 },
  { month: "May", orders: 40 },
  { month: "Jun", orders: 45 },
];

const Dashboard = () => {
  const [activeNav, setActiveNav] = useState(1);
  const [ChartLib, setChartLib] = useState(null);
  const statusValues = [
    { caption: "--All--", color: "" },
    { caption: "Pending", color: "danger" },
    { caption: "Approved", color: "primary" },
    { caption: "Rejected", color: "default" },
    { caption: "Processed", color: "warning" },
    { caption: "Shipped", color: "info" },
    { caption: "Delivered", color: "success" },
  ];

  const API_GetAllOrders = useApi(orderFunctions.getAllOrders);
  const [orders, setOrders] = useState([]);

  useEffect(() => {
    loadOrders();
    // Load recharts only on client side
    import("recharts").then((mod) => {
      setChartLib({
        LineChart: mod.LineChart,
        Line: mod.Line,
        BarChart: mod.BarChart,
        Bar: mod.Bar,
        XAxis: mod.XAxis,
        YAxis: mod.YAxis,
        CartesianGrid: mod.CartesianGrid,
        Tooltip: mod.Tooltip,
        Legend: mod.Legend,
        ResponsiveContainer: mod.ResponsiveContainer,
      });
    });
  }, []);

  const toggleNavs = (e, index) => {
    e.preventDefault();
    setActiveNav(index);
  };

  const loadOrders = async () => {
    const retVal = await API_GetAllOrders.request({}, 'OM.orderDate desc', 10, 1);
    if (retVal.ok && retVal.data) {
      setOrders(retVal.data.requestedData?.Orders || []);
    }
  };

  const chartData = activeNav === 1 ? monthlyData : weeklyData;
  
  // Extract chart components for easier use
  const {
    LineChart,
    Line,
    BarChart,
    Bar,
    XAxis,
    YAxis,
    CartesianGrid,
    Tooltip,
    Legend,
    ResponsiveContainer,
  } = ChartLib || {};

  return (
    <>
      <CardsHeader name="Admin" parentName="Dashboards" />
      <Container className="mt--6" fluid>
        <Row>
          <Col xl="8">
            <Card>
              <CardHeader className="bg-transparent">
                <Row className="align-items-center">
                  <div className="col">
                    <h6 className="text-light text-uppercase ls-1 mb-1">Overview</h6>
                    <h5 className="h3 mb-0">Sales value</h5>
                  </div>
                  <div className="col">
                    <Nav className="justify-content-end" pills>
                      <NavItem className="mr-2 mr-md-0">
                        <NavLink
                          className={classnames("py-2 px-3", {
                            active: activeNav === 1,
                          })}
                          href="#pablo"
                          onClick={(e) => toggleNavs(e, 1)}
                        >
                          <span className="d-none d-md-block">Month</span>
                          <span className="d-md-none">M</span>
                        </NavLink>
                      </NavItem>
                      <NavItem>
                        <NavLink
                          className={classnames("py-2 px-3", {
                            active: activeNav === 2,
                          })}
                          data-toggle="tab"
                          href="#pablo"
                          onClick={(e) => { toggleNavs(e, 2) }}
                        >
                          <span className="d-none d-md-block">Week</span>
                          <span className="d-md-none">W</span>
                        </NavLink>
                      </NavItem>
                    </Nav>
                  </div>
                </Row>
              </CardHeader>
              <CardBody>
                <div className="chart" style={{ height: "300px" }}>
                  {ChartLib && ResponsiveContainer && LineChart ? (
                    <ResponsiveContainer width="100%" height="100%">
                      <LineChart data={chartData}>
                        <CartesianGrid strokeDasharray="3 3" stroke="#34495e" />
                        <XAxis 
                          dataKey="month" 
                          stroke="#94a3b8"
                          style={{ fontSize: "12px" }}
                        />
                        <YAxis 
                          stroke="#94a3b8"
                          style={{ fontSize: "12px" }}
                          tickFormatter={(value) => `$${value}k`}
                        />
                        <Tooltip 
                          contentStyle={{ 
                            backgroundColor: "#1e293b",
                            border: "1px solid #334155",
                            borderRadius: "6px",
                            color: "#fff"
                          }}
                          formatter={(value) => [`$${value}k`, "Sales"]}
                        />
                        <Legend />
                        <Line
                          type="monotone"
                          dataKey="sales"
                          stroke="#5e72e4"
                          strokeWidth={3}
                          dot={{ fill: "#5e72e4", r: 4 }}
                          activeDot={{ r: 6 }}
                        />
                      </LineChart>
                    </ResponsiveContainer>
                  ) : (
                    <div style={{ height: "100%", display: "flex", alignItems: "center", justifyContent: "center" }}>
                      Loading chart...
                    </div>
                  )}
                </div>
              </CardBody>
            </Card>
          </Col>
          <Col xl="4">
            <Card>
              <CardHeader className="bg-transparent">
                <Row className="align-items-center">
                  <div className="col">
                    <h6 className="text-uppercase text-muted ls-1 mb-1">Performance</h6>
                    <h5 className="h3 mb-0">Total orders</h5>
                  </div>
                </Row>
              </CardHeader>
              <CardBody>
                <div className="chart" style={{ height: "300px" }}>
                  {ChartLib && ResponsiveContainer && BarChart ? (
                    <ResponsiveContainer width="100%" height="100%">
                      <BarChart data={ordersData}>
                        <CartesianGrid strokeDasharray="3 3" stroke="#34495e" />
                        <XAxis 
                          dataKey="month" 
                          stroke="#94a3b8"
                          style={{ fontSize: "12px" }}
                        />
                        <YAxis 
                          stroke="#94a3b8"
                          style={{ fontSize: "12px" }}
                        />
                        <Tooltip 
                          contentStyle={{ 
                            backgroundColor: "#1e293b",
                            border: "1px solid #334155",
                            borderRadius: "6px",
                            color: "#fff"
                          }}
                        />
                        <Legend />
                        <Bar dataKey="orders" fill="#5e72e4" radius={[8, 8, 0, 0]} />
                      </BarChart>
                    </ResponsiveContainer>
                  ) : (
                    <div style={{ height: "100%", display: "flex", alignItems: "center", justifyContent: "center" }}>
                      Loading chart...
                    </div>
                  )}
                </div>
              </CardBody>
            </Card>
          </Col>
        </Row>
        <Row>
          <Col xl="12">
            <Row>
              <div className="col">
                <Card>
                  <CardHeader className="border-0">
                    <h3 className="mb-0">Recent Orders</h3>
                  </CardHeader>
                  <Table className="align-items-center table-flush" responsive>
                    <thead className="thead-light">
                      <tr>
                        <th> Order ID </th>
                        <th> Order Date </th>
                        <th> Customer Name </th>
                        <th> Total Qty </th>
                        <th> Grand Total </th>
                        <th> Order Status </th>
                        <th> Order Status on </th>
                        <th scope="col" />
                      </tr>
                    </thead>
                    <tbody className="list">
                      {(orders.length > 0) &&
                        orders.map((order, index) => (
                          <OrderRow order={order} statusValues={statusValues} key={index} />
                        )) || (
                          <tr>
                            <td>
                              <span>no orders found</span>
                            </td>
                          </tr>
                        )}
                    </tbody>
                  </Table>
                  <BusyBlock iAmBusy={API_GetAllOrders.loading} />
                </Card>
              </div>
            </Row>
          </Col>
        </Row>
      </Container>
    </>
  );
}

// Force dynamic rendering - this prevents static generation
// Using getServerSideProps to prevent static generation during build
export async function getServerSideProps() {
  return {
    props: {},
  };
}

const DashboardWithNoSSR = dynamic(
  () => Promise.resolve(Dashboard),
  { 
    ssr: false,
    loading: () => <div>Loading...</div>
  }
);
DashboardWithNoSSR.layout = Admin;

export default DashboardWithNoSSR;
