import { createPortal } from 'react-dom';
import Button from '../Button';
import Backdrop from './Backdrop';

const Modal = ({
  heading,
  content,
  confirmModalHandler,
  dismissModalHandler
}) => {
  const modal = (
    <div className="fixed top-[30vh] left-[10%] w-[80%] z-20 overflow-hidden bg-white border rounded shadow-lg md:w-[40rem] md:left-[calc(50%-20rem)]">
      <div className="border-b overflow-auto p-3">
        <h2 className="font-semibold text-2xl">{heading}</h2>
      </div>
      <div className="p-3">{content}</div>
      {dismissModalHandler && (
        <div className="border-t overflow-auto p-3">
          <Button onClick={dismissModalHandler}>Close</Button>
        </div>
      )}

      {confirmModalHandler && (
        <Button styleType="primary" onClick={props.confirmModalHandler}>
          Confirm
        </Button>
      )}
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
