import React, { useState } from "react";
import dynamic from "next/dynamic";
import classnames from "classnames";
import Router from "next/router";
import {
  Button,
  Card,
  CardHeader,
  CardBody,
  FormGroup,
  Form,
  Input,
  InputGroupText,
  InputGroup,
  Container,
  Row,
  Col,
  Alert,
} from "reactstrap";
import Auth from "@/layouts/Auth";
import AuthHeader from "@/components/Headers/AuthHeader";
import useApi from "@/api/hooks/apihook";
import authFunctions from "@/api/auth"; // Using old apisauce approach - can switch to auth-modern later
import useAuth from "@/api/hooks/useAuth";
import { LoginApiResponse } from "@/types/api";

const Login: React.FC = () => {
  const API_login = useApi(authFunctions.login as any);
  const { setLogIn } = useAuth();
  const [focusedEmail, setFocusedEmail] = useState<boolean>(false);
  const [focusedPassword, setFocusedPassword] = useState<boolean>(false);
  const [username, setUsername] = useState<string>("");
  const [password, setPassword] = useState<string>("");
  const [error, setError] = useState<string>("");

  const handleClick = async (): Promise<void> => {
    if (!username || !password) {
      setError("Please enter both email and password");
      return;
    }

    setError("");
    
    try {
      const retVal = await API_login.request(username, password, "tmp");
      
      // Get the response data
      const responseData = retVal.data;
      
      // Check for SUCCESS response
      if (responseData && responseData.respondStatus === "SUCCESS") {
        const userDetails = responseData.requestedData?.userDetails;
        const jwtToken = responseData.requestedData?.JWT_Token;

        if (userDetails && jwtToken) {
          // Store user data
          setLogIn(userDetails, jwtToken);
          
          // Redirect to dashboard
          Router.push("/admin/dashboard");
          return;
        }
      }
      
      // Handle errors
      const errorMsg = (responseData?.errorMessages?.Errors as string) || 
                      retVal.error || 
                      "Login failed. Please check your credentials.";
      setError(typeof errorMsg === 'string' ? errorMsg : String(errorMsg));
    } catch (error: any) {
      setError(error.message || "An unexpected error occurred");
    }
  };

  return (
    <>
      <AuthHeader />
      <Container className="mt--9 pb-5">
        <Row className="justify-content-center">
          <Col lg="5" md="7">
            <Card className="bg-secondary border-0 mb-0">
              <CardHeader className="bg-transparent p-0">
                <div className="text-muted text-center mt-2 mb-3">
                  <img src="/assets/img/logo/al-anam-logo.png" width="60px" alt="Logo" />
                </div>
              </CardHeader>

              <CardBody className="px-lg-5 py-lg-5">
                <div className="text-center text-muted mb-4">
                  <h1 style={{ color: "#00000" }}>Sign in</h1>
                </div>
                <Form role="form">
                  <FormGroup
                    className={classnames("mb-3", {
                      focused: focusedEmail,
                    })}
                  >
                    <InputGroup className="input-group-merge input-group-alternative">
                      <InputGroupText>
                        <i className="ni ni-email-83" />
                      </InputGroupText>
                      <Input
                        placeholder="Email"
                        type="email"
                        value={username}
                        onChange={(e) => {
                          setUsername(e.target.value);
                        }}
                        onFocus={() => setFocusedEmail(true)}
                        onBlur={() => setFocusedEmail(false)}
                      />
                    </InputGroup>
                  </FormGroup>
                  <FormGroup
                    className={classnames({
                      focused: focusedPassword,
                    })}
                  >
                    <InputGroup className="input-group-merge input-group-alternative">
                      <InputGroupText>
                        <i className="ni ni-lock-circle-open" />
                      </InputGroupText>
                      <Input
                        placeholder="Password"
                        type="password"
                        value={password}
                        onChange={(e) => {
                          setPassword(e.target.value);
                        }}
                        onFocus={() => setFocusedPassword(true)}
                        onBlur={() => setFocusedPassword(false)}
                      />
                    </InputGroup>
                  </FormGroup>

                  <div className="text-center">
                    <Button
                      className="btn-clr"
                      type="button"
                      onClick={handleClick}
                    >
                      Sign in
                    </Button>
                  </div>
                </Form>
              </CardBody>
            </Card>
            {(error || API_login.errorMessage) && (
              <Alert color="danger" className="mt-1 text-center">
                {error || API_login.errorMessage}
              </Alert>
            )}
          </Col>
        </Row>
      </Container>
    </>
  );
};

const LoginWithNoSSR = dynamic(() => Promise.resolve(Login), { ssr: false });
(LoginWithNoSSR as any).layout = Auth;
export default LoginWithNoSSR;
