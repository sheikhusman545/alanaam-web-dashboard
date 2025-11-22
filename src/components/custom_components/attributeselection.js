import { useEffect, useState } from "react";
import Admin from "layouts/Admin.js";
import {
  Alert,
  Card,
  CardHeader,
  CardBody,
  CardFooter,
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
  InputGroup,
} from "reactstrap";
// Using Font Awesome icons instead of Material-UI to avoid SSR issues
// import { Delete, Edit, Save, Cancel } from "@mui/icons-material";

const AttributSelection = ({ attributes, setAttributes, readOnly }) => {
  const handleNewAttribute = () => {
    //Repeate Validation, Empty Validation
    setAttributes([
      ...attributes,
      { atributeID: 0, en_atributeName: "", ar_atributeName: "", atributeitems: [] },
    ]);
  };

  const doNewAttributeItem = (attribute, newItemName, newExtraCost) => {
    //Repeate Validation, Empty Validation
    setAttributes(
      attributes.map((attribute_) => {
        if (attribute_.en_atributeName == attribute.en_atributeName) {
          return {
            ...attribute_,
            atributeitems: [
              ...attribute_.atributeitems,
              {
                atributeItemID: 0,
                en_itemName: newItemName,
                ar_itemName: newItemName,
                extraCost: newExtraCost,
              },
            ],
          };
        } else {
          return attribute_;
        }
      })
    );
  };

  const doRenameAttribute = (attribute, newAtributeName) => {
    setAttributes(
      attributes.map((attribute_) => {
        if (attribute_.en_atributeName == attribute.en_atributeName) {
          return {
            ...attribute_,
            en_atributeName: newAtributeName,
            ar_atributeName: newAtributeName,
          };
        } else {
          return attribute_;
        }
      })
    );
  };
  ;

  const doDeleteAttribute = (attribute) => {
    //validate items should be empty
    let del = confirm("Do you want delete attribute ?");
    if (del == true) {
      setAttributes(
        attributes.filter(
          (attribute_) => attribute_.en_atributeName != attribute.en_atributeName
        )
      )
    }

  };

  const doDeletseAttributeItem = (attribute, deleteIndex) => {
    setAttributes(
      attributes.map((attribute_) => {
        if (attribute_.en_atributeName == attribute.en_atributeName) {
          return {
            ...attribute_,
            atributeitems: attribute_.atributeitems.filter(
              (item, index) => index != deleteIndex
            ),
          };
        } else {
          return attribute_;
        }
      })
    );
  };

  return (
    <>
      <Row>
        {attributes.map((attribute, index) => (
          <AttributeCard
            readOnly={readOnly}
            attribute={attribute}
            doNewAttributeItem={doNewAttributeItem}
            doDeletseAttributeItem={doDeletseAttributeItem}
            doRenameAttribute={doRenameAttribute}
            doDeleteAttribute={doDeleteAttribute}
            key={index}

          />
        ))}
      </Row>
      <Row>
        <Col lg="6">
          {(!readOnly) && (
            <Card>
              <CardBody className="cards">
                <h1 onClick={handleNewAttribute}>+</h1>
              </CardBody>
            </Card>
          )}
        </Col>
      </Row>
    </>
  );
};

AttributSelection.layout = Admin;
export default AttributSelection;

const AttributeCard = ({ attribute, doNewAttributeItem, doDeletseAttributeItem, readOnly, doRenameAttribute, doDeleteAttribute, }) => {
  const [en_atributeName, setEn_atributeName] = useState(attribute.en_atributeName);
  const [newItemName, setNewItemName] = useState("");
  const [newExtraCost, setNewExtraCost] = useState("0");
  const [atributeName_Editable, setAtributeName_Editable] = useState(false);


  useEffect(() => {
    if (en_atributeName.trim() == "") {
      setAtributeName_Editable(true);
    }
  }, [en_atributeName, atributeName_Editable])

  const handleNewAttributeItem = () => {
    doNewAttributeItem(attribute, newItemName, newExtraCost);
    setNewItemName("");
    setNewExtraCost("");
  };


  return (
    <Col lg="6">
      <Card>
        <CardTitle className="bg-light" style={{ marginBottom: "0" }}>
          <InputGroup>
            <Input className="form-control-sm" placeholder="Attribute Name" type="text" value={en_atributeName} onChange={(e) => setEn_atributeName(e.target.value)} disabled={readOnly || !atributeName_Editable} style={{ fontWeight: "bold" }} />
            {(!readOnly) && (
              (!atributeName_Editable) && (
                <>
                  <Button className="btn-icon-only btn-sm" color="secondary" type="button" onClick={() => setAtributeName_Editable(true)} >
                    <span className="btn-inner--icon"> <i className="fas fa-edit" /></span>
                  </Button>
                  <Button className="btn-icon-only btn-sm" color="secondary" type="button" onClick={() => doDeleteAttribute(attribute)} >
                    <span className="btn-inner--icon">
                      <i className="fas fa-trash" />
                    </span>
                  </Button>
                </>
              ) || (
                <>
                  <Button className="btn-icon-only btn-sm" color="secondary" onClick={() => { doRenameAttribute(attribute, en_atributeName); setAtributeName_Editable(false); }} >
                    <span className="btn-inner--icon">
                      <i className="fas fa-save" />
                    </span>
                  </Button>
                  <Button className="btn-icon-only btn-sm" color="secondary" onClick={() => setAtributeName_Editable(false)}>
                    <span className="btn-inner--icon">
                      <i className="fas fa-times" />
                    </span>
                  </Button>
                </>
              )
            )}
          </InputGroup>
        </CardTitle>
        <CardBody className="nopadding">
          <Table className="align-items-center table-flush" responsive>
            <thead className="thead-dark">
              <tr>
                <th style={{ width: "70%" }}>ITEM NAME</th>
                <th>COST</th>
                <th>  {(!readOnly) && "X"}</th>
              </tr>
            </thead>
            <tbody>
              {(attribute.atributeitems.length > 0)
                && attribute.atributeitems.map((atributeitem, index) => (
                  <tr key={index}>
                    <td>{atributeitem.en_itemName}</td>
                    <td>{atributeitem.extraCost}</td>
                    <td>
                      {(!readOnly) && (
                        <Button color="danger" className="btn-sm"
                          onClick={() => doDeletseAttributeItem(attribute, index)}>
                          <i className="ni ni-fat-remove " />
                        </Button>
                      )}
                    </td>

                  </tr>
                ))
                || <tr><td colSpan="4" className="text-danger text-center"> No Items Found </td></tr>

              }
            </tbody>
          </Table>
        </CardBody>
        <CardFooter className="nopadding">
          {(!readOnly) && (
            <InputGroup>
              <Input className="form-control-sm" placeholder="Item Name" type="text" value={newItemName} onChange={(e) => setNewItemName(e.target.value)} />
              <Input className="form-control-sm" placeholder="Cost" type="text" value={newExtraCost} onChange={(e) => setNewExtraCost(e.target.value)} />
              <Button className="btn-icon-only btn-sm" color="secondary" type="button" onClick={handleNewAttributeItem}>
                <span className="btn-inner--icon">+</span>
              </Button>
            </InputGroup>
          )}
        </CardFooter>
      </Card>
    </Col >
  );
};
