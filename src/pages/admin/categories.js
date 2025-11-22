import React, { useEffect, useState } from "react";
import dynamic from "next/dynamic";
import classnames from "classnames";
import Select from 'react-select'
// Using Font Awesome icons instead of Material-UI to avoid SSR issues
// import MenuIcon from "@mui/icons-material/Menu";
import {
  Button,
  Card,
  CardHeader,
  Media,
  Modal,
  Table,
  Container,
  Row,
  Col,
  CardBody,
  Form,
  FormGroup,
  Alert,
  Input,
  Collapse,
  CardFooter,
} from "reactstrap";
// core components
import SimpleHeader from "components/Headers/SimpleHeader.js";
// Using Font Awesome icons instead of Material-UI to avoid SSR issues
// import { Delete, DeleteForever, Edit, Visibility } from "@mui/icons-material";
import { imagePath } from "../../api/config/config";
import useApi from "../../api/hooks/apihook";
import categoryFunctions from "../../api/categories";
import { CHECKBOX_STATUS_UNCHECKED } from "react-bootstrap-table-next";
import Admin from "@/layouts/Admin";
import { MyPagination } from "utils/pagination"
import { SafeBox, validateData, BusyBlock, BusyBlockAUtoHeight } from "@/api/hooks/apiutils";

import { getMultiLevelcategoriesForDropdown } from "utils/categoryUtils";
import categories from "../../api/categories";

