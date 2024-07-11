import { createPortal } from 'react-dom';

export default ({ children }: { children: any }) => {
  return createPortal(
    children,
    document.body.appendChild(document.createElement('empty'))
  );
};
