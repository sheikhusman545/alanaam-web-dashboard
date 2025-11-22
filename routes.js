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
const routes = [
  {
    collapse: true,
    name: "Dashboards",
    icon: "ni ni-shop text-primary",
    state: "dashboardsCollapse",
    views: [
      {
        path: "/dashboard",
        name: "Dashboard",
        miniName: "D",
        layout: "/admin",
      },
      {
        path: "/categories",
        name: "Category",
        miniName: "A",
        layout: "/admin",
        permissionCheck: "permissionCategories",
      },
      {
        path: "/product",
        name: "Products",
        miniName: "A",
        layout: "/admin",
        permissionCheck: "permissionProducts",
      },
      // {
      //   path: "/elements",
      //   name: "Add Products",
      //   miniName: "A",
      //   layout: "/admin",
      // },
    ],
  },
  {
    collapse: true,
    name: "Admin Users",
    icon: "ni ni-ungroup text-orange",
    state: "examplesCollapse",
    views: [
      {
        path: "/usertypes",
        name: "User Types",
        miniName: "UT",
        layout: "/admin",
        permissionCheck: "permissionUsers",
      },
      {
        path: "/users",
        name: "Users",
        miniName: "U",
        layout: "/admin",
        permissionCheck: "permissionUsers",
      },
    ],
  },
  {
    path: "/order",
    name: "Orders",
    icon: "ni ni-archive-2 text-green",
    layout: "/admin",
    permissionCheck: "permissionOrders",
  },
  {
    path: "/bookings",
    name: "Bookings",
    icon: "ni ni-archive-2 text-green",
    layout: "/admin",
    permissionCheck: "permissionOrders",
  },
  {
    path: "/customers",
    name: "Customers",
    icon: "ni ni-chart-pie-35 text-info",
    layout: "/admin",

  },
  {
    collapse: true,
    name: "Reports",
    icon: "ni ni-calendar-grid-58 text-red",
    state: "examplesCollapse1",
    views: [
      {
        path: "/productwisereport",
        name: "Product Wise",
        miniName: "R",
        layout: "/admin",
        permissionCheck: "permissionReports",
      },
      {
        path: "/categorywisereport",
        name: "Category Wise ",
        miniName: "R",
        layout: "/admin",
        permissionCheck: "permissionReports",
      },
      {
        path: "/datewisereport",
        name: "Date Wise",
        miniName: "R",
        layout: "/admin",
        permissionCheck: "permissionReports",
      },
    ],
  },
];

export default routes;