const Categories = () => {
  const API_GetallCategories = useApi(categoryFunctions.getAlCategories);

  const [modalShow_AddEditCategory, setModalShow_AddEditCategory] = useState(false);

  const [categories, setCategories] = useState([]);
  const [allCategories, setAllCategories] = useState([]);
  const [filterValues, setFilterValues] = useState({});
  const [filterOpen, setFilterOpen] = useState(false);
  const [sortValues, setSortValues] = useState({ sortCol: "", sortDir: "" });
  const [pageSizeValue, setPageSizeValue] = useState("10");
  const [pageNumber, setPageNumber] = useState("1");
  const [recordCount, setRecordCount] = useState(null);
  const [modalReadOnly_Category, setModalReadOnly_Category] = useState(false);

  const [choosenCategory, setChoosenCategory] = useState(null);
  const pageSizeOptions = [{ value: "2", label: "2" }, { value: "5", label: "5" }, { value: "10", label: "10" }, { value: "20", label: "20" }, { value: "50", label: "50" }, { value: "100", label: "100" }, { value: "200", label: "200" }, { value: "500", label: "500" }]

  const modifycategoryList = (mod, category) => {
    if (mod == 'new') {
      console.log("new data", category)
      setCategories([...categories, category])
      setAllCategories([...allCategories, category])
    }
    else if (mod == 'edit') {
      console.log("update datas", category)
      setCategories(categories.map(category_ => { if (category_.categoryID != category.categoryID) { return category_ } else { return category } }));
      setAllCategories(categories.map(category_ => { if (category_.categoryID != category.categoryID) { return category_ } else { return category } }));

    }
    else if (mod == 'delete') {
      setCategories(
        categories.filter((category_) => category_.categoryID != category.categoryID)
      );
    }
  }
  useEffect(() => {
    loadAllCategories();
  }, []);

  useEffect(() => {
    loadListCategories();
  }, [sortValues, pageSizeValue, pageNumber]);

  const loadListCategories = async () => {
    const sort = sortValues.sortCol ? `${sortValues.sortCol} ${sortValues.sortDir}` : null;
    const retVal = await API_GetallCategories.request(filterValues, sort, pageSizeValue, pageNumber);
    
    if (retVal.ok && retVal.data) {
      setCategories(retVal.data.requestedData?.Categories || []);
      if (retVal.data.requestedData?.CategoriesCount?.[0]?.numrows) {
        setRecordCount(retVal.data.requestedData.CategoriesCount[0].numrows);
      }
    }
  };

  const loadAllCategories = async () => {
    const retVal = await API_GetallCategories.request({ ps: 1000 }, "EC1.parentCategoryID");
    
    if (retVal.ok && retVal.data) {
      const categories = retVal.data.requestedData?.Categories || [];
      setAllCategories(categories);
      getMultiLevelcategoriesForDropdown(categories);
    }
  };

  const addNewCategoryRow = (categoryToBeadded) => {
    setCategories(categories.concat(categoryToBeadded));
  };

  const sortClick = (column) => {
    setSortValues({ sortCol: column, sortDir: (sortValues.sortCol == column) ? "desc" : "asc" })
  }
  return (
    <>
      <SimpleHeader name="Categories" parentName="Masters" parentUrl="/">
        <Button
          className="btn-neutral"
          color="default"
          size="sm"
          onClick={() => {
            setModalReadOnly_Category(false);
            setChoosenCategory(null);
            setModalShow_AddEditCategory(true);
          }}>New</Button>
        <Button
          className="btn-neutral"
          color="default"
          size="sm"
          onClick={() => {
            setFilterOpen(!filterOpen)
          }}
        >
          Filters
        </Button>
      </SimpleHeader>
      <Container className="mt--6" fluid>
        <Row>
          <div className="col">
            <Collapse isOpen={filterOpen}>
              <Card>
                <CardHeader className="border-0"> <h3 className="mb-0">Filter</h3> </CardHeader>
                <CardBody>
                  <Row>
                    <Col md="3">
                      <FormGroup>
                        <label className="form-control-label" htmlFor="exampleFormControlInput111"> Keyword</label>
                        <Input className="" placeholder="Enter Keyword here" type="text" value={filterValues.keyword} onChange={e => { setFilterValues({ ...filterValues, keyword: e.target.value }); }} />
                      </FormGroup>
                    </Col>
                    <Col md="3">
                      <FormGroup>
                        <label className="form-control-label" htmlFor="exampleFormControlSelect1"> Parent Category </label>
                        <Select options={getMultiLevelcategoriesForDropdown(allCategories)} value={allCategories.map(category => { if (category.categoryID == filterValues.parentcategoryid) { return { value: category.categoryID, label: category.en_CategoryName } } })} onChange={val => { setFilterValues({ ...filterValues, parentcategoryid: val.value }); }} />
                      </FormGroup>
                    </Col>

                    <Col md="3">
                      <FormGroup>
                        <label className="form-control-label" htmlFor="exampleFormControlInput1111">&nbsp;</label>
                        <Button className="my-4 btn-md" color="dark" type="button" onClick={() => { (pageNumber == 1) && loadListCategories() || setPageNumber("1") }}> Filter </Button>
                      </FormGroup>
                    </Col>
                  </Row>

                </CardBody>
              </Card>
            </Collapse>
            <SafeBox objectApi={API_GetallCategories} lengthCheckObject={"Categories"} firstTimeOnly={true} noDataMessage="No Categoreis found!"  >
              {validateData(API_GetallCategories, "Categories", true) &&
                <Card style={{ position: "relative" }}>
                  <CardHeader className="border-0">
                    <Row className="align-items-center">
                      <div className="col">
                        <h3 className="mb-0">Category List</h3>
                      </div>
                      <div className="col text-right">
                        <Row>
                          <Col md="6">
                          </Col>
                          <Col md="6 text-left">
                            <Select options={pageSizeOptions} value={pageSizeOptions.map(pageSize => { if (pageSize.value == pageSizeValue) { return { value: pageSize.value, label: "page size: " + pageSize.label } } })} onChange={val => { setPageSizeValue(val.value); setPageNumber("1"); }} />
                          </Col>
                        </Row>
                      </div>
                    </Row>
                  </CardHeader>
                  <Table className="align-items-center table-flush" responsive>
                    <thead className="thead-light">
                      <tr>
                        <th className={`sort ${(sortValues.sortCol == "") ? 'active' : ''}`} data-sort="name" scope="col" onClick={() => sortClick('')}>
                          Image
                        </th>

                        <th className={`sort ${(sortValues.sortCol == "EC1.en_CategoryName") ? 'active' : ''}`} data-sort="budget" scope="col" onClick={() => sortClick('EC1.en_CategoryName')}>
                          en_Category Name
                        </th>
                        <th className={``} data-sort="status" scope="col">
                          ar_CategoryName
                        </th>

                        <th className={`sort ${(sortValues.sortCol == "EC2.en_CategoryName") ? 'active' : ''}`} data-sort="completion" scope="col" onClick={() => sortClick('EC2.en_CategoryName')}>
                          Parent en_CategoryName
                        </th>
                        <th className={`sort ${(sortValues.sortCol == "EC1.status") ? 'active' : ''}`} data-sort="completion" scope="col" onClick={() => sortClick('EC1.status')}>
                          Status
                        </th>
                        <th scope="col" />
                      </tr>
                    </thead>
                    <tbody className="list">
                      {(categories.length > 0 &&
                        categories.map((category) => (
                          <CategoryRow
                            category={category}
                            setModalShow_AddEditCategory={setModalShow_AddEditCategory}
                            setChoosenCategory={setChoosenCategory}
                            setModalReadOnly_Category={setModalReadOnly_Category}
                            modifycategoryList={modifycategoryList}
                            key={category.categoryID}
                          />
                        )) || <tr><td colSpan="6"><Alert color="danger text text-center"> Sorry.., no records found! </Alert></td></tr>)}
                    </tbody>
                  </Table>
                  <CardFooter className="py-4">
                    <MyPagination pageNumber={parseInt(pageNumber)} pageCount={Math.ceil(recordCount / pageSizeValue)} handleChangePage={setPageNumber} />
                  </CardFooter>
                  <BusyBlock iAmBusy={API_GetallCategories.loading} />
                </Card>
              }
            </SafeBox>
          </div>
        </Row>
      </Container>
      <Modal_AddEditCategory
        modalIsOpen={modalShow_AddEditCategory}
        setModalIsOpen={setModalShow_AddEditCategory}
        allCategories={allCategories}
        choosenCategory={choosenCategory}
        modalReadOnly_Category={modalReadOnly_Category}
        modifycategoryList={modifycategoryList}
      />
    </>

  );
};
const CategoriesWithNoSSR = dynamic(() => Promise.resolve(Categories), { ssr: false });
CategoriesWithNoSSR.layout = Admin;
CategoriesWithNoSSR.permissionCheck = "permissionCategories";
export default CategoriesWithNoSSR;

