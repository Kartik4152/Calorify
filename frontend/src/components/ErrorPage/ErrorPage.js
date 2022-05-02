//dependencies
import React from "react";
import { Result, Button } from "antd";
import { Link } from "react-router-dom";

//styles
import "./ErrorPage.scss";

//components

//assets

function ErrorPage(props) {
  const errorText = {
    404: "Sorry, the page you visited does not exist.",
    403: "Sorry, you are not authorized to access this page.",
    500: "Sorry, something went wrong.",
  };
  return (
    <Result
      status={props.error}
      title={props.error}
      subTitle={errorText[props.error]}
      extra={
        <>
          <Link to="/">
            <Button type="primary">Back Home</Button>
          </Link>
        </>
      }
    />
  );
}

export default ErrorPage;
