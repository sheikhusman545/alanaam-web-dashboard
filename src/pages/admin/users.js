import Admin from "@/layouts/Admin";
import SimpleHeader from "components/Headers/SimpleHeader.js";
import React, { useEffect, useState } from "react";
import AdminUserFunctions from "../../api/adminusers";
import useApi from "@/api/hooks/apihook";
// Using Font Awesome icons instead of Material-UI to avoid SSR issues
// import { Delete, DeleteForever, Edit, Visibility } from "@mui/icons-material";
import useReport, { ReportHeader } from "@/api/hooks/useReport";
import Select from 'react-select'
import { SafeBox, validateData, BusyBlock, BusyBlockAUtoHeight } from "@/api/hooks/apiutils";
import {
    Badge,
    Button,
    Card,
    CardHeader,
    CardFooter,
    Media,
    Modal,
    Table,
    Container,
    Row,
    Col,
    CardBody,
    Form,
    FormGroup,
    InputGroup,
    Input,
    Collapse,
} from "reactstrap";

const Users = () => {

    const uRS = useReport(); //useReportStates

    const [users, setUsers] = useState([]);
    const [modalShow_AddEditUser, setModalShow_AddEditUser] = useState(false);
    const [choosenUser, setChoosenUser] = useState(null);
    const [modalReadOnly_Admin, setModalReadOnly_Admin] = useState(false);
    const [userTypes, setUserTypes] = useState([]);

    const API_getUserTypes = useApi(AdminUserFunctions.getUsertypes);
    const API_getUsers = useApi(AdminUserFunctions.getUsers);

    useEffect(() => {
        loadUsers();
    }, [uRS.sortValues, uRS.pageSizeValue, uRS.pageNumber])
    useEffect(() => {
        loadUserTypes();
    }, [])
    const loadUsers = async () => {
        const sort = uRS.sortValues.sortCol ? `${uRS.sortValues.sortCol} ${uRS.sortValues.sortDir}` : null;
        const retVal = await API_getUsers.request(uRS.filterValues, sort, uRS.pageSizeValue, uRS.pageNumber);
        if (retVal.ok && retVal.data) {
            setUsers(retVal.data.requestedData?.Users || []);
        }
    }
    const loadUserTypes = async () => {
        const retVal = await API_getUserTypes.request();
        console.log("UserTypes API Response:", retVal);
        if (retVal && retVal.ok && retVal.data) {
            const responseData = retVal.data;
            // Try to find UserTypes in various possible locations
            let userTypesList = [];
            if (responseData.requestedData?.UserTypes && Array.isArray(responseData.requestedData.UserTypes)) {
                userTypesList = responseData.requestedData.UserTypes;
            } else if (responseData.UserTypes && Array.isArray(responseData.UserTypes)) {
                userTypesList = responseData.UserTypes;
            } else if (Array.isArray(responseData.requestedData)) {
                userTypesList = responseData.requestedData;
            } else if (Array.isArray(responseData)) {
                userTypesList = responseData;
            }
            setUserTypes([{ typeID: "", userType: "--All--" }, ...userTypesList]);
        } else {
            console.error("Failed to load user types:", retVal);
        }
    }

    const modifyUserList = (mod, user) => {
        if (mod == 'new') {
            setUsers([...users, user]);
        }
        else if (mod == 'edit') {
            setUsers(users.map(user_ => { if (user_.userID != user.userID) { return user_ } else { return user } }));
        }
        else if (mod == 'delete') {
            console.log("del", user, users, users.filter((user_) => user_.userID != user.userID));
            setUsers(users.filter((user_) => user_.userID != user.userID));
        }

    }

    return (
        <>
            <SimpleHeader name="Users" parentName="Masters" parentUrl="/">
                <Button className="btn-neutral" color="default" size="sm" onClick={() => {
                    setModalReadOnly_Admin(false);
                    setChoosenUser(null);
                    setModalShow_AddEditUser(true);
                }}> New </Button>
                <Button className="btn-neutral" color="default" size="sm" onClick={() => { uRS.setFilterOpen(!uRS.filterOpen) }}> Filters </Button>
            </SimpleHeader>
            <Container className="mt--6" fluid>
                <Row>
                    <div className="col">
                        <Collapse isOpen={uRS.filterOpen}>
                            <Card>
                                <CardHeader className="border-0"> <h3 className="mb-0">Filter</h3> </CardHeader>
                                <CardBody>
                                    <Row>
                                        <Col md="3">
                                            <FormGroup>
                                                <label className="form-control-label" htmlFor="exampleFormControlInput1"> Keyword</label>
                                                <Input className="" placeholder="Enter Keyword here" type="text" value={uRS.filterValues.keyword} onChange={e => { uRS.setFilterValues({ ...uRS.filterValues, keyword: e.target.value }); }} />
                                            </FormGroup>
                                        </Col>
                                        <Col md="3">
                                            <FormGroup>
                                                <label className="form-control-label" htmlFor="exampleFormControlSelect1">User Type</label>
                                                <Select options={userTypes.map((userType, index) => ({ value: userType.typeID, label: userType.userType }))} value={userTypes.map((userType, index) => { if (uRS.filterValues.typeid == userType.typeID) { return { value: userType.typeID, label: userType.userType } } })} onChange={val => { uRS.setFilterValues({ ...uRS.filterValues, typeid: val.value }); }} />
                                            </FormGroup>
                                        </Col>

                                        <Col md="3">
                                            <FormGroup>
                                                <label className="form-control-label" htmlFor="exampleFormControlInput1">&nbsp;</label>
                                                <Button className="my-4 btn-md" color="dark" type="button" onClick={() => { (uRS.pageNumber == 1) && loadUsers() || uRS.setPageNumber("1") }}> Filter </Button>
                                            </FormGroup>
                                        </Col>
                                    </Row>

                                </CardBody>
                            </Card>
                        </Collapse>

                        <Card >
                            <Table className="align-items-center table-flush" responsive>
                                <thead className="thead-light">
                                    <tr>
                                        <th >SLNO</th>
                                        {/* <th >userID</th> */}
                                        <th >userFullName</th>
                                        <th >adminEmail</th>
                                        <th >status</th>
                                        <th >User Type</th>
                                        <th scope="col" />
                                    </tr>
                                </thead>
                                <tbody className="list">
                                    {(users.length > 0 && users.map((user, index) => (
                                        <UserRow
                                            user={user}
                                            setModalShow_AddEditUser={setModalShow_AddEditUser}
                                            setChoosenUser={setChoosenUser}
                                            slno={index}
                                            setModalReadOnly_Admin={setModalReadOnly_Admin}
                                            modifyUserList={modifyUserList}
                                            key={index + user.userID}
                                        />
                                    )))}
                                </tbody>
                            </Table>
                            <CardFooter className="py-4">
                                <BusyBlock iAmBusy={API_getUsers.loading} />
                            </CardFooter>
                        </Card>
                    </div>
                </Row>
            </Container>
            <ModalShow_AddEditUsers
                modalIsOpen={modalShow_AddEditUser}
                setModalIsOpen={setModalShow_AddEditUser}
                choosenUser={choosenUser}
                modalReadOnly_Admin={modalReadOnly_Admin}
                modifyUserList={modifyUserList}
                userTypes={userTypes}
            />
        </>
    );
}
export default Users;
Users.layout = Admin;

