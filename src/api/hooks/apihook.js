import { useState, useCallback } from "react";
import { useRouter } from "next/router";

/**
 * Modern API hook for handling API requests with loading states and error handling
 * @param {Function} apiFunc - The API function to call
 * @returns {Object} API state and request function
 */
const useApi = (apiFunc) => {
  const router = useRouter();
  const [data, setData] = useState(null);
  const [errorStatus, setErrorStatus] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const [loading, setLoading] = useState(false);
  const [requestCalled, setRequestCalled] = useState(false);

  const request = useCallback(
    async (...args) => {
      if (loading) {
        return { ok: false, message: "Request already in progress" };
      }

      // Validate that apiFunc is actually a function
      if (typeof apiFunc !== "function") {
        console.error(
          "useApi: apiFunc must be a function, but received:",
          typeof apiFunc,
          apiFunc
        );
        setErrorStatus(true);
        setErrorMessage(
          `API function is not defined. Check your import and function name.`
        );
        setLoading(false);
        return { ok: false, error: "API function is not defined" };
      }

      setRequestCalled(true);
      setLoading(true);
      setErrorStatus(false);
      setErrorMessage("");

      try {
        const response = await apiFunc(...args);

        // Log response for debugging
        if (process.env.NODE_ENV === "development") {
          console.log("API Response:", response);
        }

        // Check if response has expected structure
        // Apisauce wraps the response in response.data, so response.data contains the actual API response
        if (response?.data && response.data.respondStatus === "SUCCESS") {
          setData(response.data);
          setErrorStatus(false);
          setErrorMessage("");
          return { ok: true, data: response.data };
        }

        // Also check if respondStatus is at root level (some API configurations)
        if (response && response.respondStatus === "SUCCESS") {
          setData(response);
          setErrorStatus(false);
          setErrorMessage("");
          return { ok: true, data: response };
        }

        // Also check for success without explicit respondStatus (some APIs return data directly)
        if (
          response?.data &&
          !response.data?.errorMessages &&
          !response.data?.error
        ) {
          // If response has data but no error indicators, consider it successful
          // This handles APIs that return data directly without respondStatus
          if (
            response.data.userDetails ||
            response.data.requestedData ||
            response.data.data ||
            response.data.JWT_Token ||
            response.data.jwtToken
          ) {
            setData(response.data);
            setErrorStatus(false);
            setErrorMessage("");
            return { ok: true, data: response.data };
          }
        }

        // Handle error responses
        if (response?.data?.errorMessages) {
          const errorMsg = response.data.errorMessages;

          switch (errorMsg.ErrorType) {
            case "UserToken.Error":
              setErrorMessage("Your session has expired. Please login again.");
              router.push("/auth/login");
              return { ok: false, error: "Session expired" };

            case "Permission.Error":
            case "User.Error":
              setErrorMessage(
                errorMsg.Errors || "You do not have permission to perform this action."
              );
              return { ok: false, error: errorMsg.Errors || "Permission denied" };

            case "validation Error":
              setErrorMessage(errorMsg.Errors || "Validation error occurred.");
              setErrorStatus(true);
              return { ok: false, error: errorMsg.Errors || "Validation error" };

            default:
              setErrorMessage(errorMsg.Errors || "An error occurred.");
              setErrorStatus(true);
              return { ok: false, error: errorMsg.Errors || "Unknown error" };
          }
        }

        // Handle unexpected response structure - log for debugging
        console.warn("Unexpected response format:", {
          response,
          responseData: response?.data,
          respondStatus: response?.data?.respondStatus,
          hasRequestedData: !!response?.data?.requestedData,
          status: response?.status,
          ok: response?.ok,
          problem: response?.problem,
        });
        setErrorStatus(true);

        // Try to extract any useful error message from the response
        const errorMsg =
          response?.data?.message ||
          response?.data?.error ||
          "Unexpected response format from server.";
        setErrorMessage(errorMsg);
        return { ok: false, error: errorMsg, data: response?.data };
      } catch (error) {
        console.error("API Error:", error);
        setErrorStatus(true);
        setErrorMessage(
          error.message || "Network error. Please check your connection."
        );
        return {
          ok: false,
          error: error.message || "Network error",
        };
      } finally {
        setLoading(false);
      }
    },
    [apiFunc, loading, router]
  );

  // Validate apiFunc on mount/update
  if (typeof apiFunc !== "function") {
    console.error(
      "useApi: apiFunc must be a function, but received:",
      typeof apiFunc,
      apiFunc
    );
    console.error(
      "This usually means the function is not exported correctly or the import path is wrong."
    );
  }

  const reset = useCallback(() => {
    setData(null);
    setErrorStatus(false);
    setErrorMessage("");
    setRequestCalled(false);
    setLoading(false);
  }, []);

  return {
    data,
    errorStatus,
    errorMessage,
    loading,
    requestCalled,
    request,
    reset,
  };
};

export default useApi;

