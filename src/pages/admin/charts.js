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
import React from "react";
// Modern chart library
import {
  LineChart,
  Line,
  BarChart,
  Bar,
  PieChart,
  Pie,
  Cell,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts";
// reactstrap components
import { Card, CardHeader, CardBody, Container, Row, Col } from "reactstrap";
// layout for this page
import Admin from "@/layouts/Admin";
// core components
import CardsHeader from "components/Headers/CardsHeader.js";

// Sample chart data
const salesData = [
  { month: "Jan", sales: 25 },
  { month: "Feb", sales: 20 },
  { month: "Mar", sales: 30 },
  { month: "Apr", sales: 22 },
  { month: "May", sales: 17 },
  { month: "Jun", sales: 29 },
];

const ordersData = [
  { month: "Jul", orders: 25 },
  { month: "Aug", orders: 20 },
  { month: "Sep", orders: 30 },
  { month: "Oct", orders: 22 },
  { month: "Nov", orders: 17 },
  { month: "Dec", orders: 29 },
];

const growthData = [
  { month: "Jan", value: 10 },
  { month: "Feb", value: 15 },
  { month: "Mar", value: 20 },
  { month: "Apr", value: 18 },
  { month: "May", value: 25 },
  { month: "Jun", value: 30 },
];

const usersData = [
  { name: "Desktop", value: 400 },
  { name: "Mobile", value: 300 },
  { name: "Tablet", value: 200 },
  { name: "Other", value: 100 },
];

const partnersData = [
  { name: "Google", value: 400 },
  { name: "Facebook", value: 300 },
  { name: "Twitter", value: 200 },
  { name: "LinkedIn", value: 100 },
];

const productData = [
  { name: "Product A", sales: 400, returns: 50 },
  { name: "Product B", sales: 300, returns: 40 },
  { name: "Product C", sales: 200, returns: 30 },
  { name: "Product D", sales: 278, returns: 25 },
  { name: "Product E", sales: 189, returns: 20 },
];

const COLORS = ["#5e72e4", "#f5365c", "#fb6340", "#ffd600", "#2dce89"];

const Charts = () => {
  return (
    <>
      <CardsHeader name="Charts" parentName="Charts" />
      <Container className="mt--6" fluid>
        <Row>
          <Col xl="6">
            <Card>
              <CardHeader>
                <h6 className="surtitle">Overview</h6>
                <h5 className="h3 mb-0">Total sales</h5>
              </CardHeader>
              <CardBody>
                <div className="chart" style={{ height: "300px" }}>
                  <ResponsiveContainer width="100%" height="100%">
                    <LineChart data={salesData}>
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
                </div>
              </CardBody>
            </Card>
          </Col>
          <Col xl="6">
            <Card>
              <CardHeader>
                <h6 className="surtitle">Performance</h6>
                <h5 className="h3 mb-0">Total orders</h5>
              </CardHeader>
              <CardBody>
                <div className="chart" style={{ height: "300px" }}>
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
                </div>
              </CardBody>
            </Card>
          </Col>
        </Row>
        <Row>
          <Col xl="6">
            <Card>
              <CardHeader>
                <h6 className="surtitle">Growth</h6>
                <h5 className="h3 mb-0">Sales value</h5>
              </CardHeader>
              <CardBody>
                <div className="chart" style={{ height: "300px" }}>
                  <ResponsiveContainer width="100%" height="100%">
                    <LineChart data={growthData}>
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
                      <Line
                        type="monotone"
                        dataKey="value"
                        stroke="#2dce89"
                        strokeWidth={3}
                        dot={{ fill: "#2dce89", r: 4 }}
                        activeDot={{ r: 6 }}
                      />
                    </LineChart>
                  </ResponsiveContainer>
                </div>
              </CardBody>
            </Card>
          </Col>
          <Col xl="6">
            <Card>
              <CardHeader>
                <h6 className="surtitle">Users</h6>
                <h5 className="h3 mb-0">Audience overview</h5>
              </CardHeader>
              <CardBody>
                <div className="chart" style={{ height: "300px" }}>
                  <ResponsiveContainer width="100%" height="100%">
                    <PieChart>
                      <Pie
                        data={usersData}
                        cx="50%"
                        cy="50%"
                        labelLine={false}
                        label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                        outerRadius={80}
                        fill="#8884d8"
                        dataKey="value"
                      >
                        {usersData.map((entry, index) => (
                          <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                        ))}
                      </Pie>
                      <Tooltip 
                        contentStyle={{ 
                          backgroundColor: "#1e293b",
                          border: "1px solid #334155",
                          borderRadius: "6px",
                          color: "#fff"
                        }}
                      />
                      <Legend />
                    </PieChart>
                  </ResponsiveContainer>
                </div>
              </CardBody>
            </Card>
          </Col>
        </Row>
        <Row>
          <Col xl="6">
            <Card>
              <CardHeader>
                <h6 className="surtitle">Partners</h6>
                <h5 className="h3 mb-0">Affiliate traffic</h5>
              </CardHeader>
              <CardBody>
                <div className="chart" style={{ height: "300px" }}>
                  <ResponsiveContainer width="100%" height="100%">
                    <PieChart>
                      <Pie
                        data={partnersData}
                        cx="50%"
                        cy="50%"
                        labelLine={false}
                        label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                        outerRadius={80}
                        fill="#8884d8"
                        dataKey="value"
                      >
                        {partnersData.map((entry, index) => (
                          <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                        ))}
                      </Pie>
                      <Tooltip 
                        contentStyle={{ 
                          backgroundColor: "#1e293b",
                          border: "1px solid #334155",
                          borderRadius: "6px",
                          color: "#fff"
                        }}
                      />
                      <Legend />
                    </PieChart>
                  </ResponsiveContainer>
                </div>
              </CardBody>
            </Card>
          </Col>
          <Col xl="6">
            <Card>
              <CardHeader>
                <h6 className="surtitle">Overview</h6>
                <h5 className="h3 mb-0">Product comparison</h5>
              </CardHeader>
              <CardBody>
                <div className="chart" style={{ height: "300px" }}>
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart data={productData}>
                      <CartesianGrid strokeDasharray="3 3" stroke="#34495e" />
                      <XAxis 
                        dataKey="name" 
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
                      <Bar dataKey="sales" stackId="a" fill="#5e72e4" radius={[8, 8, 0, 0]} />
                      <Bar dataKey="returns" stackId="a" fill="#f5365c" />
                    </BarChart>
                  </ResponsiveContainer>
                </div>
              </CardBody>
            </Card>
          </Col>
        </Row>
      </Container>
    </>
  );
}

Charts.layout = Admin;

export default Charts;

// Force dynamic rendering to prevent SSR errors during build
