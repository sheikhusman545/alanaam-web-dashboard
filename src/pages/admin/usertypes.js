import Admin from "@/layouts/Admin";
import SimpleHeader from "components/Headers/SimpleHeader.js";
import React, { useEffect, useState } from "react";
import dynamic from "next/dynamic";
import AdminUserFunctions from "../../api/adminusers";
import useApi from "@/api/hooks/apihook";
// Using Font Awesome icons instead of Material-UI to avoid SSR issues
// import { Delete, DeleteForever, Edit, Visibility } from "@mui/icons-material";
import useReport, { ReportHeader } from "@/api/hooks/useReport";
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


const UsertTypes = () => {
    const API_getUserTypes = useApi(AdminUserFunctions.getUsertypes);
    const [userTypes, setUserTypes] = useState([]);
    const [modalShow_AddEditUserType, setModalShow_AddEditUserType] = useState(false);
    const [choosenUserType, setChoosenUserType] = useState(null);
    useEffect(() => {
        loadUserTypes();
    }, []);
    const loadUserTypes = async () => {
        let retVal = await API_getUserTypes.request();
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
            setUserTypes(userTypesList);
        } else {
            console.error("Failed to load user types:", retVal);
        }
    }

    const modifyUserTypeList = (mod, userType) => {
        console.log("vall", userType)
        if (mod == 'new') {
            setUserTypes([...userTypes, userType]);
        }
        else if (mod == 'edit') {
            setUserTypes(userTypes.map(userType_ => { if (userType_.typeID != userType.typeID) { return userType_ } else { return userType } }));
        }
        else if (mod == 'delete') {
            setUserTypes(userTypes.filter((userType_) => userType_.typeID != userType.typeID));
        }
    }
    return (
        <>
            <SimpleHeader name="User Types" parentName="Masters" parentUrl="/">
                <Button className="btn-neutral" color="default" size="sm" onClick={() => {
                    setChoosenUserType(null);
                    setModalShow_AddEditUserType(true);
                }}> New </Button>

            </SimpleHeader>
            <Container className="mt--6" fluid>
                <Row>
                    <div className="col text-center">
                        <Card >

                            <Table className="align-items-center table-flush" responsive>
                                <thead className="thead-light">
                                    <tr>
                                        <th > SLNO </th>
                                        {/* <th > Type ID </th> */}
                                        <th>User Type</th>
                                        <th scope="col" >edit / delete</th>
                                    </tr>
                                </thead>
                                <tbody className="list">

                                    {(userTypes.length > 0 && userTypes.map((userType, index) => (
                                        <UserTypeRow
                                            usertype={userType}
                                            setModalShow_AddEditUserType={setModalShow_AddEditUserType}
                                            setChoosenUserType={setChoosenUserType}
                                            slno={index}
                                            modifyUserTypeList={modifyUserTypeList}
                                            key={index}
                                        />
                                    )))}

                                </tbody>
                            </Table>
                            <CardFooter className="py-4">
                            </CardFooter>
                        </Card>
                    </div>
                </Row>
            </Container>

            <ModalShow_AddEditUserType
                modalIsOpen={modalShow_AddEditUserType}
                setModalIsOpen={setModalShow_AddEditUserType}
                choosenUserType={choosenUserType}
                modifyUserTypeList={modifyUserTypeList}
            />

        </>
    );
}
const UsertTypesWithNoSSR = dynamic(() => Promise.resolve(UsertTypes), { ssr: false });
UsertTypesWithNoSSR.layout = Admin;
UsertTypesWithNoSSR.permissionCheck = "permissionUsers";
export default UsertTypesWithNoSSR;

// Force dynamic rendering to prevent SSR errors during build
// Removed getServerSideProps - not needed with dynamic ssr: false

