export const orderStatusValues = {
    [0]: { caption: "--All--", color: "" },
    [1]: { caption: "Pending", color: "danger" },
    [2]: { caption: "Approved", color: "primary" },
    [3]: { caption: "Rejected", color: "default" },
    [4]: { caption: "Processed", color: "warning" },
    [5]: { caption: "Shipped", color: "info" },
    [6]: { caption: "Delivered", color: "success" }
}

export const paymentStatusValues = {
    [1]: { caption: "Pending", color: "danger" },
    [2]: { caption: "Success", color: "primary" },
    [3]: { caption: "Failed", color: "default" },
}

export const getStoreStatusText = (status) => {
    return orderStatusValues[status]?.caption;
};