// CategoryRow component
const CategoryRow = ({ category, setModalShow_AddEditCategory, setChoosenCategory, setModalReadOnly_Category, modifycategoryList }) => {
  const API_UpdateStatus = useApi(categoryFunctions.updatestatus);
  const API_DeleteVal = useApi(categoryFunctions.deleteVal);

  const [modalShow_ViewCategory, setModalShow_ViewCategory] = useState(false);
  const [status, setStatus] = useState(category.status);

  const handleStatusChange = async () => {
    let newStatus = status == "1" ? "2" : "1";
    const updateval = await API_UpdateStatus.request(category.categoryID, newStatus);
    if (updateval.ok) {
      setStatus(newStatus);
    } else {
      alert("error");
    }
  };

  const handleRemove = async () => {
    const categoryName = category.en_CategoryName || category.categoryCode || 'this category';
    const confirmMessage = `Are you sure you want to delete "${categoryName}"?\n\nThis action cannot be undone.`;
    const confirmed = window.confirm(confirmMessage);
    
    if (confirmed) {
      const retVal = await API_DeleteVal.request(category.categoryID);
      if (retVal.ok) {
        modifycategoryList('delete', category);
      } else {
        const errorMsg = retVal.data?.errorMessages?.Errors || retVal.data?.message || "Error deleting category";
        alert(`Error deleting category: ${errorMsg}`);
      }
    }
  };

  return (
    <>
      <tr key={category.categoryID}>
        <th scope="row">
          <Media className="align-items-center">
            <a
              className="avatar rounded-circle mr-3"
              href="#pablo"
              onClick={(e) => e.preventDefault()}
            >
              <img alt="..." src={imagePath + category.categoryUrl} />
            </a>
          </Media>
        </th>

        <td className="budget">
          <span>{category.en_CategoryName}</span>
        </td>
        <td className="budget">
          <span>{category.ar_CategoryName}</span>
        </td>
        <td className="budget">
          {category.parent_en_CategoryName ? (
            <span>{category.parent_en_CategoryName}</span>
          ) : (
            <span>Main Category</span>
          )}
        </td>
        <td>
          <label className="custom-toggle mr-1">
            <input type="checkbox" checked={status == 1} onChange={handleStatusChange} />
            <span className="custom-toggle-slider rounded-circle" />
          </label>
        </td>
        <td className="text-right">
          <Button className="btn-icon-only" color="secondary" type="button">
            <span
              className="btn-inner--icon"
              onClick={() => {
                setModalReadOnly_Category(true);
                setChoosenCategory(category);
                setModalShow_AddEditCategory(true);
              }}
            >
              <i className="fas fa-eye" />
            </span>
          </Button>

          <Button
            className="btn-icon-only"
            color="secondary"
            type="button"
            onClick={() => {
              setModalReadOnly_Category(false);
              setChoosenCategory(category);
              setModalShow_AddEditCategory(true);
            }}
          >
            <span className="btn-inner--icon">
              <i className="fas fa-edit" />
            </span>
          </Button>
          <Button className="btn-icon-only" color="secondary" type="button" onClick={handleRemove}>
            <span className="btn-inner--icon">
              <i className="fas fa-trash" />
            </span>
          </Button>
        </td>
      </tr>

      <Modal_ViewCategory
        modalIsOpen={modalShow_ViewCategory}
        setModalIsOpen={setModalShow_ViewCategory}
        choosenCategory={category}
      />
    </>
  );
};