const UserTypeRow = ({ usertype, setModalShow_AddEditUserType, setChoosenUserType, slno, modifyUserTypeList }) => {
    const API_DeleteVal = useApi(AdminUserFunctions.removeUserType);

    const handleRemove = async () => {
        const userTypeName = usertype.userType || usertype.typeID || 'this user type';
        const confirmMessage = `Are you sure you want to delete "${userTypeName}"?\n\nThis action cannot be undone.`;
        const confirmed = window.confirm(confirmMessage);
        
        if (confirmed) {
            const retVal = await API_DeleteVal.request(usertype.typeID);
            if (retVal.ok) {
                modifyUserTypeList('delete', usertype);
            } else {
                const errorMsg = retVal.data?.errorMessages?.Errors || retVal.data?.message || "Error deleting user type";
                alert(`Error deleting user type: ${errorMsg}`);
            }
        }
    };
    return (
        <>
            <tr>
                <td className="budget">
                    <span>{slno + 1}</span>
                </td>
                {/* <td className="budget">
                    <span>{usertype.typeID}</span>
                </td> */}
                <td className="budget">
                    <span>{usertype.userType}</span>
                </td>
                <td>
                    <Button className="btn-icon-only" color="secondary" type="button"
                        onClick={() => {
                            setChoosenUserType(usertype);
                            setModalShow_AddEditUserType(true);
                        }}
                    >
                        <i className="fas fa-edit" />
                    </Button>
                    <Button className="btn-icon-only" color="secondary" type="button"
                        onClick={handleRemove}
                    >
                        <i className="fas fa-trash" />
                    </Button>
                </td>
            </tr>
        </>
    );
}

const ModalShow_AddEditUserType = ({ modalIsOpen, setModalIsOpen, choosenUserType, modifyUserTypeList }) => {
    const [userType, setUserType] = useState(null);
    const API_createUserType = useApi(AdminUserFunctions.createUserType);
    const API_updateUserType = useApi(AdminUserFunctions.updateUserType);
    const handleClick = async () => {
        if (choosenUserType) {
            const retVal = await API_updateUserType.request(choosenUserType.typeID, userType);
            if (retVal.ok && retVal.data) {
                setModalIsOpen(false);
                modifyUserTypeList('edit', retVal.data.requestedData?.UserType);
            }
        }
        else {
            const retVal = await API_createUserType.request(userType);
            if (retVal.ok && retVal.data) {
                setModalIsOpen(false);
                modifyUserTypeList('new', retVal.data.requestedData?.UserType);
            }
        }
    }
    useEffect(() => {
        if (choosenUserType) {
            setUserType(choosenUserType.userType);
        }
        else {
            setUserType("");
        }
    }, [choosenUserType])
    return (
        <Modal className="modal-dialog-centered" size="lg" isOpen={modalIsOpen} toggle={() => { setModalIsOpen(!modalIsOpen); }}    >
            <div className="modal-body p-0">
                <Card className="bg-secondary border-0 mb-0">
                    <CardHeader className="bg-light">
                        <div className="h2 text-center mt-2 mb-3">{(choosenUserType && "Edit") || "Add New"}  User Type </div>
                    </CardHeader>
                    <CardBody className="px-lg-5 py-lg-5">
                        <Form>
                            <FormGroup>
                                <label className="form-control-label" htmlFor="exampleFormControlInput1" > User type name </label>
                                <Input id="exampleFormControlInput123" placeholder="User type name " type="text"
                                    value={userType}
                                    onChange={(e) => {
                                        setUserType(e.target.value);
                                    }}

                                />
                            </FormGroup>
                            <Row>
                                <Col md="12" className="text-right">
                                    <Button className="my-4" color="secondary" type="button" onClick={() => setModalIsOpen(false)}> Cancel </Button>

                                    <Button className="my-4" color="danger" type="button" onClick={handleClick}> Submit </Button>

                                </Col>
                            </Row>
                        </Form>
                    </CardBody>
                </Card>
            </div>
        </Modal>
    );

}