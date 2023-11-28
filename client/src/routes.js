/** 
  All of the routes for the Material Dashboard 2 React are added here,
  You can add a new route, customize the routes and delete the routes here.

  Once you add a new route on this file it will be visible automatically on
  the Sidenav.

  For adding a new route you can follow the existing routes in the routes array.
  1. The `type` key with the `collapse` value is used for a route.
  2. The `type` key with the `title` value is used for a title inside the Sidenav. 
  3. The `type` key with the `divider` value is used for a divider between Sidenav items.
  4. The `name` key is used for the name of the route on the Sidenav.
  5. The `key` key is used for the key of the route (It will help you with the key prop inside a loop).
  6. The `icon` key is used for the icon of the route on the Sidenav, you have to add a node.
  7. The `collapse` key is used for making a collapsible item on the Sidenav that has other routes
  inside (nested routes), you need to pass the nested routes inside an array as a value for the `collapse` key.
  8. The `route` key is used to store the route location which is used for the react router.
  9. The `href` key is used to store the external links location.
  10. The `title` key is only for the item with the type of `title` and its used for the title text on the Sidenav.
  10. The `component` key is used to store the component of its route.
*/

// Material Dashboard 2 React layouts
import Dashboard from "layouts/dashboard";
import Billing from "layouts/billing";
import Profile from "layouts/profile";
import Inventory from "layouts/inventory";

// @mui icons
import Icon from "@mui/material/Icon";
import Shippings from "layouts/shippings";
import SignIn from "layouts/authentication/sign-in";
import SignOut from "layouts/authentication/sign-out";

const routes = [
  {
    type: "collapse",
    name: "Dashboard",
    key: "dashboard",
    icon: <Icon fontSize="small">dashboard</Icon>,
    route: "/dashboard",
    component: <Dashboard />,
  },
  {
    type: "collapse",
    name: "Inventario",
    key: "inventory",
    icon: <Icon fontSize="small">inventory</Icon>,
    route: "/inventory",
    component: <Inventory />,
  },
  {
    type: "collapse",
    name: "Facturas",
    key: "billing",
    icon: <Icon fontSize="small">receipt_long</Icon>,
    route: "/billing",
    component: <Billing />,
  },
  {
    type: "collapse",
    name: "Envios",
    key: "shippings",
    icon: <Icon fontSize="small">local_shipping</Icon>,
    route: "/shippings",
    component: <Shippings />,
  },
  {
    type: "collapse",
    name: "Perfil",
    key: "profile",
    icon: <Icon fontSize="small">person</Icon>,
    route: "/profile",
    component: <Profile />,
  },
  {
    type: "collapse",
    name: "Inicio de Sesion",
    key: "sign-in",
    route: "/auth/sign-in",
    icon: <Icon fontSize="small">login</Icon>,
    component: <SignIn />,
    protected: false,
    hidden: true,
  },
  {
    type: "collapse",
    name: "Cerrar Sesion",
    key: "sign-out",
    route: "/auth/sign-out",
    icon: <Icon fontSize="small">logout</Icon>,
    component: <SignOut />,
    protected: false,
    hidden: true,
  },
];

export default routes;
