import { DependencyList, useState, useEffect } from 'react'

function useActiveId(itemIds: string[], deps: DependencyList = []) {
  const [activeId, setActiveId] = useState(``)

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            setActiveId(entry.target.id)
          }
        })
      },
      { rootMargin: `0% 0% -80% 0%` }
    )

    itemIds.forEach((id) => {
      const el = document.getElementById(id)
      if (el) observer.observe(el)
    })

    return () => {
      itemIds.forEach((id) => {
        const el = document.getElementById(id)
        if (el) observer.unobserve(el)
      })
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [itemIds, ...deps])

  return activeId
}

export default useActiveId
