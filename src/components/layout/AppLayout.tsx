import { A } from '@solidjs/router'
import { children, JSX } from 'solid-js'

export const AppLayout = (props: { children: JSX.Element }) => {
  const c = children(() => props?.children)

  return (
    <div class="flex h-screen w-screen">
      <div class="h-screen w-16 bg-zinc-900">
        <div class="h-screen flex items-center flex-col justify-between">
          <div>
            <div class="flex flex-col items-center gap-2">
              <div>
                <A href="/">H</A>
              </div>
              <div>
                <A href="/music">M</A>
              </div>
              <div>
                <A href="/game-detection">G</A>
              </div>
            </div>
          </div>
          <div>
            <A href="/settings">S</A>
          </div>
        </div>
      </div>

      <div class="h-screen flex-grow bg-zinc-600 overflow-auto">{c()}</div>
    </div>
  )
}