// Force dynamic rendering to prevent SSR errors during build
// Removed getServerSideProps - not needed with dynamic ssr: false

const UserRow = ({ user, setModalShow_AddEditUser, setChoosenUser, slno, setModalReadOnly_Admin, modifyUserList }) => {
    const API_DeleteVal = useApi(AdminUserFunctions.removeUser);
    const API_updateStatus = useApi(AdminUserFunctions.updateStatus);

    const handleRemove = async () => {
        const userName = user.username || user.email || 'this user';
        const confirmMessage = `Are you sure you want to delete "${userName}"?\n\nThis action cannot be undone.`;
        const confirmed = window.confirm(confirmMessage);
        
        if (confirmed) {
            const retVal = await API_DeleteVal.request(user.userID);
            if (retVal.ok) {
                modifyUserList('delete', user);
            } else {
                const errorMsg = retVal.data?.errorMessages?.Errors || retVal.data?.message || "Error deleting user";
                alert(`Error deleting user: ${errorMsg}`);
            }
        }
    };

    const handleStatusChange = async (newStatus) => {
        const retVal = await API_updateStatus.request(user.userID, newStatus);
        if (retVal.ok && retVal.data) {
            modifyUserList('edit', retVal.data.requestedData?.User);
        }
    };

    return (
        <tr>
            <td className="budget">
                <span>{slno + 1}</span>
            </td>
            <td className="budget">
                <span>{user.userFullName}</span>
            </td>
            <td className="budget">
                <span>{user.adminEmail}</span>
            </td>
            <td>
                <Badge color={user.status === "1" ? "success" : "danger"}>
                    {user.status === "1" ? "Active" : "Inactive"}
                </Badge>
            </td>
            <td className="budget">
                <span>{user.userType || "N/A"}</span>
            </td>
            <td>
                <Button className="btn-icon-only" color="secondary" type="button"
                    onClick={() => {
                        setModalReadOnly_Admin(false);
                        setChoosenUser(user);
                        setModalShow_AddEditUser(true);
                    }}
                >
                    <i className="fas fa-edit" />
                </Button>
                <Button className="btn-icon-only" color="secondary" type="button"
                    onClick={() => {
                        setModalReadOnly_Admin(true);
                        setChoosenUser(user);
                        setModalShow_AddEditUser(true);
                    }}
                >
                    <i className="fas fa-eye" />
                </Button>
                <Button className="btn-icon-only" color="secondary" type="button"
                    onClick={handleRemove}
                >
                    <i className="fas fa-trash" />
                </Button>
            </td>
        </tr>
    );
};

