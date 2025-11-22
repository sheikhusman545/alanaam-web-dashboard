import { ExcelExport, ExcelExportColumn, ExcelExportColumnGroup } from '@progress/kendo-react-excel-export';

export const OrderExcelExport = ({ data, exportRef }) => {

    return (
        <ExcelExport data={data} fileName="Orders.xlsx" ref={exportRef}>
            <ExcelExportColumn field="orderID" title="Order ID" />
            <ExcelExportColumn field="orderDate" title="Order Date" />
            <ExcelExportColumn field="customerName" title="Customer Name" />
            <ExcelExportColumn field="totalProductsQuantity" title="Total Products Quantity" />
            <ExcelExportColumn field="grantTotal" title="Grant Total" />
            <ExcelExportColumn field="OrderStatus" title="OrderStatus" />
            <ExcelExportColumn field="cartStatusOn" title="Order StatusOn" />
            <ExcelExportColumn field="shippingCharge" title="Shipping Charge" />
            <ExcelExportColumn field="totalProductPrice" title="Total Product Price" />
        </ExcelExport>
    );
}

export const SingleOrderExcelExport = ({ data, exportRef }) => {

    return (
        <ExcelExport
            data={data && data}
            fileName="Order Products.xlsx"
            ref={exportRef}
        >
            <ExcelExportColumn field="orderID" title="Order ID" />
            <ExcelExportColumn field="en_ProductName" title="Product Name" width={200} />
            <ExcelExportColumn field="orderDate" title="Order Date" />
            <ExcelExportColumn field="customerName" title="Customer Name" />
            <ExcelExportColumn field="totalProductsQuantity" title="Total Products Quantity" />
            <ExcelExportColumn field="grantTotal" title="Grant Total" />
            <ExcelExportColumn field="OrderStatus" title="OrderStatus" />
            <ExcelExportColumn field="cartStatusOn" title="Order StatusOn" />
            <ExcelExportColumn field="SlaughterCharge" title="Slaughter Charge" />
            <ExcelExportColumn field="productPrice" title="Product Price" />

            <ExcelExportColumn field="customerEmail" title="Customer Email" />
            <ExcelExportColumn field="customerMobile" title="Customer Mobile" />
            <ExcelExportColumn field="DeliveryMethod" title="Delivery Method" />
            <ExcelExportColumn field="DeliveryTime" title="DeliveryTime" />
            <ExcelExportColumn field="DeliveryDate" title="DeliveryDate" />
            {/* {data &&
                data.length &&
                data.map((item) => {
                    return item.orderProducts.map((product, i) => (
                        <ExcelExportColumn
                            key={i}
                            field={product.en_ProductName}
                            title="ProductName" />

                        // <ExcelExportColumn
                        //     key={i}
                        //     field={product.en_ProductName}
                        //     title={product.en_ProductName}
                        //     footerCellOptions={{
                        //         wrap: true,
                        //         textAlign: "center",
                        //     }}
                        //     cellOptions={{ textAlign: "center" }}
                        //     width={150}
                        // />


                    ));
                })} */}
        </ExcelExport>

    );
}


