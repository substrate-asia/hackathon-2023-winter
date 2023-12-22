import { aa, aaVisibility, Animated, Animator, BleepsOnAnimator } from '@arwes/react'
import { MediaVideoList } from 'iconoir-react'
import { NavLink } from 'react-router-dom'
import Waterfall from 'waterfalljs-layout/react'

import { useFetchGallery } from '@/apis'
import GalleryCard from '@/components/ui/GalleryCard'
import type { BleepNames } from '@/types'

export default function () {
  const { data } = useFetchGallery()

  const items = useMemo(
    () => data?.jobs.map((i: any) => ({ id: i.id, img: JSON.parse(i.output).data.imageUrl })) ?? [],
    [data]
  )
  return (
    <>
      <Animator>
        <BleepsOnAnimator<BleepNames> transitions={{ entering: 'intro' }} continuous />
        <div
          style={{
            height: 'calc(100vh - 80px - 1.5rem)',
            width: '100%',
            padding: '0 calc(50vw - 600px)',
            marginTop: '1.5rem',
            overflowY: 'scroll',
          }}
        >
          {items.length === 0 ? (
            <div className="w-full h-30 flex-center">
              <MediaVideoList className="loading" />
            </div>
          ) : (
            <Animated animated={[aaVisibility(), aa('y', 8, 0, 0)]}>
              <Waterfall mode="position" columnWidth={300} columnCount={4} columnGap={0} rowGap={0}>
                {items.map((i: any) => {
                  return (
                    <li key={i.id}>
                      <NavLink to={`/task/${i.id}`}>
                        <GalleryCard src={i.img} key={i.id} className="mx-4 mb-8" />
                      </NavLink>
                    </li>
                  )
                })}
              </Waterfall>
            </Animated>
          )}
        </div>
      </Animator>
    </>
  )
}
