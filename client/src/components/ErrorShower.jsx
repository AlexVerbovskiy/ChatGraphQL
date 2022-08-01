import React, { useRef, useState, useLayoutEffect } from "react";

const ErrorShower = props => {
  const btnRef = useRef(null);
  let timeout = null;
  useLayoutEffect(() => {
    if (props.error === null || Object.keys(props.error).length === 0) return;
    timeout = setTimeout(() => {
      console.log("click");
      btnRef.current.click();
    }, 3000);
  }, []);

  if (props.error === null) return <div />;

  const handleCloseClick = () => {
    clearTimeout(timeout);
    props.setError(null);
  };
  return (
    <div
      className="alert alert-danger alert-dismissible fade show"
      id="alert-message-error"
      role="alert"
    >
      <strong>
        {props.error ? props.error : "Ununexpected error!"}
      </strong>
      <button
        type="button"
        className="btn-close"
        ref={btnRef}
        data-bs-dismiss="alert"
        aria-label="Close"
        onClick={handleCloseClick}
      />
    </div>
  );
};


export default ErrorShower;
