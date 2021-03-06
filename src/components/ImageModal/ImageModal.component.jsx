import { GatsbyImage, getImage } from 'gatsby-plugin-image';
import React, { useEffect, useRef, useMemo } from 'react';
import Modal from 'react-modal';
import { createFocusTrap } from 'focus-trap';
import { ModalControls } from '../ModalControls/ModalControls.component';

import './ImageModal.styles.scss';

Modal.setAppElement(`#___gatsby`);

const modalStyles = {
  overlay: {
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.80)',
    zIndex: 2,
  },
  content: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
    position: 'relative',
    inset: 'auto auto 1.5rem',
    margin: 0,
    padding: '1rem 0',
    border: 0,
    overflow: 'auto',
    backgroundColor: 'rgba(0, 0, 0, 0.00)',
  },
};

export const ImageModal = ({
  modalIndex,
  imageList,
  closeModal,
  scrollModal,
}) => {
  const modalRef = useRef(null);

  // create and manage focus trap
  useEffect(() => {
    const focusTrap = createFocusTrap(modalRef.current);
    focusTrap.activate();
    return () => {
      focusTrap.deactivate();
    };
  }, []);

  // keyboard listeners
  useEffect(() => {
    const handleKey = (e) => {
      switch (e.key) {
        case 'ArrowLeft':
          scrollModal(-1);
          break;
        case 'ArrowRight':
          scrollModal(1);
          break;
        case 'Escape':
          closeModal();
          break;
        default:
          break;
      }
    };

    window.addEventListener('keydown', handleKey);

    return function removeListener() {
      window.removeEventListener('keydown', handleKey);
    };
  }, [scrollModal, closeModal]);

  // get modal image
  const image = useMemo(() => {
    return getImage(imageList[modalIndex]?.screenshot);
  }, [imageList, modalIndex]);

  const ModalWrapper = (props, children) => {
    return (
      <div {...props} className="image-modal" ref={modalRef}>
        <button
          className="modal-close-button"
          type="button"
          onClick={closeModal}
        >
          <p className="modal-close-label">Close dialog</p>
          <div className="modal-close-icon" />
        </button>
        {children}
        <ModalControls
          pageNumber={modalIndex + 1}
          total={imageList.length}
          scrollModal={scrollModal}
        />
      </div>
    );
  };

  const ModalContainer = (props, children) => {
    return (
      // react-modal default tabindex is -1 which is trapping keyboard focus when content is clicked
      <div {...props} tabIndex="">
        {children}
      </div>
    );
  };

  return (
    <Modal
      isOpen
      onRequestClose={closeModal}
      style={modalStyles}
      shouldCloseOnEsc={false}
      shouldFocusAfterRender={false}
      contentLabel="image"
      closeTimeoutMS={300}
      overlayElement={ModalWrapper}
      contentElement={ModalContainer}
    >
      <figure className="modal-image-container" aria-live="assertive">
        <GatsbyImage
          image={image}
          alt="Project screenshot"
          className="modal-image"
          objectFit="contain"
        />
      </figure>
    </Modal>
  );
};
