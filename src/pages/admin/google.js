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
import React from "react";
import dynamic from "next/dynamic";
// react plugin used to create google maps
import { GoogleMap, Marker, LoadScript } from "@react-google-maps/api";
// reactstrap components
import { Card, Container, Row } from "reactstrap";
// layout for this page
import Admin from "@/layouts/Admin";
// core components
import SimpleHeader from "components/Headers/SimpleHeader.js";

const mapContainerStyle = {
  height: "600px",
  borderRadius: "inherit",
};

const mapOptions = {
  scrollwheel: false,
  styles: [
    {
      featureType: "administrative",
      elementType: "labels.text.fill",
      stylers: [{ color: "#444444" }],
    },
    {
      featureType: "landscape",
      elementType: "all",
      stylers: [{ color: "#f2f2f2" }],
    },
    {
      featureType: "poi",
      elementType: "all",
      stylers: [{ visibility: "off" }],
    },
    {
      featureType: "road",
      elementType: "all",
      stylers: [{ saturation: -100 }, { lightness: 45 }],
    },
    {
      featureType: "road.highway",
      elementType: "all",
      stylers: [{ visibility: "simplified" }],
    },
    {
      featureType: "road.arterial",
      elementType: "labels.icon",
      stylers: [{ visibility: "off" }],
    },
    {
      featureType: "transit",
      elementType: "all",
      stylers: [{ visibility: "off" }],
    },
    {
      featureType: "water",
      elementType: "all",
      stylers: [{ color: "#5e72e4" }, { visibility: "on" }],
    },
  ],
};

const center = { lat: 40.748817, lng: -73.985428 };

class Google extends React.Component {
  render() {
    const apiKey = process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY || "YOUR_KEY_HERE";
    
    return (
      <>
        <SimpleHeader name="Google maps" parentName="Maps" />
        <Container className="mt--6" fluid>
          <Row>
            <div className="col">
              <Card className="border-0">
                <div
                  style={{ height: `600px` }}
                  className="map-canvas"
                  id="map-custom"
                >
                  <LoadScript googleMapsApiKey={apiKey}>
                    <GoogleMap
                      mapContainerStyle={mapContainerStyle}
                      center={center}
                      zoom={12}
                      options={mapOptions}
                    >
                      <Marker position={center} />
                    </GoogleMap>
                  </LoadScript>
                </div>
              </Card>
            </div>
          </Row>
          <Row>
            <div className="col">
              <Card className="border-0">
                <div
                  style={{ height: `600px` }}
                  className="map-canvas"
                  id="map-default"
                >
                  <LoadScript googleMapsApiKey={apiKey}>
                    <GoogleMap
                      mapContainerStyle={mapContainerStyle}
                      center={center}
                      zoom={8}
                      options={{ scrollwheel: false }}
                    >
                      <Marker position={center} />
                    </GoogleMap>
                  </LoadScript>
                </div>
              </Card>
            </div>
          </Row>
        </Container>
      </>
    );
  }
}

const GoogleWithNoSSR = dynamic(() => Promise.resolve(Google), { ssr: false });
GoogleWithNoSSR.layout = Admin;
export default GoogleWithNoSSR;

// Removed getServerSideProps - using dynamic with ssr: false is sufficient
