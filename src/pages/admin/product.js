import React, { useEffect, useState } from "react";
import classnames from "classnames";

import useApi from "../../api/hooks/apihook";
import categoryFunctions from "../../api/categories";
import Admin from "@/layouts/Admin";
import productFunctions from "../../api/products";
import {
  Alert,
  Button,
  Card,
  CardFooter,
  CardHeader,
  CardTitle,
  CardSubtitle,
  Collapse,
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
  InputGroupText,
  Input,
  CardImg,
} from "reactstrap";
// core components
import SimpleHeader from "components/Headers/SimpleHeader.js";
// Using Font Awesome icons instead of Material-UI to avoid SSR issues
// import { Delete, DeleteForever, Edit, Visibility } from "@mui/icons-material";
import { imagePath } from "../../api/config/config";
import { CHECKBOX_STATUS_UNCHECKED } from "react-bootstrap-table-next";
import MultiFileUpload from "../../components/custom_components/multiplefileupload";
import AttributSelection from "../../components/custom_components/attributeselection";

import { MyPagination } from "utils/pagination"
import { SafeBox, validateData, BusyBlock, BusyBlockAUtoHeight } from "@/api/hooks/apiutils";
import useReport, { ReportHeader } from "@/api/hooks/useReport";
import Select from 'react-select'
import { getMultiLevelcategoriesForDropdown } from "utils/categoryUtils";
import { amountFormat } from "utils/utils";

