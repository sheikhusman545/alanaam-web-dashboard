"use client";

import React from "react";
import {
  Page,
  Text,
  View,
  Document,
  StyleSheet,
  Image,
} from "@react-pdf/renderer";

import { getStoreStatusText } from "utils/constantArrays";
import { amountFormat } from "utils/utils";

const singleOrdersStyles = StyleSheet.create({
  headerView: {
    flexDirection: "row",
    backgroundColor: "#f6f9fc",
    borderBottomColor: "#cfcece",
    borderBottomWidth: 2,
  },
  rowView: {
    flexDirection: "row",
    // backgroundColor: '#fff9fc',
    borderBottomColor: "#dbdbdb",
    borderBottomWidth: 1,
  },
  section: {
    margin: 10,
    padding: 10,
    flexGrow: 1,
  },
  sectionText: { fontSize: 7 },
  // sectionTextOrder: { fontSize: 7, width: '10%' }, sectionTextOrderDate: { fontSize: 7, width: '15%', textAlign: 'left' },
  rowText: { fontSize: 6 },
  imageView: {
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    height: "70px",
  },
  image: {
    objectFit: "contain",
    height: "50%",
    width: "50%",
  },
});

export const OrdersPDFDownload = ({ orders }) => {
  return (
    <Document>
      <Page size="A4">
        <View style={singleOrdersStyles.imageView}>
          <Image
            style={singleOrdersStyles.image}
            src="/assets/img/logo/al-anam-logo.png"
            alt="images"
          />
        </View>
        <View style={singleOrdersStyles.headerView}>
          <View style={singleOrdersStyles.section}>
            <Text style={singleOrdersStyles.sectionText}>Order ID</Text>
          </View>
          <View style={singleOrdersStyles.section}>
            <Text style={singleOrdersStyles.sectionText}>Order Date </Text>
          </View>
          <View style={singleOrdersStyles.section}>
            <Text style={singleOrdersStyles.sectionText}>Customer Name</Text>
          </View>
          <View style={singleOrdersStyles.section}>
            <Text style={singleOrdersStyles.sectionText}> Total Qty </Text>
          </View>
          <View style={singleOrdersStyles.section}>
            <Text style={singleOrdersStyles.sectionText}>Grand Total</Text>
          </View>
          <View style={singleOrdersStyles.section}>
            <Text style={singleOrdersStyles.sectionText}>Order Status</Text>
          </View>
          <View style={singleOrdersStyles.section}>
            <Text style={singleOrdersStyles.sectionText}>Order Status on</Text>
          </View>
        </View>
        {orders.length > 0 &&
          orders.map((order, index) => (
            <View style={singleOrdersStyles.rowView}>
              <View style={singleOrdersStyles.section}>
                <Text style={singleOrdersStyles.rowText}>{order.orderID}</Text>
              </View>
              <View style={singleOrdersStyles.section}>
                <Text style={singleOrdersStyles.rowText}>{order.orderDate} </Text>
              </View>
              <View style={singleOrdersStyles.section}>
                <Text style={singleOrdersStyles.rowText}>
                  {order.customerName == null || order.customerName == ""
                    ? "Guest"
                    : order.customerName}
                </Text>
              </View>
              <View style={singleOrdersStyles.section}>
                <Text style={singleOrdersStyles.rowText}>
                  {order.totalProductsQuantity}{" "}
                </Text>
              </View>
              <View style={singleOrdersStyles.section}>
                <Text style={singleOrdersStyles.rowText}>
                  {amountFormat(order.grantTotal)}
                </Text>
              </View>
              <View style={singleOrdersStyles.section}>
                <Text style={singleOrdersStyles.rowText}>
                  {getStoreStatusText(order.cartStatus)}
                </Text>
              </View>
              <View style={singleOrdersStyles.section}>
                <Text style={singleOrdersStyles.rowText}>{order.cartStatusOn}</Text>
              </View>
            </View>
          ))}
      </Page>
    </Document>
  );
};

