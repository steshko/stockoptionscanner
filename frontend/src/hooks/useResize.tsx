import { useEffect } from 'react';

export default function useEvent(handler: any, passive=false) {
  useEffect(() => {
    // initiate the event handler
    window.addEventListener('resize', handler, passive);

    // this will clean up the event every time the component is re-rendered
    return function cleanup() {
      window.removeEventListener('resize', handler)
    }
  })
}