// ProductRow Component
const ProductRow = ({ product, setModalShow_AddEditProduct, setChoosenProduct, setModalReadOnly_Product, modifyProductList }) => {
  const API_DeleteVal = useApi(productFunctions.deleteVal);

  const handleRemove = async () => {
    const productName = product.en_ProductName || product.productCode || 'this product';
    const confirmMessage = `Are you sure you want to delete "${productName}"?\n\nThis action cannot be undone.`;
    const confirmed = window.confirm(confirmMessage);
    
    if (confirmed) {
      const retVal = await API_DeleteVal.request(product.productID);
      if (retVal.ok) {
        modifyProductList('delete', product);
      } else {
        const errorMsg = retVal.data?.errorMessages?.Errors || retVal.data?.message || "Error deleting product";
        alert(`Error deleting product: ${errorMsg}`);
      }
    }
  };

  return (
    <>
      <tr key={product.productID}>
        <th scope="row">
          <Media className="align-items-center">
            <a
              className="avatar rounded-circle mr-3"
              href="#pablo"
              onClick={(e) => e.preventDefault()}
            >
              <img alt="..." src={imagePath + (product.mainImageUrl || product.productImage || '')} />
            </a>
          </Media>
        </th>
        <td className="budget">
          <span>{product.en_ProductName}</span>
        </td>
        <td className="budget">
          <span>{product.ar_ProductName || ''}</span>
        </td>
        <td className="budget">
          <span>{amountFormat(product.productPrice)}</span>
        </td>
        <td className="budget">
          <span>{typeof product.productCode === 'string' || typeof product.productCode === 'number' ? product.productCode : product.productCode?.toString() || '-'}</span>
        </td>
        <td className="budget">
          <span>{product.createdOn}</span>
        </td>
        <td className="text-right">
          <Button className="btn-icon-only" color="secondary" type="button">
            <span
              className="btn-inner--icon"
              onClick={() => {
                setModalReadOnly_Product(true);
                setChoosenProduct(product);
                setModalShow_AddEditProduct(true);
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
              setModalReadOnly_Product(false);
              setChoosenProduct(product);
              setModalShow_AddEditProduct(true);
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
    </>
  );
};

const Products = () => {
  const API_GetallCategories = useApi(categoryFunctions.getAlCategories);
  const API_GetallProducts = useApi(productFunctions.getAlProducts);

  const uRS = useReport(); //useReportStates

  const [categories, setCategories] = useState([]);
  const [choosenCategory, setChoosenCategory] = useState(null);
  let checked = true;
  const [modalShow_AddEditProduct, setModalShow_AddEditProduct] = useState(false);
  const [modalReadOnly_Product, setModalReadOnly_Product] = useState(false);

  const [products, setProducts] = useState([]);
  const [choosenProduct, setChoosenProduct] = useState(null);
  const [productID, setProductID] = useState("");

  useEffect(() => {
    loadCategories();
  }, []);

  useEffect(() => {
    loadproducts();
  }, [uRS.sortValues, uRS.pageSizeValue, uRS.pageNumber]);


  const loadCategories = async () => {
    const retVal = await API_GetallCategories.request();
    if (retVal.ok && retVal.data) {
      setCategories(retVal.data.requestedData?.Categories || []);
    }
  };

  const loadproducts = async () => {
    const sort = uRS.sortValues.sortCol ? `${uRS.sortValues.sortCol} ${uRS.sortValues.sortDir}` : null;
    const retVal = await API_GetallProducts.request(uRS.filterValues, sort, uRS.pageSizeValue, uRS.pageNumber);
    
    if (retVal.ok && retVal.data) {
      const productsList = retVal.data.requestedData?.Products || [];
      // Ensure productCode and mainImage are strings, not objects
      const sanitizedProducts = productsList.map(product => ({
        ...product,
        productCode: typeof product.productCode === 'object' ? (product.productCode?.toString() || '') : (product.productCode || ''),
        mainImageUrl: typeof product.mainImage === 'object' ? (product.mainImage?.url || product.mainImageUrl || '') : (product.mainImageUrl || product.mainImage || ''),
      }));
      setProducts(sanitizedProducts);
      if (retVal.data.requestedData?.ProductsCount?.[0]?.numrows) {
        uRS.setRecordCount(retVal.data.requestedData.ProductsCount[0].numrows);
      }
    }
  };

  const sortClick = (column) => {
    uRS.setSortValues({ sortCol: column, sortDir: (uRS.sortValues.sortCol == column) ? "desc" : "asc" })
  }

  const modifyProductList = (mod, product_) => {
    // Validate product_ is not null/undefined
    if (!product_ || !product_.productID) {
      console.error('modifyProductList: Invalid product data', product_);
      return;
    }

    if (mod == 'new') {
      setProducts([...products, product_]);
    }
    else if (mod == 'edit') {
      setProducts(products.map(product => {
        if (product && product.productID && product.productID == product_.productID) {
          return product_;
        }
        return product;
      }));
    }
    else if (mod == 'delete') {
      setProducts(products.filter((product) => product && product.productID && product.productID != product_.productID));
    }
  }


  return (
    <>
      <SimpleHeader name="Products" parentName="Masters" parentUrl="/">
        <Button className="btn-neutral" color="default" size="sm" onClick={() => {
          setModalReadOnly_Product(false);
          setChoosenProduct(null);
          setModalShow_AddEditProduct(true);
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
                        <label className="form-control-label" htmlFor="exampleFormControlSelect1"> Parent Category </label>
                        <Select options={getMultiLevelcategoriesForDropdown(categories)} value={categories.map(category => { if (category.categoryID == uRS.filterValues.parentcategoryid) { return { value: category.categoryID, label: category.en_CategoryName } } })} onChange={val => { uRS.setFilterValues({ ...uRS.filterValues, parentcategoryid: val.value }); }} />
                      </FormGroup>
                    </Col>

                    <Col md="3">
                      <FormGroup>
                        <label className="form-control-label" htmlFor="exampleFormControlInput1">&nbsp;</label>
                        <Button className="my-4 btn-md" color="dark" type="button" onClick={() => { (uRS.pageNumber == 1) && loadproducts() || uRS.setPageNumber("1") }}> Filter </Button>
                      </FormGroup>
                    </Col>
                  </Row>

                </CardBody>
              </Card>
            </Collapse>
            <SafeBox objectApi={API_GetallProducts} lengthCheckObject={"Products"} firstTimeOnly={true} noDataMessage="No Products found!"  >
              {validateData(API_GetallProducts, "Products", true) &&
                <Card style={{ position: "relative" }}>
                  <ReportHeader uRS={uRS}>Product List</ReportHeader>
                  <Table className="align-items-center table-flush" responsive>
                    <thead className="thead-light">
                      <tr>
                        <th className={`sort ${(uRS.sortValues.sortCol == "") ? 'active' : ''}`} data-sort="budget" scope="col" onClick={() => sortClick('')}> Image </th>
                        <th className={`sort ${(uRS.sortValues.sortCol == "PRD.en_ProductName") ? 'active' : ''}`} data-sort="budget" scope="col" onClick={() => sortClick('PRD.en_ProductName')}> en_product Name </th>
                        <th> ar_product Name </th>
                        <th className={`sort ${(uRS.sortValues.sortCol == "PRD.productPrice") ? 'active' : ''}`} data-sort="budget" scope="col" onClick={() => sortClick('PRD.productPrice')}> Product Price </th>
                        <th className={`sort ${(uRS.sortValues.sortCol == "PRD.productCode") ? 'active' : ''}`} data-sort="budget" scope="col" onClick={() => sortClick('PRD.productCode')}> Product Code </th>
                        <th className={`sort ${(uRS.sortValues.sortCol == "PRD.createdOn") ? 'active' : ''}`} data-sort="budget" scope="col" onClick={() => sortClick('PRD.createdOn')}> Created On </th>
                        <th scope="col" />
                      </tr>
                    </thead>
                    <tbody className="list">
                      {(products.length > 0 &&
                        products.map((product, index) => (
                          <ProductRow
                            product={product}
                            setModalShow_AddEditProduct={setModalShow_AddEditProduct
                            }
                            setChoosenProduct={setChoosenProduct}
                            modifyProductList={modifyProductList}
                            key={product.productID + index}
                            setModalReadOnly_Product={setModalReadOnly_Product}
                          // removeCategoryRow={removeCategoryRow}
                          />
                        ))) || (
                          <tr>
                            <td>
                              <span>no data found</span>
                            </td>
                          </tr>
                        )}
                    </tbody>
                  </Table>
                  <CardFooter className="py-4">
                    <MyPagination pageNumber={parseInt(uRS.pageNumber)} pageCount={Math.ceil(uRS.recordCount / uRS.pageSizeValue)} handleChangePage={uRS.setPageNumber} />
                  </CardFooter>
                  <BusyBlock iAmBusy={API_GetallProducts.loading} />
                </Card>
              }
            </SafeBox>
          </div>
        </Row>
      </Container>
      {modalShow_AddEditProduct && (
        <Modal_AddEditProduct
          modalIsOpen={modalShow_AddEditProduct}
          setModalIsOpen={setModalShow_AddEditProduct}
          categories={categories}
          choosenProduct={choosenProduct}
          modalReadOnly_Product={modalReadOnly_Product}
          modifyProductList={modifyProductList}
        />
      )}
    </>
  );
};
export default Products;

Products.layout = Admin;
Products.permissionCheck = "permissionProducts";

// Modal_AddEditProduct Component
const Modal_AddEditProduct = ({ modalIsOpen, setModalIsOpen, categories, choosenProduct, modalReadOnly_Product, modifyProductList }) => {
  const [product, setProduct] = useState({
    en_ProductName: '',
    ar_ProductName: '',
    en_ProductDescription: '',
    ar_ProductDescription: '',
    productPrice: '',
    productCode: '',
    categoryID: '',
    productImage: null,
  });
  const [galleryImages, setGalleryImages] = useState([]);
  const [attributes, setAttributes] = useState([]);

  const API_createProduct = useApi(productFunctions.createProduct);
  const API_updateProduct = useApi(productFunctions.updateProduct);
  const API_getProductByID = useApi(productFunctions.getProductByID);

  const [errorMessage, setErrorMessage] = useState(false);

  const loadProductByID = async () => {
    const retVal = await API_getProductByID.request(choosenProduct.productID);
    if (retVal.ok && retVal.data) {
      const productData = retVal.data.requestedData?.Product?.[0] || {};
      setProduct(productData);
      setGalleryImages(productData.GalleryImages || []);
      setAttributes(productData.Attributes || []);
    }
  };

  useEffect(() => {
    if (choosenProduct) {
      loadProductByID();
    } else {
      setProduct({
        en_ProductName: '',
        ar_ProductName: '',
        en_ProductDescription: '',
        ar_ProductDescription: '',
        productPrice: '',
        productCode: '',
        categoryID: '',
        productImage: null,
      });
      setGalleryImages([]);
      setAttributes([]);
    }
  }, [choosenProduct]);

  const handleClick = async () => {
    setErrorMessage(false);
    if (choosenProduct) {
      const retVal = await API_updateProduct.request(
        choosenProduct.productID,
        product,
        galleryImages,
        attributes,
        []
      );
      if (retVal.ok && retVal.data) {
        const updatedProduct = retVal.data.requestedData?.Product?.[0] || retVal.data.requestedData?.Product || retVal.data.requestedData;
        if (updatedProduct) {
          setModalIsOpen(false);
          modifyProductList('edit', updatedProduct);
        } else {
          setErrorMessage('Product updated but response data is invalid');
        }
      } else {
        setErrorMessage(retVal.error || retVal.data?.errorMessages?.Errors || 'Failed to update product');
      }
    } else {
      const retVal = await API_createProduct.request(product, galleryImages, attributes);
      if (retVal.ok && retVal.data) {
        const newProduct = retVal.data.requestedData?.Product?.[0] || retVal.data.requestedData?.Product || retVal.data.requestedData;
        if (newProduct) {
          setModalIsOpen(false);
          modifyProductList('new', newProduct);
        } else {
          setErrorMessage('Product created but response data is invalid');
        }
      } else {
        setErrorMessage(retVal.error || retVal.data?.errorMessages?.Errors || 'Failed to create product');
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
            <div className="h2 text-center mt-2 mb-3">
              {(modalReadOnly_Product && "View") || (choosenProduct && "Edit") || "Add New"} Product
            </div>
          </CardHeader>
          <CardBody className="px-lg-5 py-lg-5">
            <Form>
              {errorMessage && (
                <Alert color="danger">{errorMessage}</Alert>
              )}
              <FormGroup>
                <label className="form-control-label" htmlFor="exampleFormControlSelect1">
                  Category
                </label>
                <Select
                  options={getMultiLevelcategoriesForDropdown(categories)}
                  value={categories.find(cat => cat.categoryID == product.categoryID) ? {
                    value: product.categoryID,
                    label: categories.find(cat => cat.categoryID == product.categoryID)?.en_CategoryName
                  } : null}
                  onChange={val => setProduct({ ...product, categoryID: val.value })}
                  isDisabled={modalReadOnly_Product}
                />
              </FormGroup>
              <Row>
                <Col md="6">
                  <Card>
                    <CardHeader className="bg-light small-padding">English</CardHeader>
                    <CardBody>
                      <FormGroup>
                        <label className="form-control-label">Product Name</label>
                        <Input
                          placeholder="Product name in english"
                          type="text"
                          value={product.en_ProductName}
                          onChange={(e) => {
                            setProduct({ ...product, en_ProductName: e.target.value });
                          }}
                          disabled={modalReadOnly_Product}
                        />
                      </FormGroup>
                      <FormGroup>
                        <label className="form-control-label">Product Description</label>
                        <Input
                          placeholder="Product description in english"
                          rows="3"
                          type="textarea"
                          value={product.en_ProductDescription}
                          onChange={(e) => {
                            setProduct({ ...product, en_ProductDescription: e.target.value });
                          }}
                          disabled={modalReadOnly_Product}
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
                        <label className="form-control-label">Product Name</label>
                        <Input
                          placeholder="Product name in Arabic"
                          type="text"
                          value={product.ar_ProductName}
                          onChange={(e) => {
                            setProduct({ ...product, ar_ProductName: e.target.value });
                          }}
                          disabled={modalReadOnly_Product}
                        />
                      </FormGroup>
                      <FormGroup>
                        <label className="form-control-label">Product Description</label>
                        <Input
                          placeholder="Product description in Arabic"
                          rows="3"
                          type="textarea"
                          value={product.ar_ProductDescription}
                          onChange={(e) => {
                            setProduct({ ...product, ar_ProductDescription: e.target.value });
                          }}
                          disabled={modalReadOnly_Product}
                        />
                      </FormGroup>
                    </CardBody>
                  </Card>
                </Col>
              </Row>
              <Row>
                <Col md="6">
                  <FormGroup>
                    <label className="form-control-label">Product Price</label>
                    <Input
                      placeholder="Enter product price"
                      type="number"
                      value={product.productPrice}
                      onChange={(e) => {
                        setProduct({ ...product, productPrice: e.target.value });
                      }}
                      disabled={modalReadOnly_Product}
                    />
                  </FormGroup>
                </Col>
                <Col md="6">
                  <FormGroup>
                    <label className="form-control-label">Product Code</label>
                    <Input
                      placeholder="Enter product code"
                      type="text"
                      value={typeof product.productCode === 'string' || typeof product.productCode === 'number' ? product.productCode : product.productCode?.toString() || ''}
                      onChange={(e) => {
                        setProduct({ ...product, productCode: e.target.value });
                      }}
                      disabled={modalReadOnly_Product}
                    />
                  </FormGroup>
                </Col>
              </Row>
              <FormGroup>
                <label className="form-control-label">Product Image</label>
                <MultiFileUpload
                  files={galleryImages}
                  setFiles={setGalleryImages}
                  disabled={modalReadOnly_Product}
                />
              </FormGroup>
              <FormGroup>
                <label className="form-control-label">Attributes</label>
                <AttributSelection
                  attributes={attributes}
                  setAttributes={setAttributes}
                  disabled={modalReadOnly_Product}
                />
              </FormGroup>
              <Row>
                <Col md="12" className="text-right">
                  <Button className="my-4" color="secondary" type="button" onClick={() => setModalIsOpen(false)}>
                    Cancel
                  </Button>
                  {!modalReadOnly_Product && (
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