/////////////////////////////////
const Modal_AddEditCategory = ({ modalIsOpen, setModalIsOpen, allCategories, choosenCategory, modalReadOnly_Category, modifycategoryList }) => {
  const defaultValues_Category = { en_CategoryName: '', ar_CategoryName: '', en_CategoryDescription: '', ar_CategoryDescription: '', showOrder: '', categoryImage: null, parentCategoryID: 0 }

  const [category, setCategory] = useState(defaultValues_Category);

  const API_createCategory = useApi(categoryFunctions.createCategory);
  const API_updateCategory = useApi(categoryFunctions.updateCategory);
  const API_getCategoryByID = useApi(categoryFunctions.getCategoryByID);

  const [errorMessage, setErrorMessage] = useState(false);

  const types = [
    { value: "Normal", type: "Normal" }, { value: "Booking", type: "Booking" }
  ]

  const loadcategorybyid = async () => {
    const retVal = await API_getCategoryByID.request(choosenCategory.categoryID);
    if (retVal.ok && retVal.data) {
      setCategory(retVal.data.requestedData?.Category?.[0] || {});
    }
  }

  useEffect(() => {
    if (choosenCategory) {
      loadcategorybyid();
    }
    else {
      setCategory(defaultValues_Category);
    }
  }, [choosenCategory]);

  const handleClick = async () => {
    setErrorMessage(false);
    if (choosenCategory) {
      const retVal = await API_updateCategory.request(choosenCategory.categoryID, category);
      if (retVal.ok && retVal.data) {
        setModalIsOpen(false);
        modifycategoryList('edit', retVal.data.requestedData?.Category?.[0])
      } else {
        setErrorMessage(retVal.error || 'Failed to update category')
      }
      
    } else {
      const retVal = await API_createCategory.request(category);
      if (retVal.ok && retVal.data) {
        setModalIsOpen(false);
        modifycategoryList('new', retVal.data.requestedData?.Category?.[0])
      } else {
        setErrorMessage(retVal.error || 'Failed to create category')
      }
    }
  };


  return (
    <Modal
      className="modal-dialog-centered"
      size="lg"
      isOpen={modalIsOpen}
      toggle={() => {
        setModalIsOpen(!modalIsOpen);
      }}
    >
      <div className="modal-body p-0">
        <Card className="bg-secondary border-0 mb-0 relative">
          <CardHeader className="bg-light">
            <div className="h2 text-center mt-2 mb-3">{(modalReadOnly_Category && "View") || (choosenCategory && "Edit") || "Add New"} Category</div>
          </CardHeader>
          <CardBody className="px-lg-5 py-lg-5">
            <Form>
              <FormGroup>
                <label className="form-control-label" htmlFor="exampleFormControlSelect1">
                  Parent Category
                </label>
                {(modalReadOnly_Category) && (<Input
                  id="exampleFormControlInput11"
                  type="text"
                  value={category.parent_en_CategoryName ? category.parent_en_CategoryName : ""}
                  disabled={true}
                />) || (<Select options={getMultiLevelcategoriesForDropdown(allCategories)} value={allCategories.map(category_ => { if (category_.categoryID == category.parentCategoryID) { return { value: category_.categoryID, label: category_.en_CategoryName } } })} onChange={val => setCategory({ ...category, parentCategoryID: val.value })} />
                  )}
              </FormGroup>
              <Row>
                <Col md="6">
                  <Card>
                    <CardHeader className="bg-light small-padding">English</CardHeader>
                    <CardBody>
                      <FormGroup>
                        <label className="form-control-label" htmlFor="exampleFormControlInput111">Category Name</label>
                        <Input
                          id="exampleFormControlInput1"
                          placeholder="Category name in english"
                          type="text"
                          value={category.en_CategoryName}
                          onChange={(e) => {
                            setCategory({ ...category, en_CategoryName: e.target.value });
                          }}
                          disabled={modalReadOnly_Category}
                        />
                      </FormGroup>
                      <FormGroup>
                        <label className="form-control-label" htmlFor="exampleFormControlTextarea12221">
                          Category Description
                        </label>
                        <Input
                          id="exampleFormControlTextarea12221"
                          placeholder="Category description in english"
                          rows="3"
                          type="textarea"
                          value={category.en_CategoryDescription}
                          onChange={(e) => {
                            setCategory({ ...category, en_CategoryDescription: e.target.value });
                          }}
                          disabled={modalReadOnly_Category}
                        />
                      </FormGroup>
                    </CardBody>
                  </Card>
                </Col>
                <Col md="6">
                  <Card>
                    <CardHeader className="bg-light small-padding">Arabic</CardHeader>
                    <CardBody>
                      <FormGroup>
                        <label className="form-control-label" htmlFor="exampleFormControlInput1">
                          Category Name
                        </label>
                        <Input
                          id="exampleFormControlInput122"
                          placeholder="Category name in Arabic"
                          type="text"
                          value={category.ar_CategoryName}
                          onChange={(e) => {
                            setCategory({ ...category, ar_CategoryName: e.target.value });
                          }}
                          disabled={modalReadOnly_Category}
                        />
                      </FormGroup>
                      <FormGroup>
                        <label className="form-control-label" htmlFor="exampleFormControlTextarea1">
                          Category Description
                        </label>
                        <Input
                          id="exampleFormControlTextarea121123"
                          placeholder="Category description in english"
                          rows="3"
                          type="textarea"
                          value={category.ar_CategoryDescription}
                          onChange={(e) => {
                            setCategory({ ...category, ar_CategoryDescription: e.target.value });
                          }}
                          disabled={modalReadOnly_Category}
                        />
                      </FormGroup>
                    </CardBody>
                  </Card>
                </Col>
              </Row>

              <Row>
                <Col md="6">
                  <FormGroup>
                    <label className="form-control-label" htmlFor="exampleFormControlInput1232">
                      Priority
                    </label>
                    <Input
                      id="exampleFormControlInput1332"
                      placeholder="Enter priority here"
                      type="text"
                      value={category.showOrder}
                      onChange={(e) => {
                        setCategory({ ...category, showOrder: e.target.value });
                      }}
                      disabled={modalReadOnly_Category}
                    />
                  </FormGroup>
                </Col>
                <Col md="6">
                  <FormGroup>
                    <label className="form-control-label" htmlFor="exampleFormControlSelect1"> Types </label>
                    {(modalReadOnly_Category && (
                      <Input id="exampleFormControlSelect1" type="text" disabled={modalReadOnly_Category} value={category.type}
                        onChange={(e) => {
                          setCategory({ ...category, type: e.target.value });
                        }} />
                    )) || (
                        <Input id="exampleFormControlSelect1" type="select" value={category.type}
                          onChange={(e) => {
                            setCategory({ ...category, type: e.target.value });
                          }}>
                          <option value="0">-Select Type-</option>
                          {types.length > 0 &&
                            types.map((type) => (
                              <option value={type.value} key={type.value}> {type.type} </option>
                            ))}
                        </Input>
                      )}
                  </FormGroup>
                </Col>
              </Row>
              <Row>

                <Col md="6">

                  <label className="form-control-label" htmlFor="exampleFormControlInput132121">
                    Image
                  </label>
                  <div className="custom-file">
                    {(!modalReadOnly_Category) && (
                      <>
                        <input
                          className="custom-file-input"
                          id="customFileLang"
                          lang="en"
                          type="file"
                          onChange={(event) => setCategory({ ...category, categoryImage: event.target.files[0] })
                          }
                        />
                        <label className="custom-file-label" htmlFor="customFileLang">
                          Select file
                        </label>
                      </>
                    )}

                    {(modalReadOnly_Category || choosenCategory) && (
                      <Card style={{ width: 120 }}>
                        <img src={imagePath + category.categoryUrl} />
                      </Card>
                    )}


                  </div>
                </Col>
              </Row>
              <Row>
                <Col md="12" className="text-right">
                  <Button
                    className="my-4"
                    color="secondary"
                    type="button"
                    onClick={() => setModalIsOpen(false)}
                  >
                    Cancel
                  </Button>
                  {(!modalReadOnly_Category) && (<Button className="my-4" color="danger" type="button" onClick={handleClick}>
                    <span> Submit</span>

                  </Button>)}

                </Col>
              </Row>
              {(errorMessage) &&
                <Row>
                  <Col md="12" className="text-right">
                    <Alert color="danger text text-center"> {errorMessage} </Alert>
                  </Col>
                </Row>}
            </Form>
          </CardBody>
          <BusyBlockAUtoHeight iAmBusy={API_updateCategory.loading || API_createCategory.loading} />
        </Card>
      </div>
    </Modal>
  );
};

