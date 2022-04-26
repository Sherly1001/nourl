import { ReactNode, useRef } from 'react'
import './modal.scss'
import { CloseCircleOutlined } from '@ant-design/icons'
import { observer } from 'mobx-react-lite'

interface ModalProps {
  children: ReactNode
  visible: boolean
  setVisible: Function
  className: string
}

const Modal = ({ children, visible, setVisible, className }: ModalProps) => {
  const modalOverlay = useRef<HTMLDivElement>(null)

  function handleCloseModal() {
    setVisible()
  }

  function handleClickOverlay(e: React.MouseEvent) {
    const target = e.target as HTMLDivElement
    if (target.classList.contains('modal-overlay')) {
      setVisible()
    }
  }

  return (
    <div className={`modal ${visible ? 'active' : ''} ${className}`}>
      <div
        className="modal-overlay"
        ref={modalOverlay}
        onClick={(e) => handleClickOverlay(e)}
      >
        <div className="modal-container">
          <div className="modal-content">{children}</div>
          <div className="close-icon" onClick={handleCloseModal}>
            <CloseCircleOutlined />
          </div>
        </div>
      </div>
    </div>
  )
}

export default observer(Modal)