export const SingleOrdersDetailsPDFDownload = ({ orderData }) => {
  console.log("orderData", orderData);
  return (
    <Document>
      <Page size="A4">
        <View style={singleOrdersStyles.imageView}>
          <Image
            style={singleOrdersStyles.image}
            src="/assets/img/logo/al-anam-logo.png"
            alt="images"
          />
        </View>
        <View style={singleOrdersStyles.headerView}>
          <View style={singleOrdersStyles.section}>
            <Text style={singleOrdersStyles.sectionText}>Order ID</Text>
          </View>
          <View style={singleOrdersStyles.section}>
            <Text style={singleOrdersStyles.sectionText}>Product Name</Text>
          </View>
          <View style={singleOrdersStyles.section}>
            <Text style={singleOrdersStyles.sectionText}>Order Date</Text>
          </View>
          <View style={singleOrdersStyles.section}>
            <Text style={singleOrdersStyles.sectionText}> Customer Name </Text>
          </View>
          <View style={singleOrdersStyles.section}>
            <Text style={singleOrdersStyles.sectionText}>Total P Quantity</Text>
          </View>
          <View style={singleOrdersStyles.section}>
            <Text style={singleOrdersStyles.sectionText}>Grant Total</Text>
          </View>
          <View style={singleOrdersStyles.section}>
            <Text style={singleOrdersStyles.sectionText}>OrderStatus</Text>
          </View>

          {/* <View style={singleOrdersStyles.section}>
            <Text style={singleOrdersStyles.sectionText}>Order StatusOn</Text>
          </View> */}
          {/* <View style={singleOrdersStyles.section}>
            <Text style={singleOrdersStyles.sectionText}>Slaughter Charge</Text>
          </View>
          <View style={singleOrdersStyles.section}>
            <Text style={singleOrdersStyles.sectionText}>Product Price</Text>
          </View> */}
          {/* <View style={singleOrdersStyles.section}>
            <Text style={singleOrdersStyles.sectionText}>Customer Email</Text>
          </View> */}
          <View style={singleOrdersStyles.section}>
            <Text style={singleOrdersStyles.sectionText}>Customer Mobile</Text>
          </View>
          <View style={singleOrdersStyles.section}>
            <Text style={singleOrdersStyles.sectionText}>Delivery Method</Text>
          </View>

          {/* <View style={singleOrdersStyles.section}>
            <Text style={singleOrdersStyles.sectionText}>DeliveryTime</Text>
          </View>
          <View style={singleOrdersStyles.section}>
            <Text style={singleOrdersStyles.sectionText}>DeliveryDate</Text>
          </View> */}
        </View>
        {orderData.length > 0 &&
          orderData.map((order, index) => (
            <View style={singleOrdersStyles.rowView} key={index}>
              <View style={singleOrdersStyles.section}>
                <Text style={singleOrdersStyles.rowText}>{order.orderID}</Text>
              </View>
              <View style={singleOrdersStyles.section}>
                <Text style={singleOrdersStyles.rowText}>
                  {order.en_ProductName}{" "}
                </Text>
              </View>
              <View style={singleOrdersStyles.section}>
                <Text style={singleOrdersStyles.rowText}>{order.orderDate} </Text>
              </View>
              <View style={singleOrdersStyles.section}>
                <Text style={singleOrdersStyles.rowText}>
                  {order.customerName == null || order.customerName == ""
                    ? "Guest"
                    : order.customerName}
                </Text>
              </View>

              <View style={singleOrdersStyles.section}>
                <Text style={singleOrdersStyles.rowText}>
                  {order.totalProductsQuantity}
                </Text>
              </View>
              <View style={singleOrdersStyles.section}>
                <Text style={singleOrdersStyles.rowText}>
                  {amountFormat(order.grantTotal)}
                </Text>
              </View>
              <View style={singleOrdersStyles.section}>
                <Text style={singleOrdersStyles.rowText}>
                  {getStoreStatusText(order.cartStatus)}
                </Text>
              </View>
              {/* <View style={singleOrdersStyles.section}>
                <Text style={singleOrdersStyles.rowText}>
                  {order.cartStatusOn}
                </Text>
              </View> */}
              {/* <View style={singleOrdersStyles.section}>
                <Text style={singleOrdersStyles.rowText}>
                  {order.SlaughterCharge}
                </Text>
              </View>
              <View style={singleOrdersStyles.section}>
                <Text style={singleOrdersStyles.rowText}>
                  {order.productPrice}
                </Text>
              </View> */}
              {/* <View style={singleOrdersStyles.section}>
                <Text style={singleOrdersStyles.rowText}>
                  {order.customerEmail}
                </Text>
              </View> */}
              <View style={singleOrdersStyles.section}>
                <Text style={singleOrdersStyles.rowText}>{order.customerMobile}</Text>
              </View>
              <View style={singleOrdersStyles.section}>
                <Text style={singleOrdersStyles.rowText}>{order.DeliveryMethod}</Text>
              </View>
              {/* <View style={singleOrdersStyles.section}>
                <Text style={singleOrdersStyles.rowText}>
                  {order.DeliveryTime}
                </Text>
              </View>
              <View style={singleOrdersStyles.section}>
                <Text style={singleOrdersStyles.rowText}>
                  {order.DeliveryDate}
                </Text>
              </View> */}
            </View>
          ))}
      </Page>
    </Document>
  );
};
