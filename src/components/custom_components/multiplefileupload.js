import react from "react";
import Admin from "layouts/Admin.js";
import { imagePath } from "../../api/config/config";
import React, { useEffect, useState } from "react";
import {
  Alert,
  Button,
  ListGroupItem,
  ListGroup,
  Row,
  Col,
  Card,
  CardHeader,
  CardBody,
  CardImg,
  Form,
  CardTitle,
} from "reactstrap";

const MultiFileUpload = ({ imageGallery, setImageGallery, files, setFiles, readOnly, disabled, removedGalleryImages, setRemovedGalleryImages }) => {
  // Support both prop names: imageGallery/files for backward compatibility
  const gallery = imageGallery || files || [];
  const setGallery = setImageGallery || setFiles;
  const isReadOnly = readOnly !== undefined ? readOnly : disabled;

  const handleChange = (e) => {
    if (e.target.files && e.target.files[0]) {
      setGallery([
        ...gallery,
        {
          src: URL.createObjectURL(e.target.files[0]),
          newFile: true,
          newImage: e.target.files[0],
        },
      ]);
    }
  };
  
  const removeImage = (index_) => {
    if (confirm("Do you want to remove image ?")) {
      let removingObject = gallery.filter((image_, index) => index == index_);
      if (removingObject[0] && removingObject[0].hasOwnProperty('galleryImageID')) {
        if (setRemovedGalleryImages) {
          setRemovedGalleryImages([...(removedGalleryImages || []), removingObject[0].galleryImageID]);
        }
      }
      setGallery(gallery.filter((image, index) => index != index_))
    }
  }

  return (
    <>
      <Row>
        <Col className="multiImagePickerContainer">
          {gallery.map((image, index) => (
            <Card style={{ width: 120 }} key={index}>
              {(!isReadOnly) && (
                <i
                  className="ni ni-fat-remove text-center closebutton"
                  onClick={() => removeImage(index)}
                />
              )}
              <CardImg
                top
                width="100%"
                src={image.src ? image.src : imagePath + (image.imageUrl || image.galleryImageUrl || '')}
                alt="Card image cap"
              />
            </Card>
          ))}

          {(!isReadOnly) && (<>

            <Card
              className="bg-gradient-light card_uploadnew"
              style={{ width: 120 }}
            >
              <input
                type="file"
                id="files"
                name="files"
                multiple="multiple"
                hidden
                onChange={handleChange}
              />
              <label htmlFor="files" id="lable_file">
                +
            </label>
            </Card>
          </>
          )}
        </Col>
      </Row>
    </>
  );
};

MultiFileUpload.layout = Admin;
export default MultiFileUpload;
