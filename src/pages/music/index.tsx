import cx from 'classix';
import { useI18n } from '../../lang/useI18n';
import { useApp } from '../../components/modules/app/context/AppContext';

export const Music = () => {
  const { t } = useI18n();

  const { music, system } = useApp();

  return (
    <div class="space-y-6">
      <h1 class="text-2xl font-bold text-white">{t('pages.music.title')}</h1>

      {system() !== 'windows' && (
        <p class="text-red-500 font-bold text-center text-md">{t('pages.music.incompatible')}</p>
      )}

      <div class="flex flex-wrap sm:flex-nowrap justify-center sm:justify-normal gap-5 items-center">
        <div>
          <div
            class="w-screen h-screen max-w-[150px] max-h-[150px] shadow-lg border-opacity-50 block bg-cover bg-center bg-gradient-to-b from-[#bdc3c7] to-[#2c3e50]"
            style={{
              'background-image': music()?.currentSongImage
                ? `url('data:image/png;base64,${music()?.currentSongImage}')`
                : undefined,
            }}
          />
        </div>

        <div>
          <p
            class={cx(
              music()?.currentSongIsPlaying ? 'text-green-500' : 'text-white',
              'font-bold line-clamp-1',
              music()?.currentSongTitle !== null ? 'pb-3' : '',
            )}
          >
            {music()?.currentSongIsPlaying && t('pages.music.isPlaying')}
            {!music()?.currentSongIsPlaying && music()?.currentSongTitle !== null && t('pages.music.notPlaying')}
            {(music === null || (!music()?.currentSongIsPlaying && music()?.currentSongTitle === null)) &&
              t('pages.music.notDetected')}
          </p>

          <p class="line-clamp-1 text-white">{music()?.currentSongTitle}</p>
          <p class="font-medium line-clamp-1 text-white">{music()?.currentSongAuthor}</p>
          <p class="italic line-clamp-1 text-white">{music()?.currentSongAlbum}</p>
        </div>
      </div>
    </div>
  );
};
