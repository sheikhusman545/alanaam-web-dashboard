import { useState } from "react";
import Admin from "layouts/Admin.js";
import {
  Card,
  CardHeader,
  CardBody,
  Label,
  FormGroup,
  Form,
  Input,
  Container,
  Row,
  Col,
  Button,
  CardTitle,
  Table,
  footer,
} from "reactstrap";

const OrderProducts = (orderProducts) => {
  return (
    <>
      {(orderProducts.length > 0 &&
        orderProducts.map((product, index) => (
          <tr>
            <Media className="align-items-center">
              <a
                className="avatar rounded-circle mr-3"
                href="#pablo"
                onClick={(e) => e.preventDefault()}
              >
                <img alt="..." src={imagePath + product.mainImageUrl} />
              </a>
            </Media>
            <td>
              <span>{product.orderID}</span>
            </td>
            <td>
              <span>{product.en_ProductName}</span>
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
            <td>
              <span>{product.productAttributes}</span>
            </td>
            <td>
              <span>{product.productCode}</span>
            </td>
            <td>
              <span>{product.categoryRoute}</span>
            </td>
            <td>
              <span>{product.categoryID}</span>
            </td>
          </tr>
        ))) || (
          <tr>
            <td>
              <span>no data found</span>
            </td>
          </tr>
        )}
    </>
  );
};
export default OrderProducts;
