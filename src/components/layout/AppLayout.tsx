import { A } from '@solidjs/router'
import { children, JSX } from 'solid-js'

export const AppLayout = (props: { children: JSX.Element }) => {
  // const c = children(() => props?.children)

  return (
    <div class="flex h-screen w-screen">
      <div class="h-screen w-16 bg-zinc-900">
        <div class="h-screen flex items-center flex-col justify-between py-4">
          <div>
            <div class="flex flex-col items-center gap-6">
              <div>
                <A
                  activeClass="!bg-sky-300"
                  end
                  href="/"
                  class="hover:opacity-60 icon icon-home bg-white block h-6 w-6"
                />
              </div>
              <div>
                <A
                  activeClass="!bg-sky-300"
                  href="/music"
                  class="hover:opacity-60 icon icon-music bg-white block h-6 w-6"
                />
              </div>
              <div>
                <A
                  activeClass="!bg-sky-300"
                  href="/game-detection"
                  class="hover:opacity-60 icon icon-game bg-white block h-6 w-6"
                />
              </div>
            </div>
          </div>
          <div>
            <A
              href="/settings"
              activeClass="!bg-sky-300"
              class="hover:opacity-60 icon icon-cog bg-white block h-6 w-6"
            />
          </div>
        </div>
      </div>

      <div class="h-screen flex-grow bg-zinc-600 overflow-auto p-4">{props.children}</div>
    </div>
  )
}
