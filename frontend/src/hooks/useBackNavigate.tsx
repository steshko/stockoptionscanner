import { useEffect } from 'react'

export default function useBackNavigate(onClickBack: any) {
    useEffect(() => {
        function handleClickBack(event: any) {
            onClickBack()
        }
        window.addEventListener("popstate", handleClickBack);
        return () => {
            window.removeEventListener("popstate", handleClickBack);
        }
    }, [onClickBack])
}
