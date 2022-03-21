import { ReactNode, useRef } from 'react'
import './modal.scss'
import { CloseCircleOutlined } from '@ant-design/icons'

interface ModalProps {
  children: ReactNode
  visible: boolean
  setVisible: Function
  className: string
}

const Modal = ({ children, visible, setVisible, className }: ModalProps) => {
  const modalOverlay = useRef<HTMLDivElement>(null)

  function handleCloseModal() {
    setVisible(false)
  }

  function handleClickOverlay() {
    setVisible(false)
  }

  return (
    <div className={`modal ${visible ? 'active' : ''} ${className}`}>
      <div
        className="modal-overlay"
        ref={modalOverlay}
        onClick={handleClickOverlay}
      ></div>
      <div className="modal-container">
        <div className="modal-content">{children}</div>
        <div className="close-icon" onClick={handleCloseModal}>
          <CloseCircleOutlined />
        </div>
      </div>
    </div>
  )
}

export default Modal
