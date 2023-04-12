import { createPortal } from 'react-dom';
// import Button from '../Button';
// import Backdrop from './Backdrop';
import { Button, Backdrop, DropdownMenu } from '../../';
import { dots } from '../../../assets';

const Modal = ({
  heading,
  headerContent,
  content,
  contentType,
  confirmModalHandler,
  dismissModalHandler,
  dropdownItems,
  overlaid
}) => {
  let topOffsetClass = 'top-[20vh]';
  let zIndexClass = 'z-20';

  if (contentType === 'artifact') {
    topOffsetClass = 'top-[5vh]';
  }

  if (overlaid) {
    zIndexClass = 'z-30';
  }

  const modal = (
    <div
      className={`fixed ${topOffsetClass} left-[5%] w-[90%] ${zIndexClass} overflow-hidden bg-white border rounded shadow-lg md:w-[40rem] md:left-[calc(50%-20rem)]`}
    >
      <div className="flex items-center border-b p-3">
        {headerContent ? (
          headerContent
        ) : (
          <h2 className="font-semibold text-2xl">{heading}</h2>
        )}
        {dropdownItems && (
          <div className="ml-auto flex items-center">
            <DropdownMenu
              buttonContent={<img className="w-8" src={dots} />}
              items={dropdownItems}
            />
          </div>
        )}
      </div>
      <div className="p-3">{content}</div>
      {(confirmModalHandler || dismissModalHandler) && (
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
      )}
    </div>
  );

  return (
    <>
      {createPortal(
        <Backdrop overlaid={overlaid} onClick={dismissModalHandler} />,
        document.querySelector('#backdrop-root')
      )}
      {createPortal(modal, document.querySelector('#overlay-root'))}
    </>
  );
};

export default Modal;
