import { createPortal } from 'react-dom';
import Button from '../Button';
import Backdrop from './Backdrop';

const Modal = ({
  heading,
  content,
  contentType,
  confirmModalHandler,
  dismissModalHandler
}) => {
  let topOffsetClass = 'top-[20vh]';

  if (contentType === 'artifact') {
    topOffsetClass = 'top-[10vh]';
  }

  const modal = (
    <div
      className={`fixed ${topOffsetClass} left-[5%] w-[90%] z-20 overflow-hidden bg-white border rounded shadow-lg md:w-[40rem] md:left-[calc(50%-20rem)]`}
    >
      <div className="border-b overflow-auto p-3">
        <h2 className="font-semibold text-2xl">{heading}</h2>
      </div>
      <div className="p-3">{content}</div>
      <div className="flex justify-end border-t overflow-auto p-3">
        {confirmModalHandler && (
          <Button
            className="mr-2"
            styleType="primary"
            onClick={props.confirmModalHandler}
          >
            Confirm
          </Button>
        )}
        {dismissModalHandler && (
          <Button onClick={dismissModalHandler}>Close</Button>
        )}
      </div>
    </div>
  );

  return (
    <>
      {createPortal(
        <Backdrop onClick={dismissModalHandler} />,
        document.querySelector('#backdrop-root')
      )}
      {createPortal(modal, document.querySelector('#overlay-root'))}
    </>
  );
};

export default Modal;