const ModalShow_AddEditUsers = ({ modalIsOpen, setModalIsOpen, choosenUser, modalReadOnly_Admin, modifyUserList, userTypes }) => {
    const [userFullName, setUserFullName] = useState("");
    const [adminEmail, setAdminEmail] = useState("");
    const [adminPassword, setAdminPassword] = useState("");
    const [userType, setUserType] = useState("");
    const [permissionCategories, setPermissionCategories] = useState(false);
    const [permissionProducts, setPermissionProducts] = useState(false);
    const [permissionOrders, setPermissionOrders] = useState(false);
    const [permissionUsers, setPermissionUsers] = useState(false);
    const [permissionReports, setPermissionReports] = useState(false);
    
    const API_createUser = useApi(AdminUserFunctions.createUser);
    const API_updateUser = useApi(AdminUserFunctions.updateUser);
    
    const handleClick = async () => {
        if (choosenUser) {
            // Update existing user
            const retVal = await API_updateUser.request(choosenUser.userID, {
                userType,
                userFullName,
                permissionCategories,
                permissionProducts,
                permissionOrders,
                permissionUsers,
                permissionReports,
            });
            if (retVal.ok && retVal.data) {
                setModalIsOpen(false);
                modifyUserList('edit', retVal.data.requestedData?.User);
            }
        } else {
            // Create new user
            if (!adminPassword) {
                alert("Password is required for new users");
                return;
            }
            const retVal = await API_createUser.request({
                userType,
                userFullName,
                adminEmail,
                adminPassword,
                permissionCategories,
                permissionProducts,
                permissionOrders,
                permissionUsers,
                permissionReports,
            });
            if (retVal.ok && retVal.data) {
                setModalIsOpen(false);
                modifyUserList('new', retVal.data.requestedData?.User);
            }
        }
    };
    
    useEffect(() => {
        if (choosenUser) {
            setUserFullName(choosenUser.userFullName || "");
            setAdminEmail(choosenUser.adminEmail || "");
            setUserType(choosenUser.typeid || "");
            setPermissionCategories(choosenUser.permissionCategories === "1" || choosenUser.permissionCategories === true);
            setPermissionProducts(choosenUser.permissionProducts === "1" || choosenUser.permissionProducts === true);
            setPermissionOrders(choosenUser.permissionOrders === "1" || choosenUser.permissionOrders === true);
            setPermissionUsers(choosenUser.permissionUsers === "1" || choosenUser.permissionUsers === true);
            setPermissionReports(choosenUser.permissionReports === "1" || choosenUser.permissionReports === true);
            setAdminPassword(""); // Clear password for existing users
        } else {
            setUserFullName("");
            setAdminEmail("");
            setAdminPassword("");
            setUserType("");
            setPermissionCategories(false);
            setPermissionProducts(false);
            setPermissionOrders(false);
            setPermissionUsers(false);
            setPermissionReports(false);
        }
    }, [choosenUser]);
    
    return (
        <Modal className="modal-dialog-centered" size="lg" isOpen={modalIsOpen} toggle={() => { setModalIsOpen(!modalIsOpen); }}>
            <div className="modal-body p-0">
                <Card className="bg-secondary border-0 mb-0">
                    <CardHeader className="bg-light">
                        <div className="h2 text-center mt-2 mb-3">{(choosenUser && "Edit") || "Add New"} User</div>
                    </CardHeader>
                    <CardBody className="px-lg-5 py-lg-5">
                        <Form>
                            <FormGroup>
                                <label className="form-control-label">User Full Name</label>
                                <Input
                                    type="text"
                                    placeholder="User Full Name"
                                    value={userFullName}
                                    onChange={(e) => setUserFullName(e.target.value)}
                                    disabled={modalReadOnly_Admin}
                                />
                            </FormGroup>
                            <FormGroup>
                                <label className="form-control-label">Email</label>
                                <Input
                                    type="email"
                                    placeholder="Email"
                                    value={adminEmail}
                                    onChange={(e) => setAdminEmail(e.target.value)}
                                    disabled={modalReadOnly_Admin || !!choosenUser}
                                />
                            </FormGroup>
                            {!choosenUser && (
                                <FormGroup>
                                    <label className="form-control-label">Password</label>
                                    <Input
                                        type="password"
                                        placeholder="Password"
                                        value={adminPassword}
                                        onChange={(e) => setAdminPassword(e.target.value)}
                                        disabled={modalReadOnly_Admin}
                                    />
                                </FormGroup>
                            )}
                            <FormGroup>
                                <label className="form-control-label">User Type</label>
                                <Select
                                    options={userTypes.filter(ut => ut.typeID).map((userType) => ({
                                        value: userType.typeID,
                                        label: userType.userType
                                    }))}
                                    value={userTypes.filter(ut => ut.typeID).find(ut => ut.typeID === userType) ? {
                                        value: userType,
                                        label: userTypes.find(ut => ut.typeID === userType)?.userType
                                    } : null}
                                    onChange={(val) => setUserType(val?.value || "")}
                                    isDisabled={modalReadOnly_Admin}
                                />
                            </FormGroup>
                            <FormGroup>
                                <label className="form-control-label">Permissions</label>
                                <div>
                                    <FormGroup check>
                                        <Input
                                            type="checkbox"
                                            checked={permissionCategories}
                                            onChange={(e) => setPermissionCategories(e.target.checked)}
                                            disabled={modalReadOnly_Admin}
                                        />
                                        <label check>Categories</label>
                                    </FormGroup>
                                    <FormGroup check>
                                        <Input
                                            type="checkbox"
                                            checked={permissionProducts}
                                            onChange={(e) => setPermissionProducts(e.target.checked)}
                                            disabled={modalReadOnly_Admin}
                                        />
                                        <label check>Products</label>
                                    </FormGroup>
                                    <FormGroup check>
                                        <Input
                                            type="checkbox"
                                            checked={permissionOrders}
                                            onChange={(e) => setPermissionOrders(e.target.checked)}
                                            disabled={modalReadOnly_Admin}
                                        />
                                        <label check>Orders</label>
                                    </FormGroup>
                                    <FormGroup check>
                                        <Input
                                            type="checkbox"
                                            checked={permissionUsers}
                                            onChange={(e) => setPermissionUsers(e.target.checked)}
                                            disabled={modalReadOnly_Admin}
                                        />
                                        <label check>Users</label>
                                    </FormGroup>
                                    <FormGroup check>
                                        <Input
                                            type="checkbox"
                                            checked={permissionReports}
                                            onChange={(e) => setPermissionReports(e.target.checked)}
                                            disabled={modalReadOnly_Admin}
                                        />
                                        <label check>Reports</label>
                                    </FormGroup>
                                </div>
                            </FormGroup>
                            <Row>
                                <Col md="12" className="text-right">
                                    <Button className="my-4" color="secondary" type="button" onClick={() => setModalIsOpen(false)}>
                                        Cancel
                                    </Button>
                                    {!modalReadOnly_Admin && (
                                        <Button className="my-4" color="danger" type="button" onClick={handleClick}>
                                            Submit
                                        </Button>
                                    )}
                                </Col>
                            </Row>
                        </Form>
                    </CardBody>
                </Card>
            </div>
        </Modal>
    );
};
