import React, { useCallback, useEffect } from "react";
import ReactDOM from "react-dom";

const Modal = ({
  onClose,
  children,
  title,
}: {
  onClose: () => void;
  children: React.ReactNode;
  title: string;
}) => {
  // create ref for the StyledModalWrapper component
  const modalWrapperRef = React.useRef();

  const handleCloseClick = (e: { preventDefault: () => void }) => {
    e.preventDefault();
    onClose();
  };

  // check if the user has clicked inside or outside the modal
  // useCallback is used to store the function reference, so that on modal closure, the correct callback can be cleaned in window.removeEventListener
  const backDropHandler = useCallback((e) => {
    if (!modalWrapperRef?.current?.contains(e.target)) {
      onClose();
    }
  }, []);

  useEffect(() => {
    // We wrap it inside setTimeout in order to prevent the eventListener to be attached before the modal is open.
    setTimeout(() => {
      window.addEventListener("click", backDropHandler);
    });
  }, []);

  useEffect(() => {
    // remove the event listener when the modal is closed
    return () => window.removeEventListener("click", backDropHandler);
  }, []);

  const modalContent = (
    <div
      className="absolute left-0 top-0 flex h-full w-full items-center justify-center"
      style={{ backgroundColor: "rgba(0, 0, 0, 0.5)" }}
    >
      {/* Wrap the whole Modal inside the newly created StyledModalWrapper
            and use the ref */}
      <div ref={modalWrapperRef} className="h-[600px] w-[500px]">
        <div className="h-full w-full rounded-[15px] bg-white p-4">
          <div className="flex justify-end text-xl">
            <a href="#" onClick={handleCloseClick}>
              x
            </a>
          </div>
          {title && <h1>{title}</h1>}
          <div className="pt-4">{children}</div>
        </div>
      </div>
    </div>
  );

  return ReactDOM.createPortal(
    modalContent,
    document.getElementById("modal-root")!,
  );
};

export default Modal;