////
const Modal_ViewCategory = ({ modalIsOpen, setModalIsOpen, choosenCategory }) => {
  const [parentCategoryID, setParentCategoryID] = useState("0");
  const [en_categoryname, setEn_Categoryname] = useState("");
  const [ar_categoryname, setAr_Categoryname] = useState("");
  const [en_categorydec, setEn_Categorydec] = useState("");
  const [ar_categorydec, setAr_Categorydec] = useState("");
  const [priority, setPriority] = useState("");
  const [categoryUrl, setcategoryUrl] = useState("");

  useEffect(() => {
    if (choosenCategory) {
      setParentCategoryID(choosenCategory.parentCategoryID);
      setEn_Categoryname(choosenCategory.en_CategoryName);
      setAr_Categoryname(choosenCategory.ar_CategoryName);
      setEn_Categorydec(choosenCategory.en_CategoryDescription);
      setAr_Categorydec(choosenCategory.ar_CategoryDescription);
      setPriority(choosenCategory.showOrder);
      setcategoryUrl(choosenCategory.categoryUrl);
    }
  }, [choosenCategory]);
  return (
    <Modal
      className="modal-dialog-centered"
      size="lg"
      isOpen={modalIsOpen}
      toggle={() => {
        setModalIsOpen(!modalIsOpen);
      }}
    >
      <div className="modal-body p-0">
        <Card className="bg-secondary border-0 mb-0">
          <CardHeader className="bg-transparent">
            <div className="h2 text-center mt-2 mb-3">View Category</div>
          </CardHeader>
          <CardBody className="px-lg-5 py-lg-5">
            <Form>
              <FormGroup>
                <label className="form-control-label" htmlFor="exampleFormControlSelect1">
                  Parent Category
                </label>
                <Input
                  id="exampleFormControlSelect1"
                  type="text"
                  disabled
                  value={(choosenCategory.parent_ar_CategoryName) ? choosenCategory.parent_ar_CategoryName : "Main Category"}
                ></Input>
              </FormGroup>

              <Row>
                <Col md="6">
                  <FormGroup>
                    <label className="form-control-label" htmlFor="exampleFormControlInput11331">
                      Category Name
                    </label>
                    <Input
                      id="exampleFormControlInput1213"
                      placeholder="Category name in english"
                      type="text"
                      disabled
                      value={en_categoryname}
                    />
                  </FormGroup>
                </Col>
                <Col md="6">
                  <FormGroup>
                    <label className="form-control-label" htmlFor="exampleFormControlInput113">
                      Category Name
                    </label>
                    <Input
                      id="exampleFormControlInput1"
                      placeholder="Category name in Arabic"
                      type="text"
                      disabled
                      value={ar_categoryname}
                      onChange={(e) => {
                        setAr_Categoryname(e.target.value);
                      }}
                    />
                  </FormGroup>
                </Col>
              </Row>
              <Row>
                <Col md="6">
                  <FormGroup>
                    <label className="form-control-label" htmlFor="exampleFormControlTextarea131213">
                      Category Description
                    </label>
                    <Input
                      id="exampleFormControlTextarea1232123"
                      placeholder="Category description in english"
                      rows="3"
                      type="textarea"
                      disabled
                      value={en_categorydec}
                      onChange={(e) => {
                        setEn_Categorydec(e.target.value);
                      }}
                    />
                  </FormGroup>
                </Col>
                <Col md="6">
                  <FormGroup>
                    <label className="form-control-label" htmlFor="exampleFormControlTextarea13212">
                      Category Description
                    </label>
                    <Input
                      id="exampleFormControlTextarea121312"
                      placeholder="Category description in Arabic"
                      rows="3"
                      type="textarea"
                      disabled
                      value={ar_categorydec}
                      onChange={(e) => {
                        setAr_Categorydec(e.target.value);
                      }}
                    />
                  </FormGroup>
                </Col>
              </Row>
              <Row>
                <Col md="6">
                  <FormGroup>
                    <label className="form-control-label" htmlFor="exampleFormControlInput1">
                      Priority
                    </label>
                    <Input
                      id="exampleFormControlInput1"
                      placeholder="Enter priority here"
                      type="text"
                      disabled
                      value={priority}
                      onChange={(e) => {
                        setPriority(e.target.value);
                      }}
                    />
                  </FormGroup>
                </Col>
                <Col md="6">
                  <label className="form-control-label" htmlFor="exampleFormControlInput1">
                    Image
                  </label>
                  <Media className="align-items-center">
                    <img alt="..." src={imagePath + categoryUrl} width="200px" height="200px" />
                  </Media>
                </Col>
              </Row>
              <Row>
                <Col md="12" className="text-right">
                  <Button
                    className="my-4"
                    color="secondary"
                    type="button"
                    onClick={() => setModalIsOpen(false)}
                  >
                    Close
                  </Button>
                </Col>
              </Row>
            </Form>
          </CardBody>
        </Card>
      </div>
    </Modal>
  );
};
